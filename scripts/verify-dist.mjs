import { existsSync, readFileSync } from "node:fs";
import { resolve } from "node:path";

const required = [
  "index.html",
  "privacy.html",
  "terms.html",
  "robots.txt",
  "sitemap.xml",
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
console.log("Verified all public entry points, sitemap, robots and bundled script.");
