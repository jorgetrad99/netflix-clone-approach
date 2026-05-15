import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { WatchHeader } from './WatchHeader';
import { es } from '@/i18n/dictionaries/es';
import type { Section } from '@/content/types';

const stub: Section = {
  id: 'flows',
  slug: 'flows',
  title: 'Flujos Principales',
  number: 7,
  category: 'flows',
  hero: {
    tagline: 'Seis flujos críticos.',
    poster: { gradient: ['#000', '#fff'], icon: 'Workflow' },
    backdrop: { gradient: ['#000', '#fff'], icon: 'Workflow' },
  },
  meta: { runtime: 12, badges: [] },
  excerpt: '',
  intro: [],
  episodes: [],
  localized: {
    es: {
      title: 'Flujos Principales',
      tagline: 'Seis flujos críticos.',
      excerpt: '',
      intro: [],
      episodes: [],
    },
    en: {
      title: 'Main Flows',
      tagline: 'Six critical flows.',
      excerpt: '',
      intro: [],
      episodes: [],
    },
  },
};

describe('<WatchHeader>', () => {
  it('shows chapter eyebrow, title, tagline and back link to /[locale]/title/[slug]', () => {
    render(<WatchHeader section={stub} locale="es" dict={es} />);
    expect(screen.getByText(/capítulo 7/i)).toBeVisible();
    expect(screen.getByRole('heading', { level: 1, name: /flujos principales/i })).toBeVisible();
    expect(screen.getByText(/seis flujos críticos/i)).toBeVisible();
    const back = screen.getByRole('link', { name: /detalle/i });
    expect(back).toHaveAttribute('href', '/es/title/flows');
  });
});
