import { describe, it, expect } from 'vitest';
import { render, screen, act } from '@testing-library/react';
import { TopNav } from './TopNav';

describe('<TopNav>', () => {
  it('renders logo + primary nav with locale-prefixed links', () => {
    render(<TopNav />);
    expect(screen.getByRole('link', { name: /netflix docs viewer — inicio/i })).toBeVisible();
    expect(screen.getByRole('link', { name: /^inicio$/i })).toHaveAttribute('href', '/es');
    expect(screen.getByRole('link', { name: /^seguridad$/i })).toHaveAttribute(
      'href',
      '/es/title/security',
    );
    expect(screen.getByRole('link', { name: /^componentes$/i })).toHaveAttribute(
      'href',
      '/es/title/components',
    );
  });

  it('mounts SearchBar (open trigger) and LocaleSwitcher (es+en buttons)', () => {
    render(<TopNav />);
    expect(screen.getByRole('button', { name: /abrir búsqueda/i })).toBeVisible();
    expect(screen.getByRole('button', { name: /es/i })).toBeVisible();
    expect(screen.getByRole('button', { name: /en/i })).toBeVisible();
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
