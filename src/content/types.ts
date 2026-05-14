export const SECTION_IDS = [
  'overview',
  'features',
  'stack',
  'architecture',
  'data-model',
  'routes',
  'flows',
  'cross-cutting',
  'components',
  'testing',
  'security',
  'roadmap',
  'risks',
] as const;

export type SectionId = (typeof SECTION_IDS)[number];

export const CATEGORIES = [
  'product',
  'architecture',
  'flows',
  'security',
  'testing',
  'stack',
  'roadmap',
] as const;

export type Category = (typeof CATEGORIES)[number];

export type Priority = 'P0' | 'P1' | 'P2';

export interface PosterSpec {
  gradient: [string, string];
  icon: string;
  pattern?: 'dots' | 'grid' | 'noise';
}

export interface SectionMeta {
  runtime: number;
  rank?: number;
  rating?: Priority;
  badges: string[];
}

export interface SectionHero {
  tagline: string;
  poster: PosterSpec;
  backdrop: PosterSpec;
}

export type Block =
  | { kind: 'prose'; html: string }
  | { kind: 'code'; lang: string; html: string; raw: string }
  | { kind: 'mermaid'; source: string; id: string }
  | { kind: 'table'; html: string }
  | { kind: 'callout'; variant: 'info' | 'warn'; html: string };

export interface Episode {
  id: string;
  number: number;
  title: string;
  runtime: number;
  blocks: Block[];
}

export interface Section {
  id: SectionId;
  slug: string;
  title: string;
  number: number;
  category: Category;
  hero: SectionHero;
  meta: SectionMeta;
  excerpt: string;
  intro: Block[];
  episodes: Episode[];
}

export interface SearchDoc {
  id: string;
  sectionId: SectionId;
  episodeId?: string;
  title: string;
  category: Category;
  excerpt: string;
  text: string;
}
