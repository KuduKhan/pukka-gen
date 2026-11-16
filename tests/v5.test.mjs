import test from "node:test";
import assert from "node:assert/strict";
import {readFileSync} from "node:fs";
const read=path=>readFileSync(new URL("../"+path,import.meta.url),"utf8");
test("v5 studio ships explicit consent, validation and a guarded email handoff",()=>{
 const page=read("studio.html"),logic=read("src/studio-v5.ts");
 for(const marker of ['id="v5-project-form"','name="service"','name="goal"','minlength="20"','href="/privacy.html"','role="status"']){
  assert.ok(page.includes(marker),"missing "+marker);
 }
 for(const marker of ['projectForm.reportValidity()','fetch("/api/project-brief"','submitButton.disabled=true','No binding estimate is implied.']){
  assert.ok(logic.includes(marker),"missing "+marker);
 }
 assert.doesNotMatch(logic,/localStorage|sessionStorage|innerHTML/);
});
test("v5 services are truthful and all disciplines lead to the scoping tool",()=>{
 const page=read("services.html");
 assert.equal((page.match(/class="v5-card"/g)||[]).length,6);
 assert.match(page,/not represented as completed client engagements/);
 assert.equal((page.match(/href="\/studio\.html\?service=/g)||[]).length,6);
});
test("v5 routes are built and public index metadata is complete",()=>{
 const vite=read("vite.config.mjs"),map=read("public/sitemap.xml");
 assert.match(vite,/services:page\("\.\/services\.html"\)/);
 assert.match(vite,/studio:page\("\.\/studio\.html"\)/);
 assert.equal((map.match(/<url>/g)||[]).length,14);
 assert.match(read("public/robots.txt"),/Sitemap: https:\/\/pukkagennoduff\.vercel\.app\/sitemap.xml/);
 for(const file of ["index.html","studio.html","services.html","company.html","partners.html","investors.html","trust.html","privacy.html","terms.html"])assert.ok(read(file).includes('rel="canonical"'),file+" canonical");
});
test("v5 preserves client confidentiality and release honesty",()=>{
 const doc=read("docs/RELEASE-v5.md");
 assert.match(doc,/NOT an autonomous AI agent/);
 assert.match(doc,/No authenticated client workspace/);
 assert.match(doc,/provider acceptance/);
 assert.equal(JSON.parse(read("package.json")).version,"5.1.0");
});

