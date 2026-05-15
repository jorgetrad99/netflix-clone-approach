import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { MoreLikeThis } from './MoreLikeThis';
import { es } from '@/i18n/dictionaries/es';
import type { Section } from '@/content/types';

function stub(id: string, category: Section['category']): Section {
  return {
    id: id as Section['id'],
    slug: id,
    title: id,
    number: 1,
    category,
    hero: {
      tagline: 't',
      poster: { gradient: ['#000', '#fff'], icon: 'Film' },
      backdrop: { gradient: ['#000', '#fff'], icon: 'Film' },
    },
    meta: { runtime: 1, badges: [] },
    excerpt: '',
    intro: [],
    episodes: [],
  };
}

describe('<MoreLikeThis>', () => {
  it('renders nothing when there are no siblings in the same category', () => {
    const flows = stub('flows', 'flows');
    const { container } = render(<MoreLikeThis current={flows} locale="es" dict={es} />);
    expect(container).toBeEmptyDOMElement();
  });

  it('renders a row with siblings in the same category, excluding the current one', () => {
    const arch = stub('architecture', 'architecture');
    render(<MoreLikeThis current={arch} locale="es" dict={es} />);
    expect(screen.getByRole('heading', { level: 2, name: /más como esto/i })).toBeVisible();
    const links = screen.getAllByRole('link');
    expect(links.length).toBeGreaterThan(0);
    const hrefs = links.map((l) => l.getAttribute('href'));
    expect(hrefs.some((h) => h?.includes('/architecture'))).toBe(false);
  });
});
