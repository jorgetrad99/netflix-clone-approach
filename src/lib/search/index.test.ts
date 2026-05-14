import { describe, it, expect } from 'vitest';
import { getSearchEngine } from './index';

describe('getSearchEngine', () => {
  it('returns no hits for queries shorter than 2 chars', async () => {
    const engine = await getSearchEngine();
    expect(engine('a')).toEqual([]);
    expect(engine('')).toEqual([]);
  });

  it('finds the flows section for "OAuth"', async () => {
    const engine = await getSearchEngine();
    const hits = engine('OAuth');
    expect(hits.length).toBeGreaterThan(0);
    const titles = hits.map((h) => h.doc.sectionId);
    expect(titles).toContain('flows');
  });

  it('finds the security section for "PKCE"', async () => {
    const engine = await getSearchEngine();
    const hits = engine('PKCE');
    expect(hits.length).toBeGreaterThan(0);
    expect(hits.some((h) => h.doc.sectionId === 'flows' || h.doc.sectionId === 'security')).toBe(
      true,
    );
  });

  it('respects the limit', async () => {
    const engine = await getSearchEngine();
    const hits = engine('the', 3);
    expect(hits.length).toBeLessThanOrEqual(3);
  });

  it('caches the engine across calls', async () => {
    const a = await getSearchEngine();
    const b = await getSearchEngine();
    expect(a).toBe(b);
  });
});
