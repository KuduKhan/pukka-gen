import test from "node:test";
import assert from "node:assert/strict";
import {readFileSync,existsSync} from "node:fs";
import {Script} from "node:vm";
const read=(p)=>readFileSync(new URL("../"+p,import.meta.url),"utf8");
const html=read("index.html"),js=read("public/original-site.js"),css=read("public/original-site.css");
test("restored source is Pukka Gen original single-page website",()=>{
 for(const s of ["Authentic Engineering.","Next-Gen Solutions.","id=\"about\"","id=\"values\"","id=\"services\"","id=\"portfolio\"","id=\"team\"","id=\"projectBriefForm\"","id=\"contact\"","Frequently Asked Questions","The Pukka Protocol"]){
  assert.ok(html.includes(s),"Missing original section/label: "+s);
 }
 assert.ok(html.length>200000,"The supplied site should be substantially preserved");
 assert.match(css,/glass|Glass/i);
});
test("official brand assets replace both text-only logos",()=>{
 assert.equal((html.match(/class="pukka-official-wordmark"/g)||[]).length,2);
 assert.equal((html.match(/class="pukka-official-mark"/g)||[]).length,2);
 assert.ok(existsSync(new URL("../public/pukka-gen-mark.png",import.meta.url)));
 assert.ok(existsSync(new URL("../public/pukka-gen-wordmark.png",import.meta.url)));
});
test("no fake success; original project form makes a real server-side request",()=>{
 assert.match(js,/async function handleProjectBriefSubmit/);
 assert.match(js,/fetch\('\/api\/project-brief'/);
 assert.match(js,/submitButton\.disabled = true/);
 assert.match(js,/mail provider accepted your enquiry/);
 assert.doesNotMatch(js,/Brief captured\. The team will respond|Your project brief is ready for Pukka Gen review/);
 assert.match(html,/minlength="20"/);
 assert.match(html,/id="projectFormStatus"/);
});
test("all original interactivity is extracted into valid self-hosted JavaScript",()=>{
 new Script(js);
 assert.match(html,/src="\/original-site\.js" defer/);
 assert.match(html,/href="\/original-site\.css"/);
 assert.match(html,/href="\/tailwind-original\.css"/);
 assert.doesNotMatch(html,/onclick=|cdn\.tailwindcss\.com|<script>\s*const prefersReducedMotion/);
 assert.match(js,/data-pukka-open-map/);
});
test("mobile / reduced-motion logic avoids heavy pointer animation",()=>{
 assert.match(js,/prefersLightweightEffects/);
 assert.match(css,/prefers-reduced-motion:reduce/);
 assert.match(css,/pointer:coarse/);
 assert.match(css,/focus-visible/);
});
test("site keeps working routes and does not bundle superseded V5 pages",()=>{
 const v=read("vite.config.mjs"),map=read("public/sitemap.xml");
 assert.match(v,/home:page/);
 assert.match(v,/privacy:page/);
 assert.match(v,/terms:page/);
 assert.doesNotMatch(v,/services:page|studio:page|company:page/);
 assert.equal((map.match(/<url>/g)||[]).length,3);
 assert.match(html,/href="\/privacy\.html"/);
 assert.match(html,/href="\/terms\.html"/);
});
test("strong CSP for owner-provided original source and remote imagery",()=>{
 const config=JSON.parse(read("vercel.json"));
 const csp=config.headers[0].headers.find(x=>x.key==="Content-Security-Policy").value;
 assert.match(csp,/script-src 'self'/);
 assert.doesNotMatch(csp,/script-src[^;]*'unsafe-inline'/);
 assert.match(csp,/style-src-attr 'unsafe-inline'/);
 assert.match(csp,/images\.unsplash\.com/);
 assert.match(csp,/frame-src https:\/\/maps\.google\.com/);
});

