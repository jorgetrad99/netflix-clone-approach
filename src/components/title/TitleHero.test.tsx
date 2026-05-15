import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { TitleHero } from './TitleHero';
import { es } from '@/i18n/dictionaries/es';
import { en } from '@/i18n/dictionaries/en';
import type { Section } from '@/content/types';

const flowsSection: Section = {
  id: 'flows',
  slug: 'flows',
  title: 'Flujos Principales',
  number: 7,
  category: 'flows',
  hero: {
    tagline: 'Seis flujos críticos secuenciados con Mermaid.',
    poster: { gradient: ['#dc2626', '#450a0a'], icon: 'Workflow' },
    backdrop: { gradient: ['#e50914', '#141414'], icon: 'Workflow', pattern: 'noise' },
  },
  meta: { runtime: 12, badges: ['Series', 'P0'], rank: 3 },
  excerpt: 'Sign-in, validación de sesión, perfil, reproducción, webhook Stripe, sign out.',
  intro: [],
  episodes: [
    { id: 'flows/1', number: 1, title: 'Sign-in OAuth', runtime: 3, blocks: [] },
    { id: 'flows/2', number: 2, title: 'Validar sesión', runtime: 2, blocks: [] },
  ],
};

describe('<TitleHero>', () => {
  it('renders the title, tagline, excerpt and runtime in es', () => {
    render(<TitleHero section={flowsSection} locale="es" dict={es} />);
    expect(screen.getByRole('heading', { level: 1, name: /flujos principales/i })).toBeVisible();
    expect(screen.getByText(/seis flujos críticos/i)).toBeVisible();
    expect(screen.getByText(/12 min/)).toBeVisible();
    expect(screen.getByText(/2 episodios/)).toBeVisible();
  });

  it('renders English copy when given the en dict', () => {
    render(<TitleHero section={flowsSection} locale="en" dict={en} />);
    expect(screen.getByText(/2 episodes/)).toBeVisible();
    expect(screen.getByRole('link', { name: /^play$/i })).toBeVisible();
  });

  it('shows every meta badge', () => {
    render(<TitleHero section={flowsSection} locale="es" dict={es} />);
    expect(screen.getByText('Series')).toBeVisible();
    expect(screen.getByText('P0')).toBeVisible();
  });

  it('renders Play button as a link to /[locale]/watch/[slug]', () => {
    render(<TitleHero section={flowsSection} locale="es" dict={es} />);
    expect(screen.getByRole('link', { name: /reproducir/i })).toHaveAttribute(
      'href',
      '/es/watch/flows',
    );
  });

  it('shows Top rank badge when section is in Top 10', () => {
    render(<TitleHero section={flowsSection} locale="es" dict={es} />);
    expect(screen.getByText(/top 3/i)).toBeVisible();
  });
});
