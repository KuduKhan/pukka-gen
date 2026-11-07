import { existsSync, readFileSync, readdirSync, statSync } from "node:fs";
import { resolve } from "node:path";

const required = [
  "index.html",
  "privacy.html",
  "terms.html",
  "robots.txt",
  "sitemap.xml",
  "pukka-gen-wordmark.png",
  "pukka-gen-mark.png",
  "pukka-gen-favicon.png",
  "illustrations/architecture.svg",
  "illustrations/delivery-pipeline.svg",
  "illustrations/case-ops.svg",
  "illustrations/case-finance.svg",
  "illustrations/case-health.svg",
  "illustrations/case-learning.svg",
  "illustrations/case-cloudops.svg",
  "illustrations/case-support.svg",
  "illustrations/case-field.svg",
  "illustrations/case-commerce.svg",
];
for (const path of required) {
  const absolute = resolve(process.cwd(), "dist", path);
  if (!existsSync(absolute)) {
    throw new Error(`Production artifact missing: ${path}`);
  }
  if (!readFileSync(absolute).length) {
    throw new Error(`Production artifact empty: ${path}`);
  }
}
const index = readFileSync(resolve("dist", "index.html"), "utf8");
for (const route of ["/privacy.html", "/terms.html"]) {
  if (!index.includes(route)) {
    throw new Error(`Site missing legal route link: ${route}`);
  }
}
if (!/src="\/assets\//.test(index)) {
  throw new Error("Vite production script was not generated.");
}
const iconDirectory = resolve(process.cwd(), "dist", "tech");
if (!existsSync(iconDirectory)) throw new Error("Technology brand SVG assets are missing from production build.");
const iconFiles = readdirSync(iconDirectory).filter(name => name.endsWith(".svg"));
if (iconFiles.length < 32) throw new Error(`Only ${iconFiles.length} technology SVG assets found (expected at least 32).`);
for (const filename of iconFiles) {
  const contents = readFileSync(resolve(iconDirectory, filename), "utf8");
  if (!contents.startsWith("<svg") || !contents.includes("<path")) {
    throw new Error(`Invalid SVG asset: ${filename}`);
  }
}
console.log(`Verified website entry points, sitemap, legal routes, bundle and ${iconFiles.length} technology icons.`);

const bundleDir = resolve(process.cwd(), "dist", "assets");
const assetNames = readdirSync(bundleDir);
const jsBytes = assetNames.filter(name=>name.endsWith(".js")).reduce((total,name)=>total+statSync(resolve(bundleDir,name)).size,0);
const cssBytes = assetNames.filter(name=>name.endsWith(".css")).reduce((total,name)=>total+statSync(resolve(bundleDir,name)).size,0);
if(jsBytes>260_000)throw new Error(`JavaScript budget exceeded: ${jsBytes}/260000 bytes`);
if(cssBytes>160_000)throw new Error(`CSS budget exceeded: ${cssBytes}/160000 bytes`);
console.log(`Production budgets: JS ${jsBytes} B / 260 kB, CSS ${cssBytes} B / 160 kB.`);
