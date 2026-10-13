import fs from 'node:fs/promises';
import path from 'node:path';
import { randomUUID, timingSafeEqual } from 'node:crypto';
import sharp from 'sharp';
const root=path.resolve('projects');
const valid=s=>/^[a-z0-9][a-z0-9_-]{0,63}$/.test(s);
const slotValid=s=>/^[a-zA-Z0-9][a-zA-Z0-9_-]{0,79}$/.test(s);
const queue=new Map();
const paths=(project)=>{if(!valid(project))throw Error('Invalid project');const base=path.join(root,project,'assets');return {base, index:path.join(base,'slots.json')}};
export async function readSlots(project){const {index}=paths(project);try{return JSON.parse(await fs.readFile(index,'utf8'))}catch(e){if(e.code==='ENOENT')return {};throw e}}
export function authorized(token){const secret=process.env.AI_SLIDES_UPLOAD_TOKEN;if(!secret||!token)return false;const a=Buffer.from(secret),b=Buffer.from(token);return a.length===b.length&&timingSafeEqual(a,b)}
export async function imageResponse(project,slot){if(!slotValid(slot))throw Error('Invalid slot');const {base}=paths(project);const slots=await readSlots(project);const entry=slots[slot];if(!entry||!/^[a-f0-9-]{36}\.webp$/.test(entry.file))return null;return await fs.readFile(path.join(base,entry.file))}
export async function saveImage(project,slot,data){if(!slotValid(slot))throw Error('Invalid slot');if(data.length>10*1024*1024||data.length===0)throw Error('Invalid file size');const meta=await sharp(data,{limitInputPixels:25e6,failOn:'error'}).metadata();if(!['jpeg','png','webp'].includes(meta.format))throw Error('Unsupported image');if(!meta.width||!meta.height||meta.width>10000||meta.height>10000)throw Error('Invalid dimensions');const webp=await sharp(data,{limitInputPixels:25e6}).rotate().webp({quality:90}).toBuffer();const {base,index}=paths(project);await fs.mkdir(base,{recursive:true});const file=randomUUID()+'.webp';await fs.writeFile(path.join(base,file),webp,{flag:'wx',mode:0o600});const previous=queue.get(project)||Promise.resolve();const task=previous.catch(()=>{}).then(async()=>{const slots=await readSlots(project);const old=slots[slot]?.file;slots[slot]={file,width:meta.width,height:meta.height,updatedAt:new Date().toISOString()};const tmp=index+'.'+randomUUID();await fs.writeFile(tmp,JSON.stringify(slots,null,2),{mode:0o600});await fs.rename(tmp,index);if(old&&old!==file&&/^[a-f0-9-]{36}\.webp$/.test(old))await fs.rm(path.join(base,old),{force:true});return slots[slot]});queue.set(project,task);return await task}
export function assertSlotExists(slides,slot){if(!slotValid(slot)||!slides.some(s=>s.html.includes(`data-image-slot=\"${slot}\"`)))throw Error('Slot not declared')}
