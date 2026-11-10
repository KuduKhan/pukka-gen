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
   
   const chosenFonts=await page.evaluate(async()=>{
    await document.fonts.load('700 24px "Sora"');
    await document.fonts.load('400 16px "Manrope"');
    return {
     sora:document.fonts.check('700 24px "Sora"'),
     manrope:document.fonts.check('400 16px "Manrope"'),
     heading:getComputedStyle(document.querySelector("h1")).fontFamily,
     body:getComputedStyle(document.body).fontFamily
    };
   });
   if(!chosenFonts.sora||!chosenFonts.manrope||!chosenFonts.heading.includes("Sora")||!chosenFonts.body.includes("Manrope"))
    throw new Error("Homepage typography mismatch: "+JSON.stringify(chosenFonts));
   if((await page.locator("[data-service]").count())!==6)throw new Error("Six service cards missing");
   if(await page.evaluate(()=>document.documentElement.classList.contains("motion-enabled")))
    throw new Error("Reduced-motion preference should suppress scroll effects");
   if((await page.locator("[data-project]").count())!==3)throw new Error("Three concept cases missing");
   const overflow=await page.evaluate(()=>Math.max(0,document.documentElement.scrollWidth-window.innerWidth));
   if(overflow>2)throw new Error("Horizontal overflow: "+overflow+"px");
   if(await page.locator('[data-solution-select]').count()!==4)throw new Error("Four outcome paths missing");
   if(await page.locator('[data-sector]').count()!==6)throw new Error("Six industry playbooks missing");
   await page.locator('[data-solution-select="knowledge"]').click();
   const solutionSymbol=await page.locator('[data-solution-icon="engineer"]').getAttribute("href");
   if(solutionSymbol!=="/icons/pukka-symbols.svg#pg-insight")
     throw new Error("Solution architecture illustration failed to change");

   if(await page.locator('#solution-explorer').getAttribute("data-solution")!=="knowledge" ||
      !(await page.locator('#solution-title').innerText()).includes("intelligence"))throw new Error("Solution explorer failed");
   await page.locator('[data-solution-select="knowledge"]').focus();
   await page.keyboard.press("ArrowRight");
   if(await page.locator('#solution-explorer').getAttribute("data-solution")!=="trust")throw new Error("Solution explorer keyboard control failed");
   await page.locator('[data-sector="maritime"]').click();
   if(!(await page.locator('#detail-dialog').evaluate(el=>el.open)))throw new Error("Sector panel unavailable");
   if(!(await page.locator('.detail-disclaimer').innerText()).includes("Sector application"))throw new Error("Sector transparency absent");
   await page.locator('#dialog-close').click();
   if(await page.locator('#proof-accordion details').count()!==4)throw new Error("No Duff proof missing");
   if(await page.locator('#faq .faq-list details').count()!==4)throw new Error("FAQ missing");
   if(await page.locator('.ink-note').count()<3)throw new Error("Editorial handwritten annotations absent");
   if(await page.locator('.journal-symbol svg').count()!==3)throw new Error("Field note icon system inconsistent");
   if(await page.locator(".pg-capabilities-band").count()!==1)throw new Error("Enterprise capability bridge missing");
   if(await page.locator(".pg-sector-watermark").count()!==6)throw new Error("Sector visual context missing");
   if(await page.locator(".pg-cinematic-art").count()!==1)throw new Error("Cinematic engineering scene missing");
   await page.locator(".pg-cinematic-art").scrollIntoViewIfNeeded();
   await page.waitForFunction(()=>{
     const img=document.querySelector(".pg-cinematic-art");
     return img?.complete&&img?.naturalWidth>0;
   },null,{timeout:10000});
   const mastheadVisible=await page.locator(".pg-studio-strip").isVisible();
   if(width>700&&!mastheadVisible)throw new Error("Desktop enterprise studio strip missing");
   if(width<=700&&mastheadVisible)throw new Error("Mobile studio strip should be suppressed");
   if(await page.locator('.expertise-icon svg use').count()!==6 ||
      await page.locator('.sector-symbol svg use').count()!==6 ||
      await page.locator('.journal-symbol svg use').count()!==3)
     throw new Error("First-party icon sprite placements are incomplete");
   const responseIcons=await page.request.get(new URL("/icons/pukka-symbols.svg",url).toString());
   if(!responseIcons.ok() || !(await responseIcons.text()).includes('<symbol id="pg-maritime"'))
     throw new Error("Local icon sprite asset is missing or inaccessible");

   if(await page.locator('.expertise-icon svg').count()!==6)throw new Error("Service SVG system inconsistent");
   const glass=await page.locator('.system-panel').evaluate(node=>({
     background:getComputedStyle(node).backgroundColor,
     filter:getComputedStyle(node).backdropFilter || getComputedStyle(node).webkitBackdropFilter
   }));
   if(!glass.filter.includes('blur'))throw new Error("Frosted system panel style missing: "+JSON.stringify(glass));
   if(await page.locator(".pg-hero-signoff").isVisible()!==true)throw new Error("No Duff handwritten brand signoff missing");
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
   if(await page.locator('[data-stage-icon="1"]').getAttribute("href")!=="/icons/pukka-symbols.svg#pg-release")
     throw new Error("Selected engineering stage did not update SVG artwork");

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
   // Independently verify purposeful animations when the user allows motion.
   // The main QA context uses reduced-motion to protect accessibility.
   if(browserName==="chromium" && [375,1440].includes(width)){
    const motionContext=await browser.newContext({
      viewport:{width,height:900},deviceScaleFactor:1,reducedMotion:"no-preference"
    });
    try{
      const motionPage=await motionContext.newPage();
      const motionErrors=[];
      motionPage.on("pageerror",error=>motionErrors.push(error.message));
      await motionPage.goto(url,{waitUntil:"domcontentloaded"});
      await motionPage.locator(".pg-hero-signoff").waitFor();
      if(!await motionPage.evaluate(()=>document.documentElement.classList.contains("motion-enabled")))
        throw new Error("Normal-motion progressive enhancement did not start");
      const fontLoaded=await motionPage.evaluate(async()=>{
        await document.fonts.ready;
        return document.fonts.check('600 22px "Pukka Hand"');
      });
      if(!fontLoaded)throw new Error("Self-hosted Caveat handwriting font did not load");
      await motionPage.locator("#work .section-head").scrollIntoViewIfNeeded();
      await motionPage.waitForFunction(
        ()=>document.querySelector("#work .section-head")?.getAttribute("data-reveal")==="shown",
        null,{timeout:7000}
      );
      if(motionErrors.length)throw new Error("Normal-motion runtime error: "+motionErrors.join(" | "));
      await motionPage.screenshot({
        path:"artifacts/qa/motion-work-"+width+".png",animations:"disabled"
      });
    }finally{await motionContext.close();}
   }

   // Corporate pages: actual page loads, cross-browser/viewport overflow,
   // keyboard landmarks and axe checks beyond the homepage-only suite.
   if((browserName==="chromium" && [320,375,768,1440].includes(width)) ||
      (browserName!=="chromium" && width===375)){
     for(const route of ["company","partners","investors","trust"]){
       const routeUrl=new URL("/"+route+".html",url).toString();
       const routeResponse=await page.goto(routeUrl,{waitUntil:"domcontentloaded"});
       if(!routeResponse?.ok())throw new Error(route+" page failed HTTP");
       if(await page.locator('main h1').count()!==1)throw new Error(route+" heading missing");
       const corporateFonts=await page.evaluate(async()=>{
        await document.fonts.load('700 24px "Sora"');
        await document.fonts.load('400 16px "Manrope"');
        return {
         sora:document.fonts.check('700 24px "Sora"'),
         manrope:document.fonts.check('400 16px "Manrope"'),
         title:getComputedStyle(document.querySelector("main h1")).fontFamily,
         body:getComputedStyle(document.body).fontFamily
        };
       });
       if(!corporateFonts.sora||!corporateFonts.manrope||!corporateFonts.title.includes("Sora")||!corporateFonts.body.includes("Manrope"))
        throw new Error(route+" typography mismatch: "+JSON.stringify(corporateFonts));

       if(await page.locator('a.corp-skip[href="#main"]').count()!==1)throw new Error(route+" skip link absent");
       if(await page.locator('nav.corp-nav a[aria-current="page"]').count()!==1)throw new Error(route+" current page not marked");
       const routeOverflow=await page.evaluate(()=>Math.max(0,document.documentElement.scrollWidth-window.innerWidth));
       if(routeOverflow>2)throw new Error(route+" horizontal overflow at "+width+"px: "+routeOverflow);
       const routeLogo=await page.locator(".corp-brand img").evaluate(img=>img.complete&&img.naturalWidth>0);
       if(!routeLogo)throw new Error(route+" original brand logo did not load");
       if(browserName==="chromium"){
         await page.screenshot({path:"artifacts/qa/corporate-"+route+"-"+width+".png",fullPage:true,animations:"disabled"});
         if([375,1440].includes(width)){
           const a11y=await new AxeBuilder({page}).withTags(["wcag2a","wcag2aa","wcag21a","wcag21aa"]).analyze();
           const serious=a11y.violations.filter(v=>["serious","critical"].includes(v.impact||""));
           if(serious.length)throw new Error(route+" accessibility: "+JSON.stringify(serious.map(v=>({id:v.id,target:v.nodes[0]?.target}))));
         }
       }
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
