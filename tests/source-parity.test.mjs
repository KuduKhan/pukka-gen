import test from "node:test";
import assert from "node:assert/strict";
import {readFileSync,existsSync} from "node:fs";
const read=path=>readFileSync(new URL("../"+path,import.meta.url),"utf8");
const source=read("reference/pukkagen-uploaded-original.html");
const page=read("index.html");
const css=read("public/site.css"),js=read("public/site.js"),fix=read("public/fidelity.css");
test("Authoritative uploaded HTML is preserved unedited for reproduction",()=>{
 assert.equal(source.length,417601);
 assert.match(source,/<script src="https:\/\/cdn\.tailwindcss\.com"><\/script>/);
 assert.match(source,/<span class="text-white logo-text-1">PUKKA<\/span>/);
 assert.ok(existsSync(new URL("../reference/pukkagen-uploaded-original.html",import.meta.url)));
});
test("All uploaded design sections and imagery remain in the production page",()=>{
 for(const id of ["about","values","services","portfolio","process","checklist","testimonials","insights","team","contact"]){
  assert.ok(source.includes('id="'+id+'"'),id+" missing from original");
  assert.ok(page.includes('id="'+id+'"'),id+" missing from production");
 }
 const photos=[...source.matchAll(/https:\/\/images\.unsplash\.com\/photo-[a-z0-9-]+/g)].map(x=>x[0]);
 for(const photo of new Set(photos))assert.ok(page.includes(photo),"Original photo missing: "+photo);
 for(const title of ["Authentic Engineering.","Next-Gen Solutions.","Redefining Tech Partnerships","Radical Authenticity","Meet The Team","The Pukka Protocol"]){
  assert.ok(source.includes(title),"Original source heading missing: "+title);
  assert.ok(page.includes(title),"Current page heading missing: "+title);
 }
});
test("Original CSS effects, JS and typography remain intact without runtime Tailwind CDN",()=>{
 for(const block of [...source.matchAll(/<style>([\s\S]*?)<\/style>/g)]){
  assert.ok(css.includes(block[1].trim()),"Original authored CSS block missing");
 }
 for(const name of ["spotlight-card","animate-astro-bounce","reveal-text","liquid-bubble","glitch-hover","marquee-track"])assert.ok(css.includes(name),name+" CSS effect missing");
 for(const name of ["openContactModal","openMapModal","initMobileAutoScroll","getServiceTheme"])assert.ok(js.includes(name),name+" original behavior missing");
 assert.match(page,/href="\/fidelity\.css"/);
 assert.doesNotMatch(page,/cdn\.tailwindcss\.com/);
 assert.match(fix,/max-width:600px/);
 assert.match(fix,/hover\\:bg-purple-400/);
});
