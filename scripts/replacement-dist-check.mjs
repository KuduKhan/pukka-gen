import {existsSync, readFileSync, statSync} from "node:fs";
import assert from "node:assert/strict";

for (const file of ["dist/index.html", "dist/privacy.html", "dist/terms.html"]) {
  assert.ok(existsSync(file), "Missing production artifact: " + file);
  assert.ok(statSync(file).size > 100, "Empty production artifact: " + file);
}
const html = readFileSync("dist/index.html", "utf8");
for (const phrase of ["Authentic Engineering.", "Next-Gen Solutions.", "projectBriefForm", "pukka-tailwind-compiled"]) {
  assert.ok(html.includes(phrase), "Missing production page feature: " + phrase);
}
assert.ok(!html.includes("cdn.tailwindcss.com"), "Never ship Tailwind's runtime CDN");
assert.ok(!html.includes("photo-1558494949-ef526b0042a0"), "Broken hero photo was reintroduced");
console.log("Pukka Gen refined production build verified.");
