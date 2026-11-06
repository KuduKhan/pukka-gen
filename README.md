# Pukka Gen — Studio Edition

**v2.0.0**, rebuilt from scratch from the previous Pukka Gen site. The production-facing experience uses **Vite + strict TypeScript + authored CSS**, retaining the original content and trusted brand identity, without runtime Tailwind CDN or a large untyped interaction layer.

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
