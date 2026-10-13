// Independent, single-document PDF composition; no interactive viewer or pagination controls.
import {createFrame} from './render.js';
async function main(){
 const project=new URLSearchParams(location.search).get('project');
 if(!project)throw Error('PDF requires a project parameter');
 const response=await fetch(`../api/project/${encodeURIComponent(project)}`);
 if(!response.ok)throw Error('Project unavailable');
 const {slides,manifest,slots={}}=await response.json();
 const css=document.createElement('link');css.rel='stylesheet';css.href=`../projects/${encodeURIComponent(project)}/slides.css`;document.head.append(css);
 await new Promise((resolve,reject)=>{css.onload=resolve;css.onerror=()=>reject(Error('Project CSS failed'))});
 const host=document.querySelector('#print-sheets');
 slides.forEach((entry,index)=>{
  const frame=createFrame(entry,manifest,index,slides.length,{print:true});
  for(const slot of frame.querySelectorAll('[data-image-slot]')){
   const id=slot.dataset.imageSlot,entry=slots[id];slot.replaceChildren();
   if(entry){const img=document.createElement('img');img.alt=slot.dataset.alt||'';img.src=`../api/images/${encodeURIComponent(project)}/${encodeURIComponent(id)}?v=${encodeURIComponent(entry.updatedAt)}`;slot.append(img)}
   else {const hint=document.createElement('span');hint.className='slot-label';hint.textContent='이미지 미삽입';slot.append(hint)}
  }
  host.append(frame);
 });
 await document.fonts.ready;
 await Promise.all([...document.images].map(i=>i.decode()));
 document.documentElement.dataset.printReady='true';
}
main().catch(error=>{document.documentElement.dataset.printError=String(error.message||error)});
