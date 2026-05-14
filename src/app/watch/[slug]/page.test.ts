import { describe, it, expect } from 'vitest';
import { generateStaticParams, generateMetadata } from './page';
import { sections } from '@/content/generated/content';

describe('/watch/[slug]', () => {
  it('generateStaticParams returns one entry per section', () => {
    expect(generateStaticParams()).toHaveLength(sections.length);
  });

  it('generateMetadata prefixes title with "Reproducir ·" and disables indexing', async () => {
    const meta = await generateMetadata({ params: Promise.resolve({ slug: 'flows' }) });
    expect(meta.title).toBe('Reproducir · Flujos Principales');
    expect(meta.robots).toEqual({ index: false, follow: true });
  });
});
