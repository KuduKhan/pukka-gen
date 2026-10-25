# v1.1.0 → v1.2.0 engineering handoff

## Shipped on upgrade branch
- v1.1.0: server-side enquiry delivery via Vercel/Resend, safe validation, honest delivery status, functional delegated modal actions, privacy/terms pages, strict TS for newly extracted modules, Node test suite and GitHub Actions.
- v1.2.0: responsive studio polish (320px to desktop), mobile hero image sizing, skip navigation, landmark structure, keyboard focus trap, accessible input and focus states, reduced-motion visual mode with persistent local preference.

## Deployment gates
1. Verify the target is a Vercel deployment (the API is not served by static Vite hosting).
2. Configure RESEND_API_KEY, RESEND_FROM and PROJECT_BRIEF_TO, then confirm a real email arrives in a monitored inbox. SITE_ORIGIN is optional.
3. Turn on platform rate limiting/bot management. Current honeypot is not sufficient against targeted abuse.
4. Have legal counsel review Privacy Notice and Website Terms before relying on them.
5. Validate real mobile/desktop visual rendering in Chrome, Firefox, Edge, Safari and keyboard/screen-reader navigation. CI does not yet run browser automation.
6. Validate company statistics, testimonials and portfolio claims before publication.
7. Migrate legacy src/main.ts out of @ts-nocheck and compile Tailwind CSS locally in a separate dependency-safe change.

## Acceptance
Run npm ci && npm run check. For full API and browser testing, run Vercel preview with the configured secrets.
