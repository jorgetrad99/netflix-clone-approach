import { describe, it, expect } from 'vitest';
import { generateStaticParams, generateMetadata } from './page';
import { sections } from '@/content/generated/content';
import { LOCALES } from '@/i18n/config';

describe('/[locale]/watch/[slug]', () => {
  it('generateStaticParams returns N sections × M locales', () => {
    expect(generateStaticParams()).toHaveLength(sections.length * LOCALES.length);
  });

  it('generateMetadata uses dict.title.play and disables indexing', async () => {
    const es = await generateMetadata({
      params: Promise.resolve({ locale: 'es', slug: 'flows' }),
    });
    expect(es.title).toBe('Reproducir · Flujos Principales');
    expect(es.robots).toEqual({ index: false, follow: true });

    const en = await generateMetadata({
      params: Promise.resolve({ locale: 'en', slug: 'flows' }),
    });
    expect(en.title).toBe('Play · Main Flows');
  });
});
