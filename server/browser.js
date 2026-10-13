import {chromium} from 'playwright-core';
// Resolve the browser installed on this machine, not a developer-specific absolute path.
export function chromiumLaunchOptions(){
 return {
  executablePath:process.env.CHROMIUM_PATH||chromium.executablePath(),
  headless:true,
  args:process.platform==='linux'?['--no-sandbox']:[],
 };
}
