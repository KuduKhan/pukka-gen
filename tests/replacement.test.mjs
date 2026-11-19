import test from "node:test";
import assert from "node:assert/strict";
import {readFileSync} from "node:fs";
import {Script} from "node:vm";

const read = path => readFileSync(new URL("../" + path, import.meta.url), "utf8");
const html = read("index.html");

test("Pukka Gen No Duff brand and core landing-page content are retained", () => {
  for (const phrase of ["Authentic Engineering.", "Next-Gen Solutions.", "Redefining Tech Partnerships", "Radical Authenticity", "Meet The Team", "Frequently Asked Questions"]) {
    assert.ok(html.includes(phrase), phrase + " is missing");
  }
  assert.match(html, /class="text-white logo-text-1">PUKKA<\/span>/);
  assert.match(html, /class="text-cyan-400 logo-text-2">GEN<\/span>/);
  assert.match(html, /<main id="main-content">/);
  assert.match(html, /<meta name="description"/);
});

test("Mobile navigation, overlays, project form, and primary sections survive the refinement", () => {
  for (const id of ["mobileMenuBtn", "mobile-menu", "commandPalette", "serviceModal", "faqModal", "contactModal", "projectBriefForm", "projectFormStatus"]) {
    assert.ok(html.includes('id="' + id + '"'), id + " is missing");
  }
  for (const id of ["about", "values", "services", "portfolio", "process", "checklist", "testimonials", "insights", "team", "contact"]) {
    assert.ok(html.includes('id="' + id + '"'), id + " section is missing");
  }
  assert.match(html, /aria-expanded/);
  assert.match(html, /prefers-reduced-motion/);
});

test("Contact form has honest fallback, never claims a message was already delivered", () => {
  assert.match(html, /function initProjectBriefForm\(/);
  assert.match(html, /mailto:mail@pukkagennoduff\.com/);
  assert.match(html, /window\.location\.href = emailDraft/);
  assert.match(html, /has not submitted the enquiry automatically/);
  assert.doesNotMatch(html, /Brief captured\. The team will respond/);
});

test("Runtime CSS and complex decorative animation scripts are removed", () => {
  assert.match(html, /id="pukka-tailwind-compiled"/);
  assert.doesNotMatch(html, /cdn\.tailwindcss\.com/);
  for (const id of ["particleCanvas", "rocket", "comet"]) {
    assert.ok(!html.includes('id="' + id + '"'), id + " should not be running");
  }
  const scripts = [...html.matchAll(/<script\b[^>]*>([\s\S]*?)<\/script>/g)];
  assert.equal(scripts.length, 1, "Expected exactly one inline app script");
  assert.doesNotThrow(() => new Script(scripts[0][1]), "Application JavaScript must parse");
});

test("Vite continues building legal pages alongside the landing page", () => {
  const vite = read("vite.config.mjs");
  for (const page of ["index.html", "privacy.html", "terms.html"]) assert.ok(vite.includes(page));
});
