import { describe, it, expect } from 'vitest';
import { render, screen, act } from '@testing-library/react';
import { TopNav } from './TopNav';

describe('<TopNav>', () => {
  it('renders logo + primary nav with the expected links', () => {
    render(<TopNav />);
    expect(screen.getByRole('link', { name: /netflix docs viewer — home/i })).toBeVisible();
    expect(screen.getByRole('link', { name: /^home$/i })).toHaveAttribute('href', '/');
    expect(screen.getByRole('link', { name: /security/i })).toHaveAttribute(
      'href',
      '/browse/security',
    );
    expect(screen.getByRole('link', { name: /my list/i })).toHaveAttribute('href', '/my-list');
  });

  it('toggles the solid-background class once user scrolls past 32px', () => {
    render(<TopNav />);
    const header = screen.getByRole('banner');
    expect(header.className).toMatch(/from-black\/80/);

    act(() => {
      window.scrollY = 200;
      window.dispatchEvent(new Event('scroll'));
    });
    expect(header.className).toMatch(/backdrop-blur/);
  });
});
