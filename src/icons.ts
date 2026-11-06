/**
 * Pukka Gen v2.2 visual iconography.
 * Self-contained line SVGs for interface actions and verified, self-hosted
 * technology marks sourced from the Simple Icons community collection.
 * Fallbacks for unavailable brand assets are purposefully neutral monograms,
 * never substituted third-party logos.
 */
const paths = {
  software: '<rect x="2.5" y="4" width="19" height="15" rx="2.5"/><path d="M2.5 9h19M9 13l-2 2 2 2m6-4 2 2-2 2"/>',
  ai: '<path d="M12 3.5a4.5 4.5 0 0 0-7.1 5.4A4.2 4.2 0 0 0 5 16.2a4.4 4.4 0 0 0 7 4.2 4.4 4.4 0 0 0 7-4.2 4.2 4.2 0 0 0 .1-7.3A4.5 4.5 0 0 0 12 3.5Z"/><path d="M12 3.5v17m-7-12 3 1.4M4.7 16 8 14m11-5-3 1.4M19.2 16 16 14m-8-3.5L12 13l4-2.5"/>',
  cloud: '<path d="M6 17.8A4.5 4.5 0 0 1 6.3 9a6.8 6.8 0 0 1 13 .8 4 4 0 0 1 .1 8H6Z"/><path d="M9 15h6m-3-3v6"/>',
  design: '<path d="m12 2 9.2 9.5-9.2 10-9.2-10L12 2Z"/><path d="M3 11.5h18m-13-7 4 17m4-17-4 17"/>',
  security: '<path d="M12 2.6c2.2 1.7 4.8 2.6 8 2.8v6.4c0 4.9-3.4 8-8 10.2-4.6-2.2-8-5.3-8-10.2V5.4c3.2-.2 5.8-1.1 8-2.8Z"/><path d="m8.4 12.1 2.6 2.6 4.8-5"/>',
  consultancy: '<circle cx="12" cy="12" r="9"/><path d="m15.9 8.1-2.1 5.7-5.7 2.1 2.1-5.7 5.7-2.1Z"/>',
  target: '<circle cx="12" cy="12" r="9"/><circle cx="12" cy="12" r="5"/><circle cx="12" cy="12" r="1.4"/>',
  layout: '<rect x="3" y="4" width="18" height="16" rx="2"/><path d="M3 9h18M10 9v11"/>',
  layers: '<path d="m12 3 9 5-9 5-9-5 9-5Zm-9 9 9 5 9-5M3 16l9 5 9-5"/>',
  rocket: '<path d="M7 14 4 17v3h3l3-3m5-11c-3.8 1-6.4 3.9-8 9l2 2c5.1-1.6 8-4.2 9-8l-3-3Z"/><path d="M14 6c1-1.5 3.1-2.2 5-2 0 1.9-.5 4-2 5M13 11l-4 4"/>',
  sparkles: '<path d="m12 2 2.1 7.9L22 12l-7.9 2.1L12 22l-2.1-7.9L2 12l7.9-2.1L12 2ZM19 2v4m-2-2h4"/>',
  code: '<path d="m8 7-5 5 5 5m8-10 5 5-5 5m-2-17-4 22"/>',
  users: '<circle cx="9" cy="8" r="3"/><path d="M2.5 20v-2a6.5 6.5 0 0 1 13 0v2M17 5a3 3 0 0 1 0 6m.5 4c2.5.6 4 2.5 4 5"/>',
  phone: '<rect x="6.5" y="2" width="11" height="20" rx="2.2"/><path d="M11 18.5h2"/>',
  server: '<rect x="3" y="3" width="18" height="8" rx="2"/><rect x="3" y="13" width="18" height="8" rx="2"/><path d="M7 7h.01M7 17h.01M11 7h6M11 17h6"/>',
  shield: '<path d="M12 3c2 1.5 4.7 2.4 8 2.6v6.2c0 4.5-3 7.5-8 9.8-5-2.3-8-5.3-8-9.8V5.6C7.3 5.4 10 4.5 12 3Z"/><path d="m9 12 2 2 4-4"/>',
  arrow: '<path d="M5 12h14m-6-6 6 6-6 6"/>',
  arrowUp: '<path d="M5 19 19 5M9 5h10v10"/>',
  check: '<path d="m5 12 5 5L19 7"/>',
  book: '<path d="M4 5.5a2.5 2.5 0 0 1 2.5-2.5H21v17H6.5A2.5 2.5 0 0 0 4 22V5.5Zm0 14a2.5 2.5 0 0 1 2.5-2.5H21"/>',
  terminal: '<rect x="3" y="4" width="18" height="16" rx="2"/><path d="m7 9 3 3-3 3m6 0h5"/>',
  globe: '<circle cx="12" cy="12" r="9"/><path d="M3 12h18M12 3c-5 5-5 13 0 18m0-18c5 5 5 13 0 18"/>',
  calendar: '<rect x="3" y="5" width="18" height="16" rx="2"/><path d="M7 3v4m10-4v4M3 10h18"/>',
  message: '<path d="M20 11.5a8 8 0 0 1-8 8H5l-2 2v-7a8 8 0 1 1 17-3Z"/><path d="M8 11h8"/>',
  external: '<path d="M12 4h8v8m0-8-9 9"/><path d="M20 14v4a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h4"/>',
  briefcase: '<rect x="3" y="7" width="18" height="14" rx="2"/><path d="M8 7V5a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2M3 13h18"/>',
  quote: '<path d="M10 6H5a2 2 0 0 0-2 2v5h6v5H4m17-12h-5a2 2 0 0 0-2 2v5h6v5h-5"/>',
} as const;

