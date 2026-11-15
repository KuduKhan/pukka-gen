/* Pukka Gen visual refinement — progressive, motion-aware enhancement.
   No user data, network requests, dependencies or persistent storage. */
const site=document.body;
if(site.classList.contains("pg-amanah-studio-v2")){
  const reducedMotion=window.matchMedia("(prefers-reduced-motion: reduce)");
  /* Performance: no pointer-following surfaces, per-card listeners,
     continuous highlight repaints, or hover-glow overlays. */


  /* Corporate mobile navigation: one vertical panel, no horizontal scroller.
     This is separate from the homepage mobile menu, which has its own handler. */
  const corporateToggle=document.querySelector<HTMLButtonElement>(".pg-corp-menu-toggle");
  const corporateNav=document.querySelector<HTMLElement>("#pg-corp-nav");
  if(corporateToggle&&corporateNav){
    const mobile=window.matchMedia("(max-width: 980px)");
    const setOpen=(open:boolean)=>{
      const shouldOpen=mobile.matches&&open;
      corporateToggle.setAttribute("aria-expanded",String(shouldOpen));
      corporateToggle.setAttribute("aria-label",shouldOpen?"Close company menu":"Open company menu");
      const text=corporateToggle.querySelector(".pg-menu-text");
      if(text)text.textContent=shouldOpen?"Close":"Menu";
      corporateNav.classList.toggle("pg-corp-nav-open",shouldOpen);
    };
    corporateToggle.addEventListener("click",()=>setOpen(corporateToggle.getAttribute("aria-expanded")!=="true"));
    corporateNav.querySelectorAll("a").forEach(link=>link.addEventListener("click",()=>setOpen(false)));
    document.addEventListener("keydown",event=>{
      if(event.key==="Escape"&&corporateToggle.getAttribute("aria-expanded")==="true"){
        setOpen(false);corporateToggle.focus();
      }
    });
    document.addEventListener("pointerdown",event=>{
      if(corporateToggle.getAttribute("aria-expanded")!=="true")return;
      if(event.target instanceof Node&&!corporateToggle.contains(event.target)&&!corporateNav.contains(event.target))setOpen(false);
    },{passive:true});
    mobile.addEventListener("change",()=>setOpen(false));
    setOpen(false);
  }

  /* Spatial location in the homepage menu. Only internal section anchors
     are observed, so external corporate destinations keep their own state. */
  if("IntersectionObserver" in window){
    const links=Array.from(document.querySelectorAll<HTMLAnchorElement>(
      ".desktop-nav a[href^='#'],.mobile-nav a[href^='#']"
    ));
    const sections=new Map<string,HTMLElement>();
    links.forEach(link=>{
      const id=link.hash.slice(1);
      const section=document.getElementById(id);
      if(section&&id)sections.set(id,section);
    });
    if(sections.size>0){
      let active="";
      const setActive=(id:string)=>{
        if(!id||active===id)return;
        active=id;
        links.forEach(link=>{
          if(link.hash.slice(1)===id)link.setAttribute("aria-current","location");
          else link.removeAttribute("aria-current");
        });
      };
      const observer=new IntersectionObserver(entries=>{
        const candidates=entries.filter(entry=>entry.isIntersecting)
          .sort((a,b)=>b.intersectionRatio-a.intersectionRatio);
        if(candidates[0])setActive(candidates[0].target.id);
      },{threshold:[0,.2,.5],rootMargin:"-18% 0px -55% 0px"});
      sections.forEach(section=>observer.observe(section));
      links.forEach(link=>link.addEventListener("click",()=>{
        const id=link.hash.slice(1);
        if(sections.has(id))setActive(id);
      }));
    }
  }

  /* A small confirmation transition when a user changes a diagram panel.
     Does not animate data entry, scroll, dialogs or accessibility focus. */
  document.addEventListener("click",event=>{
    if(reducedMotion.matches||!(event.target instanceof Element))return;
    const trigger=event.target.closest<HTMLElement>(
      "[data-system-select],[data-solution-select],[data-step]"
    );
    if(!trigger)return;
    const panel=trigger.hasAttribute("data-system-select")
      ? document.getElementById("system-title")
      :trigger.hasAttribute("data-solution-select")
        ? document.getElementById("solution-title")
        :document.getElementById("process-title");
    if(!panel||typeof panel.animate!=="function")return;
    requestAnimationFrame(()=>panel.animate(
      [{opacity:.65,transform:"translateY(5px)"},{opacity:1,transform:"translateY(0)"}],
      {duration:240,easing:"cubic-bezier(.22,.76,.24,1)"}
    ));
  },{passive:true});
}
