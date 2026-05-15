import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { Intro } from './Intro';
import { es } from '@/i18n/dictionaries/es';
import type { Block, Section } from '@/content/types';

const introBlocks: Block[] = [
  { kind: 'prose', html: '<p>The plan in <strong>one</strong> shot.</p>' },
];

const baseSection: Section = {
  id: 'overview',
  slug: 'overview',
  title: 'Visión General',
  number: 1,
  category: 'product',
  hero: {
    tagline: 't',
    poster: { gradient: ['#000', '#fff'], icon: 'Film' },
    backdrop: { gradient: ['#000', '#fff'], icon: 'Film' },
  },
  meta: { runtime: 5, badges: ['Featured'], rank: 1 },
  excerpt: 'e',
  intro: introBlocks,
  episodes: [],
  localized: {
    es: { title: 'Visión General', tagline: 't', excerpt: 'e', intro: introBlocks, episodes: [] },
    en: { title: 'Overview', tagline: 't', excerpt: 'e', intro: introBlocks, episodes: [] },
  },
};

describe('<Intro>', () => {
  it('returns null when there are no prose blocks', () => {
    const empty: Section = {
      ...baseSection,
      intro: [],
      localized: {
        ...baseSection.localized,
        es: { ...baseSection.localized.es, intro: [] },
        en: { ...baseSection.localized.en, intro: [] },
      },
    };
    const { container } = render(<Intro section={empty} locale="es" dict={es} />);
    expect(container).toBeEmptyDOMElement();
  });

  it('renders the prose HTML and the sidebar facts', () => {
    render(<Intro section={baseSection} locale="es" dict={es} />);
    expect(screen.getByText(/one/)).toBeVisible();
    expect(screen.getByText(/Categoría/i)).toBeVisible();
    expect(screen.getByText('producto')).toBeVisible();
    expect(screen.getByText(/5 min/)).toBeVisible();
    expect(screen.getByText(/Top 10/i)).toBeVisible();
    expect(screen.getByText('#1')).toBeVisible();
    expect(screen.getByText('Featured')).toBeVisible();
  });
});
