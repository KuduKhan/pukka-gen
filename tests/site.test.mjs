import test from "node:test";
import assert from "node:assert/strict";
import {readFileSync,existsSync} from "node:fs";
const read=path=>readFileSync(new URL("../"+path,import.meta.url),"utf8");
const html=read("index.html"),main=read("src/main.ts"),style=read("src/styles.css");
test("fresh source uses only new architecture and original brand assets",()=>{
 assert.match(html,/Pukka Gen — Engineered to Matter/);
 assert.match(html,/No jargon\. No shortcuts/);
 assert.match(html,/src="\/pukka-gen-wordmark\.png"/);
 assert.ok(existsSync(new URL("../public/pukka-gen-wordmark.png",import.meta.url)));
 assert.ok(existsSync(new URL("../public/pukka-gen-favicon.png",import.meta.url)));
 assert.doesNotMatch(html,/khanhomes|wasafi/i);
 assert.doesNotMatch(html,/testimonials|unverified client results/i);
 assert.doesNotMatch(html,/https:\/\/images\./i);
 assert.match(html,/name="robots" content="index,follow"/);
 assert.match(read("public/robots.txt"),/Allow: \//);
 assert.doesNotMatch(read("public/robots.txt"),/Disallow: \/\s*(?:\n|$)/);
});
test("all meaningful sections, contact links and legal pages exist",()=>{
 const ids=["main","top","work","expertise","approach","studio","journal","contact","project-form","detail-dialog","system-panel"];
 for(const id of ids)assert.ok(html.includes('id="'+id+'"'),id+" absent");
 for(const route of ["privacy.html","terms.html"]){
  assert.match(read(route),/href="\/"/);
  assert.match(read(route),/src\/legal\.css/);
 }
 assert.match(html,/mailto:mail@pukkagennoduff.com/);
 assert.match(html,/name="email" type="email"/);
 assert.match(html,/name="message" minlength="20"/);
 assert.match(main,/fetch\("\/api\/project-brief"/);
 assert.match(main,/fallback\.hidden=false/);
});
test("engineering atlas is functional, not a non-interactive illustration",()=>{
 const domains=["software","ai","cloud","security","design","strategy"];
 for(const key of domains){
  assert.ok(html.includes('data-system-select="'+key+'"'),key+" tab missing");
  assert.ok(html.includes('data-node="'+key+'"'),key+" SVG node missing");
  assert.ok(html.includes('data-link="'+key+'"'),key+" connector missing");
  assert.match(main,new RegExp("\\b"+key+":\\{"));
 }
 assert.match(html,/role="img" aria-labelledby="atlas-title atlas-desc"/);
 assert.match(html,/id="system-copy" aria-live="polite"/);
 assert.match(main,/function setDomain/);
 assert.match(main,/ArrowLeft/);
 assert.match(main,/Home/);
 assert.match(main,/setDomain\("software"\)/);
 assert.match(style,/\.atlas-links path\[data-active="true"\]/);
 assert.match(style,/@media\(prefers-reduced-motion:reduce\)/);
});
test("original concepts are clearly identified and interact correctly",()=>{
 for(const key of ["operations","intelligence","security"]){
  assert.ok(html.includes('data-project="'+key+'"'),key+" project missing");
  assert.ok(main.includes(key+":{label:"),key+" detail absent");
 }
 for(const filter of ["all","platforms","intelligence","trust"])assert.ok(html.includes('data-filter="'+filter+'"'));
 assert.match(html,/ILLUSTRATIVE UI/);
 assert.match(html,/ILLUSTRATIVE FLOW/);
 assert.match(html,/ILLUSTRATIVE MODEL/);
 assert.match(main,/Illustrative product concept/);
 assert.match(main,/card\.hidden=filter/);
 assert.doesNotMatch(html,/99\.99%|5M\+|2\.5×/);
});
test("services, process and articles retain accessible interactions",()=>{
 for(const key of ["software","ai","cloud","security","design","strategy"]){
  assert.ok(html.includes('data-service="'+key+'"'));
  assert.match(main,new RegExp(key+":\\{label:"));
 }
 for(const key of ["discover","architect","engineer","verify","evolve"])assert.ok(html.includes('data-step="'+key+'"'));
 for(const key of ["discovery","security","ai"])assert.ok(html.includes('data-article="'+key+'"'));
 assert.match(main,/dialog\.showModal\(\)/);
 assert.match(main,/dialog\.addEventListener\("close"/);
 assert.match(main,/setMenu\(false\)/);
});
test("TypeScript, Vite and Vercel preview config are intentionally lean",()=>{
 const pkg=JSON.parse(read("package.json"));
 assert.equal(pkg.version,"4.0.0-preview.1");
 assert.equal(Object.keys(pkg.dependencies||{}).length,0);
 assert.equal(pkg.scripts.build,"tsc --noEmit && vite build");
 const lock=JSON.parse(read("package-lock.json"));
 assert.equal(lock.version,pkg.version);
 assert.equal(lock.packages[""].version,pkg.version);
 assert.match(read("vite.config.mjs"),/privacy\.html/);
 assert.match(read("vite.config.mjs"),/terms\.html/);
 const config=JSON.parse(read("vercel.json"));
 assert.equal(config.framework,"vite");
 assert.match(JSON.stringify(config),/frame-ancestors 'none'/);
});
test("design system supports smallest mobile width and accessible contrast modes",()=>{
 for(const query of ["max-width:380px","max-width:600px","max-width:980px","prefers-reduced-motion:reduce","prefers-contrast:more"]){
  assert.ok(style.includes(query),query+" unsupported");
 }
 for(const token of ["--night:#07182e","--cyan:#52d8f6","--violet:#925ef3"]){
  assert.ok(style.includes(token),token+" absent");
 }
 const open=(style.match(/\{/g)||[]).length,close=(style.match(/\}/g)||[]).length;
 assert.equal(open,close,"CSS braces unbalanced");
});


test("outcome-led No Duff 4.1 includes four keyboard-accessible problem-to-solution paths",()=>{
 for(const key of ["operations","knowledge","trust","products"]){
  assert.ok(html.includes('data-solution-select="'+key+'"'),key+" outcome missing");
  assert.match(main,new RegExp("\\b"+key+":\\{kicker:"));
 }
 for(const id of ["solutions","solution-selector","solution-explorer","solution-title","solution-description","solution-proof"]){
  assert.ok(html.includes('id="'+id+'"'),id+" missing");
 }
 assert.match(html,/id="solution-description" aria-live="polite"/);
 assert.match(main,/function selectSolution/);
 assert.match(main,/solutionSelector\.addEventListener\("keydown"/);
 assert.match(main,/setAttribute\("aria-pressed"/);
 assert.match(style,/\.solution-explorer\[data-solution="knowledge"\]/);
});
test("industry playbooks are illustrative rather than claims about actual customers",()=>{
 const sectorKeys=["maritime","property","finance","education","health","workforce"];
 for(const key of sectorKeys){
  assert.ok(html.includes('data-sector="'+key+'"'),key+" sector absent");
  assert.ok(main.includes(key+':{label:"SECTOR PLAYBOOK'),key+" sector detail absent");
 }
 assert.match(html,/id="sector-grid"/);
 assert.match(html,/not unverified claims about our clients/i);
 assert.match(main,/sector application pattern/i);
 assert.match(main,/for\(const kind of \["project","service","sector","article"\]/);
 assert.match(style,/\.sector-grid/);
});
test("No Duff assurance is explicit, inspectable and provides direct FAQ answers",()=>{
 assert.match(html,/id="proof-accordion"/);
 assert.match(html,/id="faq-title"/);
 assert.match(html,/Good engineering begins with the problem/);
 assert.match(html,/independent evidence/i);
 assert.match(style,/\.proof-accordion details/);
 assert.match(style,/\.faq-list details/);
 assert.equal((html.match(/class="sector-card/g)||[]).length,6);
 assert.equal((html.match(/class="solution-choice/g)||[]).length,4);
});


test("premium glass card system has one cohesive self-hosted handwriting identity",()=>{
  const premium=read("src/premium.css");
  assert.match(html,/href="\/src\/premium.css"/);
  assert.match(premium,/@font-face\s*\{/);
  assert.match(premium,/font-family:"Pukka Hand"/);
  assert.match(premium,/\/fonts\/Caveat-variable\.ttf/);
  assert.match(premium,/--glass-dark:/);
  assert.match(premium,/backdrop-filter:blur/);
  assert.match(premium,/\.sector-symbol svg/);
  assert.match(premium,/\.expertise-icon svg/);
  assert.match(premium,/\.journal-symbol svg/);
  assert.match(premium,/\.project-form :is\(input,select,textarea\):focus-visible/);
  assert.ok(existsSync(new URL("../public/fonts/Caveat-variable.ttf",import.meta.url)));
  assert.ok(existsSync(new URL("../public/fonts/OFL-Caveat.txt",import.meta.url)));
  assert.match(read("public/fonts/OFL-Caveat.txt"),/SIL OPEN FONT LICENSE/i);
  assert.ok((html.match(/class="ink-note/g)||[]).length>=3);
  assert.match(html,/class="pg-hero-signoff"/);
  assert.doesNotMatch(html,/class="ink-note ink-note-hero"/);
});
test("illustrative icon scenes use consistent semantic SVG instead of platform-dependent pictograms",()=>{
  assert.equal((html.match(/class="journal-symbol" aria-hidden="true"><svg/g)||[]).length,3);
  assert.equal((html.match(/class="ai-ic"><svg/g)||[]).length,3);
  assert.match(read("src/premium.css"),/prefers-reduced-motion:reduce/);
  assert.match(read("src/premium.css"),/prefers-contrast:more/);
  assert.match(main,/IntersectionObserver/);
  assert.match(main,/document\.documentElement\.classList\.add\("motion-enabled"\)/);
  assert.doesNotMatch(read("src/premium.css"),/https?:\/\//);
});


test("motion QA exercises both reduced and normal motion modes without runtime font dependencies",()=>{
  const browserSuite=read("scripts/browser-qa.mjs");
  assert.match(browserSuite,/reducedMotion:"reduce"/);
  assert.match(browserSuite,/reducedMotion:"no-preference"/);
  assert.match(browserSuite,/document\.fonts\.check/);
  assert.match(browserSuite,/motion-enabled/);
  assert.match(browserSuite,/data-reveal/);
  assert.match(browserSuite,/motion-work-/);
});


test("iconography v2 is one distinct local SVG symbol family with precise contextual placement",()=>{
 const sprite=read("public/icons/pukka-symbols.svg");
 const count=(sprite.match(/<symbol id="pg-/g)||[]).length;
 assert.ok(count>=25,"Icon sprite should provide a complete visual vocabulary");
 for(const key of ["software","ai","cloud","security","design","strategy","maritime","property","finance","education","health","workforce","discovery","journal-security","journal-ai","scope","roadmap","flow","release"]){
  assert.ok(sprite.includes('id="pg-'+key+'"'),key+" missing in sprite");
 }
 for(const section of ["expertise-icon","sector-symbol","journal-symbol"])assert.match(html,new RegExp('class="pg-icon pg-icon-'+section+'"'));
 assert.equal((html.match(/href="\/icons\/pukka-symbols\.svg#pg-/g)||[]).length>=18,true);
 assert.match(html,/data-stage-icon="0"/);
 assert.match(html,/data-solution-icon="input"/);
 assert.match(main,/const solutionIconMap:/);
 assert.match(main,/const stageIconMap:/);
 assert.match(main,/setAttribute\("href","\/icons\/pukka-symbols\.svg#pg-"/);
 assert.match(read("src/premium.css"),/\.pg-stage-plate/);
 assert.match(read("src/premium.css"),/\.sector-card\[data-sector="health"\]/);
 assert.doesNotMatch(sprite,/\b(?:href|src)=["\x27]https?:\/\//,"SVG symbols must not import remote imagery");
});


test("original enterprise editorial direction is organized for decision-makers",()=>{
 const enterprise=read("src/enterprise.css");
 const art=read("public/illustrations/pukka-systems-horizon.svg");
 const sections=["expertise","solutions","systems","work","sectors","approach","proof","studio","journal","faq","contact"];
 let cursor=0;
 for(const id of sections){
  const index=html.indexOf('id="'+id+'"',cursor);
  assert.ok(index>cursor,"Section missing/out of sequence: "+id);
  cursor=index;
 }
 assert.match(html,/class="pg-studio-strip"/);
 assert.match(html,/class="pg-capabilities-band"/);
 assert.match(html,/class="pg-cinematic-art"/);
 assert.match(html,/Technology<br>built to <em>matter/);
 assert.match(html,/No Duff<span class="full-stop">/);
 assert.match(html,/pukka-gen-wordmark\.png/);
 assert.equal((html.match(/class="pg-sector-watermark"/g)||[]).length,6);
 assert.match(enterprise,/\.pg-cinematic/);
 assert.match(enterprise,/@media\(max-width:375px\)/);
 assert.match(enterprise,/@media\(prefers-reduced-motion:reduce\)/);
 assert.match(art,/<svg xmlns="http:\/\/www\.w3\.org\/2000\/svg"/);
 assert.doesNotMatch(html,/nocturnalsintellisoft\.com|https:\/\/images/i);
 assert.match(html,/AN INTELLISOFT COMPANY/);
 assert.doesNotMatch(enterprise,/nocturnalsintellisoft\.com/);
});

test("corporate authority routes are honest, linked and accessible",()=>{
 const pages=["company","partners","investors","trust"];
 for(const name of pages){
  const page=read(name+".html");
  assert.match(html,new RegExp('href="/'+name+'\\.html"'),name+" must be discoverable");
  assert.match(page,/href="#main"/);
  assert.match(page,/id="main"/);
  assert.match(page,/aria-label="Corporate pages"/);
  assert.match(page,/href="\/src\/corporate\.css"/);
  assert.match(page,/href="\/privacy\.html"/);
  assert.doesNotMatch(page,/99\.99%|certified by ISO|guaranteed returns/i);
 }
 assert.match(read("company.html"),/Mufasa Khan/);
 assert.match(read("partners.html"),/Propose a partnership/);
 assert.match(read("investors.html"),/not an offer of securities/i);
 assert.match(read("trust.html"),/not ISO 27001 certification/i);
 assert.match(html,/pg-corporate-grid/);
 assert.match(read("src/corporate-home.css"),/@media\(max-width:600px\)/);
 assert.match(read("src/corporate.css"),/prefers-reduced-motion:reduce/);
 const inputs=read("vite.config.mjs");
 for(const name of pages)assert.match(inputs,new RegExp(name+':page\\("\\./'+name+'\\.html"\\)'));
});
