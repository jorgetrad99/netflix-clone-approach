import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import HomePage from './page';
import { sections } from '@/content/generated/content';

describe('<HomePage>', () => {
  it('renders the brand title', () => {
    render(<HomePage />);
    expect(screen.getByRole('heading', { level: 1, name: /netflix docs viewer/i })).toBeVisible();
  });

  it('renders one card per parsed section', () => {
    render(<HomePage />);
    expect(screen.getAllByTestId('section-card')).toHaveLength(sections.length);
  });

  it('shows the section title for the architecture section', () => {
    render(<HomePage />);
    expect(screen.getByText(/^Arquitectura$/)).toBeVisible();
  });
});
