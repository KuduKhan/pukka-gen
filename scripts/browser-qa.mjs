import {chromium,firefox,webkit} from "playwright";
import AxeBuilder from "@axe-core/playwright";
import {mkdir,writeFile} from "node:fs/promises";
const url=process.env.PUKKA_BASE_URL||"http://127.0.0.1:4173/";
const widths=[320,375,768,1024,1280,1440];
const results=[],failures=[];
await mkdir("artifacts/qa",{recursive:true});
async function ready(){
 for(let i=0;i<80;i++){
  try{if((await fetch(url)).ok)return;}catch{}
  await new Promise(resolve=>setTimeout(resolve,500));
 }
 throw new Error("Development site did not start");
}
await ready();
for(const [browserName,engine] of Object.entries({chromium,firefox,webkit})){
 const browser=await engine.launch({headless:true});
 try{
 for(const width of widths){
  const context=await browser.newContext({viewport:{width,height:900},deviceScaleFactor:1,reducedMotion:"reduce"});
  const page=await context.newPage();const errors=[];
  page.on("pageerror",error=>errors.push(error.message));
  try{
   const response=await page.goto(url,{waitUntil:"domcontentloaded"});
   if(!response?.ok())throw new Error("Page HTTP failure");
   await page.locator("[data-service]").first().waitFor({timeout:12000});
   if((await page.locator("[data-service]").count())!==6)throw new Error("Six service cards missing");
   if((await page.locator("[data-project]").count())!==3)throw new Error("Three concept cases missing");
   const overflow=await page.evaluate(()=>Math.max(0,document.documentElement.scrollWidth-window.innerWidth));
   if(overflow>2)throw new Error("Horizontal overflow: "+overflow+"px");
   const logo=await page.locator(".brand img").evaluate(img=>img.complete&&img.naturalWidth>0);
   if(!logo)throw new Error("Original logo is missing");
   await page.locator('[data-system-select="security"]').click();
   if(await page.locator("#system-panel").getAttribute("data-active")!=="security"||
      await page.locator('[data-node="security"]').getAttribute("data-active")!=="true")
    throw new Error("Engineering atlas did not update");
   await page.locator('[data-system-select="security"]').focus();
   await page.keyboard.press("ArrowRight");
   if(await page.locator("#system-panel").getAttribute("data-active")!=="design")throw new Error("Atlas keyboard navigation failed");
   await page.locator('[data-filter="trust"]').click();
   if(await page.locator(".project:visible").count()!==1)throw new Error("Project filter failed");
   await page.locator('[data-filter="all"]').click();
   if(await page.locator(".project:visible").count()!==3)throw new Error("Project filter did not reset");
   await page.locator('[data-project="operations"]').click();
   if(!(await page.locator("#detail-dialog").evaluate(el=>el.open)))throw new Error("Project dialog unavailable");
   if(!(await page.locator(".detail-disclaimer").isVisible()))throw new Error("Concept disclosure not visible");
   await page.locator("#dialog-close").click();
   await page.locator('[data-service="software"]').click();
   if(!(await page.locator("#detail-dialog").evaluate(el=>el.open)))throw new Error("Service dialog unavailable");
   await page.keyboard.press("Escape");
   await page.locator('[data-step="verify"]').click();
   if(!(await page.locator("#process-title").innerText()).includes("Tests"))throw new Error("Process steps did not update");
   await page.locator('[data-article="discovery"]').click();
   if(!(await page.locator("#detail-dialog").evaluate(el=>el.open)))throw new Error("Field note dialog unavailable");
   await page.locator("#dialog-close").click();
   if(width<=980){
    await page.locator("#menu-toggle").click();
    if(await page.locator("#menu-toggle").getAttribute("aria-expanded")!=="true")throw new Error("Mobile menu inaccessible");
    await page.keyboard.press("Escape");
    if(await page.locator("#menu-toggle").getAttribute("aria-expanded")!=="false")throw new Error("Mobile Escape failed");
   }
   await page.locator("#project-form button[type=submit]").click();
   if(await page.locator("#form-status").getAttribute("data-state")!=="error")throw new Error("Invalid form not blocked");
   if(errors.length)throw new Error("Unhandled browser errors: "+errors.join(" | "));
   // Bring the page back to its initial view for visual acceptance and axe scans.
   await page.goto(url,{waitUntil:"domcontentloaded"});
   await page.locator("[data-service]").first().waitFor();
   if(browserName==="chromium"){
    await page.screenshot({path:"artifacts/qa/preview-"+width+".png",fullPage:true,animations:"disabled"});
    if([375,1440].includes(width)){
     const axe=await new AxeBuilder({page}).withTags(["wcag2a","wcag2aa","wcag21a","wcag21aa"]).analyze();
     const serious=axe.violations.filter(v=>["serious","critical"].includes(v.impact||""));
     if(serious.length)throw new Error("Axe: "+JSON.stringify(serious.map(v=>({id:v.id,nodes:v.nodes.slice(0,6).map(n=>({target:n.target,summary:n.failureSummary?.slice(0,260)}))}))));
    }
   }
   results.push({browser:browserName,width,ok:true});
  }catch(error){
   const reason=error instanceof Error?error.message:String(error);
   failures.push({browser:browserName,width,reason});
   results.push({browser:browserName,width,ok:false,error:reason});
   try{await page.screenshot({path:"artifacts/qa/failure-"+browserName+"-"+width+".png",animations:"disabled"});}catch{}
  }finally{await context.close();}
 }
 }finally{await browser.close();}
}
await writeFile("artifacts/qa/report.json",JSON.stringify({passed:failures.length===0,results,failures},null,2));
console.log(JSON.stringify({passed:failures.length===0,checked:results.length,failures},null,2));
if(failures.length)process.exitCode=1;
