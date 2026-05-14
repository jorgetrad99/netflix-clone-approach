import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import HomePage from './page';

describe('<HomePage>', () => {
  it('renders the brand title', () => {
    render(<HomePage />);
    expect(screen.getByRole('heading', { level: 1, name: /netflix docs viewer/i })).toBeVisible();
  });

  it('shows the foundation phase badge', () => {
    render(<HomePage />);
    expect(screen.getByText(/phase 0 · foundation/i)).toBeVisible();
  });
});
