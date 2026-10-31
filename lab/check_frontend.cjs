const fs=require('node:fs');
const vm=require('node:vm');
const path=require('node:path');
const html=fs.readFileSync(path.join(__dirname,'../dist/live/index.html'),'utf8');
const scripts=[...html.matchAll(/<script\b[^>]*>([\s\S]*?)<\/script>/gi)];
if(!scripts.length)throw new Error('No live frontend script found');
for(const [index,match] of scripts.entries())new vm.Script(match[1],{filename:`live-script-${index}.js`});
console.log(`${scripts.length} current live frontend scripts compiled successfully.`);
