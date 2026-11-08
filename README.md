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
