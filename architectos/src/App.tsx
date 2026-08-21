import { useEffect, useMemo, useRef, useState, type CSSProperties, type ReactNode } from 'react';
import {
  Activity, ArrowLeft, ArrowRight, BookOpen, Bookmark, BookmarkCheck, Boxes, BrainCircuit,
  Check, CheckCircle2, ChevronRight, Circle, Clock3, Code2, Compass, Copy, ExternalLink,
  Github, GraduationCap, Layers3, Library, Map, Menu, Radar, RefreshCcw, Search,
  Sparkles, Target, TerminalSquare, Trophy, X, Zap
} from 'lucide-react';
import topicsRaw from '../content/topics.json';
import blogsRaw from '../content/blogs.json';
import capstoneRaw from '../content/capstone.json';
import type { Blog, Capstone, Topic } from './types';
import { freshness, githubIssueUrl, radarRefreshPrompt, topicRefreshPrompt } from './lib';
import { useProgress } from './progress';

const topics = topicsRaw as Topic[];
const blogs = blogsRaw as Blog[];
const capstone = capstoneRaw as Capstone;

type View = 'today' | 'map' | 'library' | 'capstone' | 'radar' | 'freshness';

type StageMeta = { title: string; subtitle: string; color: string };
const stages: Record<number, StageMeta> = {
  1: { title: 'Engineering foundations', subtitle: 'Programming, Java, systems and computer science', color: 'violet' },
  2: { title: 'Full-stack foundations', subtitle: 'Browser, JavaScript, React and frontend architecture', color: 'blue' },
  3: { title: 'Backend & data systems', subtitle: 'Spring, APIs, databases, queues, streaming and search', color: 'cyan' },
  4: { title: 'Security & identity', subtitle: 'Auth, sessions, roles, browser security and threat models', color: 'green' },
  5: { title: 'Distributed systems', subtitle: 'Consistency, failure, scaling and multi-region design', color: 'amber' },
  6: { title: 'Cloud & production', subtitle: 'Containers, CI/CD, observability, SRE and platforms', color: 'orange' },
  7: { title: 'Product architecture', subtitle: 'System design, DDD, governance and technical leadership', color: 'pink' },
  8: { title: 'AI-era architecture', subtitle: 'LLM systems, RAG, agents, evals and AI platforms', color: 'purple' },
  9: { title: 'Synthesis', subtitle: 'End-to-end architecture practicum', color: 'gold' },
};

const nav: { id: View; label: string; icon: typeof Compass }[] = [
  { id: 'today', label: 'Today', icon: Compass },
  { id: 'map', label: 'Learning map', icon: Map },
  { id: 'library', label: 'Topic library', icon: Library },
  { id: 'capstone', label: 'Capstone', icon: Boxes },
  { id: 'radar', label: 'Tech radar', icon: Radar },
  { id: 'freshness', label: 'Freshness', icon: RefreshCcw },
];

function prereqsDone(topic: Topic, completed: string[]) {
  return topic.prerequisites.every((p) => completed.includes(p));
}

function percent(n: number, d: number) { return d ? Math.round((n / d) * 100) : 0; }
function copy(text: string) { navigator.clipboard?.writeText(text); }

