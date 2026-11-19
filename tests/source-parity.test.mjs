import test from "node:test";
import assert from "node:assert/strict";
import {readFileSync, existsSync} from "node:fs";

const read = path => readFileSync(new URL("../" + path, import.meta.url), "utf8");
const original = read("reference/pukkagen-uploaded-original.html");
const refined = read("index.html");

test("User-supplied original remains archived and unedited", () => {
  assert.ok(existsSync(new URL("../reference/pukkagen-uploaded-original.html", import.meta.url)));
  assert.equal(original.length, 417601);
  assert.match(original, /cdn\.tailwindcss\.com/);
});

test("All original navigation and content sections exist in refined production page", () => {
  for (const id of ["about", "values", "services", "portfolio", "process", "checklist", "testimonials", "insights", "team", "contact"]) {
    assert.ok(original.includes('id="' + id + '"'), "Original lacks " + id);
    assert.ok(refined.includes('id="' + id + '"'), "Refined page lacks " + id);
  }
  for (const name of ["Authentic Engineering.", "Next-Gen Solutions.", "Redefining Tech Partnerships", "Radical Authenticity", "Meet The Team"]) {
    assert.ok(refined.includes(name), "Refined page lacks " + name);
  }
});

test("Known broken image and runtime CSS CDN are absent from the production page", () => {
  assert.ok(refined.includes("photo-1544197150-b99a580bb7a8"));
  assert.ok(!refined.includes("photo-1558494949-ef526b0042a0"));
  assert.ok(!refined.includes("cdn.tailwindcss.com"));
  assert.ok(refined.includes('id="pukka-tailwind-compiled"'));
});

test("Reduced-motion, navigation labels and reliable form feedback are present", () => {
  assert.match(refined, /prefers-reduced-motion/);
  assert.match(refined, /aria-label="Pukka Gen No Duff/);
  assert.match(refined, /id="projectFormStatus"/);
  assert.match(refined, /Please review it and press Send/);
});
