import {testProject,baseUrl} from './project.js';
import test from 'node:test';
import assert from 'node:assert/strict';
import { chromium } from 'playwright-core';
import {chromiumLaunchOptions} from '../server/browser.js';
const url=process.env.TEST_URL || `${baseUrl}/?project=${encodeURIComponent(testProject)}`;
const sizes=[[1920,1080],[2560,1440],[1366,768],[1280,800],[1024,768],[1920,1200],[1440,900],[2560,1080],[3440,1440],[800,1280],[768,1024],[3840,1080],[320,568]];

test('HTML slide maintains uniform scale and centered layout across display sizes', {timeout:120000},async()=>{
 const browser=await chromium.launch(chromiumLaunchOptions());
 const count=(await (await import('../server/app.js')).loadProject(testProject)).slides.length;
 try { const page=await browser.newPage(); const errors=[]; page.on('pageerror',e=>errors.push(e.message));
 for(const [w,h] of sizes){ await page.setViewportSize({width:w,height:h});await page.goto(url,{waitUntil:'networkidle'});const result=await page.evaluate(()=>{const a=document.querySelector('#viewport').getBoundingClientRect();const b=document.querySelector('#slide').getBoundingClientRect();const m=new DOMMatrix(getComputedStyle(document.querySelector('#slide')).transform);return {vw:a.width,vh:a.height,x:b.x,y:b.y,w:b.width,h:b.height,sx:m.a,sy:m.d,count:document.querySelector('#counter').textContent,pdfDisabled:document.querySelector('#pdf').disabled}});
 const scale=Math.min(w/1920,h/1080);assert.ok(Math.abs(result.sx-scale)<.0001,JSON.stringify({w,h,result}));assert.ok(Math.abs(result.sy-scale)<.0001);assert.ok(Math.abs(result.w/ result.h-16/9)<.0001);assert.ok(Math.abs(result.x-(w-result.w)/2)<1.5);assert.ok(Math.abs(result.y-(h-result.h)/2)<1.5);assert.equal(result.pdfDisabled,false);assert.equal(result.count,`1 / ${count}`);}
 if(count>=3){await page.click('#next');assert.equal(await page.locator('#counter').textContent(),`2 / ${count}`);await page.keyboard.press('ArrowRight');assert.equal(await page.locator('#counter').textContent(),`3 / ${count}`);await page.click('#prev');assert.equal(await page.locator('#counter').textContent(),`2 / ${count}`);}
 await page.click('#fullscreen');await page.waitForFunction(()=>!!document.fullscreenElement);assert.equal(await page.locator('.controls').isVisible(),true);assert.equal(await page.locator('#slide').isVisible(),true);await page.click('#fullscreen');await page.waitForFunction(()=>!document.fullscreenElement);assert.deepEqual(errors,[]);
 }finally{await browser.close()}
});
