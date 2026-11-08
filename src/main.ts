import {
  allFaqs, audiences, blogDetails, checklist, delivery, disciplines,
  portfolioDetails, sectors, serviceDetails, serviceSummaries,
  studio, team, techDetails, techGroups, values
} from './content';
import { icon, technologyMark, type IconName } from './icons';

const $ = <T extends Element = HTMLElement>(selector: string, root: ParentNode = document): T | null =>
  root.querySelector<T>(selector);

function requireElement<T extends Element = HTMLElement>(selector: string): T {
  const result = $<T>(selector);
  if (!result) throw new Error(`Pukka Gen: missing required element ${selector}`);
  return result;
}

const escapeHtml = (value: string | number): string =>
  String(value).replace(/[&<>"']/g, char =>
    ({ '&':'&amp;', '<':'&lt;', '>':'&gt;', '"':'&quot;', "'":'&#39;' })[char] ?? char);

const listMarkup = (items: readonly string[]) => '<ul>' + items.map(item =>
  '<li>' + escapeHtml(item) + '</li>').join('') + '</ul>';
const chipMarkup = (items: readonly string[]) => '<div class="detail-chips">' +
  items.map(item => '<span>' + escapeHtml(item) + '</span>').join('') + '</div>';

function mount(id: string, markup: string): void {
  requireElement('#' + id).innerHTML = markup;
}

const dialog = requireElement<HTMLDialogElement>('#detail-dialog');
const dialogBody = requireElement<HTMLElement>('#dialog-body');
const dialogContact = requireElement<HTMLAnchorElement>('#dialog-contact');
let previousFocus: HTMLElement | null = null;
let focusContactAfterClose = false;
let proposedService = '';

function openDetail(markup: string, service = ''): void {
  previousFocus = document.activeElement instanceof HTMLElement ? document.activeElement : null;
  proposedService = service;
  dialogBody.innerHTML = markup;
  dialogBody.scrollTop = 0;
  if (!dialog.open) dialog.showModal();
  document.body.classList.add('dialog-open');
}

function closeDetail(): void {
  if (dialog.open) dialog.close();
}
requireElement<HTMLButtonElement>('#dialog-close').addEventListener('click', closeDetail);
dialog.addEventListener('click', event => {
  if (event.target === dialog) closeDetail();
});
dialog.addEventListener('close', () => {
  document.body.classList.remove('dialog-open');
  if (focusContactAfterClose) {
    focusContactAfterClose = false;
    window.requestAnimationFrame(() => document.querySelector<HTMLElement>('#project-name')?.focus({preventScroll:true}));
  } else previousFocus?.focus({preventScroll:true});
});
dialogContact.addEventListener('click', () => {
  const select = $<HTMLSelectElement>('#project-service');
  if (select && proposedService) select.value = proposedService;
  focusContactAfterClose = true;
  closeDetail();
});

// Accessible compact navigation: no duplicate desktop and mobile menu destinations.
const menuButton = requireElement<HTMLButtonElement>('#menu-toggle');
const mobileNav = requireElement<HTMLElement>('#mobile-navigation');
function setMenuOpen(open: boolean): void {
  mobileNav.hidden = !open;
  mobileNav.inert = !open;
  menuButton.setAttribute('aria-expanded', String(open));
  menuButton.setAttribute('aria-label', open ? 'Close navigation menu' : 'Open navigation menu');
}
menuButton.addEventListener('click', () => setMenuOpen(mobileNav.hidden));
mobileNav.querySelectorAll<HTMLAnchorElement>('a').forEach(link =>
  link.addEventListener('click', () => setMenuOpen(false)));
document.addEventListener('pointerdown', event => {
  const target = event.target;
  if (target instanceof Node && !mobileNav.hidden &&
      !mobileNav.contains(target) && !menuButton.contains(target)) setMenuOpen(false);
});
document.addEventListener('keydown', event => {
  if (event.key === 'Escape' && !mobileNav.hidden) {
    setMenuOpen(false);
    menuButton.focus({preventScroll:true});
  }
});
window.matchMedia('(min-width: 1101px)').addEventListener('change', event => {
  if (event.matches) setMenuOpen(false);
});
setMenuOpen(false);

// PUKKA v3: semantic SVG systems explorer, driven by real capability copy.
// Controls work with pointer, keyboard and reduced-motion preferences.
const blueprintTopics = {
  software: {
    kicker:'01 / APPLICATION ENGINEERING',title:'Reliable software, by design.',
    description:'Clear architecture, maintainable code and dependable interfaces—from useful prototypes to production systems.',
    output:'DELIVERABLE / RESPONSIVE APPLICATIONS'
  },
  ai: {
    kicker:'02 / INTELLIGENT AUTOMATION',title:'Intelligence with a purpose.',
    description:'Applied AI, language workflows and automation designed around human oversight, evaluation and measurable utility.',
    output:'DELIVERABLE / ASSISTED WORKFLOWS'
  },
  cloud: {
    kicker:'03 / CLOUD & OPERATIONS',title:'Built to run. Built to recover.',
    description:'Versioned infrastructure, observable deployments, scalable services and recovery-minded cloud operations.',
    output:'DELIVERABLE / RESILIENT INFRASTRUCTURE'
  },
  security: {
    kicker:'04 / SECURITY & VERIFICATION',title:'Trust is an engineering decision.',
    description:'Threat-aware architecture, authorization boundaries, automated checks and practical release safeguards.',
    output:'DELIVERABLE / SECURITY & QUALITY GATES'
  },
  design: {
    kicker:'05 / PRODUCT EXPERIENCE',title:'Clarity is a product feature.',
    description:'Purposeful interfaces, accessibility-aware components and intuitive journeys that serve real users.',
    output:'DELIVERABLE / HUMAN-CENTRED UX'
  },
  consultancy: {
    kicker:'06 / TECHNICAL STRATEGY',title:'Think clearly. Build intentionally.',
    description:'Requirements discovery, architecture trade-offs, phased roadmaps and decisions teams can defend.',
    output:'DELIVERABLE / ENGINEERING ROADMAP'
  }
} as const;
type BlueprintKey = keyof typeof blueprintTopics;
const blueprintRoot = requireElement<HTMLElement>('#living-blueprint');
const blueprintControls = requireElement<HTMLElement>('#blueprint-controls');
const blueprintButtons = Array.from(blueprintControls.querySelectorAll<HTMLButtonElement>('[data-blueprint-domain]'));
function selectBlueprintDomain(key:BlueprintKey):void {
  const item = blueprintTopics[key];
  blueprintRoot.dataset.blueprintFocus = key;
  requireElement('#blueprint-kicker').textContent = item.kicker;
  requireElement('#blueprint-title').textContent = item.title;
  requireElement('#blueprint-description').textContent = item.description;
  requireElement('#blueprint-output').textContent = item.output;
  blueprintButtons.forEach(button=>button.setAttribute('aria-pressed',String(button.dataset.blueprintDomain===key)));
  blueprintRoot.querySelectorAll<SVGElement>('[data-bp-node],[data-bp-wire]').forEach(element=>{
    element.dataset.active = String(
      (element.dataset.bpNode ?? element.dataset.bpWire) === key
    );
  });
}
blueprintControls.addEventListener('click',event=>{
  if(!(event.target instanceof Element))return;
  const key=event.target.closest<HTMLButtonElement>('[data-blueprint-domain]')?.dataset.blueprintDomain;
  if(key && Object.prototype.hasOwnProperty.call(blueprintTopics,key))selectBlueprintDomain(key as BlueprintKey);
});
blueprintControls.addEventListener('keydown',event=>{
  if(!['ArrowRight','ArrowLeft','ArrowUp','ArrowDown','Home','End'].includes(event.key))return;
  const current=event.target instanceof Element?event.target.closest<HTMLButtonElement>('[data-blueprint-domain]'):null;
  if(!current)return;
  const index=blueprintButtons.indexOf(current);
  if(index<0)return;
  event.preventDefault();
  const next=event.key==='Home'?0:event.key==='End'?blueprintButtons.length-1:
    (index+((event.key==='ArrowLeft'||event.key==='ArrowUp')?-1:1)+blueprintButtons.length)%blueprintButtons.length;
  const selected=blueprintButtons[next];const key=selected?.dataset.blueprintDomain;
  if(key && Object.prototype.hasOwnProperty.call(blueprintTopics,key)){selectBlueprintDomain(key as BlueprintKey);selected.focus();}
});
selectBlueprintDomain('software');

// Service catalog: complete descriptive copy lives in the typed content model.
mount('service-grid', serviceSummaries.map((service, i) => `
  <button type="button" class="service-card" data-service="${escapeHtml(service.key)}"
     >
    <span class="service-card-top"><span class="service-number">SERVICE / ${String(i+1).padStart(2,'0')}</span><span class="service-icon" aria-hidden="true">${icon(service.key)}</span></span>
    <h3>${escapeHtml(service.title)}</h3>
    <p>${escapeHtml(service.body)}</p>
    <span class="card-bottom"><span>${escapeHtml(service.category)}</span><span class="card-arrow" aria-hidden="true">${icon("arrowUp")}</span></span>
  </button>`).join(''));

const enquiryCategory: Record<keyof typeof serviceDetails,string> = {
  software: 'dev', ai:'ai', cloud:'cloud', design:'design', security:'security', consultancy:'consultancy'
};
function showService(key: keyof typeof serviceDetails): void {
  const data = serviceDetails[key];
  openDetail(`
    <span class="detail-service-icon" aria-hidden="true">${icon(key)}</span>
    <span class="detail-kicker">SERVICE / PUKKA GEN</span>
    <h2 id="dialog-title">${escapeHtml(data.title)}</h2>
    <p class="detail-description">${escapeHtml(data.description)}</p>
    <div class="detail-section"><h3>What we deliver</h3>${listMarkup(data.features)}</div>
    <div class="detail-section"><h3>Technology & methods</h3>${chipMarkup(data.technologies.map(t => t.name))}</div>
  `, enquiryCategory[key]);
}

mount('values-grid', values.map(value => `
  <article class="value-item"><span class="value-number">${escapeHtml(value.number)}</span><div>
    <h3>${escapeHtml(value.title)}</h3><p>${escapeHtml(value.body)}</p>
  </div></article>`).join(''));
const processIcons: readonly IconName[] = ['target','layout','layers','shield','rocket'];
mount('process-list', delivery.map((stage, index) => `
  <article class="process-row">
    <div class="process-number"><span class="process-step">${escapeHtml(stage.number)}</span><span class="process-step-icon" aria-hidden="true">${icon(processIcons[index] ?? "target")}</span></div>
    <div class="process-head"><h3>${escapeHtml(stage.title)}</h3><p>${escapeHtml(stage.subtitle)}</p></div>
    <div class="process-text"><p class="process-quote">“${escapeHtml(stage.quote)}”</p>
      <p>${escapeHtml(stage.body)}</p><div class="process-output">Output: ${escapeHtml(stage.output)}</div>
    </div>
  </article>`).join(''));

const audienceIcons: readonly IconName[] = ['sparkles','briefcase','server'];
mount('audience-grid', audiences.map((a, index) => `
  <article class="audience-card"><span class="audience-category">${escapeHtml(a.tag)}</span><span class="audience-icon" aria-hidden="true">${icon(audienceIcons[index] ?? "briefcase")}</span>
    <h3>${escapeHtml(a.title)}</h3><p>${escapeHtml(a.body)}</p>
    <div class="tag-list">${a.tags.map(t=>'<span>'+escapeHtml(t)+'</span>').join('')}</div>
  </article>`).join(''));
mount('sector-list', sectors.map(s => '<span>'+escapeHtml(s)+'</span>').join(''));

// Selected projects: real source content, not invented case-study metrics.
const caseEntries = Object.entries(portfolioDetails) as [keyof typeof portfolioDetails, (typeof portfolioDetails)[keyof typeof portfolioDetails]][];
const categories: Record<keyof typeof portfolioDetails,string> = {
  ops:'AI',finance:'Security',health:'AI',learning:'Design',
  cloudops:'Cloud',support:'AI',field:'Software',commerce:'Software'
};
const categoryIcons: Record<string, IconName> = {AI:'ai',Security:'shield',Cloud:'cloud',Software:'software',Design:'design'};
const workFilters = ['All work','AI','Software','Cloud','Security','Design'] as const;
let currentFilter: string = 'All work';
const filterNode = requireElement<HTMLElement>('#work-filters');
function renderFilters(): void {
  filterNode.innerHTML = workFilters.map(filter =>
    `<button type="button" class="filter-button" data-filter="${escapeHtml(filter)}"
      aria-pressed="${filter===currentFilter}">${escapeHtml(filter)}</button>`).join('');
}
function renderWork(): void {
  const visible = caseEntries.filter(([key]) =>
    currentFilter === 'All work' || categories[key] === currentFilter);
  mount('portfolio-grid', visible.map(([key,info]) => `
    <article class="portfolio-card${currentFilter === 'All work' && key === 'ops' ? ' portfolio-card-featured' : ''}">
      <button type="button" data-case="${escapeHtml(key)}">
        <div class="portfolio-image">
          <img loading="lazy" decoding="async" src="${escapeHtml(info.image)}" alt="Conceptual engineering illustration for ${escapeHtml(info.title)}">
          <span class="portfolio-index">SYSTEM / ${escapeHtml(info.index)}</span>
          <span class="pg-concept-indicator">ILLUSTRATIVE CONCEPT</span>
        </div>
        <div class="portfolio-information">
          <span class="portfolio-tag"><span class="portfolio-category-symbol" aria-hidden="true">${icon(categoryIcons[categories[key]] ?? "code")}</span>${escapeHtml(info.eyebrow)}</span>
          <div class="portfolio-title-row"><h3>${escapeHtml(info.title)}</h3><span class="portfolio-arrow" aria-hidden="true">${icon("arrowUp")}</span></div>
          <p>${escapeHtml(info.description)}</p>
          <div class="pg-case-explainer">
            <span>ENGINEERING APPROACH</span>
            <strong>${escapeHtml(info.outcomes[0] ?? info.role)}</strong>
          </div>
          <div class="pg-case-stack" aria-label="Representative technologies">${info.stack.slice(0,3).map(tool => '<span>'+escapeHtml(tool)+'</span>').join('')}</div>
          <span class="pg-case-action">Explore concept <span aria-hidden="true">↗</span></span>
        </div>
      </button>
    </article>`).join(''));
  requireElement('#work-count').textContent =
    `Showing ${visible.length} of ${caseEntries.length} projects`;
  renderFilters();
}
renderWork();
filterNode.addEventListener('click', event => {
  if (!(event.target instanceof Element)) return;
  const button = event.target.closest<HTMLButtonElement>('[data-filter]');
  if (!button) return;
  const requested = button.dataset.filter || 'All work';
  if (!workFilters.some(value => value === requested)) return;
  const restoreKeyboardFocus = document.activeElement === button;
  currentFilter = requested;
  renderWork();
  if (restoreKeyboardFocus) {
    const selected = Array.from(filterNode.querySelectorAll<HTMLButtonElement>('[data-filter]'))
      .find(item => item.dataset.filter === requested);
    selected?.focus({preventScroll:true});
  }
});
function showCase(key: keyof typeof portfolioDetails): void {
  const data=portfolioDetails[key];
  openDetail(`
    <span class="detail-kicker">PUKKA GEN / ILLUSTRATIVE ENGINEERING CONCEPT</span>
    <h2 id="dialog-title">${escapeHtml(data.title)}</h2>
    <p class="detail-description">${escapeHtml(data.description)}</p>
    <div class="pg-case-disclosure"><strong>Concept study — not a verified client deployment.</strong><p>This model explores one credible system approach. Visuals are conceptual; outcomes and figures from older portfolio copy are intentionally not presented as achieved results.</p></div>
    <img class="detail-hero-image" src="${escapeHtml(data.image)}" alt="Conceptual architecture illustration for ${escapeHtml(data.title)}" loading="lazy">
    <div class="detail-section"><h3>The engineering problem</h3><p>${escapeHtml(data.context)}</p></div>
    <div class="detail-section"><h3>Design and technical focus</h3><p>${escapeHtml(data.role)}</p></div>
    <div class="detail-section"><h3>Proposed system capabilities</h3>${listMarkup(data.outcomes)}</div>
    <div class="detail-section"><h3>Representative technology choices</h3>${chipMarkup(data.stack)}</div>
  `);
}

// Insight library: preserve full legacy article copy; remove old presentational classes.
const articleCatalog = [
  {key:'mvp_trap',category:'Product strategy'},
  {key:'scope',category:'Scope & budgets'},
  {key:'cheap_code',category:'Engineering quality'},
  {key:'bluffing',category:'Choosing a partner'},
  {key:'ai_business',category:'AI & automation'},
  {key:'pwa',category:'Mobile products'},
  {key:'cloud_security',category:'Cybersecurity'},
  {key:'serverless',category:'Cloud architecture'}
] as const;
const articleIcons: Record<(typeof articleCatalog)[number]['key'], IconName> = {mvp_trap:'target',scope:'layers',cheap_code:'code',bluffing:'users',ai_business:'ai',pwa:'phone',cloud_security:'shield',serverless:'server'};
mount('article-grid', articleCatalog.map((article,index) => {
  const data = blogDetails[article.key];
  return `<button type="button" class="article-card" data-article="${article.key}">
      <span class="article-topline"><span class="article-category"><span class="article-index">${String(index+1).padStart(2,"0")} / </span>${escapeHtml(article.category)}</span><span class="article-symbol" aria-hidden="true">${icon(articleIcons[article.key])}</span></span>
      <h3>${escapeHtml(data.title)}</h3><p>${escapeHtml(data.description)}</p>
      <span class="article-read">Read insight <span aria-hidden="true">${icon("arrowUp")}</span></span>
    </button>`;
}).join(''));
function cleanStaticArticle(content: string): string {
  // Source is bundled, authored studio copy, never user-supplied HTML.
  // Remove legacy CSS hooks and any executable/embedded content from the archive.
  const template = document.createElement('template');
  template.innerHTML = content;
  template.content.querySelectorAll('script,style,iframe,object,embed,form').forEach(el => el.remove());
  template.content.querySelectorAll('*').forEach(element => {
    for (const attribute of Array.from(element.attributes)) {
      if (attribute.name === 'class' || attribute.name === 'style' ||
          attribute.name.startsWith('on') || attribute.name === 'id' ||
          attribute.name.startsWith('data-')) element.removeAttribute(attribute.name);
      if ((attribute.name === 'href' || attribute.name === 'src') &&
          !/^(https:\/\/|mailto:|\/|#)/i.test(attribute.value)) {
        element.removeAttribute(attribute.name);
      }
    }
  });
  return template.innerHTML;
}
function showArticle(key: keyof typeof blogDetails): void {
  const entry = blogDetails[key];
  openDetail(`
    <span class="detail-kicker">THE PUKKA JOURNAL</span>
    <h2 id="dialog-title">${escapeHtml(entry.title)}</h2>
    <p class="detail-description">${escapeHtml(entry.description)}</p>
    <div class="detail-section article-body">${cleanStaticArticle(entry.content)}</div>
  `);
}
requireElement<HTMLButtonElement>('#view-checklist').addEventListener('click', () => showArticle('checklist'));
requireElement<HTMLButtonElement>('#download-checklist').addEventListener('click', () => {
  const text = [ 'PUKKA GEN — THE NO-DUFF CHECKLIST', '', ...checklist.map((q,i) => `${i+1}. ${q}`),
    '', 'If more than three answers are unclear, start with discovery before development.',
    'Pukka Gen — Authentic Engineering. Next-Gen Solutions.', 'https://www.pukkagennoduff.com/' ].join('\n');
  const objectUrl = URL.createObjectURL(new Blob([text], {type:'text/plain;charset=utf-8'}));
  const link = document.createElement('a');
  link.href = objectUrl;
  link.download = 'pukka-gen-no-duff-checklist.txt';
  document.body.appendChild(link);
  link.click();
  link.remove();
  setTimeout(() => URL.revokeObjectURL(objectUrl), 1000);
});

// Technology inventory: descriptions imported from the original experience.
const techEntries = Object.entries(techDetails) as [keyof typeof techDetails,(typeof techDetails)[keyof typeof techDetails]][];
const normalize = (value:string) => value.toLowerCase().replace(/[^a-z0-9]/g,'');
const aliases: Record<string,string> = {postgresql:'postgres',googlecloud:'gcp',kubernetes:'kubernetes',adobexd:'adobexd',jira:'jira',openai:'openai'};
function findTech(label: string): keyof typeof techDetails | null {
  const query = normalize(label);
  const mapped = aliases[query] || query;
  const match = techEntries.find(([key,info]) =>
    normalize(String(key)) === mapped || normalize(info.title) === query);
  return match?.[0] || null;
}
const technologyGroupIcons: readonly IconName[] = ['layout','ai','server'];
mount('technology-groups', techGroups.map((group, index) => `
  <section class="technology-group">
    <div class="technology-heading"><span class="technology-group-icon" aria-hidden="true">${icon(technologyGroupIcons[index] ?? "layers")}</span><h3>${escapeHtml(group.title)}</h3><span class="technology-item-count">${String(group.items.length).padStart(2,"0")} TOOLS</span></div><div class="technology-pills">
      ${group.items.map(label => {
        const key = findTech(label);
        return key
          ? `<button type="button" data-tech="${escapeHtml(key)}" aria-label="About ${escapeHtml(label)}">${technologyMark(label)}<span class="technology-name">${escapeHtml(label)}</span></button>`
          : `<span class="technology-static">${technologyMark(label)}<span class="technology-name">${escapeHtml(label)}</span></span>`;
      }).join('')}
    </div>
  </section>`).join(''));
function showTech(key: keyof typeof techDetails): void {
  const item = techDetails[key];
  const knownBrand = techGroups.flatMap(group => group.items).find(label => findTech(label) === key) ?? item.title;
  openDetail(`<div class="detail-tech-mark">${technologyMark(knownBrand)}</div><span class="detail-kicker">TECHNOLOGY / OUR TOOLKIT</span>
    <h2 id="dialog-title">${escapeHtml(item.title)}</h2>
    <p class="detail-description">${escapeHtml(item.description)}</p>
    <div class="detail-section"><h3>Where it fits</h3>${listMarkup(item.uses)}</div>`);
}

mount('team-grid', team.map(person => `
  <article class="team-card">
    <div class="team-initials" aria-hidden="true">${person.name.split(' ').slice(0,2).map(part=>escapeHtml(part[0]||'')).join('')}</div>
    <h3>${escapeHtml(person.name)}</h3>
    <p class="team-role">${escapeHtml(person.role)}</p>
    <p class="team-focus">${escapeHtml(person.focus)}</p>
    <p>${escapeHtml(person.bio)}</p>
    <div class="tag-list">${person.tags.map(tag=>'<span>'+escapeHtml(tag)+'</span>').join('')}</div>
    <a class="team-email" href="mailto:${escapeHtml(person.email)}">Contact ${escapeHtml(person.name.split(' ')[0])} ↗</a>
  </article>`).join(''));
mount('disciplines', disciplines.map(item => `
  <article><h3>${escapeHtml(item.title)}</h3><strong>${escapeHtml(item.subtitle)}</strong><p>${escapeHtml(item.body)}</p></article>`).join(''));
// Source testimonials are retained in the archive but are intentionally not
// displayed without permission and independent verification of their claims.
const proofStandards = [
  {number:'01',icon:'layers' as IconName,title:'Explain the architecture',body:'Describe the problem, technical trade-offs and system boundaries before calling a concept a finished product.'},
  {number:'02',icon:'shield' as IconName,title:'Test what matters',body:'Source checks, regression tests, cross-browser QA and accessibility analysis are evidence to review—not guarantees to invent.'},
  {number:'03',icon:'check' as IconName,title:'Publish only what is verified',body:'Concept visuals stay labelled. Customer endorsements and performance figures remain unpublished until independently substantiated.'}
] as const;
mount('testimonial-grid', proofStandards.map(item=>`
  <article class="testimonial-card pg-proof-card">
    <div class="pg-proof-top"><span>${escapeHtml(item.number)} / OUR STANDARD</span><span class="pg-proof-icon" aria-hidden="true">${icon(item.icon)}</span></div>
    <h3>${escapeHtml(item.title)}</h3>
    <p>${escapeHtml(item.body)}</p>
    <span class="pg-proof-bottom">NO DUFF / VERIFIABLE BY DESIGN</span>
  </article>`).join(''));
mount('faq-list', allFaqs.map((item,index) => `
  <details name="pukka-faq"><summary>${escapeHtml(item.question)}</summary>
    <p>${escapeHtml(item.answer)}</p>
  </details>`).join(''));

// One delegated listener for static, typed source-content actions.
document.addEventListener('click', event => {
  if (!(event.target instanceof Element)) return;
  const serviceEl = event.target.closest<HTMLElement>('[data-service]');
  if (serviceEl) {
    const key = serviceEl.dataset.service;
    if (key && Object.prototype.hasOwnProperty.call(serviceDetails, key)) showService(key as keyof typeof serviceDetails);
    return;
  }
  const caseEl = event.target.closest<HTMLElement>('[data-case]');
  if (caseEl) {
    const key = caseEl.dataset.case;
    if (key && Object.prototype.hasOwnProperty.call(portfolioDetails, key)) showCase(key as keyof typeof portfolioDetails);
    return;
  }
  const articleEl = event.target.closest<HTMLElement>('[data-article]');
  if (articleEl) {
    const key = articleEl.dataset.article;
    if (key && Object.prototype.hasOwnProperty.call(blogDetails, key)) showArticle(key as keyof typeof blogDetails);
    return;
  }
  const techEl = event.target.closest<HTMLElement>('[data-tech]');
  if (techEl) {
    const key = techEl.dataset.tech;
    if (key && Object.prototype.hasOwnProperty.call(techDetails, key)) showTech(key as keyof typeof techDetails);
  }
});

const year = $('#copyright-year');
if (year) year.textContent = String(new Date().getFullYear());

// Contact: authenticated delivery is server-only, with explicit fallback on error.
const contactForm = requireElement<HTMLFormElement>('#project-form');
const formStatus = requireElement<HTMLElement>('#form-status');
const fallback = requireElement<HTMLAnchorElement>('#email-fallback');
const submitButton = requireElement<HTMLButtonElement>('#project-form button[type="submit"]');
function setFormStatus(message: string, state: 'error' | 'pending' | 'success'): void {
  formStatus.textContent = message;
  formStatus.dataset.state = state;
}
const formFields = Array.from(contactForm.querySelectorAll<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>('input:not([name="website"]),select,textarea'));
formFields.forEach(field => {
  const syncState = () => field.setAttribute('aria-invalid', String(!field.validity.valid && field.dataset.touched === 'true'));
  field.addEventListener('blur', () => { field.dataset.touched = 'true'; syncState(); });
  field.addEventListener('input', () => { syncState(); if(formStatus.dataset.state === 'error') formStatus.textContent=''; });
  field.addEventListener('change', () => { syncState(); });
});
function readBrief(): Record<'name'|'email'|'phone'|'service'|'message'|'website',string> {
  const data = new FormData(contactForm);
  const get = (key:string) => String(data.get(key) ?? '').trim();
  return {name:get('name'),email:get('email'),phone:get('phone'),service:get('service'),message:get('message'),website:get('website')};
}
contactForm.addEventListener('submit', async event => {
  event.preventDefault();
  formFields.forEach(field => { field.dataset.touched = 'true'; field.setAttribute('aria-invalid', String(!field.validity.valid)); });
  if (!contactForm.checkValidity()) {
    setFormStatus('Please complete the required fields and check the highlighted information.', 'error');
    formFields.find(field => !field.validity.valid)?.focus();
    return;
  }
  if (submitButton.disabled) return;
  const brief = readBrief();
  fallback.hidden = true;
  submitButton.disabled = true;
  contactForm.setAttribute('aria-busy', 'true');
  setFormStatus('Submitting your project brief…','pending');
  try {
    const response = await fetch('/api/project-brief', {
      method:'POST', headers:{'Content-Type':'application/json'},
      body:JSON.stringify(brief)
    });
    const result: {ok?:boolean;error?:string} | null = await response.json().catch(()=>null);
    if (!response.ok || result?.ok !== true) throw new Error(result?.error || 'Online enquiries are unavailable right now.');
    contactForm.reset();
    formFields.forEach(field => {field.dataset.touched = 'false';field.setAttribute('aria-invalid','false');});
    setFormStatus('Your project brief has been accepted by our delivery service. Thank you for contacting Pukka Gen.', 'success');
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Online submission failed.';
    setFormStatus(message + ' Please use the direct email option below.', 'error');
    const text = [`Name: ${brief.name}`,`Email: ${brief.email}`,
      `Phone: ${brief.phone || 'Not provided'}`,`Service: ${brief.service}`,'',brief.message].join('\n');
    fallback.href = 'mailto:' + studio.email + '?subject=' +
      encodeURIComponent('Pukka Gen project enquiry — ' + brief.service) + '&body=' + encodeURIComponent(text);
    fallback.hidden = false;
  } finally {
    submitButton.disabled = false;
    contactForm.removeAttribute('aria-busy');
  }
});

/** v2.1 presentation improvements: progressive enhancement only. */
const header = requireElement<HTMLElement>('#site-header');
const progressBar = requireElement<HTMLElement>('#reading-progress-bar');
let scrollFrame = 0;
function updateScrollVisuals(): void {
  scrollFrame = 0;
  const total = Math.max(0, document.documentElement.scrollHeight - window.innerHeight);
  const progress = total ? Math.min(100, Math.max(0, (window.scrollY / total) * 100)) : 0;
  progressBar.style.width = progress.toFixed(1) + '%';
  header.classList.toggle('is-scrolled', window.scrollY > 16);
}
window.addEventListener('scroll', () => {
  if (!scrollFrame) scrollFrame = requestAnimationFrame(updateScrollVisuals);
}, {passive:true});
window.addEventListener('resize', updateScrollVisuals, {passive:true});
updateScrollVisuals();

// Section location stays accurate in both desktop and keyboard navigation.
const sectionLinks = Array.from(document.querySelectorAll<HTMLAnchorElement>(
  '.desktop-navigation a[href^="#"], .mobile-navigation a[href^="#"]'
));
const sections = sectionLinks
  .map(link => document.getElementById(link.hash.slice(1)))
  .filter((section): section is HTMLElement => section instanceof HTMLElement);
function setCurrentSection(id: string): void {
  sectionLinks.forEach(link => {
    if (link.hash === '#' + id) link.setAttribute('aria-current', 'location');
    else link.removeAttribute('aria-current');
  });
}
if ('IntersectionObserver' in window) {
  const currentObserver = new IntersectionObserver(entries => {
    for (const entry of entries) {
      if (entry.isIntersecting) setCurrentSection(entry.target.id);
    }
  }, {rootMargin:'-22% 0px -62% 0px',threshold:0});
  sections.forEach(section => currentObserver.observe(section));
}

// Content is visible by default; animation is enabled only when supported and wanted.
if ('IntersectionObserver' in window &&
    !window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
  const revealTargets = Array.from(document.querySelectorAll<HTMLElement>(
    '.service-card, .portfolio-card, .article-card, .audience-card, .team-card, .process-row, .value-item, .testimonial-card'
  ));
  const revealObserver = new IntersectionObserver(entries => {
    for (const entry of entries) {
      if (!entry.isIntersecting) continue;
      entry.target.classList.add('is-visible');
      revealObserver.unobserve(entry.target);
    }
  }, {threshold:0.07,rootMargin:'0px 0px 30px 0px'});
  revealTargets.forEach(target => {
    target.classList.add('reveal-item');
    if (target.getBoundingClientRect().top < window.innerHeight * .94) target.classList.add('is-visible');
    else revealObserver.observe(target);
  });
  document.documentElement.classList.add('reveal-ready');
}
