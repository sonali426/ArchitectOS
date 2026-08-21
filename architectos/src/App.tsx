import { useMemo, useState } from 'react';
import { BrainCircuit, ChevronRight, Code2, Compass, Github, Library, Menu, Radar, RefreshCcw, Search, X } from 'lucide-react';
import type { LearningUnit, V2Domain, V2Module } from './types';
import { useProgress } from './progress';
import { allUnits, catalog, pct, REPO } from './v2/data';
import Home from './v2/Home';
import Curriculum from './v2/Curriculum';
import Detail from './v2/Detail';
import DesignLab from './v2/DesignLab';
import { Freshness, TechRadar } from './v2/Maintenance';

type View='today'|'curriculum'|'design'|'radar'|'freshness';
type Selected={domain:V2Domain;module:V2Module;unit?:LearningUnit};
const nav:[View,string,typeof Compass][]=[['today','Today',Compass],['curriculum','Curriculum',Library],['design','System Design Lab',BrainCircuit],['radar','Tech Radar',Radar],['freshness','Freshness & Drift',RefreshCcw]];

export default function App(){
 const progress=useProgress();const [view,setView]=useState<View>('today');const [selected,setSelected]=useState<Selected|null>(null);const [query,setQuery]=useState('');const [menu,setMenu]=useState(false);
 const completed=allUnits.filter(x=>progress.isComplete(x.unit.id)).length;
 const results=useMemo(()=>{const q=query.trim().toLowerCase();if(!q)return[];return allUnits.filter(x=>[x.domain.title,x.module.title,x.unit.title,x.unit.summary,...x.unit.concepts].join(' ').toLowerCase().includes(q)).slice(0,10)},[query]);
 const go=(v:View)=>{setView(v);setSelected(null);setMenu(false);window.scrollTo({top:0,behavior:'smooth'})};
 const openUnit=(domain:V2Domain,module:V2Module,unit:LearningUnit)=>{setSelected({domain,module,unit});setQuery('');window.scrollTo({top:0,behavior:'smooth'})};
 const openModule=(domain:V2Domain,module:V2Module)=>{setSelected({domain,module});window.scrollTo({top:0,behavior:'smooth'})};
 return <div className="v2-shell"><aside className={menu?'v2-side open':'v2-side'}><button className="v2-brand" onClick={()=>go('today')}><span><Code2 size={18}/></span><div><strong>ArchitectOS V2</strong><small>Engineer → Product Architect</small></div></button><nav>{nav.map(([id,label,Icon])=><button key={id} className={view===id&&!selected?'active':''} onClick={()=>go(id)}><Icon size={17}/><span>{label}</span></button>)}</nav><div className="v2-side-spacer"/><section className="v2-side-progress"><small>OVERALL MASTERY</small><strong>{pct(completed,allUnits.length)}%</strong><span>{completed} / {allUnits.length} units</span><div className="v2-bar"><i style={{width:`${pct(completed,allUnits.length)}%`}}/></div></section><a className="v2-repo" href={REPO} target="_blank" rel="noreferrer"><Github size={15}/> GitHub source</a></aside>{menu&&<button className="v2-scrim" onClick={()=>setMenu(false)}/>}<main className="v2-main"><header className="v2-top"><button className="v2-menu" onClick={()=>setMenu(true)}><Menu size={19}/></button><div className="v2-search"><Search size={16}/><input value={query} onChange={e=>setQuery(e.target.value)} placeholder={`Search ${catalog.stats.units} units, concepts, modules…`}/>{query&&<button onClick={()=>setQuery('')}><X size={14}/></button>}{query&&<div className="v2-search-results">{results.length?results.map(x=><button key={x.unit.id} onClick={()=>openUnit(x.domain,x.module,x.unit)}><div><strong>{x.unit.title}</strong><small>{x.domain.title} · {x.module.title}</small></div><ChevronRight size={14}/></button>):<p>No match.</p>}</div>}</div><span className="v2-live"><i/> V2 · {catalog.stats.domains} domains · {catalog.stats.units} units</span></header><div className="v2-content">{selected?<Detail domain={selected.domain} module={selected.module} unit={selected.unit} progress={progress} back={()=>selected.unit?setSelected({domain:selected.domain,module:selected.module}):setSelected(null)} openUnit={u=>openUnit(selected.domain,selected.module,u)}/>:<>{view==='today'&&<Home progress={progress} openUnit={openUnit} go={v=>go(v)}/>} {view==='curriculum'&&<Curriculum progress={progress} openModule={openModule}/>} {view==='design'&&<DesignLab progress={progress} openUnit={openUnit}/>} {view==='radar'&&<TechRadar/>} {view==='freshness'&&<Freshness/>}</>}</div></main></div>
}
