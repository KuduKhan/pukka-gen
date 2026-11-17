import test from "node:test";
import assert from "node:assert/strict";
import {readFileSync} from "node:fs";
const read=path=>readFileSync(new URL("../"+path,import.meta.url),"utf8");
const html=read("index.html"),js=read("public/site.js"),css=read("public/site.css");
test("The uploaded Pukka Gen design is the entire production landing page",()=>{
 for(const name of ["Authentic Engineering.","Next-Gen Solutions.","Redefining Tech Partnerships","Radical Authenticity","Selected builds with real product pressure.","Meet The Team","Frequently Asked Questions"]){
  assert.ok(html.includes(name),name+" missing");
 }
 assert.match(html,/class="text-white logo-text-1">PUKKA<\/span>/);
 assert.match(html,/class="text-cyan-400 logo-text-2">GEN<\/span>/);
 assert.match(html,/\/fidelity\.css/);
 assert.match(html,/site\.css/);
 assert.match(html,/site\.js/);
 assert.doesNotMatch(html,/cdn\.tailwindcss\.com/);
});
test("The replacement form performs real provider-gated submission rather than fake toast success",()=>{
 assert.match(html,/id="projectBriefForm"/);
 assert.match(js,/fetch\('\/api\/project-brief'/);
 assert.match(js,/provider accepted your enquiry/i);
 assert.match(js,/Delivery could not be confirmed/i);
 assert.doesNotMatch(js,/Brief captured\. The team will respond/);
});
test("Mobile menu, services, modals and source interaction code retained",()=>{
 for(const key of ["mobileMenuBtn","mobile-menu","serviceModal","faqModal","commandPalette","contactModal","portfolio"]){
  assert.ok(html.includes(key),key+" missing");
 }
 assert.ok(js.length>120000);
 assert.match(css,/@media \(prefers-reduced-motion: reduce\)/);
});
test("Vite builds only new site and legal pages; no obsolete public product pages",()=>{
 const vite=read("vite.config.mjs");
 for(const page of ["index.html","privacy.html","terms.html"])assert.ok(vite.includes(page));
 for(const page of ["services.html","studio.html","company.html","trust.html"])assert.ok(!vite.includes('page("./'+page+'")'));
});
