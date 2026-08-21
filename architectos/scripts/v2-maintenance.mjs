import fs from 'node:fs';
import path from 'node:path';
const root=path.resolve(new URL('..',import.meta.url).pathname);
const catalog=JSON.parse(fs.readFileSync(path.join(root,'content','v2','catalog.json'),'utf8'));
const mode=process.argv.find(a=>a.startsWith('--mode='))?.split('=')[1]||'all';
const day=86400000;const age=d=>Math.max(0,Math.floor((Date.now()-new Date(`${d}T00:00:00Z`).getTime())/day));const due=(d,n)=>age(d)>=n;
const out=[];let count=0;
if(mode==='all'||mode==='resources'){
 const rows=catalog.resources.filter(r=>due(r.lastVerified,r.refreshEveryDays));count+=rows.length;
 out.push('# ArchitectOS V2 — Resource Health','',rows.length?`The following ${rows.length} resource(s) crossed their verification interval.`:'All resources are inside their verification window.','');
 if(rows.length)out.push('| Resource | Age | Review policy |','|---|---:|---:|',...rows.map(r=>`| ${r.title} | ${age(r.lastVerified)}d | ${r.refreshEveryDays}d |`),'','**Required action:** verify the canonical URL, current version/deprecations, whether the source is still best-in-class, then update `lastVerified` and the review interval. Do not refresh dates mechanically.','');
}
if(mode==='all'||mode==='curriculum'){
 const mods=catalog.domains.flatMap(d=>d.modules.map(m=>({...m,domainTitle:d.title})));const rows=mods.filter(m=>due(m.lastReviewed,m.curriculumReviewEveryDays));count+=rows.length;
 out.push('# ArchitectOS V2 — Curriculum Drift','',rows.length?`The following ${rows.length} module(s) crossed their curriculum review interval.`:'All modules are inside their curriculum review window.','');
 if(rows.length)out.push('| Module | Age | Review policy |','|---|---:|---:|',...rows.map(m=>`| ${m.domainTitle} / ${m.title} | ${age(m.lastReviewed)}d | ${m.curriculumReviewEveryDays}d |`),'','**Required action:** compare each module against current standards, university curricula, canonical runtime/platform docs, major production engineering practices and meaningful durable developments. Propose **ADD / EXPAND / MERGE / DEPRECATE** changes. Do not merely refresh links.','');
}
console.log(out.join('\n'));if(process.env.GITHUB_OUTPUT)fs.appendFileSync(process.env.GITHUB_OUTPUT,`count=${count}\n`);
