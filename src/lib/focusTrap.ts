/**
 * Shared dialog keyboard handling.
 * Kept fully type-checked while the legacy DOM interaction layer is migrated.
 */
const FOCUSABLE_SELECTOR = [
  'a[href]:not([tabindex="-1"])',
  'area[href]:not([tabindex="-1"])',
  'button:not(:disabled):not([tabindex="-1"])',
  'input:not(:disabled):not([type="hidden"]):not([tabindex="-1"])',
  'select:not(:disabled):not([tabindex="-1"])',
  'textarea:not(:disabled):not([tabindex="-1"])',
  '[tabindex]:not([tabindex="-1"])',
].join(', ');

export function getFocusableElements(container: Element | null): HTMLElement[] {
  if (!container) return [];
  return Array.from(container.querySelectorAll<HTMLElement>(FOCUSABLE_SELECTOR))
    .filter(element =>
      !element.closest('[inert], [hidden], [aria-hidden="true"], fieldset:disabled') &&
      element.getClientRects().length > 0 &&
      window.getComputedStyle(element).visibility !== 'hidden'
    );
}

/** Returns keyboard focus to the active dialog and wraps Tab at its boundaries. */
export function trapTabFocus(event: KeyboardEvent, dialog: HTMLElement): void {
  if (event.key !== 'Tab') return;
  const elements = getFocusableElements(dialog);
  if (elements.length === 0) {
    event.preventDefault();
    dialog.tabIndex = -1;
    dialog.focus({ preventScroll: true });
    return;
  }
  const first = elements[0];
  const last = elements[elements.length - 1];
  if (!dialog.contains(document.activeElement)) {
    event.preventDefault();
    first.focus({ preventScroll: true });
  } else if (event.shiftKey && document.activeElement === first) {
    event.preventDefault();
    last.focus({ preventScroll: true });
  } else if (!event.shiftKey && document.activeElement === last) {
    event.preventDefault();
    first.focus({ preventScroll: true });
  }
}
