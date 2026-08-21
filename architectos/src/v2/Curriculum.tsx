import { ChevronRight } from 'lucide-react';
import type { V2Domain, V2Module } from '../types';
import { catalog, pct } from './data';

type Progress={isComplete:(id:string)=>boolean};
export default function Curriculum({progress,openModule}:{progress:Progress;openModule:(d:V2Domain,m:V2Module)=>void}){
  return <><header className="v2-page-head"><div><span className="eyebrow">FULL COMPETENCY GRAPH</span><h1>Curriculum</h1><p>Domains contain modules; modules contain the smallest honestly-completable learning units. Start in order, then branch when dependencies and your real projects justify it.</p></div></header>
    <div className="v2-domains">{catalog.domains.map(domain=>{const units=domain.modules.flatMap(m=>m.units),done=units.filter(u=>progress.isComplete(u.id)).length;return <section className="v2-domain" key={domain.id}><div className="v2-domain-head"><div className="v2-domain-num">{String(domain.order).padStart(2,'0')}</div><div><h2>{domain.title}</h2><p>{domain.summary}</p></div><div className="v2-domain-progress"><strong>{done}/{units.length}</strong><small>mastered</small><div className="v2-bar"><i style={{width:`${pct(done,units.length)}%`}}/></div></div></div><div className="v2-modules">{domain.modules.map(mod=>{const mdone=mod.units.filter(u=>progress.isComplete(u.id)).length;return <button key={mod.id} onClick={()=>openModule(domain,mod)}><div><span className="eyebrow">{mdone}/{mod.units.length} COMPLETE</span><h3>{mod.title}</h3><p>{mod.summary}</p></div><footer><span>{mod.units.length} units</span><ChevronRight size={15}/></footer></button>})}</div></section>})}</div>
  </>;
}
