// Pukka Gen Vercel serverless contact endpoint. Provider keys remain server-only.
const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const reply = (res, code, payload) => res.status(code).json(payload);
const field = (obj, key, limit) => typeof obj[key] === "string" ? obj[key].trim().slice(0, limit + 1) : "";
export default async function handler(req, res) {
  res.setHeader("Cache-Control", "no-store");
  if (req.method !== "POST") { res.setHeader("Allow", "POST"); return reply(res, 405, {ok:false,error:"Method not allowed."}); }
  if (!String(req.headers["content-type"] ?? "").includes("application/json")) return reply(res, 415, {ok:false,error:"JSON required."});
  let body;
  try {
    const raw = typeof req.body === "string" ? req.body : JSON.stringify(req.body ?? {});
    if (raw.length > 12000) return reply(res, 413, {ok:false,error:"Brief is too long."});
    body = typeof req.body === "string" ? JSON.parse(req.body) : req.body;
  } catch { return reply(res, 400, {ok:false,error:"Invalid JSON."}); }
  if (!body || typeof body !== "object" || Array.isArray(body)) return reply(res, 400, {ok:false,error:"Invalid brief."});
  if (field(body,"website",500)) return reply(res, 200, {ok:true}); // Honeypot
  const name=field(body,"name",120), email=field(body,"email",254);
  const phone=field(body,"phone",60), service=field(body,"service",60), message=field(body,"message",1500);
  if (name.length<2 || name.length>120 || !emailPattern.test(email) || email.length>254 ||
      !/^[a-z0-9-]{2,60}$/i.test(service) || message.length<12 || message.length>1500 || phone.length>60)
    return reply(res,422,{ok:false,error:"Please check the name, email, service and project details."});
  const origin=process.env.SITE_ORIGIN;
  if (origin && req.headers.origin && req.headers.origin !== origin)
    return reply(res,403,{ok:false,error:"Origin not allowed."});
  const {RESEND_API_KEY,RESEND_FROM,PROJECT_BRIEF_TO}=process.env;
  if (!RESEND_API_KEY || !RESEND_FROM || !PROJECT_BRIEF_TO)
    return reply(res,503,{ok:false,error:"Online enquiries are being configured. Please email mail@pukkagennoduff.com directly."});
  const text=["PUKKA GEN — NEW PROJECT BRIEF","",`Name: ${name}`,`Email: ${email}`,`Phone: ${phone||"Not provided"}`,`Service: ${service}`,"",message].join("\n");
  try {
    const sent=await fetch("https://api.resend.com/emails",{
      method:"POST",
      headers:{Authorization:`Bearer ${RESEND_API_KEY}`,"Content-Type":"application/json"},
      body:JSON.stringify({from:RESEND_FROM,to:[PROJECT_BRIEF_TO],reply_to:email,
        subject:`Pukka Gen project brief — ${service}`,text}),
      signal:AbortSignal.timeout(10000)
    });
    if (!sent.ok) return reply(res,502,{ok:false,error:"Email delivery failed. Please contact us directly."});
    return reply(res,200,{ok:true});
  } catch { return reply(res,502,{ok:false,error:"Email service unavailable. Please contact us directly."}); }
}
