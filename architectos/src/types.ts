export type Resource = {
  title: string;
  url: string;
  kind: string;
  note: string;
  lastVerified: string;
};

export type Topic = {
  id: string;
  stage: number;
  track: string;
  title: string;
  summary: string;
  why: string;
  level: string;
  prerequisites: string[];
  outcomes: string[];
  concepts: string[];
  resources: Resource[];
  lab: string;
  refreshEveryDays: number;
  volatility: string;
  lastVerified: string;
};

export type Blog = {
  name: string;
  url: string;
  focus: string[];
  signal: string;
  refreshEveryDays: number;
  lastVerified: string;
};

export type CapstonePhase = { stage: number; title: string; deliverable: string; items: string[] };
export type Capstone = { title: string; description: string; phases: CapstonePhase[] };
