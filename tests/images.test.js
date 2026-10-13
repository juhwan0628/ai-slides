import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import path from 'node:path';
import {randomUUID} from 'node:crypto';
import sharp from 'sharp';
import {saveImage,readSlots,imageResponse,authorized} from '../server/image-store.js';
import {testProject} from './project.js';

test('image slot is validated, replaced, persisted and isolated by project',async()=>{
 const project='test-'+randomUUID().slice(0,8), slot='example-image';
 const folder=path.resolve('projects',project);
 await fs.mkdir(folder,{recursive:true});
 try{
  const png=await sharp({create:{width:240,height:140,channels:3,background:'#cd803a'}}).png().toBuffer();
  await assert.rejects(saveImage(project,'../escape',png));
  await assert.rejects(saveImage(project,slot,Buffer.from('not-an-image')));
  const first=await saveImage(project,slot,png);assert.equal(first.width,240);
  const stored=await imageResponse(project,slot);assert.equal((await sharp(stored).metadata()).format,'webp');
  const next=await sharp({create:{width:640,height:360,channels:3,background:'#2177a6'}}).jpeg().toBuffer();
  const second=await saveImage(project,slot,next);assert.notEqual(second.file,first.file);
  const map=await readSlots(project);assert.equal(map[slot].width,640);
  assert.equal((await readSlots(testProject))[slot],undefined);
  assert.equal((await sharp(await imageResponse(project,slot)).metadata()).width,640);
  await assert.rejects(fs.access(path.join(folder,'assets',first.file)));
  assert.equal(authorized('wrong-token'),false);
 } finally {await fs.rm(folder,{recursive:true,force:true})}
});
