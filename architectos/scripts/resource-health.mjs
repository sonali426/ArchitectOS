import fs from 'node:fs';
import path from 'node:path';

const root = path.resolve(new URL('..', import.meta.url).pathname);
const topics = JSON.parse(fs.readFileSync(path.join(root, 'content/topics.json'), 'utf8'));
const blogs = JSON.parse(fs.readFileSync(path.join(root, 'content/blogs.json'), 'utf8'));
const argTopic = process.argv.find(a => a.startsWith('--topic='))?.split('=')[1];
const now = Date.now();
const day = 86400000;
const age = d => Math.max(0, Math.floor((now - new Date(`${d}T00:00:00Z`).getTime()) / day));
const due = (x) => age(x.lastVerified) >= x.refreshEveryDays;
let rows = [];
for (const t of topics) if ((!argTopic || t.id === argTopic) && due(t)) rows.push({kind:'Topic',name:t.title,id:t.id,age:age(t.lastVerified),policy:t.refreshEveryDays});
for (const b of blogs) if (!argTopic && due(b)) rows.push({kind:'Radar',name:b.name,id:b.url,age:age(b.lastVerified),policy:b.refreshEveryDays});
rows.sort((a,b)=>(b.age/b.policy)-(a.age/a.policy));
const report = rows.length
  ? [`# ArchitectOS resource freshness report`, '', `Generated: ${new Date().toISOString()}`, '', `The following ${rows.length} item(s) have crossed their refresh interval.`, '', '| Type | Item | Age | Policy |', '|---|---|---:|---:|', ...rows.map(r=>`| ${r.kind} | ${r.name} | ${r.age}d | ${r.policy}d |`), '', '## Required action', '', 'Open each topic in ArchitectOS and run its **Resource refresh task**. Update the curated resources, verification date, refresh interval if needed, and any newly required concepts. Do not refresh links mechanically; verify quality and relevance.'].join('\n')
  : `# ArchitectOS resource freshness report\n\nGenerated: ${new Date().toISOString()}\n\nAll curriculum and radar items are inside their configured refresh windows.`;
console.log(report);
if (process.env.GITHUB_OUTPUT) fs.appendFileSync(process.env.GITHUB_OUTPUT, `count=${rows.length}\n`);
