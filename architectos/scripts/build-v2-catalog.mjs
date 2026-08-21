import fs from 'node:fs';
import path from 'node:path';
import tailDomainsRaw from '../content/v2/tail-domains.mjs';
import productPracticum from '../content/v2/product-practicum.mjs';

const root=path.resolve(new URL('..',import.meta.url).pathname);
const v2=path.join(root,'content','v2');
const domainFiles=fs.readdirSync(v2).filter(f=>/^domain-\d+.*\.json$/.test(f)).sort();
const resourceFiles=fs.readdirSync(v2).filter(f=>/^resources.*\.json$/.test(f)).sort();
// Clone generated JS domains so validator normalization never mutates module singletons across imports.
const tailDomains=structuredClone(tailDomainsRaw);
const leadership=tailDomains.find(d=>d.id==='staff-leadership');
const incidentLeadership=leadership?.modules.find(m=>m.id==='incident-leadership');
const leadershipCommand=incidentLeadership?.units.find(u=>u.id==='incident-command');
if(leadershipCommand) leadershipCommand.id='incident-command-leadership';
const systemDesign=tailDomains.find(d=>d.id==='system-design');
if(systemDesign && !systemDesign.modules.some(m=>m.id===productPracticum.id)) systemDesign.modules.push(structuredClone(productPracticum));

const domains=[...domainFiles.map(f=>JSON.parse(fs.readFileSync(path.join(v2,f),'utf8'))),...tailDomains].sort((a,b)=>a.order-b.order);
const resources=resourceFiles.flatMap(f=>JSON.parse(fs.readFileSync(path.join(v2,f),'utf8')));
const errors=[],warnings=[];
const uniq=(ids,kind)=>{const seen=new Set();for(const id of ids){if(seen.has(id))errors.push(`Duplicate ${kind} id: ${id}`);seen.add(id)}return seen};
const domainIds=uniq(domains.map(d=>d.id),'domain');
const modules=domains.flatMap(d=>d.modules.map(m=>({...m,domainId:d.id,domainTitle:d.title,phase:d.phase,domainOrder:d.order})));
const moduleIds=uniq(modules.map(m=>m.id),'module');
const units=modules.flatMap(m=>m.units.map(u=>({...u,moduleId:m.id,domainId:m.domainId,phase:m.phase})));
const unitIds=uniq(units.map(u=>u.id),'unit');
const resourceIds=uniq(resources.map(r=>r.id),'resource');
const legacyIds=new Set(modules.flatMap(m=>m.legacyTopicIds||[]));
for(const d of domains){
  if(!d.title||!Array.isArray(d.modules)||!d.modules.length)errors.push(`Invalid domain ${d.id}`);
  for(const m of d.modules){
    if(!m.summary||!m.why||!Array.isArray(m.units)||m.units.length<2)errors.push(`Module ${m.id} must have summary, why and at least two units`);
    if(!m.lastReviewed||!m.curriculumReviewEveryDays)errors.push(`Module ${m.id} missing curriculum review metadata`);
    for(const r of m.resourceRefs||[])if(!resourceIds.has(r))errors.push(`Module ${m.id} references missing resource ${r}`);
    for(const p of m.prerequisites||[])if(!moduleIds.has(p)&&!unitIds.has(p)&&!domainIds.has(p)&&!legacyIds.has(p))warnings.push(`Unresolved prerequisite ${p} on module ${m.id}`);
    for(const u of m.units){
      for(const field of ['summary','challenge','evidence'])if(!u[field])errors.push(`Unit ${u.id} missing ${field}`);
      if(!Array.isArray(u.concepts)||u.concepts.length<2)errors.push(`Unit ${u.id} needs concepts`);
      if(!['foundation','working','deep','architect'].includes(u.depth))errors.push(`Unit ${u.id} has invalid depth ${u.depth}`);
    }
  }
}
const v1Dir=path.join(root,'content','topics');
const v1=fs.existsSync(v1Dir)?fs.readdirSync(v1Dir).filter(f=>/^stage-\d+\.json$/.test(f)).flatMap(f=>JSON.parse(fs.readFileSync(path.join(v1Dir,f),'utf8'))):[];
const mapped=new Map();for(const m of modules)for(const old of m.legacyTopicIds||[]){const arr=mapped.get(old)||[];arr.push(m.id);mapped.set(old,arr)}
const migrationMap=v1.map(t=>({legacyTopicId:t.id,title:t.title,status:mapped.has(t.id)?'migrated':'unmapped',v2Modules:mapped.get(t.id)||[]}));
const unmappedLegacy=migrationMap.filter(x=>x.status==='unmapped').map(x=>x.legacyTopicId);
if(unmappedLegacy.length)errors.push(`V1 topics not explicitly migrated: ${unmappedLegacy.join(', ')}`);
const stats={domains:domains.length,modules:modules.length,units:units.length,resources:resources.length,designLabs:units.filter(u=>u.id.startsWith('lab-')).length,architectUnits:units.filter(u=>u.depth==='architect').length,legacyTopics:v1.length,legacyMapped:v1.length-unmappedLegacy.length};
const catalog={generatedAt:new Date().toISOString(),domains,resources,stats,unmappedLegacy,migrationMap};
fs.writeFileSync(path.join(v2,'catalog.json'),JSON.stringify(catalog,null,2)+'\n');
fs.writeFileSync(path.join(v2,'migration-map.json'),JSON.stringify(migrationMap,null,2)+'\n');
console.log(`ArchitectOS V2: ${stats.domains} domains, ${stats.modules} modules, ${stats.units} units, ${stats.resources} resources, ${stats.designLabs} design labs.`);
console.log(`V1 migration: ${stats.legacyMapped}/${stats.legacyTopics} explicit topic mappings.`);
for(const w of warnings)console.warn(`WARN: ${w}`);
if(errors.length){for(const e of errors)console.error(`ERROR: ${e}`);process.exit(1)}
