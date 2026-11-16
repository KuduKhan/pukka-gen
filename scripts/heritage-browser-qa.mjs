import { chromium, firefox, webkit } from "playwright";
import AxeBuilder from "@axe-core/playwright";
import assert from "node:assert/strict";
import {mkdir,writeFile} from "node:fs/promises";
const base=process.env.PUKKA_BASE_URL||"http://127.0.0.1:4173";
const pages=["about","services","industries","careers","faqs","contact"];
const engines={chromium,firefox,webkit};
const failures=[],results=[];
await mkdir("artifacts/qa",{recursive:true});
for(const [browserName,engine] of Object.entries(engines)){
 const browser=await engine.launch({headless:true});
 try{
  const widths=browserName==="chromium"?[320,375,768,1280]:[375,1280];
  for(const width of widths){
   for(const name of pages){
    const page=await browser.newPage({viewport:{width,height:900},deviceScaleFactor:1,reducedMotion:"reduce"});
    const pageErrors=[];
    page.on("pageerror",err=>pageErrors.push(err.message));
    try{
     const res=await page.goto(base+"/"+name+".html",{waitUntil:"domcontentloaded",timeout:30000});
     assert.ok(res?.ok(),name+": HTTP status");
     await page.locator("main#main").waitFor();
     await page.evaluate(()=>document.fonts.ready);
     const geometry=await page.evaluate(()=>({scroll:document.documentElement.scrollWidth,inner:innerWidth}));
     assert.ok(geometry.scroll<=geometry.inner+2,name+" width "+width+": horizontal overflow "+JSON.stringify(geometry));
     assert.deepEqual(pageErrors,[],name+": runtime errors");
     for(const im of await page.locator("img").all()){
      const loaded=await im.evaluate(x=>x.complete&&x.naturalWidth>0);
      assert.ok(loaded,name+" image missing: "+(await im.getAttribute("src")));
     }
     if(width<=768){
      const menu=page.locator(".ph-menu summary");
      await menu.click();
      assert.ok(await page.locator(".ph-menu[open]").count(),name+": mobile navigation did not expand");
      assert.ok(await page.locator(".ph-menu a[href='/contact.html']").isVisible(),"Contact link must be visible in the expanded mobile menu");
     }
     if(name==="faqs"){
      const first=page.locator(".ph-faq").first();
      await first.locator("summary").click();
      assert.ok(await first.getAttribute("open")!==null,"FAQ does not open");
     }
     const report=await new AxeBuilder({page}).withTags(["wcag2a","wcag2aa","wcag21a","wcag21aa","wcag22aa"]).analyze();
     const major=report.violations.filter(x=>["critical","serious"].includes(x.impact));
     assert.equal(major.length,0,name+": WCAG violations: "+major.map(x=>x.id+" "+x.nodes.length).join("; "));
     if(browserName==="chromium"&&width===375&&["about","services","contact"].includes(name)){
      await page.screenshot({path:"artifacts/qa/heritage-"+name+"-mobile.png",fullPage:true});
     }
     if(browserName==="chromium"&&width===1280&&["about","services","industries","careers","faqs","contact"].includes(name)){
      await page.screenshot({path:"artifacts/qa/heritage-"+name+"-desktop.png",fullPage:true});
     }
     results.push({browserName,width,name,overflow:0,axeViolations:report.violations.length});
    }catch(err){failures.push(browserName+"/"+name+"/"+width+": "+err.message);}
    finally{await page.close();}
   }
  }
 }finally{await browser.close();}
}
await writeFile("artifacts/qa/heritage-qa.json",JSON.stringify({results,failures},null,2));
console.log("Heritage browser checks: "+results.length+" passed; "+failures.length+" failed");
for(const f of failures)console.error(f);
if(failures.length)process.exitCode=1;

