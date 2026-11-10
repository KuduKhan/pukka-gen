/* Pukka Gen — lightweight precision spotlight; pointers only, no scroll hooks. */
const precisePointer=window.matchMedia("(hover: hover) and (pointer: fine) and (prefers-reduced-motion: no-preference)");
const surfaces=Array.from(document.querySelectorAll<HTMLElement>(
 ".system-panel,.solution-stage,.process-display,.proof-preview,.studio-wordmark,.project-form,"+
 ".expertise-card,.project,.journal-card,.sector-card,.pg-corporate-card,.corp-card,.corp-feature"
));
for(const surface of surfaces){
 let frame=0,x=0,y=0;
 const flush=():void=>{
  surface.style.setProperty("--pg-spot-x",x+"px");
  surface.style.setProperty("--pg-spot-y",y+"px");
  frame=0;
 };
 const reset=():void=>{
  if(frame)cancelAnimationFrame(frame);
  frame=0;
  surface.style.removeProperty("--pg-spot-x");
  surface.style.removeProperty("--pg-spot-y");
 };
 surface.addEventListener("pointermove",(event:PointerEvent)=>{
  if(!precisePointer.matches||event.pointerType==="touch")return;
  const rect=surface.getBoundingClientRect();
  x=Math.round(event.clientX-rect.left);
  y=Math.round(event.clientY-rect.top);
  if(!frame)frame=requestAnimationFrame(flush);
 },{passive:true});
 surface.addEventListener("pointerleave",reset,{passive:true});
 precisePointer.addEventListener("change",()=>{
  if(!precisePointer.matches)reset();
 });
}
