# Pukka Gen — Fresh Studio Preview

A new, source-clean Pukka Gen website built from scratch on the isolated branch `rebuild/pukka-fresh-v1-preview`.

## Release model

This branch contains a **new Git tree**. Legacy application sources, styles, tests, JavaScript modules and old media were not carried into this tree. Only the original Pukka Gen wordmark, mark and favicon blobs were retained. The existing Git repository and its history remain intact; the current main branch, open production URL and prior versions remain recoverable.

The Vercel integration may publish a **preview** build of this branch. Do **not** merge this branch into main, promote an alias or deploy to the production target until the owner inspects the Vercel preview and explicitly approves production.

The public pages intentionally include `noindex,nofollow` and a restrictive `robots.txt` while in review. These need controlled adjustment before public production promotion.

## Structure

- `index.html`: accessible, new layout and original inline SVG engineering atlas; services, three labeled engineering concepts, process, studio, journal and enquiry.
- `src/styles.css`: authored navy/cyan/violet responsive design system with compact mobile navigation, visual interface concepts, original iconography and reduced-motion support.
- `src/main.ts`: small TypeScript interaction layer; keyboard-usable diagram and process explorer, accessible dialogs, portfolio filtering, mobile navigation and form feedback.
- `api/project-brief.js`: server-only Resend email handler; refuses unconfigured delivery and exposes no credentials to the browser.
- `privacy.html` and `terms.html`: clearly labeled preview drafts requiring independent business/legal review before public launch.
- `tests/` and `scripts/`: automated integrity, API, build artifact, multi-browser, responsiveness and axe checks.

## Local QA

Run `npm ci`, `npm run check` and `npm run dev`. Browser QA additionally requires temporary Playwright and axe packages and browser runtimes as configured in GitHub Actions. Verify at 320, 375, 768, 1024, 1280 and 1440 CSS pixels and on physical phones, including reduced motion and keyboard navigation.

## Online enquiries

The contact form uses server-only environment variables: `RESEND_API_KEY`, `RESEND_FROM` and `PROJECT_BRIEF_TO`. If missing or provider delivery fails, it offers a user-driven email fallback. A success message only means the provider accepted the email; actual receipt and user-response workflows must be verified separately.

## Acceptance blockers

- Human approval of screenshots, words, logo rendering, interaction and responsive appearance.
- Real-device and assistive-technology verification; measured performance and accessibility.
- Real email receipt and provider/domain configuration.
- Independent privacy, legal and public business-copy sign-off.
- Removal of preview indexing restrictions after explicit production approval.

**Preview is not authorization to deploy to production.**

## Precision Glass UX refinement — preview-only

The site now includes a separate, cohesive `src/premium.css` visual contract: navy translucent technical panels, restrained white glass cards, matching custom SVG plates, accessible high-contrast states, self-hosted Caveat handwriting accents under the SIL Open Font License, and optional motion-triggered entrance transitions. Motion is disabled for reduced-motion users and original content is visible without JavaScript. No external font provider, extra JS library, or new business functionality is introduced. Real hardware visual approval remains a separate launch gate.

## Precision SVG icon system / review candidate

Pukka Gen now ships a single first-party, same-origin vector icon sprite at `public/icons/pukka-symbols.svg`. Three intentional visual treatments are used: distinct technical service icons in light dimensional plates; sector-specific pictograms in illuminated dark-glass badges; and compact editorial/journal icons. The solution diagram and five engineering process stages now change their SVG composition with the selected use case or stage. SVGs are inline semantic references to local symbols (not external logo services, web fonts, emoji, or runtime icon packages). Colors remain tied to the original navy/cyan/violet identity. Mobile, reduced-motion and high-contrast treatments are explicit. These additions are preview-only; production acceptance is unchanged.

## Enterprise editorial layout adaptation (preview-only)

Nocturnals Intellisoft provided a *high-level* reference for business-first presentation, editorial typography, capability sequencing, sector context and contrasting section design. Pukka Gen does **not** copy its website code, assets, wordmark, images, branding, claims or customer data. The new original presentation uses a compact two-level desktop masthead, software/AI/security services first, original outcome/technical portfolio content, self-authored panoramic SVG visual break, sector-specific architectural motifs and a clear No Duff engineering methodology. The Pukka navy/cyan/violet palette, original logo, licensed handwritten signoff, keyboard-accessible System Atlas and verified-content policy remain unchanged. This is an isolated Vercel preview candidate, not authorized production.

## Production release authorization — November 8, 2026

The owner explicitly authorized promotion to **production** after inspection of the Enterprise Editorial redesign preview. Homepage indexing and `robots.txt` preview restrictions were removed accordingly. This does **not** constitute independent verification of the third-party email provider, device-specific behavior, or legal notices; those remain operational follow-ups. The code history remains preserved in Git.

## Pukka Gen 4.0 — Corporate Authority & Enterprise Trust (review branch)

The `feat/pukka-gen-4-corporate-authority` review branch introduces clear standalone Company, Partnerships, Investors and Trust pages, adds stakeholder journeys to the homepage and strengthens founder/brand-positioning clarity.

- Claims policy: no invented clients, traction, financing, certifications or company registration identifiers
- External links to published automated tests and CI are evidence of the website checks only, **not** claims about external client delivery
- The company attribution and founder role follow the owner's statements; contracting entity and jurisdiction require separate document verification
- Privacy and website-use statements no longer imply the **whole website** is merely a prelaunch preview, while retaining explicit legal-completeness cautions
- The changes require an independent legal review, real email delivery check, real-device and assistive-technology acceptance, and an approved production rebuild
- Branch review and GitHub CI do not authorize deployment or merge to `main`

## Brand typography — Sora + Manrope (November 2026)

- **Sora Variable**: headings on the homepage, company, partnerships, investors and trust pages
- **Manrope Variable**: body copy, navigation, buttons and forms across all routes
- Retain system monospace for technical diagrams and labels
- **Pukka Hand / Caveat is preserved exactly**, including all handwritten No Duff lettering
- Font software is self-hosted under SIL OFL 1.1; license text in `public/fonts/OFL-Sora.txt` and `public/fonts/OFL-Manrope.txt`
- Verify build, font loading, responsive layout, accessibility and real-device review before production
