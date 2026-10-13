import fs from 'node:fs/promises';
import path from 'node:path';
import {createHash,randomUUID} from 'node:crypto';
import {fileURLToPath} from 'node:url';
import {exportPdf} from './pdf.js';
const root=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'..');
const cacheRoot=path.join(root,'cache','pdf');
const pending=new Map();
let generationQueue=Promise.resolve();
const shared=['engine/render.js','engine/print.js','engine/print.html','engine/player.css','server/pdf.js','node_modules/@fontsource-variable/noto-sans-kr/wght.css'];
async function fingerprint(project){
 const hash=createHash('sha256');
 const base=`projects/${project}/`;
 for(const file of [...shared,base+'manifest.json',base+'slides.html',base+'slides.css']){
  hash.update(file);hash.update(await fs.readFile(path.join(root,file)));
 }
 const slotsFile=path.join(root,base,'assets','slots.json');
 let slots;
 try{slots=await fs.readFile(slotsFile)}catch(e){if(e.code!=='ENOENT')throw e;slots=Buffer.from('{}')}
 hash.update(slots);
 const records=JSON.parse(slots.toString());
 for(const [id,record] of Object.entries(records).sort(([a],[b])=>a.localeCompare(b))){
  if(!/^[a-f0-9-]{36}\.webp$/.test(record.file))throw Error('Invalid slot asset');
  hash.update(id);hash.update(await fs.readFile(path.join(root,base,'assets',record.file)));
 }
 return hash.digest('hex');
}
export async function cachedPdf(project,port){
 const digest=await fingerprint(project);
 const folder=path.join(cacheRoot,project);
 const filename=path.join(folder,digest+'.pdf');
 try{return {filename,hit:true,bytes:(await fs.stat(filename)).size}}catch(e){if(e.code!=='ENOENT')throw e}
 const key=project+':'+digest;
 if(pending.has(key))return pending.get(key);
 const build=generationQueue.catch(()=>{}).then(async()=>{
  try{return {filename,hit:true,bytes:(await fs.stat(filename)).size}}catch(e){if(e.code!=='ENOENT')throw e}
  const {pdf}=await exportPdf(project,port);
  await fs.mkdir(folder,{recursive:true});
  const tmp=path.join(folder,'.'+randomUUID()+'.tmp');
  try{await fs.writeFile(tmp,pdf,{flag:'wx',mode:0o600});await fs.rename(tmp,filename)}finally{await fs.rm(tmp,{force:true})}
  // Keep immutable versions: never delete a file while another response may be streaming it.
  return {filename,hit:false,bytes:pdf.length};
 });
 pending.set(key,build);generationQueue=build.then(()=>{},()=>{});
 try{return await build}finally{pending.delete(key)}
}
