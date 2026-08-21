import { CheckCircle2 } from 'lucide-react';
import type { LearningUnit, V2Domain, V2Module } from '../types';
import { catalog, depthLabel } from './data';

type Progress={isComplete:(id:string)=>boolean};
export default function DesignLab({progress,openUnit}:{progress:Progress;openUnit:(d:V2Domain,m:V2Module,u:LearningUnit)=>void}){
  const domain=catalog.domains.find(d=>d.id==='system-design')!;const lab=domain.modules.find(m=>m.id==='design-lab')!;const method=domain.modules.filter(m=>m.id!=='design-lab');const done=lab.units.filter(u=>progress.isComplete(u.id)).length;
  return <><header className="v2-page-head split"><div><span className="eyebrow">SYSTEM DESIGN — DEEP PRACTICE</span><h1>Architecture Design Lab</h1><p>Do not memorize reference diagrams. Use the method, make assumptions explicit, estimate load, model data and failure, then change the constraints and redesign.</p></div><div className="v2-score"><strong>{done}/{lab.units.length}</strong><span>cases mastered</span></div></header>
    <section className="v2-method"><span className="eyebrow">METHOD BEFORE CASES</span><div>{method.map(m=><article key={m.id}><strong>{m.title}</strong><span>{m.units.length} units</span><p>{m.summary}</p></article>)}</div></section>
    <div className="v2-legend"><span className="v2-depth foundation">Foundation</span><span className="v2-depth deep">Deep</span><span className="v2-depth architect">Architect</span></div>
    <div className="v2-cases">{lab.units.map((u,i)=><button key={u.id} className={progress.isComplete(u.id)?'done':''} onClick={()=>openUnit(domain,lab,u)}><header><span>{String(i+1).padStart(2,'0')}</span><em className={`v2-depth ${u.depth}`}>{depthLabel[u.depth]}</em></header><h3>{u.title.replace('Design Lab: ','')}</h3><p>{u.concepts.slice(0,6).join(' · ')}</p>{progress.isComplete(u.id)&&<footer><CheckCircle2 size={14}/> mastered</footer>}</button>)}</div>
  </>;
}
