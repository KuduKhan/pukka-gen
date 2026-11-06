import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import handler from '../api/project-brief.mjs';

const read = path => readFileSync(new URL('../' + path, import.meta.url), 'utf8');
const html = read('index.html');
const main = read('src/main.ts');
const css = read('src/styles.css');
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
    assert.match(document,/href="\/src\/styles.css"/);
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
