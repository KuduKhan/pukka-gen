/**
 * Canonical service routing for the contact form.
 * Keeps the service detail CTA aligned with the server-side enquiry categories.
 */
export const serviceOptions = {
  software: "dev",
  ai: "ai",
  cloud: "cloud",
  design: "design",
  security: "security",
  consultancy: "consultancy",
} as const;

export function resolveServiceValue(key: string): string | null {
  return Object.prototype.hasOwnProperty.call(serviceOptions, key)
    ? serviceOptions[key as keyof typeof serviceOptions]
    : null;
}
