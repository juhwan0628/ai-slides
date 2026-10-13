import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import path from 'node:path';
import {randomUUID} from 'node:crypto';
import {cachedPdf} from '../server/pdf-cache.js';
import {testProject} from './project.js';
const root=path.resolve('projects');
test('cached PDF reuses complete output and invalidates on content edits', {timeout:80000},async()=>{
 const name='testpdf'+randomUUID().replaceAll('-','').slice(0,12);
 const dir=path.join(root,name);
 await fs.mkdir(dir,{recursive:true});
 try{
 for(const f of ['manifest.json','slides.html','slides.css'])await fs.copyFile(path.join(root,testProject,f),path.join(dir,f));
 const [first,concurrent]=await Promise.all([cachedPdf(name,Number(process.env.PORT||3400)),cachedPdf(name,Number(process.env.PORT||3400))]);
 assert.equal(first.filename,concurrent.filename);
 assert.ok(first.bytes>1000);assert.equal((await fs.readFile(first.filename)).subarray(0,4).toString(),'%PDF');
 const second=await cachedPdf(name,Number(process.env.PORT||3400));assert.equal(second.hit,true);assert.equal(first.filename,second.filename);
 await fs.appendFile(path.join(dir,'slides.css'),'\n/* cache invalidation test */\n');
 const third=await cachedPdf(name,Number(process.env.PORT||3400));assert.notEqual(third.filename,first.filename);assert.equal(third.hit,false);
 }finally{await fs.rm(dir,{recursive:true,force:true});await fs.rm(path.join('cache','pdf',name),{recursive:true,force:true})}
});
