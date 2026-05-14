import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, act, fireEvent } from '@testing-library/react';
import { Card } from './Card';
import type { Section } from '@/content/types';

const stubSection: Section = {
  id: 'overview',
  slug: 'overview',
  title: 'Visión General',
  number: 1,
  category: 'product',
  hero: {
    tagline: 'El blueprint completo del producto.',
    poster: { gradient: ['#e50914', '#220505'], icon: 'Film' },
    backdrop: { gradient: ['#141414', '#e50914'], icon: 'Film' },
  },
  meta: { runtime: 5, badges: [] },
  excerpt: 'excerpt',
  intro: [],
  episodes: [],
};

function getPreview(link: HTMLElement): HTMLElement | null {
  return link.querySelector('[data-testid="card-preview"]');
}

describe('<Card>', () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });
  afterEach(() => {
    vi.useRealTimers();
  });

  it('links to the title detail route', () => {
    render(<Card section={stubSection} />);
    const link = screen.getByRole('link', { name: /abrir visión general/i });
    expect(link).toHaveAttribute('href', '/title/overview');
  });

  it('keeps preview hidden initially and reveals it after hover delay', async () => {
    render(<Card section={stubSection} />);
    const link = screen.getByRole('link', { name: /abrir visión general/i });
    const preview = getPreview(link);
    expect(preview).not.toBeNull();
    expect(preview).toHaveAttribute('aria-hidden', 'true');

    fireEvent.mouseEnter(link);
    await act(async () => {
      vi.advanceTimersByTime(399);
    });
    expect(getPreview(link)).toHaveAttribute('aria-hidden', 'true');

    await act(async () => {
      vi.advanceTimersByTime(2);
    });
    expect(getPreview(link)).toHaveAttribute('aria-hidden', 'false');
  });

  it('cancels the preview when mouse leaves before delay elapses', async () => {
    render(<Card section={stubSection} />);
    const link = screen.getByRole('link', { name: /abrir visión general/i });
    fireEvent.mouseEnter(link);
    await act(async () => {
      vi.advanceTimersByTime(200);
    });
    fireEvent.mouseLeave(link);
    await act(async () => {
      vi.advanceTimersByTime(500);
    });
    expect(getPreview(link)).toHaveAttribute('aria-hidden', 'true');
  });

  it('renders the rank number when provided', () => {
    const { container } = render(<Card section={stubSection} rank={3} />);
    expect(container.textContent).toContain('3');
  });
});
