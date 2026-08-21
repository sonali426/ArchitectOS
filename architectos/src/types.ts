export type V2Resource = {
  id: string; title: string; url: string; kind: string; role: string;
  lastVerified: string; refreshEveryDays: number;
};

export type LearningUnit = {
  id: string; title: string; depth: 'foundation'|'working'|'deep'|'architect';
  summary: string; concepts: string[]; challenge: string; evidence: string;
};

export type V2Module = {
  id: string; title: string; summary: string; why: string;
  legacyTopicIds: string[]; prerequisites: string[]; resourceRefs: string[];
  curriculumReviewEveryDays: number; lastReviewed: string; units: LearningUnit[];
};

export type V2Domain = {
  id: string; phase: number; order: number; title: string; summary: string; modules: V2Module[];
};

export type V2Catalog = {
  generatedAt: string;
  domains: V2Domain[];
  resources: V2Resource[];
  stats: {
    domains: number; modules: number; units: number; resources: number;
    designLabs: number; architectUnits: number; legacyTopics: number; legacyMapped: number;
  };
  unmappedLegacy: string[];
};

export type Blog = {
  name: string; url: string; focus: string[]; signal: string;
  refreshEveryDays: number; lastVerified: string;
};

export type MasteryModes = {
  understand: boolean; implement: boolean; breakIt: boolean; measure: boolean; explain: boolean;
};

export type UnitProgress = { modes: MasteryModes; evidence: string; notes: string };
