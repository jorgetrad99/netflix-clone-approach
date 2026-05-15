import { describe, it, expect } from 'vitest';
import robots from './robots';

describe('robots', () => {
  it('returns a wildcard rule that allows /', () => {
    const r = robots();
    const rules = Array.isArray(r.rules) ? r.rules : [r.rules];
    expect(rules[0]?.userAgent).toBe('*');
    expect(rules[0]?.allow).toBe('/');
  });

  it('disallows watch, search, my-list under any locale', () => {
    const r = robots();
    const rules = Array.isArray(r.rules) ? r.rules : [r.rules];
    const disallow = (rules[0]?.disallow ?? []) as string[];
    expect(disallow).toEqual(expect.arrayContaining(['/*/watch/', '/*/search', '/*/my-list']));
  });

  it('points sitemap to /sitemap.xml', () => {
    const r = robots();
    expect(r.sitemap).toMatch(/\/sitemap\.xml$/);
  });
});
