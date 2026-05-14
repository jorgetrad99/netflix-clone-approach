import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { EpisodeList } from './EpisodeList';
import type { Section } from '@/content/types';

const baseSection: Section = {
  id: 'flows',
  slug: 'flows',
  title: 'Flujos Principales',
  number: 7,
  category: 'flows',
  hero: {
    tagline: 't',
    poster: { gradient: ['#000', '#fff'], icon: 'Workflow' },
    backdrop: { gradient: ['#000', '#fff'], icon: 'Workflow' },
  },
  meta: { runtime: 1, badges: [] },
  excerpt: '',
  intro: [],
  episodes: [
    {
      id: 'flows/1',
      number: 1,
      title: 'Sign-in OAuth',
      runtime: 3,
      blocks: [
        { kind: 'mermaid', source: 'sequenceDiagram\nA->>B: hi', id: 'm1' },
        { kind: 'prose', html: '<p>x</p>' },
      ],
    },
    {
      id: 'flows/2',
      number: 2,
      title: 'Validar sesión',
      runtime: 2,
      blocks: [{ kind: 'code', lang: 'ts', html: '<pre/>', raw: 'const x = 1;' }],
    },
  ],
};

describe('<EpisodeList>', () => {
  it('renders an "Episodios" heading and one row per episode', () => {
    render(<EpisodeList section={baseSection} />);
    expect(screen.getByRole('heading', { level: 2, name: /episodios/i })).toBeVisible();
    expect(screen.getAllByRole('listitem')).toHaveLength(2);
  });

  it('each row links to /watch/[slug]#ep-N', () => {
    render(<EpisodeList section={baseSection} />);
    const links = screen.getAllByRole('link');
    expect(links[0]).toHaveAttribute('href', '/watch/flows#ep-1');
    expect(links[1]).toHaveAttribute('href', '/watch/flows#ep-2');
  });

  it('shows runtime per episode', () => {
    render(<EpisodeList section={baseSection} />);
    expect(screen.getByText(/3 min/)).toBeVisible();
    expect(screen.getByText(/2 min/)).toBeVisible();
  });

  it('falls back to a no-episodes message when episodes is empty', () => {
    const empty: Section = { ...baseSection, episodes: [] };
    render(<EpisodeList section={empty} />);
    expect(screen.getByRole('heading', { level: 2, name: /sin episodios/i })).toBeVisible();
  });
});
