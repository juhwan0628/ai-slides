import {chromium} from 'playwright-core';
import sharp from 'sharp';
import * as pdfjs from 'pdfjs-dist/legacy/build/pdf.mjs';
import {createCanvas} from '@napi-rs/canvas';
import fs from 'node:fs/promises';
import path from 'node:path';
import {chromiumLaunchOptions} from '../server/browser.js';
const url=process.env.SLIDES_URL||'http://127.0.0.1:3400/?project=demo';
const out=path.resolve(process.env.REPORT_DIR||'artifacts/m5');
const mode=process.argv[2]||'';
await fs.mkdir(out,{recursive:true});
const report={url,mode,failures:[],warnings:[],pages:[]};
const browser=await chromium.launch(chromiumLaunchOptions());
try{
const page=await browser.newPage({viewport:{width:1920,height:1080},deviceScaleFactor:1});
page.on('pageerror',e=>report.failures.push({type:'js-error',message:e.message}));
const printUrl=new URL(url);printUrl.pathname=printUrl.pathname.replace(/\/$/,'')+'/engine/print.html';printUrl.searchParams.delete('print');await page.goto(printUrl.toString(),{waitUntil:'networkidle'});await page.waitForFunction(()=>document.documentElement.dataset.printReady==='true');await page.evaluate(()=>document.fonts.ready);
const count=await page.locator('#print-sheets > .frame').count();if(!count)report.failures.push({type:'no-slides'});
if(mode==='--inject-overflow')await page.locator('#print-sheets .master-content').first().evaluate(el=>{el.insertAdjacentHTML('beforeend','<div data-test-overflow style="position:absolute;left:0;top:0;width:4000px;height:100px">ERROR</div>')});
if(mode==='--inject-missing-image')await page.locator('#print-sheets [data-image-slot]').first().evaluate(el=>{el.replaceChildren();el.dataset.testRequired='true'});
if(mode==='--inject-ratio')await page.locator('#print-sheets > .frame').first().evaluate(el=>{el.style.width='1600px'});
const inspections=await page.locator('#print-sheets > .frame').evaluateAll(frames=>frames.map((frame,index)=>{
 const issues=[],f=frame.getBoundingClientRect();if(Math.abs(f.width/f.height-16/9)>.001||Math.abs(f.width-1920)>1||Math.abs(f.height-1080)>1)issues.push('frame-ratio');
 for(const el of frame.querySelectorAll('*')){
  const style=getComputedStyle(el),r=el.getBoundingClientRect();if(style.display==='none'||style.visibility==='hidden'||!r.width||!r.height)continue;
  if(el.closest('[data-image-slot]')&&el!==el.closest('[data-image-slot]'))continue;
  if(r.left<f.left-2||r.right>f.right+2||r.top<f.top-2||r.bottom>f.bottom+2)issues.push('outside-frame:'+el.tagName);
  if(el.scrollWidth>el.clientWidth+3&&style.overflowX==='hidden')issues.push('clipped-horizontal:'+el.tagName);
  if(el.scrollHeight>el.clientHeight+3&&style.overflowY==='hidden')issues.push('clipped-vertical:'+el.tagName);
 }
 for(const slot of frame.querySelectorAll('[data-image-slot]')){
  const img=slot.querySelector('img');if(!img){if(slot.dataset.testRequired==='true')issues.push('missing-image:'+slot.dataset.imageSlot);else issues.push('warning:empty-slot:'+slot.dataset.imageSlot)}else if(!img.complete||!img.naturalWidth)issues.push('broken-image:'+slot.dataset.imageSlot);
 }
 return {index:index+1,issues};
}));
for(let i=0;i<count;i++){
 const p={page:i+1,issues:inspections[i].issues};report.pages.push(p);
 for(const reason of p.issues)(reason.startsWith('warning:')?report.warnings:report.failures).push({page:i+1,reason});
 await page.locator('#print-sheets > .frame').nth(i).screenshot({path:path.join(out,`print-${i+1}.png`),animations:'disabled'});
}
await page.goto(url,{waitUntil:'networkidle'});
for(let i=0;i<count;i++){
 if(i)await page.locator('#next').click();
 const file=path.join(out,`html-${i+1}.png`);await page.locator('#slide > .frame').screenshot({path:file,animations:'disabled'});
 const a=await sharp(file).removeAlpha().raw().toBuffer({resolveWithObject:true});const b=await sharp(path.join(out,`print-${i+1}.png`)).removeAlpha().raw().toBuffer({resolveWithObject:true});
 if(a.info.width!==b.info.width||a.info.height!==b.info.height){report.failures.push({page:i+1,reason:'screenshot-dimensions'});continue}
 let different=0;for(let px=0;px<a.data.length;px+=3){if(Math.abs(a.data[px]-b.data[px])+Math.abs(a.data[px+1]-b.data[px+1])+Math.abs(a.data[px+2]-b.data[px+2])>72)different++}
 const mismatch=different/(a.info.width*a.info.height);report.pages[i].pixelMismatch=mismatch;
 // The viewer intentionally has an on-screen page number that PDF omits; it is a localized difference.
 if(mismatch>.025)report.failures.push({page:i+1,reason:'html-print-visual-diff',mismatch});
}
const pdfUrl=new URL(url);const name=pdfUrl.searchParams.get('project')||'demo';pdfUrl.pathname=pdfUrl.pathname.replace(/\/$/,'')+'/api/pdf/'+encodeURIComponent(name);pdfUrl.search='';
const response=await page.request.get(pdfUrl.toString(),{timeout:45000});if(!response.ok())report.failures.push({type:'pdf-http',status:response.status()});else{
 const bytes=new Uint8Array(await response.body());await fs.writeFile(path.join(out,'presentation.pdf'),bytes);
 const byteLength=bytes.length;const doc=await pdfjs.getDocument({data:bytes,useSystemFonts:true}).promise;report.pdf={pageCount:doc.numPages,bytes:byteLength};if(doc.numPages!==count)report.failures.push({type:'pdf-page-count',expected:count,actual:doc.numPages});
 for(let i=1;i<=doc.numPages;i++){
  const pdfPage=await doc.getPage(i),v=pdfPage.getViewport({scale:1});
  if(Math.abs(v.width/v.height-16/9)>.001)report.failures.push({page:i,reason:'pdf-ratio',width:v.width,height:v.height});
  const viewport=pdfPage.getViewport({scale:1920/v.width}),canvas=createCanvas(Math.round(viewport.width),Math.round(viewport.height));
  await pdfPage.render({canvasContext:canvas.getContext('2d'),viewport}).promise;
  const file=path.join(out,`pdf-${i}.png`);await fs.writeFile(file,canvas.toBuffer('image/png'));
  if(mode==='--inject-pdf-diff'&&i===1)await sharp(file).composite([{input:Buffer.from(`<svg xmlns="http://www.w3.org/2000/svg" width="400" height="200"><rect width="400" height="200" fill="red"/></svg>`),left:200,top:200}]).toFile(path.join(out,'pdf-injected.png'));
  const comparisonFile=(mode==='--inject-pdf-diff'&&i===1)?path.join(out,'pdf-injected.png'):file;
  const rendered=await sharp(comparisonFile).removeAlpha().raw().toBuffer({resolveWithObject:true});
  const html=await sharp(path.join(out,`print-${i}.png`)).removeAlpha().raw().toBuffer({resolveWithObject:true});
  if(rendered.info.width!==html.info.width||rendered.info.height!==html.info.height){report.failures.push({page:i,reason:'pdf-raster-dimensions'});continue}
  let changed=0;for(let k=0;k<html.data.length;k+=3)if(Math.abs(html.data[k]-rendered.data[k])+Math.abs(html.data[k+1]-rendered.data[k+1])+Math.abs(html.data[k+2]-rendered.data[k+2])>72)changed++;
  const mismatch=changed/(rendered.info.width*rendered.info.height);
  report.pages[i-1].pdfPixelMismatch=mismatch;
  if(mismatch>.025)report.failures.push({page:i,reason:'pdf-raster-visual-diff',mismatch});
 }
}
} catch(e){report.failures.push({type:'execution',message:e.stack||String(e)})}finally{await browser.close();await fs.writeFile(path.join(out,'report.json'),JSON.stringify(report,null,2));console.log(JSON.stringify({pages:report.pages.length,pdf:report.pdf,failures:report.failures,warnings:report.warnings,comparison:report.pages.map(p=>({print:p.pixelMismatch,pdf:p.pdfPixelMismatch}))},null,2));}
if(report.failures.length)process.exitCode=1;
