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
