import {existsSync,readFileSync,statSync} from "node:fs";
import assert from "node:assert/strict";
for(const file of ["dist/index.html","dist/privacy.html","dist/terms.html","dist/site.css","dist/site.js","dist/tailwind-generated.css"]){
 assert.ok(existsSync(file),"Missing production artifact: "+file);
 assert.ok(statSync(file).size>10,"Empty production artifact: "+file);
}
const html=readFileSync("dist/index.html","utf8");
for(const value of ["Authentic Engineering.","Next-Gen Solutions.","projectBriefForm","/site.js","/site.css"]){
 assert.ok(html.includes(value),"Missing site content: "+value);
}
assert.ok(!html.includes("cdn.tailwindcss.com"),"Runtime Tailwind CDN must not ship");
console.log("Pukka Gen replacement build verified.");