function App() {
  const progress = useProgress();
  const [view, setView] = useState<View>('today');
  const [previousView, setPreviousView] = useState<View>('today');
  const [selectedTopicId, setSelectedTopicId] = useState<string | null>(null);
  const [query, setQuery] = useState('');
  const [track, setTrack] = useState('All');
  const [stageFilter, setStageFilter] = useState<number | 'All'>('All');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const searchRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const listener = (e: KeyboardEvent) => {
      if (e.key === '/' && document.activeElement?.tagName !== 'INPUT') {
        e.preventDefault(); searchRef.current?.focus();
      }
      if (e.key === 'Escape') setQuery('');
    };
    window.addEventListener('keydown', listener);
    return () => window.removeEventListener('keydown', listener);
  }, []);

  const completed = progress.state.completed;
  const available = useMemo(() => topics.filter(t => !completed.includes(t.id) && prereqsDone(t, completed)), [completed]);
  const nextTopic = available[0] || topics.find(t => !completed.includes(t.id)) || topics[0];
  const selectedTopic = topics.find(t => t.id === selectedTopicId) || null;
  const tracks = useMemo(() => ['All', ...Array.from(new Set(topics.map(t => t.track))).sort()], []);
  const freshStats = useMemo(() => {
    const all = [...topics, ...blogs];
    return all.reduce((a, item) => { const f = freshness(item); a[f.tone] = (a[f.tone] || 0) + 1; return a; }, {} as Record<string, number>);
  }, []);

  const searchResults = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return [];
    return topics.filter(t => [t.title, t.track, t.summary, ...t.concepts].join(' ').toLowerCase().includes(q)).slice(0, 8);
  }, [query]);

  function openTopic(id: string) {
    setPreviousView(view);
    setSelectedTopicId(id);
    progress.setLastTopic(id);
    setQuery('');
  }

  function go(v: View) { setSelectedTopicId(null); setView(v); setSidebarOpen(false); window.scrollTo({ top: 0, behavior: 'smooth' }); }

  return <div className="app-shell">
    <aside className={`sidebar ${sidebarOpen ? 'open' : ''}`}>
      <div className="brand" onClick={() => go('today')}>
        <div className="brand-mark"><Code2 size={19} /></div>
        <div><strong>ArchitectOS</strong><span>Engineering mastery</span></div>
      </div>
      <nav className="nav-list">
        {nav.map(({ id, label, icon: Icon }) => <button key={id} className={`nav-item ${view === id && !selectedTopic ? 'active' : ''}`} onClick={() => go(id)}>
          <Icon size={18} /><span>{label}</span>{id === 'freshness' && (freshStats.warn || freshStats.danger) ? <em>{(freshStats.warn || 0) + (freshStats.danger || 0)}</em> : null}
        </button>)}
      </nav>
      <div className="sidebar-spacer" />
      <div className="sidebar-progress">
        <div className="eyebrow">OVERALL MASTERY</div>
        <div className="progress-number">{percent(completed.length, topics.length)}%</div>
        <div className="progress-track"><span style={{ width: `${percent(completed.length, topics.length)}%` }} /></div>
        <small>{completed.length} / {topics.length} topics completed</small>
      </div>
      <a className="repo-link" href="https://github.com/sonali426/Careersmet" target="_blank" rel="noreferrer"><Github size={16}/> GitHub source <ExternalLink size={13}/></a>
    </aside>
    {sidebarOpen && <button className="sidebar-scrim" onClick={() => setSidebarOpen(false)} aria-label="Close navigation" />}

    <main className="main">
      <header className="topbar">
        <button className="mobile-menu" onClick={() => setSidebarOpen(true)}><Menu size={20}/></button>
        <div className="search-wrap">
          <Search size={17}/><input ref={searchRef} value={query} onChange={e => setQuery(e.target.value)} placeholder="Search 81 topics, concepts, resources…" />
          <kbd>/</kbd>
          {query && <button className="clear-search" onClick={() => setQuery('')}><X size={15}/></button>}
          {query && <div className="search-panel">
            {searchResults.length ? searchResults.map(t => <button key={t.id} onClick={() => openTopic(t.id)}><span className={`stage-dot ${stages[t.stage]?.color}`} /> <span><strong>{t.title}</strong><small>{t.track} · Stage {t.stage}</small></span><ChevronRight size={15}/></button>) : <div className="empty-search">No matching topic. Try a concept like “sessions”, “queues” or “rate limiting”.</div>}
          </div>}
        </div>
        <div className="topbar-status"><span className="pulse"/> Curriculum live · {topics.length} topics</div>
      </header>

      <div className="content">
        {selectedTopic ? <TopicPage topic={selectedTopic} progress={progress} onBack={() => {setSelectedTopicId(null); setView(previousView)}} onOpenTopic={openTopic} /> : null}
        {!selectedTopic && view === 'today' && <Today topics={topics} nextTopic={nextTopic} completed={completed} onOpen={openTopic} onGo={go} />}
        {!selectedTopic && view === 'map' && <LearningMap completed={completed} onOpen={openTopic} />}
        {!selectedTopic && view === 'library' && <LibraryView track={track} setTrack={setTrack} stageFilter={stageFilter} setStageFilter={setStageFilter} tracks={tracks} completed={completed} onOpen={openTopic} />}
        {!selectedTopic && view === 'capstone' && <CapstoneView onOpen={openTopic} />}
        {!selectedTopic && view === 'radar' && <RadarView />}
        {!selectedTopic && view === 'freshness' && <FreshnessView onOpen={openTopic} />}
      </div>
    </main>
  </div>;
}

