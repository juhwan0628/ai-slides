import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import {loadProject,safeStatic,validProject} from '../server/app.js';
import {testProject} from './project.js';
test('selected project has valid slides and fixed canvas',async()=>{
 const {manifest,slides}=await loadProject(testProject);
 assert.deepEqual(manifest.canvas,{width:1920,height:1080});
 assert.ok(slides.length>0);
 assert.ok(slides.every(s=>['cover','standard','closing'].includes(s.layout)));
});
test('safe project and static paths',()=>{
 assert.equal(validProject('../etc'),false);
 assert.equal(validProject(testProject),true);
 assert.throws(()=>safeStatic('../etc/passwd'));
 assert.throws(()=>safeStatic(`projects/${testProject}/secret.json`));
});
test('content is independently loaded from selected project',async()=>{
 const {slides}=await loadProject(testProject);
 const source=await fs.readFile(`projects/${testProject}/slides.html`,'utf8');
 assert.ok(source.includes(slides[0].html.trim()));
});
test('layout rules apply to shared frame rather than viewer wrapper',async()=>{
 const css=await fs.readFile('engine/player.css','utf8');
 for(const selector of ['.frame .columns{','.frame .panel{','.frame table{'])assert.ok(css.includes(selector));
 assert.ok(!css.includes('.slide .columns{'));
});
