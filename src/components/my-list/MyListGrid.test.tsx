import { describe, it, expect, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import { MyListGrid } from './MyListGrid';
import { useMyListStore } from '@/lib/store/my-list';

describe('<MyListGrid>', () => {
  beforeEach(() => {
    useMyListStore.setState({ ids: [] });
    globalThis.localStorage.clear();
  });

  it('shows the empty state when no ids are stored', () => {
    render(<MyListGrid />);
    expect(screen.getByRole('heading', { level: 2, name: /tu lista está vacía/i })).toBeVisible();
  });

  it('renders one card per stored id', () => {
    useMyListStore.setState({ ids: ['overview', 'flows'] });
    render(<MyListGrid />);
    expect(screen.getAllByTestId('section-card')).toHaveLength(2);
  });

  it('ignores unknown ids in the store', () => {
    useMyListStore.setState({ ids: ['overview', 'not-a-real-id'] });
    render(<MyListGrid />);
    expect(screen.getAllByTestId('section-card')).toHaveLength(1);
  });
});
