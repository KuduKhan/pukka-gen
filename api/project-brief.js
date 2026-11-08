/* Server-side email gateway. Client claims success only after a provider accepts. */
const mailPattern=/^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const serviceSet=new Set(["Software engineering","AI & automation","Cloud & DevOps","Security & QA","Product design","Technical strategy"]);
function escapeHtml(value){
 return value.replace(/[&<>"']/g,character=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[character]||character));
}
export default async function handler(req,res){
 res.setHeader("Cache-Control","no-store");
 res.setHeader("X-Content-Type-Options","nosniff");
 if(req.method!=="POST"){res.setHeader("Allow","POST");return res.status(405).json({ok:false,error:"Only POST is supported."});}
 const origin=String(req.headers.origin||"");
 const host=String(req.headers.host||"");
 if(origin){
  try{if(new URL(origin).host!==host)return res.status(403).json({ok:false,error:"Invalid request origin."});}
  catch{return res.status(403).json({ok:false,error:"Invalid request origin."});}
 }
 if(!String(req.headers["content-type"]||"").includes("application/json"))return res.status(415).json({ok:false,error:"Use JSON format."});
 const raw=typeof req.body==="string"?req.body:JSON.stringify(req.body||{});
 if(raw.length>6500)return res.status(413).json({ok:false,error:"Project brief is too long."});
 let input;
 try{input=typeof req.body==="string"?JSON.parse(req.body):req.body;}catch{return res.status(400).json({ok:false,error:"Invalid request body."});}
 if(!input||typeof input!=="object")return res.status(400).json({ok:false,error:"Invalid request."});
 const text=key=>typeof input[key]==="string"?input[key].trim():"";
 const name=text("name"),email=text("email"),service=text("service"),message=text("message"),website=text("website");
 if(website)return res.status(200).json({ok:true});
 if(name.length<2||name.length>100||!mailPattern.test(email)||email.length>254||!serviceSet.has(service)||message.length<20||message.length>2500){
  return res.status(422).json({ok:false,error:"Please check your name, email, service and project details."});
 }
 const key=process.env.RESEND_API_KEY,from=process.env.RESEND_FROM,to=process.env.PROJECT_BRIEF_TO;
 if(!key||!from||!to)return res.status(503).json({ok:false,error:"Online delivery is not configured for this preview."});
 const content="<h2>New Pukka Gen project brief</h2><p><strong>Name:</strong> "+escapeHtml(name)+"</p><p><strong>Email:</strong> "+escapeHtml(email)+"</p><p><strong>Service:</strong> "+escapeHtml(service)+"</p><h3>Project details</h3><p>"+escapeHtml(message).replace(/\n/g,"<br>")+"</p>";
 try{
  const response=await fetch("https://api.resend.com/emails",{
   method:"POST",
   headers:{"Authorization":"Bearer "+key,"Content-Type":"application/json"},
   body:JSON.stringify({from,to:[to],reply_to:email,subject:"Pukka Gen project enquiry: "+service,html:content})
  });
  if(!response.ok){console.error("Mail gateway HTTP status:",response.status);return res.status(502).json({ok:false,error:"Online delivery is temporarily unavailable."});}
  const payload=await response.json().catch(()=>null);
  if(!payload?.id)return res.status(502).json({ok:false,error:"The delivery provider did not confirm acceptance."});
  return res.status(200).json({ok:true});
 }catch(error){console.error("Mail gateway connection failure");return res.status(502).json({ok:false,error:"Online delivery is temporarily unavailable."});}
}
