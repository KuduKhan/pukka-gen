import {mkdirSync,copyFileSync,cpSync,rmSync} from 'node:fs';
const output=new URL('../dist/',import.meta.url);
rmSync(output,{recursive:true,force:true});
mkdirSync(output,{recursive:true});
for(const page of ['index.html','privacy.html','terms.html']) copyFileSync(new URL('../'+page,import.meta.url),new URL(page,output));
cpSync(new URL('../public/',import.meta.url),output,{recursive:true});
console.log('Static website built in dist');
