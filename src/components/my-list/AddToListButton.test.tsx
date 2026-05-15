import { describe, it, expect, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { AddToListButton } from './AddToListButton';
import { useMyListStore } from '@/lib/store/my-list';
import type { Section } from '@/content/types';

const stub: Section = {
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
  meta: { runtime: 1, badges: [] },
  excerpt: '',
  intro: [],
  episodes: [],
};

describe('<AddToListButton>', () => {
  beforeEach(() => {
    useMyListStore.setState({ ids: [] });
    globalThis.localStorage.clear();
  });

  it('starts with the "add" label and aria-pressed=false', () => {
    render(<AddToListButton section={stub} />);
    const btn = screen.getByRole('button', { name: /agregar visión general/i });
    expect(btn).toHaveAttribute('aria-pressed', 'false');
  });

  it('clicking adds the id to the store and updates label/state', () => {
    render(<AddToListButton section={stub} />);
    fireEvent.click(screen.getByRole('button'));
    expect(useMyListStore.getState().ids).toContain('overview');
    expect(screen.getByRole('button', { name: /quitar visión general/i })).toHaveAttribute(
      'aria-pressed',
      'true',
    );
  });

  it('clicking again removes the id', () => {
    render(<AddToListButton section={stub} />);
    fireEvent.click(screen.getByRole('button'));
    fireEvent.click(screen.getByRole('button'));
    expect(useMyListStore.getState().ids).not.toContain('overview');
  });
});
