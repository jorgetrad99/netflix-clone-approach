import { describe, it, expect } from 'vitest';
import sitemap from './sitemap';
import { LOCALES } from '@/i18n/config';
import { SECTION_SLUGS } from '@/content/generated/content';

describe('sitemap', () => {
  it('includes the root URL', () => {
    const entries = sitemap();
    expect(entries[0]?.url).toMatch(/\/$/);
  });

  it('includes one home + N titles + N watch per locale', () => {
    const entries = sitemap();
    const expectedPerLocale = 1 + SECTION_SLUGS.length * 2;
    const expectedTotal = 1 + LOCALES.length * expectedPerLocale;
    expect(entries).toHaveLength(expectedTotal);
  });

  it('emits hreflang alternates for each title across locales', () => {
    const entries = sitemap();
    const titleEntry = entries.find((e) => e.url.endsWith('/es/title/flows'));
    expect(titleEntry?.alternates?.languages?.es).toMatch(/\/es\/title\/flows$/);
    expect(titleEntry?.alternates?.languages?.en).toMatch(/\/en\/title\/flows$/);
  });

  it('marks /watch URLs with lower priority than title pages', () => {
    const entries = sitemap();
    const t = entries.find((e) => e.url.endsWith('/es/title/flows'));
    const w = entries.find((e) => e.url.endsWith('/es/watch/flows'));
    expect((t?.priority ?? 0) > (w?.priority ?? 0)).toBe(true);
  });
});
