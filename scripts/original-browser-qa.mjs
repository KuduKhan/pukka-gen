import { chromium, firefox, webkit } from "playwright";
import assert from "node:assert/strict";
import {mkdir,writeFile} from "node:fs/promises";

const base=process.env.PUKKA_BASE_URL||"http://127.0.0.1:4173";
const errors=[],results=[];
await mkdir("artifacts/qa",{recursive:true});

for(const [engineName,engine] of Object.entries({chromium,firefox,webkit})){
 const browser=await engine.launch({headless:true});
 try{
  for(const width of engineName==="chromium"?[320,375,768,1440]:[375,1440]){
   const page=await browser.newPage({viewport:{width,height:850},reducedMotion:"reduce"});
   const runtimeErrors=[];
   page.on("pageerror",error=>runtimeErrors.push(error.message));
   try{
    const response=await page.goto(base,{waitUntil:"domcontentloaded",timeout:30000});
    assert.ok(response?.ok(),"Homepage HTTP status failed");
    await page.locator("#projectBriefForm").waitFor();
    const {scrollWidth,innerWidth}=await page.evaluate(()=>({scrollWidth:document.documentElement.scrollWidth,innerWidth:window.innerWidth}));
    assert.ok(scrollWidth<=innerWidth+3,"Horizontal overflow at "+width+": "+scrollWidth+" > "+innerWidth);
    assert.deepEqual(runtimeErrors,[],"Uncaught browser errors");
    for(const selector of [".pukka-official-mark",".pukka-official-wordmark"]){
     const image=page.locator(selector).first();
     assert.ok(await image.count(),"Missing original brand asset "+selector);
     const loaded=await image.evaluate(img=>img.complete&&img.naturalWidth>0);
     assert.ok(loaded,"Brand image failed to load "+selector);
    }
    if(width<1024){
     const toggle=page.locator("#mobileMenuBtn");
     if(await toggle.count()){await toggle.click();assert.ok(await page.locator("#mobile-menu").isVisible(),"Mobile menu failed to open")}
    }
    if(engineName==="chromium"&&[375,1440].includes(width)){
     await page.screenshot({path:"artifacts/qa/pukka-original-"+width+".png",fullPage:true,timeout:25000});
    }
    results.push({engineName,width,scrollWidth});
   }catch(error){errors.push(engineName+"/"+width+": "+error.message)}
   finally{await page.close()}
  }
 }finally{await browser.close()}
}
await writeFile("artifacts/qa/original-browser-results.json",JSON.stringify({results,errors},null,2));
console.log("Original source browser QA: "+results.length+" passed, "+errors.length+" failed");
for(const error of errors)console.error(error);
if(errors.length)process.exitCode=1;
