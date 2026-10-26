# Pukka Gen

Vite + TypeScript services website.

## Local development

```sh
npm ci
npm run dev
npm run check
```

## Enquiry delivery (Vercel)

The project form posts to `/api/project-brief` (Vercel Node function) and does not pretend an unsent email was delivered. To enable real delivery, configure these **server-only** deployment environment variables:

- `RESEND_API_KEY`: restricted transactional email provider key.
- `RESEND_FROM`: sender on a provider-verified domain.
- `PROJECT_BRIEF_TO`: receiving mailbox.
- `SITE_ORIGIN`: optional exact allowed origin, e.g. `https://www.pukkagennoduff.com`.

Use `vercel dev` to test serverless API locally; `npm run dev` serves just the frontend. Production form must be tested with genuine inbox delivery before release. Without configured secrets it displays a clear error and offers direct email contact. A honeypot is included; enable WAF/rate limiting and abuse management in production.

`npm run check` runs TypeScript checks, Node API smoke tests, and the Vite production build. The legacy `src/main.ts` is still marked `@ts-nocheck` while typed modules are incrementally extracted. Legal notices need professional review against the final hosting and data practices.

## Deployment

Output directory: `dist`. Target platform for `api/`: Vercel.

## Upgrade plan

v1.1.0: repair contact/modal functionality and establish an automated quality gate.
v1.2.0: premium responsive, accessible and reduced-motion UI refinement.

## v1.2.0 UI

Adds a compiled Vite studio stylesheet, accessible skip link and page landmark, modal Tab focus loop, fluid mobile typography, stronger focus treatments, improved form readability and a saved "Calm visuals" preference. Device-imposed reduced motion remains respected regardless of the preference. The existing Tailwind browser CDN is **not yet migrated** to a compiled Tailwind pipeline; removing it without regenerating all utility styles would break the current page. Make that a separately tested follow-up.

### Deployment safety
The production headers are in `vercel.json`. Strict Content Security Policy requires a separate cleanup of legacy inline styles/scripts and third-party CDNs; it has not been enforced to avoid breaking the site. If the serverless email provider is unavailable, a clearly labelled mail-client fallback preserves a usable manual route without falsely claiming delivery.

## v1.2.1 polish and release integrity

The Vite production build now emits `privacy.html` and `terms.html` as
independent HTML pages. Files under `public/` ensure `robots.txt` and
`sitemap.xml` are deployed too. Run `npm run check` to confirm these
artifacts exist under `dist/`, in addition to unit tests and type-checking.

Motion-reduction requests now pause both particles and rotating hero imagery.
The navigation uses `inert` while hidden and restores keyboard focus when
closing with Escape. Portfolio and contact layouts include further minimum
touch-target sizes and small-screen readability refinements.

The email API rejects `Sec-Fetch-Site: cross-site`, but a server-side
rate-limiting service/WAF remains required for targeted abuse resistance.
