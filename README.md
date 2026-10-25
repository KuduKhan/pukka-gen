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
