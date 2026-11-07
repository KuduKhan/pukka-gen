import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync, readdirSync } from 'node:fs';
import handler from '../api/project-brief.mjs';

const read = path => readFileSync(new URL('../' + path, import.meta.url), 'utf8');
const html = read('index.html');
const main = read('src/main.ts');
const css = read('src/site.css');
const content = read('src/content.ts');

function response() {
  return {
    code:0, payload:null, headers:{},
    status(n){ this.code=n; return this; },
    json(x){ this.payload=x; return this; },
    setHeader(name,value){ this.headers[name]=value; }
  };
}
const valid = {
  name:'Test Engineer',email:'test@example.org',phone:'',service:'dev',
  message:'I would like to discuss a secure application build.',website:''
};
const request = (body=valid, headers={}) => ({
  method:'POST',headers:{'content-type':'application/json',...headers},body
});

test('fresh application uses semantic sections and accessible navigation',()=>{
  const ids=['main','about','services','work','values','approach','industries',
    'insights','technology','team','testimonials','faq','contact'];
  for(const id of ids) assert.match(html,new RegExp('id="'+id+'"'));
  assert.match(html,/class="skip-link"/);
  assert.match(html,/aria-label="Primary navigation"/);
  assert.match(html,/aria-expanded="false"/);
  assert.match(html,/id="mobile-navigation"[^>]*hidden inert/);
  assert.match(main,/mobileNav\.inert = !open/);
  assert.match(main,/setMenuOpen\(false\)/);
});
test('all original service and portfolio data survives rebuild',()=>{
  for(const key of ['software','ai','cloud','design','security','consultancy'])
    assert.match(content,new RegExp('\\b'+key+': \\{'));
  for(const key of ['ops','finance','health','learning','cloudops','support','field','commerce'])
    assert.match(content,new RegExp('\\b'+key+': \\{'));
  assert.match(content,/export const allFaqs/);
  assert.match(content,/export const techDetails/);
  assert.match(content,/export const blogDetails/);
  assert.match(content,/The MVP Trap/);
  assert.match(content,/Karim Nyambok Omar/);
  assert.match(content,/Mufasa Khan/);
  assert.match(content,/Mombasa, Kenya/);
  assert.match(content,/No-Duff Discovery/);
});
test('new design supports responsive motion preferences and type-safe module',()=>{
  assert.doesNotMatch(main,/@ts-nocheck/);
  assert.doesNotMatch(html,/cdn\.tailwindcss\.com/);
  assert.match(css,/@media \(max-width:600px\)/);
  assert.match(css,/@media \(max-width:800px\)/);
  assert.match(css,/@media \(prefers-reduced-motion:reduce\)/);
  assert.match(css,/max-height:calc\(100dvh - 96px\)/);
  assert.match(html,/<dialog id="detail-dialog"/);
  assert.match(main,/dialog\.showModal\(\)/);
});
test('filtered projects, service enquiries and original content are wired',()=>{
  assert.match(main,/function renderWork/);
  assert.match(main,/aria-pressed/);
  assert.match(main,/function showService/);
  assert.match(main,/function showCase/);
  assert.match(main,/function showArticle/);
  assert.match(main,/findTech/);
  assert.match(html,/name="service"/);
  assert.match(main,/fetch\('\/api\/project-brief'/);
  assert.match(html,/id="email-fallback"/);
  assert.match(html,/href="\/privacy.html"/);
  assert.match(html,/href="\/terms.html"/);
});
test('legal pages preserve original privacy and contract notices',()=>{
  for(const path of ['privacy.html','terms.html']) {
    const document=read(path);
    assert.match(document,/Last updated: October 26, 2026/);
    assert.match(document,/href="\/src\/site.css"/);
    assert.match(document,/href="\/"/);
  }
  assert.match(read('privacy.html'),/Information collected/);
  assert.match(read('terms.html'),/separately agreed written contract/);
});
test('API only accepts POST',async()=>{
  const res=response(); await handler({method:'GET',headers:{}},res);assert.equal(res.code,405);
  assert.equal(res.headers.Allow,'POST');
});
test('API validates JSON and data lengths',async()=>{
  const malformed=response();await handler(request('not-json'),malformed);assert.equal(malformed.code,400);
  const shortName=response();await handler(request({...valid,name:'x'}),shortName);assert.equal(shortName.code,422);
  const oversized=response();await handler(request({...valid,message:'x'.repeat(15000)}),oversized);assert.equal(oversized.code,413);
});
test('API prevents cross-site browser submissions',async()=>{
  const res=response();await handler(request(valid,{'sec-fetch-site':'cross-site'}),res);
  assert.equal(res.code,403);
});
test('honeypot does not dispatch email',async()=>{
  const res=response();await handler(request({...valid,website:'bot'}),res);
  assert.equal(res.code,200);
});
test('without server-side email configuration, client gets honest 503',async()=>{
  const envKeys=['RESEND_API_KEY','RESEND_FROM','PROJECT_BRIEF_TO'];
  const previous=envKeys.map(key=>process.env[key]);
  for(const key of envKeys) delete process.env[key];
  try {
    const res=response();await handler(request(),res);
    assert.equal(res.code,503);
    assert.equal(res.payload.ok,false);
  } finally {
    envKeys.forEach((key,i)=>{if(previous[i]===undefined)delete process.env[key];else process.env[key]=previous[i];});
  }
});

test('v2.1 enterprise identity and structure are present without copying the reference brand',()=>{
  const updatedStyle=read('src/site.css');
  assert.match(html, /href="\/src\/site.css"/);
  assert.match(html, /id="reading-progress-bar"/);
  assert.match(html, /id="outcome-heading"/);
  assert.match(html, /enterprise-ribbon-grid/);
  assert.match(html, /class="hero-scene"/);
  assert.match(html, /alt="Conceptual software architecture/);
  assert.doesNotMatch(html, /nocturnalsintellisoft\.com/i);
  assert.doesNotMatch(updatedStyle, /nocturnalsintellisoft\.com/i);
  assert.match(updatedStyle, /#services \{/);
  assert.match(updatedStyle, /outcome-showcase-grid/);
  assert.match(updatedStyle, /sector-strip span:nth-child\(6\)/);
  assert.match(updatedStyle, /@media \(max-width:380px\)/);
  assert.match(updatedStyle, /prefers-reduced-motion:reduce/);
  assert.match(read('package.json'), /"version": "2\.3\.4"/);
});
test('v2.1 nav scroll state, reveal enhancements and portfolio keyboard focus are wired',()=>{
  assert.match(main, /function updateScrollVisuals/);
  assert.match(main, /classList\.toggle\('is-scrolled'/);
  assert.match(main, /setAttribute\('aria-current', 'location'\)/);
  assert.match(main, /restoreKeyboardFocus/);
  assert.match(main, /selected\?\.focus\(\{preventScroll:true\}\)/);
  assert.match(main, /revealObserver\.unobserve\(entry\.target\)/);
  assert.match(main, /prefers-reduced-motion: reduce/);
});

test('v2.2 premium UI polish is responsive and respects access needs',()=>{
  const style=read('src/site.css');
  const icons=read('src/icons.ts');
  assert.match(html,/href="\/src\/site.css"/);
  assert.match(style,/#services \.service-grid/);
  assert.match(style,/#work \.portfolio-card/);
  assert.match(style,/#technology \.technology-pills/);
  assert.match(style,/@supports/);
  assert.match(style, /backdrop-filter:blur\(12px\)/);
  assert.match(style,/@media \(max-width:600px\)/);
  assert.match(style,/@media \(max-width:390px\)/);
  assert.match(style,/@media \(prefers-reduced-motion:reduce\)/);
  assert.match(main,/technologyMark\(label\)/);
  assert.match(main,/icon\(service\.key\)/);
  assert.match(main,/articleIcons\[article\.key\]/);
  assert.match(main,/processIcons\[index\]/);
  assert.match(icons,/aria-hidden="true"/);
  assert.doesNotMatch(main,/@ts-nocheck/);
});
test('v2.2 contains verified local SVG files for technology names',()=>{
  const icons=read('src/icons.ts');
  const begin=icons.indexOf('const brandSlugs:');
  const end=icons.indexOf('};',begin);
  assert.ok(begin!==-1 && end>begin);
  const map=icons.slice(begin,end);
  const slugs=[...map.matchAll(/'[^']+':'([a-z0-9]+)'/g)].map(match=>match[1]);
  assert.ok(slugs.length>=27,'expected at least 27 verified technology logos');
  const assets=readdirSync(new URL('../public/tech/',import.meta.url));
  assert.equal(new Set(slugs).size,slugs.length);
  for(const slug of slugs){
    assert.ok(assets.includes(slug+'.svg'),slug+' SVG missing');
    const svg=read('public/tech/'+slug+'.svg');
    assert.match(svg,/^<svg/);
    assert.match(svg,/<path/);
    assert.match(svg,/fill="#[0-9A-Fa-f]{6}"/);
  }
  assert.match(icons,/tech-mark-generic/);
});

test('v2.3.0 design system consolidates styling and exposes reusable tokens',()=>{
  const sheet=read('src/site.css');
  for(const token of ['--pg-font-display','--pg-font-body','--pg-space-4','--pg-radius-lg','--pg-surface-light','--pg-shadow-md','--pg-motion-standard','--pg-focus-ring']) assert.ok(sheet.includes(token),token+' absent');
  assert.equal((html.match(/rel="stylesheet"/g)||[]).length,1);
  assert.match(html,/href="\/src\/site.css"/);
  for(const file of ['privacy.html','terms.html']) assert.match(read(file),/href="\/src\/site.css"/);
});

test('v2.3.1 premium cards preserve content and adapt the first portfolio entry',()=>{
 const css=read('src/site.css');
 for (const token of ['service-card-top','portfolio-card-featured','article-index']) assert.match(main,new RegExp(token));
 assert.match(css,/#work \.portfolio-card-featured/);
 assert.match(css,/#testimonials \.testimonial-grid/);
 assert.match(css,/grid-template-columns:minmax\(0,1fr\)/);
});

test('v2.3.2 ships original architecture artwork and verified technology asset mapping',()=>{
 const icons=read('src/icons.ts');
 assert.match(html,/src="\/illustrations\/architecture.svg"/);
 assert.match(html,/src="\/illustrations\/delivery-pipeline.svg"/);
 assert.match(read('public/illustrations/architecture.svg'),/conceptual engineering blueprint/i);
 assert.match(read('public/illustrations/delivery-pipeline.svg'),/Five clear stages/);
 for(const brand of ['Adobe XD','AWS','Azure']) assert.ok(icons.includes("'"+brand+"'"));
 for(const file of ['xd.svg','azure.svg','amazonwebservices.svg']) assert.match(read('public/tech/'+file),/^<svg/);
});

test('v2.3.3 avoids hidden content, supports safe areas and preserves contact focus',()=>{
 const style=read('src/site.css');
 assert.match(style,/prefers-reduced-data:reduce/);
 assert.match(style,/safe-area-inset-bottom/);
 assert.match(style,/max-width:375px/);
 assert.match(style,/max-width:330px/);
 assert.match(style,/\.reveal-ready \.reveal-item \{opacity:1/);
 assert.match(main,/focusContactAfterClose/);
 assert.match(main,/getBoundingClientRect\(\)\.top/);
});

test('v2.3.4 includes automated multi-engine responsive and accessible browser QA',()=>{
 const qa=read('scripts/browser-qa.mjs');
 const workflow=read('.github/workflows/browser-quality.yml');
 for(const engine of ['chromium','firefox','webkit']) assert.match(qa,new RegExp('\\b'+engine+'\\b'));
 for(const viewport of ['320','375','768','1024','1280','1440']) assert.ok(qa.includes(viewport));
 assert.match(qa,/AxeBuilder/);
 assert.match(qa,/data\.overflow/);
 assert.match(qa,/aria-expanded/);
 assert.match(qa,/screenshot/);
 assert.match(workflow,/upload-artifact@v4/);
 assert.match(workflow,/playwright install --with-deps/);
 assert.match(read('package.json'),/"version": "2\.3\.4"/);
});
