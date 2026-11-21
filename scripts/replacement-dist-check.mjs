import {readFileSync,existsSync} from 'node:fs';
import assert from 'node:assert/strict';
const html=readFileSync('dist/index.html','utf8');
for(const file of ['pukka-gen-wordmark.png','pukka-gen-mark.png','pukka-gen-favicon.png','website.js','brand.css']){assert.ok(existsSync('dist/'+file),file);assert.ok(html.includes('/'+file),file+' reference');}
assert.ok(html.includes('https://cdn.tailwindcss.com'));
assert.ok(!html.includes('/utilities.css'));
console.log('Replacement build and original branding verified');
