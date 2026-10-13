import {testProject,baseUrl} from './project.js';
import test from 'node:test';
import assert from 'node:assert/strict';
import {chromium} from 'playwright-core';
import {chromiumLaunchOptions} from '../server/browser.js';
const root=baseUrl;
const check=async page=>page.evaluate(async()=>{const sample='한글 테스트 English 123';for(const weight of [400,700]){const spec=`${weight} 24px "Noto Sans KR Variable"`;const loaded=await document.fonts.load(spec,sample);if(!loaded.length||!document.fonts.check(spec,sample))throw Error('Missing required font')}return true});
test('print fonts load and PDF embeds Noto Sans KR', {timeout:60000}, async()=>{
 const b=await chromium.launch(chromiumLaunchOptions());try{
 const p=await b.newPage();await p.goto(`${root}/engine/print.html?project=${testProject}`,{waitUntil:'networkidle'});assert.equal(await check(p),true);
 const response=await p.request.get(`${root}/api/pdf/${testProject}`,{timeout:40000});assert.equal(response.status(),200);const pdf=await response.body();assert.match(pdf.toString('latin1'),/\/FontName \/[A-Z]{6}\+NotoSansKR/);
 const bad=await b.newPage();await bad.route('**/engine/fonts/files/*.woff2',route=>route.abort());await bad.goto(`${root}/engine/print.html?project=${testProject}`,{waitUntil:'networkidle'});await assert.rejects(check(bad),/NetworkError|Missing required font/);
 await bad.close();await p.close();
 }finally{await b.close()}
});
