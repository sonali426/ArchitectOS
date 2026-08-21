import catalogRaw from '../../content/v2/catalog.json';
import blogsRaw from '../../content/blogs.json';
import type { Blog, V2Catalog, V2Domain, V2Module, V2Resource } from '../types';

export const catalog=catalogRaw as V2Catalog;
export const blogs=blogsRaw as Blog[];
export const resources=new Map(catalog.resources.map(r=>[r.id,r]));
export const allModules=catalog.domains.flatMap(domain=>domain.modules.map(module=>({domain,module})));
export const allUnits=allModules.flatMap(x=>x.module.units.map(unit=>({...x,unit})));
export const REPO='https://github.com/sonali426/ArchitectOS';
export const depthLabel:Record<string,string>={foundation:'Foundation',working:'Working',deep:'Deep',architect:'Architect'};
const DAY=86_400_000;
export const ageDays=(date:string)=>Math.max(0,Math.floor((Date.now()-new Date(`${date}T00:00:00Z`).getTime())/DAY));
export const freshness=(last:string,every:number)=>{const age=ageDays(last),ratio=age/every;return ratio>=1.25?{label:'Stale',tone:'danger',age}:ratio>=.85?{label:'Due soon',tone:'warn',age}:{label:'Fresh',tone:'good',age}};
export const pct=(n:number,d:number)=>d?Math.round(n/d*100):0;
export const copy=(s:string)=>navigator.clipboard?.writeText(s);
export const moduleResources=(m:V2Module)=>(m.resourceRefs||[]).map(id=>resources.get(id)).filter(Boolean) as V2Resource[];

export function curriculumDriftPrompt(domain:V2Domain,module:V2Module){return `ArchitectOS V2 curriculum drift audit\nDOMAIN: ${domain.title}\nMODULE: ${module.title}\nCURRENT UNITS:\n${module.units.map(u=>`- ${u.title}: ${u.concepts.join(', ')}`).join('\n')}\n\nResearch current authoritative baselines and high-signal engineering practice. Compare this module against current university curricula, standards/RFCs, official runtime/platform documentation, major production engineering practices and durable architectural developments. Do not merely refresh links.\n\nReturn: KEEP / ADD / EXPAND / MERGE / DEPRECATE recommendations; missing durable concepts; obsolete/vendor-specific material; proposed learning units with challenge + mastery evidence; best canonical resources; new review date and interval. Preserve prerequisite coherence and avoid trend-chasing.`}
export const globalDriftPrompt=()=>`Audit the entire ArchitectOS V2 curriculum for coverage drift. Use ACM/IEEE/AAAI CS2023, IEEE SWEBOK v4, current standards/RFCs, Java/JVM/browser/database/distributed-systems/cloud/Kubernetes/security/SRE documentation, and high-signal engineering practice as baselines. Identify durable missing knowledge required of an elite software engineer/product architect. Return ADD / EXPAND / MERGE / DEPRECATE changes by domain with evidence and suggested learning units. Avoid framework trivia and interview memorization.`;
export const globalResourcePrompt=()=>`Audit ArchitectOS V2 learning resources. For every resource crossing its review window, verify the URL, current version, deprecations and quality. Prefer first-party docs, standards, university courses, canonical papers/books and deep practitioner material. Keep resources only when each serves a distinct role. Return replacements, removals, verification date and recommended next review interval.`;
