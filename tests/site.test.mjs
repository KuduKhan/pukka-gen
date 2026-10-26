import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import handler from '../api/project-brief.mjs';

const html = readFileSync(new URL('../index.html', import.meta.url), 'utf8');
const main = readFileSync(new URL('../src/main.ts', import.meta.url), 'utf8');
function res() { return {code:0,payload:null,status(n){this.code=n;return this},json(x){this.payload=x;return this},setHeader(){}} }
test('legal pages link internally',()=>{assert.match(html,/href="\/privacy.html"/);assert.match(html,/href="\/terms.html"/)});
test('modal actions do not rely on inaccessible inline handlers',()=>{assert.doesNotMatch(main,/onclick="closeServiceModal\(\)"/);assert.match(main,/data-close-service-modal/)});
test('contact form uses server instead of mailto',()=>{assert.match(main,/fetch\('\/api\/project-brief'/);assert.doesNotMatch(main,/window.location.href = `mailto:/)});
test('contact API rejects wrong method',async()=>{const r=res();await handler({method:'GET',headers:{}},r);assert.equal(r.code,405)});
test('contact API rejects invalid body',async()=>{const r=res();await handler({method:'POST',headers:{'content-type':'application/json'},body:{name:'x'}},r);assert.equal(r.code,422)});
test('contact API rejects oversized body',async()=>{const r=res();await handler({method:'POST',headers:{'content-type':'application/json'},body:{message:'x'.repeat(15000)}},r);assert.equal(r.code,413)});

test('v1.2.0 provides accessibility and motion controls', () => {
  const style = readFileSync(new URL('../src/styles/studio.css', import.meta.url), 'utf8');
  const updatedHtml = readFileSync(new URL('../index.html', import.meta.url), 'utf8');
  const updatedMain = readFileSync(new URL('../src/main.ts', import.meta.url), 'utf8');
  assert.match(updatedHtml, /class="skip-to-content"/);
  assert.match(updatedHtml, /id="main-content"/);
  assert.match(updatedHtml, /data-motion-toggle/);
  assert.match(updatedMain, /event\.key !== 'Tab'/);
  assert.match(updatedMain, /setCalmMode\(calmMode\)/);
  assert.match(style, /prefers-reduced-motion/);
  assert.match(style, /max-width:767px/);
});

test('email fallback is available if server submission fails', () => {
  const updatedHtml=readFileSync(new URL('../index.html',import.meta.url),'utf8');
  const updatedMain=readFileSync(new URL('../src/main.ts',import.meta.url),'utf8');
  assert.match(updatedHtml,/id="emailBriefFallback"/);
  assert.match(updatedMain,/emailFallback\.hidden = false/);
  assert.match(updatedMain,/encodeURIComponent\(body\)/);
});

test('build config includes legal pages as HTML entry points', () => {
  const config=readFileSync(new URL('../vite.config.ts',import.meta.url),'utf8');
  assert.match(config,/privacy: resolve/);
  assert.match(config,/terms: resolve/);
});
test('navigation and portfolio preserve accessible states', () => {
  const document=readFileSync(new URL('../index.html',import.meta.url),'utf8');
  const source=readFileSync(new URL('../src/main.ts',import.meta.url),'utf8');
  assert.match(document,/id="mobile-menu" class="hidden" aria-hidden="true" inert/);
  assert.match(source,/mobileMenu\.inert = !isOpen/);
  assert.match(source,/portfolioResultCount\.textContent/);
});
test('reduced motion disables slideshow transitions', () => {
  const source=readFileSync(new URL('../src/main.ts',import.meta.url),'utf8');
  assert.match(source,/document\.hidden \|\| prefersReducedMotion \|\| isPerformanceConstrained/);
});
test('API blocks cross-site browser requests', async () => {
  const request={method:'POST',headers:{'content-type':'application/json','sec-fetch-site':'cross-site'},body:{}};
  const result=res();
  await handler(request,result);
  assert.equal(result.code,403);
});

test('mobile service cards retain readable text and one-column layout', () => {
  const styles=readFileSync(new URL('../src/styles/studio.css',import.meta.url),'utf8');
  assert.match(styles,/#services \.stagger-container,#industries/);
  assert.match(styles,/grid-template-columns:minmax\(0,1fr\)/);
  assert.match(styles,/#services \.spotlight-card p \{ font-size:/);
});
test('service modal connects to a matching project enquiry selection', () => {
  const page=readFileSync(new URL('../index.html',import.meta.url),'utf8');
  const source=readFileSync(new URL('../src/main.ts',import.meta.url),'utf8');
  assert.match(page,/value="security"/);
  assert.match(page,/value="consultancy"/);
  assert.match(source,/data-service-interest="\$\{key\}"/);
  assert.match(source,/resolveServiceValue\(serviceLink\.dataset\.serviceInterest/);
});