function PageHeader({ eyebrow, title, description, action }: { eyebrow: string; title: string; description: string; action?: ReactNode }) {
  return <div className="page-header"><div><div className="eyebrow">{eyebrow}</div><h1>{title}</h1><p>{description}</p></div>{action}</div>;
}

function Today({ topics, nextTopic, completed, onOpen, onGo }: { topics: Topic[]; nextTopic: Topic; completed: string[]; onOpen:(id:string)=>void; onGo:(v:View)=>void }) {
  const currentStage = nextTopic.stage;
  const stageTopics = topics.filter(t => t.stage === currentStage);
  const stageDone = stageTopics.filter(t => completed.includes(t.id)).length;
  const focus = topics.filter(t => !completed.includes(t.id) && (t.stage === currentStage || t.stage === currentStage + 1)).slice(0, 5);
  return <>
    <section className="hero-panel">
      <div className="hero-copy"><span className="hero-kicker"><Sparkles size={14}/> BUILT FOR DEPTH, NOT CHECKLIST THEATRE</span>
        <h1>Become the engineer who can <em>build it, break it, scale it, and explain why.</em></h1>
        <p>A dependency-aware path from basic Java to elite full-stack engineering, distributed systems, product architecture and AI-era technical leadership.</p>
        <div className="hero-actions"><button className="btn primary" onClick={() => onOpen(nextTopic.id)}>Continue learning <ArrowRight size={16}/></button><button className="btn ghost" onClick={() => onGo('map')}>Explore the map</button></div>
      </div>
      <div className="hero-metric"><div className="metric-ring" style={{'--pct': `${percent(completed.length, topics.length) * 3.6}deg`} as CSSProperties}><div><strong>{percent(completed.length, topics.length)}%</strong><span>mastery</span></div></div><small>{topics.length - completed.length} topics remaining</small></div>
    </section>

    <div className="dashboard-grid">
      <section className="card continue-card">
        <div className="card-head"><div><span className="eyebrow">NEXT BEST TOPIC</span><h2>{nextTopic.title}</h2></div><span className={`stage-pill ${stages[nextTopic.stage].color}`}>Stage {nextTopic.stage}</span></div>
        <p>{nextTopic.summary}</p>
        <div className="concept-row">{nextTopic.concepts.slice(0,5).map(c => <span key={c}>{c}</span>)}</div>
        <div className="continue-footer"><div><small>Stage progress</small><div className="thin-progress"><span style={{width:`${percent(stageDone,stageTopics.length)}%`}}/></div></div><button className="btn compact" onClick={() => onOpen(nextTopic.id)}>Open topic <ChevronRight size={15}/></button></div>
      </section>
      <section className="card system-card">
        <div className="card-head"><div><span className="eyebrow">THE MASTERY LOOP</span><h2>How to study every topic</h2></div><BrainCircuit size={22}/></div>
        <div className="mastery-loop">{[['01','Understand'],['02','Implement'],['03','Break'],['04','Measure'],['05','Explain']].map(([n,label]) => <div key={n}><b>{n}</b><span>{label}</span></div>)}</div>
        <p className="muted">A topic is not “done” because you watched it. Build evidence that you can reason about it under failure and trade-offs.</p>
      </section>
    </div>

    <section className="section-block">
      <div className="section-title"><div><span className="eyebrow">FOCUS QUEUE</span><h2>Your next five moves</h2></div><button className="text-btn" onClick={() => onGo('library')}>View all topics <ArrowRight size={14}/></button></div>
      <div className="focus-list">{focus.map((t,i) => <button key={t.id} className="focus-row" onClick={() => onOpen(t.id)}><span className="focus-index">0{i+1}</span><span className={`stage-dot ${stages[t.stage].color}`}/><div><strong>{t.title}</strong><small>{t.track} · {t.concepts.slice(0,3).join(' · ')}</small></div><span className="fresh-tag">{freshness(t).label}</span><ChevronRight size={16}/></button>)}</div>
    </section>

    <section className="section-block">
      <div className="section-title"><div><span className="eyebrow">9-STAGE ARCHITECTURE</span><h2>The complete journey</h2></div></div>
      <div className="stage-strip">{Object.entries(stages).map(([id,s]) => { const n=Number(id), ts=topics.filter(t=>t.stage===n), d=ts.filter(t=>completed.includes(t.id)).length; return <button key={id} onClick={()=>onGo('map')}><span className={`stage-number ${s.color}`}>{id}</span><strong>{s.title}</strong><small>{d}/{ts.length} complete</small><div className="thin-progress"><span style={{width:`${percent(d,ts.length)}%`}}/></div></button>})}</div>
    </section>
  </>;
}

