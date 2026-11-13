import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";

const read = (path) => readFileSync(new URL(`../${path}`, import.meta.url), "utf8");
const pages = ["index.html", "company.html", "partners.html", "investors.html", "trust.html", "privacy.html", "terms.html"];
const editorialPath = "/src/amanah-editorial.css";
const finishPath = "/src/amanah-finish.css";
const finish = read("src/amanah-finish.css");
const css = read("src/amanah-editorial.css");

test("editorial and finish stylesheets load once, in the correct order, across all public pages", () => {
  for (const page of pages) {
    const source = read(page);
    const links = [...source.matchAll(/<link[^>]+rel="stylesheet"[^>]*>/g)].map((entry) => entry[0]);
    const editorial = links.filter((link) => link.includes(editorialPath));
    assert.equal(editorial.length, 1, `${page} must load one editorial stylesheet`);
    const finishLinks = links.filter(link => link.includes(finishPath));
    assert.equal(finishLinks.length, 1, `${page} must load one final polish stylesheet`);
    assert.equal(links.at(-1), finishLinks[0], `${page} must load polish rules last`);
    assert.ok(links.indexOf(editorial[0]) < links.indexOf(finishLinks[0]), `${page} must load polish after editorial styles`);
  }
});

test("reference patterns cover home and corporate surfaces", () => {
  for (const selector of [
    ".hero", ".hero-grid", ".hero h1", ".system-panel", ".proof-ribbon",
    ".expertise-card", ".project", ".journal-card", ".pg-corporate-card",
    ".corp-hero", ".corp-card", ".corp-feature", ".corp-footer",
  ]) {
    assert.ok(css.includes(selector), `Missing editorial treatment for ${selector}`);
  }
});

test("brand and accessible-interaction constraints are preserved", () => {
  assert.match(css, /font-family:"Pukka Hand"/);
  assert.match(css, /prefers-reduced-motion:reduce/);
  assert.match(css, /prefers-contrast:more/);
  assert.match(css, /focus-visible/);
  assert.doesNotMatch(css, /@import\s+url\(https?:/i);
  assert.doesNotMatch(css, /url\(https?:/i);
  assert.match(read("src/premium.css"), /font-family:"Pukka Hand"/);
});

test("editorial stylesheet has structurally matched CSS delimiters", () => {
  const withoutComments = css.replace(/\/\*[\s\S]*?\*\//g, "");
  for (const [open, close] of [["{", "}"], ["(", ")"]]) {
    let depth = 0;
    for (const char of withoutComments) {
      if (char === open) depth += 1;
      if (char === close) depth -= 1;
      assert.ok(depth >= 0, `Unmatched closing ${close}`);
    }
    assert.equal(depth, 0, `Unmatched opening ${open}`);
  }
});

test("Amanah-style finishing layer keeps original handwriting and responsive navigation", () => {
  assert.match(finish, /font-family:"Pukka Hand"/);
  assert.match(finish, /pg-hero-signoff::after/);
  assert.match(finish, /pg-hand-swash::after/);
  assert.match(finish, /ink-note::after/);
  assert.match(finish, /max-height:calc\(100dvh/);
  assert.match(finish, /max-width:380px/);
  assert.match(finish, /prefers-reduced-motion:reduce/);
  assert.doesNotMatch(finish, /url\(https?:/i);
  const home = read("index.html");
  assert.match(home, /pg-hand-swash/);
  assert.ok((home.match(/pg-nav-icon/g) || []).length >= 10);
  const sprite = read("public/icons/pukka-symbols.svg");
  assert.match(sprite, /id="pg-arrow-up-right"/);
  assert.match(sprite, /id="pg-chevron-right"/);
});
