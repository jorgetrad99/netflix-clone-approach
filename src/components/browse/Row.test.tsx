import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { Row } from './Row';
import type { Section } from '@/content/types';

const makeSection = (id: string, title: string, rank?: number): Section => ({
  id: id as Section['id'],
  slug: id,
  title,
  number: 1,
  category: 'product',
  hero: {
    tagline: `${title} tagline`,
    poster: { gradient: ['#000', '#fff'], icon: 'Film' },
    backdrop: { gradient: ['#000', '#fff'], icon: 'Film' },
  },
  meta: { runtime: 1, badges: [], rank },
  excerpt: '',
  intro: [],
  episodes: [],
});

describe('<Row>', () => {
  it('renders the row title and one link per section', () => {
    const sections = [makeSection('overview', 'Visión General'), makeSection('flows', 'Flujos')];
    render(<Row title="Imperdibles" sections={sections} />);
    expect(screen.getByRole('heading', { level: 2, name: /imperdibles/i })).toBeVisible();
    expect(screen.getAllByRole('link')).toHaveLength(2);
  });

  it('returns null when sections list is empty', () => {
    const { container } = render(<Row title="Empty" sections={[]} />);
    expect(container).toBeEmptyDOMElement();
  });

  it('shows ranks 1..N when variant=top10', () => {
    const sections = [
      makeSection('a', 'Alpha', 1),
      makeSection('b', 'Beta', 2),
      makeSection('c', 'Gamma', 3),
    ];
    const { container } = render(<Row title="Top" sections={sections} variant="top10" />);
    const text = container.textContent ?? '';
    expect(text).toMatch(/1/);
    expect(text).toMatch(/2/);
    expect(text).toMatch(/3/);
  });
});