function LearningMap({ completed, onOpen }: { completed:string[]; onOpen:(id:string)=>void }) {
  return <>
    <PageHeader eyebrow="DEPENDENCY-AWARE CURRICULUM" title="Learning map" description="Move left-to-right through the foundations, but follow prerequisites within each stage. Advanced topics remain visible so you always understand where a concept fits." />
    <div className="map-stages">{Object.entries(stages).map(([id, meta]) => {
      const n=Number(id); const list=topics.filter(t=>t.stage===n); const done=list.filter(t=>completed.includes(t.id)).length;
      return <section className="map-stage" key={id}>
        <div className="map-stage-head"><span className={`stage-number ${meta.color}`}>{id}</span><div><h2>{meta.title}</h2><p>{meta.subtitle}</p></div><div className="stage-count"><strong>{done}/{list.length}</strong><span>complete</span></div></div>
        <div className="map-topic-grid">{list.map(t => { const locked=!prereqsDone(t,completed) && !completed.includes(t.id); return <button className={`map-topic ${completed.includes(t.id)?'done':''} ${locked?'locked':''}`} key={t.id} onClick={()=>onOpen(t.id)}><div className="topic-status">{completed.includes(t.id)?<CheckCircle2 size={17}/>:<Circle size={17}/>}</div><div><strong>{t.title}</strong><span>{t.track}</span><small>{t.concepts.slice(0,3).join(' · ')}</small></div><ChevronRight size={15}/></button>})}</div>
      </section>})}</div>
  </>;
}

function LibraryView({ track, setTrack, stageFilter, setStageFilter, tracks, completed, onOpen }:{track:string;setTrack:(x:string)=>void;stageFilter:number|'All';setStageFilter:(x:number|'All')=>void;tracks:string[];completed:string[];onOpen:(id:string)=>void}) {
  const filtered = topics.filter(t => (track==='All'||t.track===track) && (stageFilter==='All'||t.stage===stageFilter));
  return <>
    <PageHeader eyebrow="FULL TOPIC INDEX" title="Topic library" description={`Browse ${topics.length} topics across every major competency expected of a high-end full-stack engineer and product architect.`} />
    <div className="filters"><select value={track} onChange={e=>setTrack(e.target.value)}>{tracks.map(x=><option key={x}>{x}</option>)}</select><select value={String(stageFilter)} onChange={e=>setStageFilter(e.target.value==='All'?'All':Number(e.target.value))}><option>All</option>{Object.keys(stages).map(s=><option key={s} value={s}>Stage {s}: {stages[Number(s)].title}</option>)}</select><span>{filtered.length} topics</span></div>
    <div className="library-grid">{filtered.map(t=><TopicCard key={t.id} topic={t} done={completed.includes(t.id)} onOpen={onOpen}/>)}</div>
  </>;
}

