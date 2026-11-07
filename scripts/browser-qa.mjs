/**
 * Pukka Gen v2.3.4 cross-browser visual and interaction acceptance.
 * Run in CI after `npm ci && npm install --no-save --package-lock=false playwright @axe-core/playwright`
 * and `npx playwright install --with-deps chromium firefox webkit`.
 * Produces deterministic viewport screenshots + a JSON evidence report.
 * Screenshot baseline review is a separate human approval, not an inferred pass.
 */
import { chromium, firefox, webkit } from 'playwright';
import AxeBuilder from '@axe-core/playwright';
import { mkdir, writeFile } from 'node:fs/promises';

const origin = process.env.PUKKA_BASE_URL || 'http://127.0.0.1:4173/';
const widths = [320,375,768,1024,1280,1440];
const height = 900;
const folder = 'artifacts/visual-qa';
const results = [];
const failures = [];
await mkdir(folder,{recursive:true});

async function serverReady(){
 for(let attempt=0;attempt<60;attempt++){
   try{const response=await fetch(origin);if(response.ok)return;}catch{}
   await new Promise(resolve=>setTimeout(resolve,500));
 }
 throw new Error('Vite preview server did not start: '+origin);
}
await serverReady();
const browserTypes={chromium,firefox,webkit};
for(const [name,engine] of Object.entries(browserTypes)){
 const browser = await engine.launch({headless:true});
 try{
  for(const width of widths){
   const page = await browser.newPage({
     viewport:{width,height},reducedMotion:'reduce',deviceScaleFactor:1
   });
   const errors=[];
   page.on('pageerror',err=>errors.push(err.message));
   const data={browser:name,width,ok:false,overflow:0,serviceCount:0,portfolioCount:0,articleCount:0,techCount:0,consoleErrors:[]};
   try{
     const response=await page.goto(origin,{waitUntil:'domcontentloaded',timeout:30000});
     if(!response?.ok())throw new Error('Page response '+response?.status());
     await page.locator('.service-card').first().waitFor({timeout:15000});
     data.serviceCount=await page.locator('.service-card').count();
     data.portfolioCount=await page.locator('.portfolio-card').count();
     data.articleCount=await page.locator('.article-card').count();
     data.techCount=await page.locator('.technology-pills button, .technology-pills .technology-static').count();
     if(data.serviceCount!==6 || data.portfolioCount!==8 || data.articleCount!==8 || data.techCount!==33)
       throw new Error('Unexpected content counts '+JSON.stringify(data));
     const layout=await page.evaluate(()=>{
       const vw=window.innerWidth;
       const doc=document.documentElement;
       const overflow=Math.max(0,doc.scrollWidth-vw);
       const candidates=Array.from(document.querySelectorAll('body *'))
         .filter(el=>{const r=el.getBoundingClientRect();return r.width>0 && (r.right>vw+2 || r.left < -2) && getComputedStyle(el).position !== 'fixed'})
         .slice(0,10).map(el=>({tag:el.tagName,class:typeof el.className==='string'?el.className.slice(0,80):'',right:Math.round(el.getBoundingClientRect().right)}));
       return {overflow,candidates};
     });
     data.overflow=layout.overflow;
     if(data.overflow>2)throw new Error('Horizontal overflow '+JSON.stringify(layout));
     if(errors.length)throw new Error('Uncaught errors: '+errors.join(' | '));
     // Interactive service and technology dialogs remain keyboard-accessible.
     await page.locator('.service-card').first().click();
     if(!(await page.locator('#detail-dialog').evaluate(el=>el.open)))
       throw new Error('Service dialog failed to open');
     await page.locator('#dialog-close').click();
     await page.locator('[data-filter="AI"]').click();
     const filtered=await page.locator('.portfolio-card').count();
     if(filtered<=0 || filtered>=8)throw new Error('Portfolio filter did not respond');
     await page.locator('[data-filter="All work"]').click();
     if(await page.locator('.portfolio-card').count()!==8)
       throw new Error('All work filter did not restore eight cases');
     await page.locator('.technology-pills button[data-tech]').first().click();
     if(!(await page.locator('#detail-dialog').evaluate(el=>el.open)))
       throw new Error('Technology dialog failed');
     await page.locator('#dialog-close').click();
     const mobile=width<=1100;
     if(mobile){
       await page.locator('#menu-toggle').click();
       if(await page.locator('#menu-toggle').getAttribute('aria-expanded')!=='true')
         throw new Error('Mobile menu failed to open');
       await page.keyboard.press('Escape');
       if(await page.locator('#menu-toggle').getAttribute('aria-expanded')!=='false')
         throw new Error('Mobile Escape close failed');
     }
     await page.locator('#project-form button[type="submit"]').click();
     const state=await page.locator('#form-status').getAttribute('data-state');
     if(state!=='error')throw new Error('Form validation did not surface');
     if(name==='chromium' && [375,768,1440].includes(width)){
       await page.goto(origin,{waitUntil:'domcontentloaded'});
       await page.locator('.service-card').first().waitFor();
       await page.screenshot({path:`${folder}/pukka-v2.3.4-${width}.png`,fullPage:true,animations:'disabled'});
     }
     if(name==='chromium' && [375,1440].includes(width)){
       await page.goto(origin,{waitUntil:'domcontentloaded'});
       await page.locator('.service-card').first().waitFor();
       const axe=await new AxeBuilder({page}).withTags(['wcag2a','wcag2aa','wcag21a','wcag21aa']).analyze();
       data.axeViolations=axe.violations.map(v=>({id:v.id,impact:v.impact,nodes:v.nodes.length,help:v.help}));
       const serious=axe.violations.filter(v=>['critical','serious'].includes(v.impact||''));
       if(serious.length)throw new Error('Axe serious/critical: '+serious.map(v=>v.id+':'+v.nodes.length).join(', '));
     }
     data.ok=true;
   }catch(err){const reason=err instanceof Error?err.message:String(err);failures.push({browser:name,width,reason});data.error=reason;try{await page.screenshot({path:`${folder}/failure-${name}-${width}.png`,fullPage:false,animations:'disabled'});}catch{}}
   results.push(data);
   await page.close();
  }
 } finally {await browser.close();}
}
const report={origin,widths,browsers:Object.keys(browserTypes),passed:failures.length===0,failures,results};
await writeFile(`${folder}/report.json`,JSON.stringify(report,null,2));
console.log(JSON.stringify({passed:report.passed,viewports:results.length,failures,axe:results.filter(r=>r.axeViolations).map(r=>({width:r.width,violations:r.axeViolations}))},null,2));
if(failures.length)process.exitCode=1;
