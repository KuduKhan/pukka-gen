import assert from "node:assert/strict";
import {existsSync,readFileSync,readdirSync,statSync} from "node:fs";
const required=[
 "dist/index.html","dist/privacy.html","dist/terms.html",
 "dist/original-site.js","dist/original-site.css","dist/tailwind-original.css",
 "dist/pukka-gen-mark.png","dist/pukka-gen-wordmark.png","dist/pukka-gen-favicon.png"
];
for(const file of required)assert.ok(existsSync(file),"Missing build artifact: "+file);
for(const page of ["services.html","studio.html","company.html","investors.html","partners.html","trust.html"])assert.ok(!existsSync("dist/"+page),"Superseded page leaked into production: "+page);
const html=readFileSync("dist/index.html","utf8");
assert.ok(html.includes("Authentic Engineering."),"Original Pukka Gen content not deployed");
assert.ok(html.includes("src=\"/original-site.js\""),"Original interactive source not included");
assert.ok(!html.includes("cdn.tailwindcss.com"),"Development Tailwind CDN still used");
const css=statSync("dist/tailwind-original.css").size;
assert.ok(css>20000&&css<220000,"Original Tailwind output size unexpected: "+css);
const count=dir=>readdirSync(dir).reduce((sum,name)=>{const file=dir+"/"+name;return sum+(statSync(file).isDirectory()?count(file):statSync(file).size)},0);
const size=count("dist");
assert.ok(size<3*1024*1024,"Build asset budget exceeded: "+size);
console.log("Original Pukka Gen site verified; built bytes:",size,"Tailwind bytes:",css);