function TopicCard({ topic, done, onOpen }:{topic:Topic;done:boolean;onOpen:(id:string)=>void}) {
  const f=freshness(topic);
  return <button className={`topic-card ${done?'done':''}`} onClick={()=>onOpen(topic.id)}><div className="topic-card-top"><span className={`stage-pill ${stages[topic.stage].color}`}>S{topic.stage}</span><span className={`freshness ${f.tone}`}>{f.label}</span></div><h3>{topic.title}</h3><p>{topic.summary}</p><div className="concept-row small">{topic.concepts.slice(0,4).map(c=><span key={c}>{c}</span>)}</div><div className="topic-card-footer"><span>{topic.track}</span>{done?<span className="complete"><Check size={14}/> Complete</span>:<span>Open <ChevronRight size={14}/></span>}</div></button>
}

function TopicPage({ topic, progress, onBack, onOpenTopic }:{topic:Topic;progress:ReturnType<typeof useProgress>;onBack:()=>void;onOpenTopic:(id:string)=>void}) {
  const f=freshness(topic); const done=progress.isComplete(topic.id); const bookmarked=progress.isBookmarked(topic.id);
  const prereqTopics=topic.prerequisites.map(id=>topics.find(t=>t.id===id)).filter(Boolean) as Topic[];
  const next=topics.find(t=>t.prerequisites.includes(topic.id));
  const [copied,setCopied]=useState(false);
  const refreshPrompt=topicRefreshPrompt(topic);
  function doCopy(){copy(refreshPrompt);setCopied(true);setTimeout(()=>setCopied(false),1600)}
  return <>
    <button className="back-btn" onClick={onBack}><ArrowLeft size={16}/> Back</button>
    <section className="topic-hero">
      <div className="topic-hero-main"><div className="topic-meta"><span className={`stage-pill ${stages[topic.stage].color}`}>Stage {topic.stage}</span><span>{topic.track}</span><span>{topic.level}</span><span className={`freshness ${f.tone}`}>{f.label} · verified {topic.lastVerified}</span></div><h1>{topic.title}</h1><p>{topic.summary}</p></div>
      <div className="topic-actions"><button className={`btn ${done?'success':'primary'}`} onClick={()=>progress.toggleComplete(topic.id)}>{done?<><CheckCircle2 size={16}/> Completed</>:<><Target size={16}/> Mark complete</>}</button><button className="icon-btn" title="Bookmark" onClick={()=>progress.toggleBookmark(topic.id)}>{bookmarked?<BookmarkCheck size={18}/>:<Bookmark size={18}/>}</button></div>
    </section>

    <div className="topic-layout">
      <div className="topic-main">
        <section className="content-card"><div className="content-card-title"><BrainCircuit size={19}/><h2>Why this matters</h2></div><p className="lead-copy">{topic.why}</p></section>
        {prereqTopics.length>0 && <section className="content-card"><div className="content-card-title"><Layers3 size={19}/><h2>Prerequisites</h2></div><div className="prereq-list">{prereqTopics.map(p=><button key={p.id} onClick={()=>onOpenTopic(p.id)}><span>{progress.isComplete(p.id)?<CheckCircle2 size={16}/>:<Circle size={16}/>}</span><strong>{p.title}</strong><ChevronRight size={14}/></button>)}</div></section>}
        <section className="content-card"><div className="content-card-title"><GraduationCap size={19}/><h2>What you must master</h2></div><div className="concept-checklist">{topic.concepts.map((c,i)=><div key={c}><span>{String(i+1).padStart(2,'0')}</span><p>{c}</p></div>)}</div></section>
        <section className="content-card"><div className="content-card-title"><BookOpen size={19}/><h2>Curated learning resources</h2></div><p className="section-note">Small by design: primary docs + canonical depth + hands-on material. Every link carries a verification date and is periodically re-audited.</p><div className="resource-list">{topic.resources.map(r=><a href={r.url} target={r.url.startsWith('#')?'_self':'_blank'} rel="noreferrer" key={r.title}><div className="resource-icon"><BookOpen size={18}/></div><div><strong>{r.title}</strong><p>{r.note}</p><span>{r.kind} · verified {r.lastVerified}</span></div><ExternalLink size={15}/></a>)}</div></section>
        <section className="content-card lab-card"><div className="content-card-title"><TerminalSquare size={19}/><h2>Proof-of-learning lab</h2></div><p>{topic.lab}</p><div className="lab-rule"><Zap size={15}/><span>Do not mark this topic complete until you can implement it, break it deliberately, observe the failure, and explain the trade-off.</span></div></section>
        <section className="content-card"><div className="content-card-title"><CheckCircle2 size={19}/><h2>Exit criteria</h2></div><ul className="outcomes">{topic.outcomes.map(o=><li key={o}><Circle size={14}/><span>{o}</span></li>)}</ul></section>
        {next && <button className="next-topic" onClick={()=>onOpenTopic(next.id)}><div><span className="eyebrow">A NATURAL NEXT STEP</span><strong>{next.title}</strong><small>{next.summary}</small></div><ArrowRight size={20}/></button>}
      </div>
      <aside className="topic-side">
        <section className="maintenance-card"><div className="maintenance-title"><RefreshCcw size={18}/><div><strong>Resource refresh task</strong><span>Repeatable for this topic</span></div></div><p>This task searches current sources, verifies links, removes weak material and flags missing concepts.</p><button className="btn compact full" onClick={doCopy}>{copied?<><Check size={15}/> Copied research task</>:<><Copy size={15}/> Copy refresh task</>}</button><a className="btn subtle full" target="_blank" rel="noreferrer" href={githubIssueUrl(`[ArchitectOS] Refresh: ${topic.title}`, refreshPrompt)}>Open refresh issue <ExternalLink size={13}/></a><div className="refresh-policy"><span>Policy</span><strong>Every {topic.refreshEveryDays} days</strong><small>Volatility: {topic.volatility}</small></div></section>
        <section className="side-card"><span className="eyebrow">RESOURCE HEALTH</span><div className={`health-state ${f.tone}`}><Activity size={20}/><div><strong>{f.label}</strong><span>{f.age} days since verification</span></div></div></section>
        <section className="side-card"><span className="eyebrow">STAGE</span><h3>{stages[topic.stage].title}</h3><p>{stages[topic.stage].subtitle}</p></section>
      </aside>
    </div>
  </>;
}

