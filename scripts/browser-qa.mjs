import {chromium,firefox,webkit} from "playwright";
import AxeBuilder from "@axe-core/playwright";
import {mkdir,writeFile} from "node:fs/promises";
const url=process.env.PUKKA_BASE_URL||"http://127.0.0.1:4173/";
const results=[],failures=[];
await mkdir("artifacts/qa",{recursive:true});
for(const [browserName,engine] of Object.entries({chromium,firefox,webkit})){
 const browser=await engine.launch({headless:true});
 try{
  for(const width of [320,375,768,1280]){
   const context=await browser.newContext({viewport:{width,height:900},deviceScaleFactor:1,reducedMotion:"reduce"});
   const page=await context.newPage(),errors=[];
   page.on("pageerror",error=>errors.push(error.message));
   try{
    const response=await page.goto(url,{waitUntil:"domcontentloaded",timeout:30000});
    if(!response?.ok())throw Error("Page HTTP status "+response?.status());
    await page.locator("#about").waitFor({timeout:15000});
    const logo=page.locator('nav img[alt="Pukka Gen No Duff"]');
    if(!(await logo.count()))throw Error("Official Pukka Gen wordmark missing");
    const naturalWidth=await logo.evaluate(img=>img.complete?img.naturalWidth:0);
    if(!naturalWidth)throw Error("Official Pukka Gen wordmark failed to load");
    const geometry=await page.evaluate(()=>({scroll:document.documentElement.scrollWidth,width:innerWidth}));
    if(geometry.scroll>geometry.width+2)throw Error("Horizontal overflow "+JSON.stringify(geometry));
    if(width<=768){
     await page.locator("#mobileMenuBtn").click();
     const mobile=page.locator("#mobile-menu");
     if(!(await mobile.isVisible()))throw Error("Mobile vertical navigation failed to open");
     if(!(await mobile.locator('a[href="#services"]').isVisible()))throw Error("Mobile services link not visible");
     await page.locator("#mobileMenuBtn").click();
    }
    if(width===375){
     await page.route("**/api/project-brief",route=>route.fulfill({status:200,contentType:"application/json",body:JSON.stringify({ok:true})}));
     await page.locator("#projectName").fill("Quality Test");
     await page.locator("#projectEmail").fill("quality@example.com");
     await page.locator("#projectService").selectOption("dev");
     await page.locator("#projectMessage").fill("A complete qualifying enquiry for verified form functionality.");
     await page.locator("#projectBriefForm button[type=submit]").click();
     const status=page.locator("#projectFormStatus");
     await status.getByText(/provider accepted|accepted your enquiry/i).waitFor({timeout:12000});
    }
    if(errors.length)throw Error("Runtime errors: "+errors.slice(0,3).join("; "));
    if((browserName==="chromium"&&[375,1280].includes(width))){
     const a11y=await new AxeBuilder({page}).withTags(["wcag2a","wcag2aa","wcag21a","wcag21aa"]).analyze();
     const severe=a11y.violations.filter(v=>["critical","serious"].includes(v.impact));
     if(severe.length)throw Error("Accessibility: "+severe.map(v=>v.id+"("+v.nodes.length+")").join(", "));
     await page.screenshot({path:"artifacts/qa/replacement-"+width+".png",fullPage:true,animations:"disabled"});
    }
    results.push({browser:browserName,width,passed:true});
   }catch(e){
    const reason=e instanceof Error?e.message:String(e);
    failures.push({browser:browserName,width,reason});
    results.push({browser:browserName,width,passed:false,reason});
   }finally{await context.close();}
  }
 }finally{await browser.close();}
}
await writeFile("artifacts/qa/replacement-report.json",JSON.stringify({results,failures},null,2));
console.log(JSON.stringify({total:results.length,passed:results.length-failures.length,failures},null,2));
if(failures.length)process.exitCode=1;
