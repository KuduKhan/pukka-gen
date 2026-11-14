import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";

const read = (path) => readFileSync(new URL(`../${path}`, import.meta.url), "utf8");
const pages = ["index.html", "company.html", "partners.html", "investors.html", "trust.html", "privacy.html", "terms.html"];
const editorialPath = "/src/amanah-editorial.css";
const finishPath = "/src/amanah-finish.css";
const lustrePath = "/src/pukka-lustre.css";
const lustre = read("src/pukka-lustre.css");
const interactivity = read("src/pukka-lustre.ts");
const finish = read("src/amanah-finish.css");
const css = read("src/amanah-editorial.css");

test("editorial, finish and final visual layers load exactly once, in order, on every public page", () => {
  for (const page of pages) {
    const source = read(page);
    const links = [...source.matchAll(/<link[^>]+rel="stylesheet"[^>]*>/g)].map((entry) => entry[0]);
    const editorial = links.filter((link) => link.includes(editorialPath));
    assert.equal(editorial.length, 1, `${page} must load one editorial stylesheet`);
    const finishLinks = links.filter(link => link.includes(finishPath));
    assert.equal(finishLinks.length, 1, `${page} must load one final polish stylesheet`);
    const lustreLinks = links.filter(link => link.includes(lustrePath));
    assert.equal(lustreLinks.length, 1, `${page} must load one visual excellence stylesheet`);
    assert.equal(links.at(-1), lustreLinks[0], `${page} must load visual finish last`);
    assert.equal((source.match(/src="\/src\/pukka-lustre\.ts"/g) || []).length, 1, `${page} must attach one motion-aware enhancement script`);
    assert.ok(links.indexOf(finishLinks[0]) < links.indexOf(lustreLinks[0]), `${page} must load visual finish after editorial polish`);
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


test("visual excellence layer is structurally sound, local and motion aware", () => {
  const sanitized = lustre.replace(/\/\*[\s\S]*?\*\//g,"");
  for (const [open,close] of [["{","}"],["(",")"]]){
    let depth=0;
    for (const char of sanitized){
      if(char===open)depth++;
      if(char===close)depth--;
      assert.ok(depth>=0,"Extra closing "+close);
    }
    assert.equal(depth,0,"Unclosed "+open);
  }
  assert.doesNotMatch(lustre, /url\((?:["']?)https?:/i);
  assert.match(lustre,/prefers-reduced-motion:reduce/);
  assert.match(lustre,/prefers-reduced-transparency:reduce/);
  assert.match(lustre,/forced-colors:active/);
  assert.match(lustre,/pointer:coarse/);
  assert.match(lustre,/\.pg-lustre-surface::after/);
  assert.match(lustre, /backdrop-filter:blur/);
  assert.match(lustre,/focus-visible/);
  assert.match(lustre,/pgx-content-in/);
  assert.match(lustre,/solution-choice\[aria-pressed="true"\]/);
  assert.match(interactivity,/requestAnimationFrame/);
  assert.match(interactivity,/prefers-reduced-motion: reduce/);
  assert.match(interactivity,/IntersectionObserver/);
  assert.match(interactivity,/pointermove/);
  assert.doesNotMatch(interactivity, /\bfetch\s*\(/);
  assert.doesNotMatch(interactivity, /localStorage|sessionStorage|navigator\.sendBeacon/);
});


test("enterprise identity stays consistent across homepage and corporate routes", () => {
  const home = read("index.html");
  assert.match(home, /class="pg-enterprise-signature"/);
  assert.match(home, /AN INTELLISOFT COMPANY/);
  assert.match(home, /font/); // Existing branding and its stylesheet links stay present
  assert.equal((home.match(/class="pg-corporate-card pg-route-card"/g)||[]).length,4);
  assert.equal((home.match(/class="pg-route-icon"/g)||[]).length,4);
  assert.equal((home.match(/class="pg-route-index"/g)||[]).length,4);
  for(const route of ["company.html","partners.html","investors.html","trust.html"]){
    const page=read(route);
    assert.equal((page.match(/class="corp-card pg-corp-elevated"/g)||[]).length,4,route);
    assert.equal((page.match(/class="pg-corp-card-icon"/g)||[]).length,4,route);
    assert.equal((page.match(/class="pg-corp-card-top"/g)||[]).length,4,route);
    assert.match(page,/pukka-gen-wordmark\.png/);
    assert.match(page,/pg-corp-at-glance/);
  }
  const sprite=read("public/icons/pukka-symbols.svg");
  const IDs=new Set([...sprite.matchAll(/<symbol id="([^"]+)"/g)].map(match=>match[1]));
  for(const route of ["index.html","company.html","partners.html","investors.html","trust.html"]){
    const page=read(route);
    for(const [_,id] of page.matchAll(/href="\/icons\/pukka-symbols\.svg#([^"]+)"/g)){
      assert.ok(IDs.has(id),route+" has missing SVG symbol "+id);
    }
  }
  assert.match(lustre,/pg-enterprise-affiliation/);
  assert.match(lustre,/pg-route-card/);
  assert.match(lustre,/pg-corp-elevated/);
});