function CapstoneView({ onOpen }:{onOpen:(id:string)=>void}) {
  return <>
    <PageHeader eyebrow="ONE PRODUCT, INCREASING DEPTH" title={capstone.title} description={capstone.description} action={<Trophy size={34}/>}/>
    <div className="capstone-intro"><div><strong>Why one evolving product?</strong><p>You stop collecting disconnected tutorials and repeatedly revisit the same product under new constraints: security, traffic, failure, team scale, cost and AI.</p></div><div><strong>Architecture evidence</strong><p>Every phase produces runnable code plus decisions, measurements, failure experiments and design artifacts.</p></div></div>
    <div className="capstone-timeline">{capstone.phases.map((p,i)=><section key={p.stage}><div className="timeline-node">{String(i+1).padStart(2,'0')}</div><div className="timeline-card"><span className={`stage-pill ${stages[p.stage].color}`}>Stage {p.stage}</span><h2>{p.title}</h2><p className="deliverable">Deliverable: <strong>{p.deliverable}</strong></p><div className="phase-items">{p.items.map(x=><span key={x}><Check size={13}/>{x}</span>)}</div><button className="text-btn" onClick={()=>{const first=topics.find(t=>t.stage===p.stage); if(first)onOpen(first.id)}}>Open this stage <ArrowRight size={14}/></button></div></section>)}</div>
  </>;
}

