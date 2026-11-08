import test from "node:test";
import assert from "node:assert/strict";
import handler from "../api/project-brief.js";
function invoke(method,body,headers={"content-type":"application/json","host":"example.vercel.app","origin":"https://example.vercel.app"}){
 const result={statusCode:200,headers:{},body:null};
 const res={setHeader(name,value){result.headers[name]=value;},status(n){result.statusCode=n;return this;},json(payload){result.body=payload;return this;}};
 const req={method,body,headers};
 return Promise.resolve(handler(req,res)).then(()=>result);
}
const valid={name:"Test Project Owner",email:"owner@example.com",service:"Software engineering",message:"We need a responsive, permission-aware workflow application.",website:""};
test("reject unsupported methods and malformed input",async()=>{
 assert.equal((await invoke("GET",{})).statusCode,405);
 assert.equal((await invoke("POST",{},{"content-type":"text/plain","host":"example.vercel.app"})).statusCode,415);
 assert.equal((await invoke("POST",{...valid,email:"invalid"})).statusCode,422);
 assert.equal((await invoke("POST",{...valid,message:"tiny"})).statusCode,422);
 assert.equal((await invoke("POST",valid,{"content-type":"application/json","host":"example.vercel.app","origin":"https://attacker.example"})).statusCode,403);
});
test("fail safely without server credentials and do not falsely claim delivery",async()=>{
 const keys=["RESEND_API_KEY","RESEND_FROM","PROJECT_BRIEF_TO"];
 const before=keys.map(k=>process.env[k]);
 keys.forEach(k=>delete process.env[k]);
 try{
  const r=await invoke("POST",valid);
  assert.equal(r.statusCode,503);
  assert.equal(r.body.ok,false);
  assert.match(r.body.error,/not configured/i);
 }finally{keys.forEach((k,i)=>{if(before[i]===undefined)delete process.env[k];else process.env[k]=before[i];});}
});
test("honeypot is acknowledged without contacting email provider",async()=>{
 const r=await invoke("POST",{...valid,website:"https://spam.example"});
 assert.equal(r.statusCode,200);
 assert.equal(r.body.ok,true);
});
