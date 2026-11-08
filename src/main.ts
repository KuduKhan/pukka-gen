/* Pukka Gen — fresh TypeScript interaction layer. No legacy UI code. */
type Domain = "software"|"ai"|"cloud"|"security"|"design"|"strategy";
type Step = "discover"|"architect"|"engineer"|"verify"|"evolve";
type Kind = "project"|"service"|"sector"|"article";
type Detail = {label:string;title:string;intro:string;points:readonly string[];disclaimer?:string};
function byId<T extends HTMLElement>(id:string):T {
 const node=document.getElementById(id);
 if(!node)throw new Error("Missing application element: #"+id);
 return node as T;
}
function escapeHtml(input:string):string{
 const map:Record<string,string>={"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"};
 return input.replace(/[&<>"']/g,character=>map[character] || character);
}
const domains:Record<Domain,{index:string;title:string;copy:string;output:string}>={
 software:{index:"01 / SOFTWARE ENGINEERING",title:"Software that earns its place.",copy:"Robust, maintainable applications that turn complicated workflows into straightforward experiences.",output:"OUTPUT / PRODUCTION-READY APPLICATIONS"},
 ai:{index:"02 / AI & AUTOMATION",title:"Useful intelligence. Human control.",copy:"Assistive systems designed with evaluation, accountable decisions and a practical route to measurable usefulness.",output:"OUTPUT / EVALUATED INTELLIGENT WORKFLOWS"},
 cloud:{index:"03 / CLOUD & OPERATIONS",title:"Built to run. Ready to recover.",copy:"Observable infrastructure, disciplined releases and recovery-minded operations beneath every digital product.",output:"OUTPUT / RELIABLE CLOUD FOUNDATIONS"},
 security:{index:"04 / SECURITY & ASSURANCE",title:"Trust starts in the architecture.",copy:"Authorization boundaries, threat-aware design and repeatable verification before systems go live.",output:"OUTPUT / REVIEWABLE SECURITY CONTROLS"},
 design:{index:"05 / PRODUCT EXPERIENCE",title:"Clarity is a competitive advantage.",copy:"Thoughtful journeys, inclusive interfaces and systems people can navigate without second-guessing.",output:"OUTPUT / ACCESSIBLE PRODUCT EXPERIENCES"},
 strategy:{index:"06 / ENGINEERING DIRECTION",title:"Decide well before you build.",copy:"Discovery, constraints and transparent technical trade-offs that focus investment on the real problem.",output:"OUTPUT / ACTIONABLE DELIVERY ROADMAP"}
};
const atlasPanel=byId<HTMLElement>("system-panel");
const atlasControls=Array.from(document.querySelectorAll<HTMLButtonElement>("[data-system-select]"));
const atlasNodes=Array.from(document.querySelectorAll<SVGGElement>("[data-node]"));
const atlasLinks=Array.from(document.querySelectorAll<SVGPathElement>("[data-link]"));
function setDomain(key:Domain):void{
 const data=domains[key];
 atlasPanel.dataset.active=key;
 byId("system-index").textContent=data.index;
 byId("system-title").textContent=data.title;
 byId("system-copy").textContent=data.copy;
 byId("system-deliverable").textContent=data.output;
 atlasControls.forEach(button=>button.setAttribute("aria-pressed",String(button.dataset.systemSelect===key)));
 atlasNodes.forEach(node=>node.dataset.active=String(node.dataset.node===key));
 atlasLinks.forEach(link=>link.dataset.active=String(link.dataset.link===key));
}
byId("system-tabs").addEventListener("click",event=>{
 const origin=event.target;
 if(!(origin instanceof Element))return;
 const button=origin.closest<HTMLButtonElement>("[data-system-select]");
 if(button && (button.dataset.systemSelect || "") in domains)setDomain(button.dataset.systemSelect as Domain);
});
byId("system-tabs").addEventListener("keydown",event=>{
 if(!(event instanceof KeyboardEvent))return;
 if(!["ArrowLeft","ArrowRight","ArrowUp","ArrowDown","Home","End"].includes(event.key))return;
 const element=event.target;
 const button=element instanceof Element?element.closest<HTMLButtonElement>("[data-system-select]"):null;
 if(!button)return;
 const index=atlasControls.indexOf(button);
 if(index<0)return;
 event.preventDefault();
 const next=event.key==="Home"?0:event.key==="End"?atlasControls.length-1:(index+(event.key==="ArrowLeft"||event.key==="ArrowUp"?-1:1)+atlasControls.length)%atlasControls.length;
 const target=atlasControls[next];
 if(target && (target.dataset.systemSelect || "") in domains){setDomain(target.dataset.systemSelect as Domain);target.focus();}
});
setDomain("software");

// Outcome-first solution explorer: technical choices are shown as proposed
// architecture patterns, never as verified client deployments.
type SolutionKey="operations"|"knowledge"|"trust"|"products";
const solutionData:Record<SolutionKey,{
  kicker:string;title:string;description:string;input:string;engineer:string;output:string;proof:string
}>={
  operations:{kicker:"OPERATIONS / PROCESS INTELLIGENCE",title:"Less handoff. More progress.",description:"Model the work, simplify the approvals and give teams a reliable view of what needs attention—without replacing control with guesswork.",input:"Fragmented work",engineer:"Workflow platform",output:"Reviewable outcome",proof:"Workflow regression · permission tests · operational usability"},
  knowledge:{kicker:"KNOWLEDGE / CONTROLLED AI",title:"Useful intelligence. Human oversight.",description:"Connect internal knowledge to practical tasks through permission-aware retrieval, evaluated responses and explicit review paths.",input:"Disconnected knowledge",engineer:"Governed retrieval",output:"Assisted decisions",proof:"Retrieval evaluation · data boundaries · human review"},
  trust:{kicker:"TRUST / SYSTEM ASSURANCE",title:"Security designed in, not bolted on.",description:"Start with identity, sensitive data and trust boundaries. Design authorization, verification and recovery into the system from day one.",input:"Security exposure",engineer:"Assurance model",output:"Clear controls",proof:"Threat modeling · access isolation · release review"},
  products:{kicker:"PRODUCTS / DIGITAL EXPERIENCE",title:"Build the right thing, beautifully.",description:"Turn a business problem into an accessible software experience supported by thoughtful architecture, reliable delivery and maintainable systems.",input:"Unclear requirements",engineer:"Product engineering",output:"Usable software",proof:"Usability review · cross-device QA · release evidence"}
};
const solutionRoot=byId<HTMLElement>("solution-explorer");
const solutionControls=Array.from(document.querySelectorAll<HTMLButtonElement>("[data-solution-select]"));
function selectSolution(key:SolutionKey):void{
 const item=solutionData[key];
 solutionRoot.dataset.solution=key;
 byId("solution-kicker").textContent=item.kicker;
 byId("solution-title").textContent=item.title;
 byId("solution-description").textContent=item.description;
 byId("solution-input").textContent=item.input;
 byId("solution-engineer").textContent=item.engineer;
 byId("solution-output").textContent=item.output;
 byId("solution-proof").textContent=item.proof;
 solutionControls.forEach(button=>button.setAttribute("aria-pressed",String(button.dataset.solutionSelect===key)));
}
const solutionSelector=byId<HTMLElement>("solution-selector");
solutionSelector.addEventListener("click",event=>{
 const origin=event.target;
 const button=origin instanceof Element?origin.closest<HTMLButtonElement>("[data-solution-select]"):null;
 const key=button?.dataset.solutionSelect;
 if(key && Object.hasOwn(solutionData,key))selectSolution(key as SolutionKey);
});
solutionSelector.addEventListener("keydown",event=>{
 if(!(event instanceof KeyboardEvent)||!["ArrowDown","ArrowUp","ArrowRight","ArrowLeft","Home","End"].includes(event.key))return;
 const origin=event.target;
 const button=origin instanceof Element?origin.closest<HTMLButtonElement>("[data-solution-select]"):null;
 if(!button)return;
 const index=solutionControls.indexOf(button);
 if(index<0)return;
 event.preventDefault();
 const newIndex=event.key==="Home"?0:event.key==="End"?solutionControls.length-1:
  (index+(event.key==="ArrowLeft"||event.key==="ArrowUp"?-1:1)+solutionControls.length)%solutionControls.length;
 const target=solutionControls[newIndex];
 const key=target?.dataset.solutionSelect;
 if(key && Object.hasOwn(solutionData,key)){selectSolution(key as SolutionKey);target.focus();}
});
selectSolution("operations");

const steps:Record<Step,{label:string;title:string;copy:string;result:string}>={
 discover:{label:"STAGE 01 / FIND THE REAL PROBLEM",title:"Understand before building.",copy:"Define the people, constraints, intended outcomes and genuine business problem before proposing a solution.",result:"Problem statement · scope boundaries · success measures"},
 architect:{label:"STAGE 02 / DESIGN THE SYSTEM",title:"Make the hard decisions early.",copy:"Choose system boundaries, data flows, technology trade-offs and security controls with long-term ownership in mind.",result:"Architecture blueprint · risk register · product experience model"},
 engineer:{label:"STAGE 03 / BUILD THE PRODUCT",title:"Write for people and production.",copy:"Deliver maintainable code, coherent interfaces and observable systems in useful increments with clear review points.",result:"Working increments · documented decisions · integration evidence"},
 verify:{label:"STAGE 04 / PROVE IT WORKS",title:"Tests before promises.",copy:"Review accessibility, authorization, regression behavior, deployment integrity and recovery paths before approving a release.",result:"QA results · security review · release acceptance evidence"},
 evolve:{label:"STAGE 05 / KEEP IT HEALTHY",title:"Make the next step easier.",copy:"Measure behavior, learn from users, review incidents and improve the system without unnecessary complexity.",result:"Operations handover · improvement priorities · sustainable ownership"}
};
const processButtons=Array.from(document.querySelectorAll<HTMLButtonElement>("[data-step]"));
function selectStep(key:Step):void{
 const item=steps[key];
 byId("process-index").textContent=item.label;
 byId("process-title").textContent=item.title;
 byId("process-copy").textContent=item.copy;
 byId("process-result").textContent=item.result;
 processButtons.forEach(button=>button.setAttribute("aria-pressed",String(button.dataset.step===key)));
}
byId("process-controls").addEventListener("click",event=>{
 const origin=event.target;
 if(!(origin instanceof Element))return;
 const button=origin.closest<HTMLButtonElement>("[data-step]");
 if(button && (button.dataset.step || "") in steps)selectStep(button.dataset.step as Step);
});
byId("process-controls").addEventListener("keydown",event=>{
 if(!(event instanceof KeyboardEvent))return;
 if(!["ArrowDown","ArrowUp","ArrowRight","ArrowLeft","Home","End"].includes(event.key))return;
 const origin=event.target;
 const button=origin instanceof Element?origin.closest<HTMLButtonElement>("[data-step]"):null;
 if(!button)return;
 const current=processButtons.indexOf(button);
 if(current<0)return;
 event.preventDefault();
 const index=event.key==="Home"?0:event.key==="End"?processButtons.length-1:(current+(event.key==="ArrowUp"||event.key==="ArrowLeft"?-1:1)+processButtons.length)%processButtons.length;
 const target=processButtons[index];
 if(target&&(target.dataset.step || "") in steps){selectStep(target.dataset.step as Step);target.focus();}
});
selectStep("discover");

const details:Record<Kind,Record<string,Detail>>={
 project:{
  operations:{label:"CONCEPT 01 / PLATFORM ARCHITECTURE",title:"Operations, under control.",intro:"A conceptual operational command workspace connecting approvals, workflows and accountable oversight.",points:["Challenge: fragmented operational data and approval steps slow down teams and obscure accountability.","Architecture: role-based permissions, clearly modeled workflows, event-driven status changes and audit-aware review.","Experience: concise dashboards that surface exceptions instead of overwhelming people with raw data.","Acceptance: signed-in access tests, workflow regression, performance checks and useful operational documentation."],disclaimer:"Illustrative product concept and UI study. Mock interface figures are demonstration data—not customer deployment outcomes."},
  intelligence:{label:"CONCEPT 02 / INTELLIGENT WORKFLOWS",title:"Intelligence with intent.",intro:"An assisted workflow model that evaluates inputs, helps people make decisions and records human approvals.",points:["Challenge: repetitive information routing and inconsistent decisions across busy teams.","Architecture: bounded orchestration, human review points, defined model inputs and observable outcomes.","Experience: transparent status, clear confidence limits, editable suggestions and explicit approvals.","Acceptance: evaluation cases, failure-mode review, data-handling safeguards and measurable user utility."],disclaimer:"Illustrative AI workflow pattern. No claims of model accuracy, customer adoption or production-scale deployment."},
  security:{label:"CONCEPT 03 / TRUST & ASSURANCE",title:"Trust is engineered.",intro:"A security-first application gateway blueprint with documented boundaries and repeatable verification.",points:["Challenge: sensitive access paths that are difficult to audit or secure after launch.","Architecture: identity-based authorization, least-privilege roles, secure defaults and threat-informed interfaces.","Operations: auditable events, incident visibility and controlled recovery procedures.","Acceptance: cross-account isolation tests, independent security review and remediation evidence."],disclaimer:"Illustrative security architecture model. The concept is not a certification or statement of deployed security effectiveness."}
 },
 service:{
  software:{label:"CAPABILITY 01 / SOFTWARE",title:"Software engineering",intro:"Purposeful web and mobile application engineering with maintainability, usability and dependable operations in view.",points:["Architecture and application design","Responsive platforms and connected workflows","API integrations and data modeling","Automated checks and production handover"]},
  ai:{label:"CAPABILITY 02 / INTELLIGENCE",title:"AI & automation",intro:"Intelligent assistance designed around real tasks, measurable value and clear human oversight.",points:["AI integration and workflow orchestration","Responsible prompt and evaluation design","Useful reporting and operational assistance","Reviewable automation and safety controls"]},
  cloud:{label:"CAPABILITY 03 / INFRASTRUCTURE",title:"Cloud & DevOps",intro:"Infrastructure choices that favor reliability, observability, security and controlled operational cost.",points:["Cloud architecture and migration planning","CI/CD and repeatable deployments","Monitoring, backup and recovery design","Infrastructure automation and cost review"]},
  security:{label:"CAPABILITY 04 / ASSURANCE",title:"Security & QA",intro:"Practical security and quality disciplines embedded into the system lifecycle.",points:["Threat-informed architecture and access boundaries","Security assessment and remediation","Automated test strategies and release gates","Accessible, verifiable production readiness"]},
  design:{label:"CAPABILITY 05 / PRODUCT UX",title:"Product design",intro:"Human-centred interfaces that express complex engineering through clarity, trust and intuitive interactions.",points:["Research-led information architecture","Accessible and responsive user experiences","Design systems, prototypes and usability review","Polished interface components with purpose"]},
  strategy:{label:"CAPABILITY 06 / DIRECTION",title:"Technical strategy",intro:"Clear choices at the beginning save teams from expensive and unnecessary implementation later.",points:["Problem discovery and feasibility","Architecture and technology trade-off analysis","Phased delivery and ownership planning","Quality, security and maintenance requirements"]}
 },
 sector:{
  maritime:{label:"SECTOR PLAYBOOK / MARITIME & LOGISTICS",title:"Maritime & logistics",intro:"An engineering use-case model for operational coordination, asset status and exception-handling in complex maritime and logistics workflows.",points:["Problem pattern: disconnected shipping, cargo or equipment updates that slow operational coordination.","Proposed system: role-scoped workflow tracking, structured event updates and a clear operational dashboard.","Assurance: data-integrity checks, resilient connectivity, audit visibility and device-aware interface acceptance.","First step: map the actual operations and applicable access boundaries with the responsible team."],disclaimer:"Sector application pattern only. It does not represent an existing maritime customer or completed deployment."},
  property:{label:"SECTOR PLAYBOOK / PROPERTY SYSTEMS",title:"Real estate & property",intro:"A conceptual property information and operations platform for structured records and accountable service workflows.",points:["Problem pattern: scattered property documents, inquiries and service updates.","Proposed system: searchable asset records, permissions, approval tracking and clear owner/tenant interactions.","Assurance: secure document access, record integrity and tenant isolation as applicable.","First step: agree on the exact property-management process and stakeholder access rules."],disclaimer:"Illustrative sector scenario, not a claim about a client or launched product."},
  finance:{label:"SECTOR PLAYBOOK / FINANCIAL WORKFLOWS",title:"Finance & operations",intro:"A proposed operations workflow with transparent approvals, reconciliation and traceable decision paths.",points:["Problem pattern: complex approvals, inconsistent handoffs and hard-to-reconcile reporting.","Proposed system: permissioned financial workflows, status history, reconciliation support and exportable records.","Assurance: least privilege, separation of duties, transaction integrity and independent acceptance where needed.","First step: define financial controls, required audit evidence and applicable regulations."],disclaimer:"No regulated-services certifications or production customer outcomes are asserted."},
  education:{label:"SECTOR PLAYBOOK / DIGITAL LEARNING",title:"Education & learning",intro:"A conceptual learning platform designed around clear learning journeys and trustworthy academic evidence.",points:["Problem pattern: fragmented lessons, unclear progress and confusing feedback.","Proposed system: syllabus-first navigation, structured practice and reviewable completion records.","Assurance: learner data protection, accessible interfaces and integrity-aware assessment paths.","First step: map the actual teaching outcomes, learner roles and evidence requirements."],disclaimer:"A design reference, not a claim that a deployed institution uses this platform."},
  health:{label:"SECTOR PLAYBOOK / HEALTH ADMINISTRATION",title:"Healthcare administration",intro:"A non-clinical operational application pattern for staffing, scheduling and secure information flow.",points:["Problem pattern: hard-to-coordinate staffing and administrative workflows.","Proposed system: staff scheduling, administrative approvals and operational visibility with role boundaries.","Assurance: privacy-by-design, data minimization and independent clinical review if scope ever becomes clinical.","First step: document the non-clinical intended use and applicable data-protection obligations."],disclaimer:"Administrative use cases only. No diagnosis, treatment claims or certified healthcare deployments."},
  workforce:{label:"SECTOR PLAYBOOK / PERSONNEL OPERATIONS",title:"Enterprise workforce",intro:"A conceptual people-operations workspace with permission-aware records and accountable approvals.",points:["Problem pattern: scattered personnel information, inconsistent leave routing and unclear workforce availability.","Proposed system: role-based workforce workflows, self-service requests and status-aware oversight.","Assurance: cross-user isolation, privacy controls, approval history and organization-scoped permissions.","First step: determine the target organization, data retention needs and valid HR rules."],disclaimer:"Illustrative system design. It is not a statement of an active HR customer deployment."}
 },
 article:{
  discovery:{label:"FIELD NOTE 01 / PRODUCT STRATEGY",title:"Before the first line of code.",intro:"Shipping software faster is not useful if the team never defined the problem properly.",points:["Describe the user and the expensive friction in their day—not a list of fashionable features.","Choose a small, meaningful first release and define what success would look like.","Make ownership, security and recovery expectations explicit before implementation.","The most valuable design decision is often a feature you decide not to build."]},
  security:{label:"FIELD NOTE 02 / SYSTEM SECURITY",title:"Security is not a launch checklist.",intro:"Security is stronger when it shapes architecture rather than appearing after the product is complete.",points:["Identify data boundaries, trust relationships and high-risk workflows from the start.","Design authorization separately from visible interface permissions.","Test failure paths and cross-account access, not only happy-path screens.","Independent review and documented remediation remain necessary for high-risk systems."]},
  ai:{label:"FIELD NOTE 03 / RESPONSIBLE AI",title:"Make AI earn its place.",intro:"A sophisticated model is not a product outcome. Useful intelligence must serve a known workflow.",points:["Identify a specific task, human reviewer and measurable success criterion.","Define the limits of the model's authority and its permitted inputs.","Measure failure cases and record when humans reject or correct suggestions.","Integrate monitoring and improvement into the real workflow rather than staging a static demo."]}
 }
};
const dialog=byId<HTMLDialogElement>("detail-dialog");
const dialogBody=byId<HTMLElement>("dialog-content");
const closeButton=byId<HTMLButtonElement>("dialog-close");
let focusBeforeDialog:HTMLElement|null=null;
function showDetail(kind:Kind,key:string):void{
 const item=details[kind][key];
 if(!item)return;
 focusBeforeDialog=document.activeElement instanceof HTMLElement?document.activeElement:null;
 let markup='<span class="dialog-label">'+escapeHtml(item.label)+'</span>';
 markup+='<h2 id="dialog-title">'+escapeHtml(item.title)+'</h2>';
 markup+='<p>'+escapeHtml(item.intro)+'</p>';
 markup+='<ul class="detail-list">'+item.points.map(point=>'<li>'+escapeHtml(point)+'</li>').join("")+'</ul>';
 if(item.disclaimer)markup+='<p class="detail-disclaimer">'+escapeHtml(item.disclaimer)+'</p>';
 dialogBody.innerHTML=markup;
 dialog.showModal();
 document.body.classList.add("dialog-open");
 closeButton.focus();
}
document.addEventListener("click",event=>{
 if(!(event.target instanceof Element))return;
 for(const kind of ["project","service","sector","article"] as const){
  const button=event.target.closest<HTMLButtonElement>("[data-"+kind+"]");
  if(button){const key=button.dataset[kind];if(key)showDetail(kind,key);return;}
 }
});
closeButton.addEventListener("click",()=>dialog.close());
byId<HTMLAnchorElement>("dialog-contact").addEventListener("click",()=>dialog.close());
dialog.addEventListener("click",event=>{
 if(event.target!==dialog)return;
 const rect=dialog.getBoundingClientRect();
 if(event.clientX<rect.left||event.clientX>rect.right||event.clientY<rect.top||event.clientY>rect.bottom)dialog.close();
});
dialog.addEventListener("close",()=>{document.body.classList.remove("dialog-open");focusBeforeDialog?.focus({preventScroll:true});});
const filterButtons=Array.from(document.querySelectorAll<HTMLButtonElement>("[data-filter]"));
const projects=Array.from(document.querySelectorAll<HTMLElement>(".project[data-category]"));
byId("work-filters").addEventListener("click",event=>{
 if(!(event.target instanceof Element))return;
 const button=event.target.closest<HTMLButtonElement>("[data-filter]");
 if(!button)return;
 const filter=button.dataset.filter || "all";
 filterButtons.forEach(candidate=>candidate.setAttribute("aria-pressed",String(candidate.dataset.filter===filter)));
 projects.forEach(card=>{card.hidden=filter!=="all"&&card.dataset.category!==filter;});
});

const menuButton=byId<HTMLButtonElement>("menu-toggle");
const mobileNav=byId<HTMLElement>("mobile-nav");
function setMenu(open:boolean):void{
 menuButton.setAttribute("aria-expanded",String(open));
 menuButton.setAttribute("aria-label",open?"Close menu":"Open menu");
 mobileNav.hidden=!open;
 mobileNav.inert=!open;
}
menuButton.addEventListener("click",()=>setMenu(menuButton.getAttribute("aria-expanded")!=="true"));
mobileNav.querySelectorAll("a").forEach(link=>link.addEventListener("click",()=>setMenu(false)));
window.addEventListener("resize",()=>{if(window.innerWidth>980)setMenu(false);},{passive:true});
document.addEventListener("click",event=>{
 if(menuButton.getAttribute("aria-expanded")!=="true")return;
 if(!(event.target instanceof Node))return;
 if(!mobileNav.contains(event.target)&&!menuButton.contains(event.target))setMenu(false);
});
document.addEventListener("keydown",event=>{
 if(event.key==="Escape"&&menuButton.getAttribute("aria-expanded")==="true"){setMenu(false);menuButton.focus();}
});
setMenu(false);
const header=byId<HTMLElement>("site-header");
let scrollScheduled=false;
function reflectScroll():void{header.classList.toggle("is-scrolled",window.scrollY>20);scrollScheduled=false;}
window.addEventListener("scroll",()=>{if(!scrollScheduled){scrollScheduled=true;requestAnimationFrame(reflectScroll);}},{passive:true});
reflectScroll();
byId("year").textContent=String(new Date().getFullYear());

// Real contact delivery is server-only. If mail is not configured the site
// explicitly offers a direct-email fallback instead of claiming success.
type Brief={name:string;email:string;service:string;message:string;website:string};
const form=byId<HTMLFormElement>("project-form");
const formStatus=byId<HTMLElement>("form-status");
const fallback=byId<HTMLAnchorElement>("email-fallback");
const submit=form.querySelector<HTMLButtonElement>('button[type="submit"]');
if(!submit)throw new Error("Project enquiry submit button missing");
function formMessage(text:string,state:"error"|"pending"|"success"):void{
 formStatus.textContent=text;formStatus.dataset.state=state;
}
form.addEventListener("submit",async event=>{
 event.preventDefault();
 fallback.hidden=true;
 if(!form.checkValidity()){
  const first=form.querySelector<HTMLInputElement|HTMLTextAreaElement|HTMLSelectElement>(":invalid");
  first?.focus();
  form.reportValidity();
  formMessage("Please complete the required fields with valid information.","error");
  return;
 }
 const data=new FormData(form);
 const get=(field:string)=>String(data.get(field)||"").trim();
 const brief:Brief={name:get("name"),email:get("email"),service:get("service"),message:get("message"),website:get("website")};
 const mailSubject="Project enquiry — "+brief.service;
 const mailBody=["Name: "+brief.name,"Email: "+brief.email,"Service: "+brief.service,"","Project brief:",brief.message].join("\n");
 fallback.href="mailto:mail@pukkagennoduff.com?subject="+encodeURIComponent(mailSubject)+"&body="+encodeURIComponent(mailBody);
 submit.disabled=true;form.setAttribute("aria-busy","true");
 formMessage("Submitting your project brief…","pending");
 try{
  const response=await fetch("/api/project-brief",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify(brief)});
  const result:unknown=await response.json().catch(()=>null);
  const record=result&&typeof result==="object"?result as Record<string,unknown>:null;
  if(!response.ok||record?.ok!==true)throw new Error(typeof record?.error==="string"?record.error:"Online delivery is unavailable.");
  form.reset();
  formMessage("Your brief was accepted by the mail delivery service. Thank you for reaching out.","success");
 }catch(error){
  const message=error instanceof Error?error.message:"Online delivery is unavailable.";
  formMessage(message+" Use the direct email option below so your enquiry is not lost.","error");
  fallback.hidden=false;
 }finally{
  submit.disabled=false;form.removeAttribute("aria-busy");
 }
});
