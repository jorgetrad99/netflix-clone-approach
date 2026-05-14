import { describe, it, expect } from 'vitest';
import { generateStaticParams, generateMetadata } from './page';
import { sections } from '@/content/generated/content';

describe('/title/[slug]', () => {
  it('generateStaticParams returns one entry per section', () => {
    const params = generateStaticParams();
    expect(params).toHaveLength(sections.length);
    expect(params.every((p) => typeof p.slug === 'string' && p.slug.length > 0)).toBe(true);
  });

  it('generateMetadata returns title + description from the section', async () => {
    const meta = await generateMetadata({ params: Promise.resolve({ slug: 'flows' }) });
    expect(meta.title).toBe('Flujos Principales');
    expect(meta.description).toMatch(/Sign-in/i);
  });

  it('generateMetadata falls back to "No encontrado" for unknown slug', async () => {
    const meta = await generateMetadata({ params: Promise.resolve({ slug: 'nonexistent' }) });
    expect(meta.title).toBe('No encontrado');
  });
});
