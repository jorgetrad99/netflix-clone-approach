import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import HomePage from './page';

describe('<HomePage>', () => {
  it('renders the featured hero with the overview tagline', () => {
    render(<HomePage />);
    expect(screen.getByRole('heading', { level: 1, name: /visión general/i })).toBeVisible();
  });

  it('shows at least 4 distinct rows', () => {
    render(<HomePage />);
    const rows = screen.getAllByRole('heading', { level: 2 });
    expect(rows.length).toBeGreaterThanOrEqual(4);
  });

  it('renders the Top 10 row', () => {
    render(<HomePage />);
    expect(screen.getByRole('heading', { level: 2, name: /top 10/i })).toBeVisible();
  });
});
