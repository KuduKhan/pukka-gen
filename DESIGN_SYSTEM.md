# Pukka Gen visual design system — v2.3

One source: `src/site.css`. No external font request or runtime icon library is required.

## Foundations

| Area | Contract |
| --- | --- |
| Type | Display and body use first-party OS/system stacks, technical labels use a monospace stack |
| Palette | Midnight `#071521`, deep ocean `#102d3d`, accent `#69e6d5`, light `#f6f9fb` |
| Spacing | 4px to 48px in 4px-based increments (`--pg-space-*`) |
| Radii | 8 / 12 / 18 / 24px and pill, consistently tokenised |
| Elevation | `--pg-shadow-sm`, `--pg-shadow-md`, `--pg-shadow-lg` |
| Motion | 160 / 240 / 440ms, ease `cubic-bezier(.22,1,.36,1)` |
| Accessible focus | 3px high-contrast solid focus outline |

## Component rules

- Dark glass is reserved for the navigation, emphasis panels and dialogs; main reading surfaces are solid.
- Card elevations communicate interaction rather than decorating everything.
- Typography levels are semantic; body copy prioritises legibility at narrow phone widths.
- Brand technology logos may only be used where source attribution is correct; unknown icons get neutral original glyphs.
- Every interactive control needs a visible keyboard focus state and 44px minimum touch target where feasible.
- Motion is decorative, never required to reveal critical information.
- Design tokens should be reused instead of adding parallel colour/spacing systems.
