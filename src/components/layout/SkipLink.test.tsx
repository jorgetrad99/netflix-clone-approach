import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { SkipLink } from './SkipLink';

describe('<SkipLink>', () => {
  it('renders an anchor pointing to #main-content', () => {
    render(<SkipLink />);
    const link = screen.getByRole('link', { name: /saltar al contenido/i });
    expect(link).toHaveAttribute('href', '#main-content');
  });

  it('is visually hidden by default (sr-only) but focusable', () => {
    render(<SkipLink />);
    const link = screen.getByRole('link');
    expect(link.className).toMatch(/sr-only/);
    expect(link.className).toMatch(/focus:not-sr-only/);
  });
});
