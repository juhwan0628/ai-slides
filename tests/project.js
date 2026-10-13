import fs from 'node:fs';
import path from 'node:path';
const root=path.resolve('projects');
export const testProject=process.env.TEST_PROJECT||fs.readdirSync(root,{withFileTypes:true}).filter(d=>d.isDirectory()&&fs.existsSync(path.join(root,d.name,'manifest.json'))).map(d=>d.name).sort()[0];
if(!testProject)throw Error('No project exists. Ask your AI agent to create a project from an approved DESIGN.md first.');
export const baseUrl=process.env.TEST_BASE_URL||'http://127.0.0.1:3400';