export type IconName = keyof typeof paths;
export function icon(name: IconName, className = 'ui-icon'): string {
  return '<svg class="' + className +
    '" viewBox="0 0 24 24" width="24" height="24" fill="none" ' +
    'stroke="currentColor" stroke-width="1.65" stroke-linecap="round" ' +
    'stroke-linejoin="round" aria-hidden="true" focusable="false">' +
    paths[name] + '</svg>';
}

// Only paths verified and bundled under /public/tech.
const brandSlugs: Readonly<Record<string, string>> = {
  'React':'react','Angular':'angular','Vue.js':'vuedotjs','TypeScript':'typescript',
  'Flutter':'flutter','Swift':'swift','Figma':'figma','Sketch':'sketch',
  'Node.js':'nodedotjs','Python':'python','Java':'openjdk','C#':'sharp',
  '.NET':'dotnet','Go':'go','MongoDB':'mongodb','PostgreSQL':'postgresql',
  'Redis':'redis','TensorFlow':'tensorflow','PyTorch':'pytorch',
  'Google Cloud':'googlecloud','Docker':'docker','Kubernetes':'kubernetes',
  'Terraform':'terraform','Jenkins':'jenkins','Git':'git','GitLab':'gitlab',
  'Selenium':'selenium','Cypress':'cypress','Jira':'jira'
};
const initial = (value: string): string => value
  .split(/[^A-Za-z0-9]+/).filter(Boolean)
  .map(word => word[0]!.toUpperCase()).join('').slice(0,3) || 'TECH';

export function technologyMark(label: string): string {
  const slug = brandSlugs[label];
  if (slug) {
    return '<span class="tech-mark" aria-hidden="true"><img src="/tech/' + slug +
      '.svg" alt="" width="25" height="25" loading="lazy" decoding="async"></span>';
  }
  // Neutral SVG monogram avoids inventing or misattributing a corporate logo.
  const chars = initial(label).replace(/[^A-Z0-9]/g,'');
  return '<span class="tech-mark tech-mark-generic" aria-hidden="true">' +
    '<svg viewBox="0 0 36 36" width="28" height="28" focusable="false">' +
    '<rect x="2" y="2" width="32" height="32" rx="9" fill="#1E3A4A" />' +
    '<rect x="2.5" y="2.5" width="31" height="31" rx="8.5" fill="none" stroke="#86DCCF" stroke-opacity=".7" />' +
    '<text x="18" y="22.1" fill="#D3FFF5" text-anchor="middle" font-size="' + (chars.length > 2 ? '9':'12') +
    '" font-weight="750" font-family="Arial, sans-serif">' + chars + '</text></svg></span>';
}
