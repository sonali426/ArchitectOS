import { useEffect, useMemo, useState } from 'react';
import type { MasteryModes, UnitProgress } from './types';

const KEY = 'architectos.progress.v3';
const emptyModes = (): MasteryModes => ({ understand:false, implement:false, breakIt:false, measure:false, explain:false });
type State = { units: Record<string, UnitProgress>; bookmarkedModules: string[]; lastUnit?: string };
const initial: State = { units:{}, bookmarkedModules:[] };

export function useProgress() {
  const [state,setState] = useState<State>(() => {
    try { return { ...initial, ...JSON.parse(localStorage.getItem(KEY) || '{}') }; }
    catch { return initial; }
  });
  useEffect(()=>localStorage.setItem(KEY,JSON.stringify(state)),[state]);

  return useMemo(()=>({
    state,
    getUnit:(id:string):UnitProgress => state.units[id] || {modes:emptyModes(),evidence:'',notes:''},
    setMode:(id:string,key:keyof MasteryModes,value:boolean)=>setState(s=>{
      const current=s.units[id] || {modes:emptyModes(),evidence:'',notes:''};
      return {...s,units:{...s.units,[id]:{...current,modes:{...current.modes,[key]:value}}},lastUnit:id};
    }),
    setEvidence:(id:string,evidence:string)=>setState(s=>{
      const current=s.units[id] || {modes:emptyModes(),evidence:'',notes:''};
      return {...s,units:{...s.units,[id]:{...current,evidence}},lastUnit:id};
    }),
    setNotes:(id:string,notes:string)=>setState(s=>{
      const current=s.units[id] || {modes:emptyModes(),evidence:'',notes:''};
      return {...s,units:{...s.units,[id]:{...current,notes}},lastUnit:id};
    }),
    isComplete:(id:string)=>{
      const p=state.units[id]; return !!p && Object.values(p.modes).every(Boolean) && p.evidence.trim().length>0;
    },
    toggleModuleBookmark:(id:string)=>setState(s=>({...s,bookmarkedModules:s.bookmarkedModules.includes(id)?s.bookmarkedModules.filter(x=>x!==id):[...s.bookmarkedModules,id]})),
    reset:()=>setState(initial),
  }),[state]);
}
