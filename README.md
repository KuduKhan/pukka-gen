# Pukka Gen No Duff — restored original website

The production homepage is built from the **owner-supplied 417,625-byte** source `pukkagen - Copy-1.html`, not the previous v5 / v5.1 redesign. The original source was recovered through the user's Library after they supplied the ChatGPT share link describing it.

The owner's HTML remains the foundation for all visual sections, markup and interaction. The restored implementation retains its sections, portfolio, services, team, FAQ and visuals. Official Pukka Gen No Duff mark and wordmark assets from the existing project replace two text-only logo placeholders.

## Production integration

- Original inline CSS/JS was extracted to self-hosted static assets without changing their core behavior.
- Tailwind classes are precompiled from the source rather than generated in visitors' browsers by the Tailwind CDN.
- Three inline `onclick` handlers are bound from external JavaScript and a restrictive Content Security Policy allows the original remote fonts, imagery and map.
- Project enquiries now require real server-side email-provider acceptance through `/api/project-brief`. A failed or unconfigured provider produces an explicit failure rather than a fabricated success.
- Expensive particle, rocket and comet animations are not initialized on touch/reduced-motion devices.
- Privacy / terms links work; legacy v5 corporate routes are excluded from build output.

## Evidence boundaries

The original source mentions projects, people, company testimonials and map locations. These are **owner-provided website content** and not independently verified by this release. Before commercial publication or marketing claims, confirm team/profile consent, customer testimonials, official domains and company address. Inbox delivery and real-device acceptance remain independent gates.

## Verification

`npm run check` runs original-source tests, existing API tests, the TypeScript/Vite build, compiled Tailwind checks and distribution validation.

