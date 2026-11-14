/* Pukka Gen visual refinement — progressive, motion-aware enhancement.
   No user data, network requests, dependencies or persistent storage. */
const site=document.body;
if(site.classList.contains("pg-amanah-studio-v2")){
  const reducedMotion=window.matchMedia("(prefers-reduced-motion: reduce)");
  const finePointer=window.matchMedia("(hover: hover) and (pointer: fine)");

  /* Gentle positional highlights on interactive cards, never on text or
     touch devices. JS-disabled pages retain the original solid card finish. */
  if(finePointer.matches&&!reducedMotion.matches){
    const cards=document.querySelectorAll<HTMLElement>(
      ".expertise-card,.journal-card,.project,.pg-corporate-card,.corp-card,.pg-corp-at-glance"
    );
    cards.forEach(card=>{
      card.classList.add("pg-lustre-surface");
      let frame=0;
      let x=50,y=25;
      const paint=()=>{
        card.style.setProperty("--pg-spot-x",x.toFixed(2)+"%");
        card.style.setProperty("--pg-spot-y",y.toFixed(2)+"%");
        frame=0;
      };
      card.addEventListener("pointermove",event=>{
        if(event.pointerType==="touch"||reducedMotion.matches)return;
        const rect=card.getBoundingClientRect();
        if(!rect.width||!rect.height)return;
        x=Math.max(0,Math.min(100,(event.clientX-rect.left)/rect.width*100));
        y=Math.max(0,Math.min(100,(event.clientY-rect.top)/rect.height*100));
        if(frame===0)frame=requestAnimationFrame(paint);
      },{passive:true});
      card.addEventListener("pointerleave",()=>{
        if(frame!==0){cancelAnimationFrame(frame);frame=0;}
        card.style.removeProperty("--pg-spot-x");
        card.style.removeProperty("--pg-spot-y");
      },{passive:true});
    });
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
