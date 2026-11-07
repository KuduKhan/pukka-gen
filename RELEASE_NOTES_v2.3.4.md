# Pukka Gen v2.3.4 — Visual Excellence release candidate

## Sequential implementation history

| Stage | Version | Work |
|:--|:--|:--|
| 1 | 2.3.0 | Unified style architecture and design tokens |
| 2 | 2.3.1 | Cards, editorial hierarchy and responsive portfolio bento |
| 3 | 2.3.2 | Original architecture/process illustrations and verified brand marks |
| 4 | 2.3.3 | Responsive layout and reduced-motion/accessibility refinements |
| 5 | 2.3.4 | Browser QA, accessible interactions, screenshot evidence and production budgets |

## Automated acceptance

1. `npm ci && npm run check` must pass, including TS strict checks, API tests, production output and tech-asset verification.
2. Vercel branch preview must be READY and point to the exact expected release SHA.
3. Multi-engine browser test (Chromium, Firefox, WebKit) at 320 / 375 / 768 / 1024 / 1280 / 1440px must pass layout, service dialog, filter, tech dialog, navigation, validation and uncaught-error checks.
4. axe-core serious/critical WCAG A/AA failures block release; snapshot PNG and JSON QA evidence is uploaded to GitHub Actions for review.
5. The main-branch CI and Vercel production deployment must be rechecked after merge.

## External acceptance remains open

- Human approval of the visual screenshot baseline and independent screen-reader / physical device tests.
- Actual Pukka Gen project-enquiry email delivery to a monitored inbox, including server-side provider and spam/rate limit configuration.
- Verified ownership/attribution and correctness of legacy portfolio metrics, testimonials and other publication claims.
- Legal review, and real-user field performance metrics; lab bundle budgets cannot establish actual LCP/INP/CLS at the 75th percentile.

Never represent automated QA as independent production signoff.

## Closed automated findings
- Card button labels now use their visible content, resolving 14 accessible-name mismatches.
- The remaining technology badge was changed to a non-textual decorative vector glyph.
- Timeline subtitle contrast improved from an axe-reported 4.36:1 to a darker accessible foreground.
- Eight case-study stock images replaced with original local conceptual SVG art, labelled **not client screenshots**.
- Automated screenshot QA now decodes all case-study images and rejects blank/unavailable art.
