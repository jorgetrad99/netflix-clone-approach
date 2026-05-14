import type { SearchDoc } from '@/content/types';

const FUSE_OPTIONS = {
  keys: [
    { name: 'title', weight: 0.5 },
    { name: 'excerpt', weight: 0.3 },
    { name: 'text', weight: 0.2 },
  ],
  threshold: 0.4,
  ignoreLocation: true,
  minMatchCharLength: 2,
};

export interface SearchHit {
  doc: SearchDoc;
  score: number;
}

export type SearchEngine = (query: string, limit?: number) => SearchHit[];

let enginePromise: Promise<SearchEngine> | null = null;

export function getSearchEngine(): Promise<SearchEngine> {
  if (!enginePromise) {
    enginePromise = (async () => {
      const [{ default: Fuse }, { default: docs }] = await Promise.all([
        import('fuse.js'),
        import('@/content/generated/search-index.json'),
      ]);
      const fuse = new Fuse(docs as SearchDoc[], FUSE_OPTIONS);
      return (query: string, limit = 20): SearchHit[] => {
        if (!query || query.trim().length < 2) return [];
        return fuse
          .search(query.trim(), { limit })
          .map((r) => ({ doc: r.item, score: r.score ?? 1 }));
      };
    })();
  }
  return enginePromise;
}
