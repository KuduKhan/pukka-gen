export {};
const form=document.querySelector<HTMLFormElement>("#v5-project-form");
const output=document.querySelector<HTMLTextAreaElement>("#v5-output");
const status=document.querySelector<HTMLElement>("#v5-status");
const send=document.querySelector<HTMLButtonElement>("#v5-submit");
if(!form||!output||!status||!send)throw new Error("Project Studio markup unavailable");
const projectForm=form,preview=output,feedback=status,submitButton=send;
const read=(name:string):string=>(projectForm.elements.namedItem(name) as HTMLInputElement|HTMLTextAreaElement|HTMLSelectElement|null)?.value.trim()||"";
function makeBrief():string{
 return ["PUKKA GEN / ENGINEERING PROJECT BRIEF",
 "Contact: "+(read("name")||"Not supplied"),
 "Email: "+(read("email")||"Not supplied"),
 "Discipline: "+(read("service")||"Not selected"),
 "Project stage: "+read("stage"),
 "Timeline: "+read("timeline"),
 "Budget range: "+read("budget"),
 "",
 "CHALLENGE AND DESIRED OUTCOME",
 read("goal")||"Describe the problem and what success looks like.",
 "",
 "CONSTRAINTS AND INTEGRATIONS",
 read("constraints")||"To be discussed",
 "",
 "Next step: Human review and scoping. No binding estimate is implied."].join("\n");
}
function refresh():void{preview.value=makeBrief();}
const requested=new URLSearchParams(location.search).get("service");
const allowed=["Software engineering","AI & automation","Cloud & DevOps","Security & QA","Product design","Technical strategy"];
if(requested&&allowed.includes(requested))(projectForm.elements.namedItem("service") as HTMLSelectElement).value=requested;
projectForm.addEventListener("input",refresh);
projectForm.addEventListener("change",refresh);
document.querySelector("#v5-refresh")?.addEventListener("click",()=>{refresh();feedback.textContent="Brief refreshed.";});
document.querySelector("#v5-copy")?.addEventListener("click",async()=>{
 refresh();
 try{await navigator.clipboard.writeText(preview.value);feedback.textContent="Brief copied.";}
 catch{preview.focus();preview.select();feedback.textContent="Select and copy the brief using your device controls.";}
});
projectForm.addEventListener("submit",async(event)=>{
 event.preventDefault();feedback.textContent="";
 if(!projectForm.reportValidity())return;
 const message=["Stage: "+read("stage"),"Timeline: "+read("timeline"),"Budget: "+read("budget"),"Challenge: "+read("goal"),"Constraints: "+(read("constraints")||"To be discussed")].join("\n");
 if(message.length>2500){feedback.textContent="Please shorten the project details.";return;}
 submitButton.disabled=true;submitButton.textContent="Submitting…";
 try{
  const response=await fetch("/api/project-brief",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({name:read("name"),email:read("email"),service:read("service"),message,website:read("website")})});
  const body=await response.json().catch(()=>null) as {ok?:boolean,error?:string}|null;
  if(response.ok&&body?.ok){feedback.textContent="The email provider accepted the enquiry. Pukka Gen must independently confirm receipt.";projectForm.reset();refresh();}
  else feedback.textContent=body?.error||"Delivery was not confirmed. Use the standard contact form.";
 }catch{feedback.textContent="Network error. Delivery was not confirmed. Use the standard contact form.";}
 finally{submitButton.disabled=false;submitButton.textContent="Send project enquiry";}
});
refresh();

