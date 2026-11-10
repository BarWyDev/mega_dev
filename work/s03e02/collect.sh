#!/bin/sh
# Runs the kit's collector, then copies every raw request file it made into the ledger (requests.json).
cd "$(dirname "$0")"
S=$(node -e 'console.log(require("./secrets.local.json").session)')
(cd repo/sched-prod && node collectors/all.mjs --api https://hq.mega.dev/challenges/nothing-ships-unmarked/api --session "$S") | tee -a collect.log
node -e '
const fs=require("fs"),dir="repo/sched-prod/doc/issues";
const led=fs.existsSync("requests.json")?JSON.parse(fs.readFileSync("requests.json","utf8")):{};
let n=0;
for(const f of fs.readdirSync(dir)){
  const raw=fs.readFileSync(dir+"/"+f,"utf8");
  const m=raw.match(/^---\nkey: (IN-\d+)\n[\s\S]*?labels: \[from:(\w+)\]\nsources: \[(IN-\d+)\]\n---\n\n([\s\S]*?)\n\nchannel: (\w+)\n(?:reporter: (.*)\n)?$/);
  if(m&&m[1]===m[3]&&!led[m[1]]){led[m[1]]={channel:m[5],id:m[1],from:m[2],text:m[4],...(m[6]?{reporter:m[6]}:{})};n++;console.log("NEW",JSON.stringify(led[m[1]]));}
}
fs.writeFileSync("requests.json",JSON.stringify(led,null,2)+"\n");
console.log(n+" new request(s) in the ledger, "+Object.keys(led).length+" in all");'
