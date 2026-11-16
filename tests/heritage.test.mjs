import test from "node:test";
import assert from "node:assert/strict";
import {readFileSync} from "node:fs";
const get=path=>readFileSync(new URL("../"+path,import.meta.url),"utf8");
const newPages=["about","services","industries","careers","faqs","contact"];
test("six original-brand routes preserve the authentic Pukka Gen design system",()=>{
 for(const name of newPages){
  const page=get(name+".html");
  assert.match(page,/\/src\/heritage\.css/,name);
  assert.match(page,/pukka-gen-wordmark\.png/,name);
  assert.match(page,/pukka-gen-mark\.png/,name);
  assert.match(page,/No Duff/i,name);
  assert.match(page,/<main id="main">/,name);
  assert.match(page,/href="#main"/,name);
  assert.match(page,/<details class="ph-menu">/,name);
  assert.match(page,/<nav class="ph-nav"/,name);
  assert.match(page,/rel="canonical"/,name);
 }
});
test("About contains mission, vision, original Pukka definition and four core values",()=>{
 const page=get("about.html");
 for(const marker of ["Our Mission","Our Vision","Radical Authenticity","Future-Proof Engineering","User-Obsessed Design","Collaborative Intelligence","Pukka","Gen"])assert.ok(page.includes(marker),marker);
});
test("services include original five practice categories plus technical strategy",()=>{
 const page=get("services.html");
 for(const marker of ["Custom Software Development","AI &amp; Intelligent Automation","Cloud Strategy &amp; DevOps","Product Design &amp; Strategy","QA &amp; Cybersecurity","Technical Strategy &amp; Architecture"])assert.ok(page.includes(marker),marker);
 assert.equal((page.match(/class="v5-card"/g)||[]).length,6);
 assert.equal((page.match(/href="\/studio\.html\?service=/g)||[]).length,6);
});
test("ten industry contexts are presented without invented past delivery claims",()=>{
 const page=get("industries.html");
 assert.equal((page.match(/<article class="ph-card/g)||[]).length,10);
 for(const marker of ["Retail &amp; E-Commerce","Fintech &amp; Banking","Healthcare &amp; Medtech","Education &amp; E-Learning","Manufacturing &amp; Industry 4.0","Logistics &amp; Transportation","Insurance","Telecommunications","Hospitality &amp; Travel","Non-Profit &amp; Social Impact"])assert.ok(page.includes(marker),marker);
});
test("FAQ questions are native keyboard-accessible disclosure widgets",()=>{
 const page=get("faqs.html");
 assert.equal((page.match(/<details class="ph-faq">/g)||[]).length,6);
 assert.equal((page.match(/<summary>/g)||[]).length,6);
});
test("careers does not present interest disciplines as authenticated openings",()=>{
 const page=get("careers.html");
 assert.match(page,/not an announcement of active vacancies/);
 assert.match(page,/No independently verified open positions/);
 assert.doesNotMatch(page,/>Apply now</i);
});
test("contact provenance, QR and unsupported metrics restrictions are explicit",()=>{
 const page=get("contact.html");
 assert.match(page,/pukka-contact-qr\.svg/);
 assert.match(page,/verified Vercel/);
 assert.match(page,/not been independently verified/);
 assert.match(get("public/pukka-contact-qr.svg"),/<svg/);
 for(const n of newPages){
  const content=get(n+".html");
  assert.doesNotMatch(content,/50\+.*projects|30\+.*clients|99\.9% uptime/i,n);
 }
});
test("14 routes are in sitemap and all heritage routes build with Vite",()=>{
 const vite=get("vite.config.mjs"),map=get("public/sitemap.xml"),home=get("index.html");
 assert.equal((map.match(/<url>/g)||[]).length,14);
 for(const page of ["about","industries","careers","faqs","contact"]){
  assert.match(vite,new RegExp(page+':page\\("\\.\\/'+page+'\\.html"\\)'));
  assert.ok(home.includes('href="/'+page+'.html"'),"Homepage discovery link missing: "+page);
 }
 assert.ok(home.includes('id="pukka-standard"'));
});
test("visual implementation is lightweight and reduced-motion aware",()=>{
 const css=get("src/heritage.css");
 assert.match(css,/prefers-reduced-motion:reduce/);
 assert.match(css,/focus-visible/);
 assert.match(css,/ph-grid-5/);
 assert.doesNotMatch(css,/@keyframes|pointermove|mousemove/);
});

