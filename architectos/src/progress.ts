import { useEffect, useMemo, useState } from 'react';

const KEY = 'architectos.progress.v2';

type ProgressState = {
  completed: string[];
  bookmarked: string[];
  resourceBookmarks: string[];
  lastTopic?: string;
};

const initial: ProgressState = { completed: [], bookmarked: [], resourceBookmarks: [] };

export function useProgress() {
  const [state, setState] = useState<ProgressState>(() => {
    try { return { ...initial, ...JSON.parse(localStorage.getItem(KEY) || '{}') }; }
    catch { return initial; }
  });
  useEffect(() => localStorage.setItem(KEY, JSON.stringify(state)), [state]);

  return useMemo(() => ({
    state,
    isComplete: (id: string) => state.completed.includes(id),
    isBookmarked: (id: string) => state.bookmarked.includes(id),
    toggleComplete: (id: string) => setState((s) => ({ ...s, completed: s.completed.includes(id) ? s.completed.filter(x => x !== id) : [...s.completed, id], lastTopic: id })),
    toggleBookmark: (id: string) => setState((s) => ({ ...s, bookmarked: s.bookmarked.includes(id) ? s.bookmarked.filter(x => x !== id) : [...s.bookmarked, id] })),
    setLastTopic: (id: string) => setState((s) => ({ ...s, lastTopic: id })),
    reset: () => setState(initial),
  }), [state]);
}
