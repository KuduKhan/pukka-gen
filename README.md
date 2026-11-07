# Pukka Gen — Studio Edition

**v2.3.4**, rebuilt from scratch from the previous Pukka Gen site. The production-facing experience uses **Vite + strict TypeScript + authored CSS**, retaining the original content and trusted brand identity, without runtime Tailwind CDN or a large untyped interaction layer.

## What is included

- Rebuilt responsive home, about, values, services, portfolio, delivery process, audience and sector, insights and full No-Duff checklist, technology, team, testimonials, FAQ, contact, legal and social links.
- The original **six complete service specifications**, **eight full portfolio case-study data sets**, **technology information**, **nine article and checklist resources**, and **FAQ data** preserved as typed, static editorial content in `src/content.ts`.
- Accessible, keyboard-friendly native HTML dialogs, a mobile navigation menu, working portfolio filtering, service-to-enquiry preselection, checklist download, privacy-aware enquiry confirmation and direct email fallback.
- Stable original brand images: `pukka-gen-wordmark.png`, `pukka-gen-mark.png`, and `pukka-gen-favicon.png`.
- Independently accessible Privacy and Terms pages sharing the new visual system.

This rebuild intentionally does **not** use invented customer data. Testimonials, project metrics, staff biographies and existing technology claims from the earlier site are preserved for continuity but require independent publication verification. No new client results have been fabricated.

## Development

```sh
npm ci
npm run dev
npm run check
```

Run `npm run check` before each preview and release. It runs strict TypeScript, Node regression/API tests, production build and output verification. Vite emits `dist/` for Vercel.

## Real enquiry delivery

The project form submits to `POST /api/project-brief`, a Vercel serverless function. Configure these **server-only Vercel environment variables**:

- `RESEND_API_KEY` — transactional email provider key
- `RESEND_FROM` — sender address at a verified domain
- `PROJECT_BRIEF_TO` — monitored receiving mailbox
- `SITE_ORIGIN` — optional exact production origin

The UI only reports acceptance by the email delivery service; it does **not** claim receipt by the mailbox. Without provider configuration, the API returns a non-success result and the user sees a direct-mail fallback. Never commit provider keys or secrets.

## Release acceptance

Before claiming full production validation, independently verify responsive views at 320, 375, 768, 1024, 1280 and 1440 px, keyboard and screen-reader journeys, successful real email delivery, platform WAF/rate limiting, legal notices and truthful portfolio testimonials. API smoke tests do not replace end-to-end delivery confirmation.

## Rebuild history

The previous site is archived on GitHub branch `archive/pre-rebuild-v1.2.3`. The replacement removes its obsolete DOM-first scripts, old Tailwind-dependent styles and duplicate original front-end files. Preserve the archive until this version has passed business acceptance.

## v2.1.0 — Enterprise Experience design refresh

The rebuilt site is styled with a restrained, editorial enterprise aesthetic, informed by the professional information architecture and visual patterns of Nocturnals Intellisoft. It is **not** a copy of that company's content, source code, photographs, wordmark or distinctive branding.

- Compact navigation with visible current-section location, scroll-aware appearance and a small reading-progress indicator.
- More substantial display typography, controlled whitespace, refined enterprise color layers and consistent buttons.
- An image-led hero with original Pukka Gen copy, a clear engineering-focus band and a new outcome-focused editorial feature.
- Responsive 2-column numbered service directory, improved portfolio gallery, dark/light section alternation, image-backed sector tiles, polished team, insights, process, FAQ and enquiry presentation.
- Respect for mobile device widths, keyboard access, explicit focus on portfolio filters, and reduced-motion preferences.
- All service specifications, case studies, editorial resources, team details, Pukka contact channels, legal pages and serverless enquiry functions are preserved.

New presentation CSS lives in `src/enterprise.css` and is loaded after the v2.0 base styles. Required quality gates: `npm ci && npm run check`, preview review, desktop/tablet/mobile browser validation and genuine email-delivery verification before declaring full acceptance.

## v2.2.0 — Precision Glass UI/UX overhaul

- `src/premium.css`: controlled glassmorphism, refined contrast, premium cards, spacing, gradient depth, responsive layouts and reduced-motion fallbacks.
- `src/icons.ts`: original dependency-free SVG line illustrations for service, delivery, portfolio, audience, article and detail views.
- `public/tech/`: **29 self-hosted technology SVG marks** sourced from the community [Simple Icons project](https://github.com/simple-icons/simple-icons). Names and trademarks are the property of their respective owners; their use does not imply endorsement or certification.
- Adobe XD, OpenAI, AWS and Azure have neutral SVG monograms because a verified appropriate brand SVG was not available from that source. No unrelated brand icons are substituted.
- Technology chips are now balanced vector-logo tiles. Existing descriptive panels and service selection continue working.
- White service cards, dark portfolio cards, glass industry panels, staff and insights, delivery stages, contact form and dialog views all have consistent interaction, spacing and iconography.
- The full Pukka Gen editorial, business, service, portfolio, contact, FAQ and legal material is preserved.
- `npm run check` verifies package metadata, typed client logic, Node API tests, Vite build, and presence of production technology assets.

Styling is specific to Pukka Gen; no third-party studio's source code or proprietary designs were copied. Independent real-device/browser/screen-reader checks, actual email arrival verification and client-claim/legal review remain outstanding acceptance work.

## v2.3.0–v2.3.4 sequential visual-excellence releases

- **v2.3.0**: unified typography, colours, spacing, radii, shadows, interaction and focus tokens; merged three legacy override stylesheets into `src/site.css` and updated legal pages.
- **v2.3.1**: responsive service grid, featured image-led case-study card, editorial insights and consistent testimonial layout.
- **v2.3.2**: original `public/illustrations/architecture.svg` and `delivery-pipeline.svg`; three verified Devicon brand marks; fallback for OpenAI remains a clearly neutral monogram; icon provenance in `TECH_ASSETS.md`.
- **v2.3.3**: 320–1440px width safeguards, motion restraint, contact form focus on dialog CTA and mobile-safe layout adjustments.
- **v2.3.4**: static CI gate + Chromium, Firefox and WebKit browser QA at six widths, screenshot evidence capture, Playwright interaction tests and axe-core automated WCAG checks. Build asset-size budgets guard script/style bloat.

For local browser acceptance, install ephemeral tooling with `npm install --no-save --package-lock=false playwright @axe-core/playwright`, run `npx playwright install chromium firefox webkit`, start `npm run dev -- --host 127.0.0.1 --port 4173`, then run `node scripts/browser-qa.mjs`.

The automated browser suite captures **visual QA snapshots**, not signed pixel-diff approval of a new visual baseline. Physical device and assistive-technology signoff, measured field Core Web Vitals, actual email arrival, and independent substantiation of inherited customer metrics require separate evidence. Do not treat a green browser run as proof of those external gates.