function RadarView() {
  const [focus,setFocus]=useState('All');
  const focuses=['All',...Array.from(new Set(blogs.flatMap(b=>b.focus))).sort()];
  const list=blogs.filter(b=>focus==='All'||b.focus.includes(focus));
  return <>
    <PageHeader eyebrow="KEEP YOUR ARCHITECTURE INSTINCT CURRENT" title="Tech radar" description="A deliberately high-signal reading set: production engineering, systems, platform, security, architecture and AI—not a firehose of product announcements." />
    <div className="radar-routine"><Radar size={24}/><div><strong>Weekly radar ritual</strong><p>Read 2 production deep-dives + 1 architecture essay + 1 fast-moving AI/platform update. Capture: what problem, what constraint, what surprising trade-off, what principle transfers to your systems.</p></div></div>
    <div className="chip-filter">{focuses.map(f=><button className={focus===f?'active':''} key={f} onClick={()=>setFocus(f)}>{f}</button>)}</div>
    <div className="radar-grid">{list.map(b=>{const f=freshness(b);const prompt=radarRefreshPrompt(b);return <article className="radar-card" key={b.name}><div className="radar-card-head"><div className="radar-logo">{b.name.split(' ').slice(0,2).map(x=>x[0]).join('').toUpperCase()}</div><span className={`freshness ${f.tone}`}>{f.label}</span></div><h3>{b.name}</h3><p>{b.signal}</p><div className="concept-row small">{b.focus.map(x=><span key={x}>{x}</span>)}</div><div className="radar-actions"><a href={b.url} target="_blank" rel="noreferrer">Read source <ExternalLink size={13}/></a><button onClick={()=>copy(prompt)}><Copy size={13}/> Audit task</button></div></article>})}</div>
  </>;
}

function FreshnessView({ onOpen }:{onOpen:(id:string)=>void}) {
  const allTopics=topics.map(t=>({type:'Topic' as const,item:t,f:freshness(t),ratio:freshness(t).age/t.refreshEveryDays})).sort((a,b)=>b.ratio-a.ratio);
  const allBlogs=blogs.map(b=>({type:'Radar' as const,item:b,f:freshness(b),ratio:freshness(b).age/b.refreshEveryDays})).sort((a,b)=>b.ratio-a.ratio);
  const due=[...allTopics,...allBlogs].sort((a,b)=>b.ratio-a.ratio);
  return <>
    <PageHeader eyebrow="CURRICULUM MAINTENANCE CONSOLE" title="Freshness & update triggers" description="The product knows when its source material is aging. Fast-moving AI topics refresh far more often than durable CS fundamentals." />
    <div className="maintenance-grid"><div className="maintenance-stat good"><CheckCircle2/><strong>{due.filter(x=>x.f.tone==='good').length}</strong><span>fresh</span></div><div className="maintenance-stat warn"><Clock3/><strong>{due.filter(x=>x.f.tone==='warn').length}</strong><span>due soon</span></div><div className="maintenance-stat danger"><RefreshCcw/><strong>{due.filter(x=>x.f.tone==='danger').length}</strong><span>stale</span></div></div>
    <section className="automation-explain"><div><Github size={21}/><div><strong>Automated GitHub trigger</strong><p>A scheduled workflow scans the same content files every Monday. When items cross their refresh window it creates/updates a GitHub issue containing the exact topics to re-research. Manual workflow dispatch is also supported.</p></div></div><div><RefreshCcw size={21}/><div><strong>Per-topic trigger</strong><p>Every topic has a repeatable research task and one-click issue composer, so resource refresh is systematic rather than “find some new links”.</p></div></div></section>
    <div className="freshness-table"><div className="freshness-table-head"><span>Item</span><span>Type</span><span>Policy</span><span>Status</span><span></span></div>{due.map(x=>{
      const item=x.item; const isTopic=x.type==='Topic'; return <div className="freshness-row" key={`${x.type}-${isTopic?(item as Topic).id:(item as Blog).name}`}><div><strong>{isTopic?(item as Topic).title:(item as Blog).name}</strong><small>Verified {item.lastVerified}</small></div><span>{x.type}</span><span>{item.refreshEveryDays}d</span><span className={`freshness ${x.f.tone}`}>{x.f.label}</span>{isTopic?<button onClick={()=>onOpen((item as Topic).id)}>Review <ChevronRight size={13}/></button>:<a href={(item as Blog).url} target="_blank" rel="noreferrer">Open <ExternalLink size={12}/></a>}</div>})}</div>
  </>;
}

export default App;
