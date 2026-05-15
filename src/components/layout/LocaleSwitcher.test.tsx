import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { LocaleSwitcher } from './LocaleSwitcher';
import { useRouter, usePathname } from 'next/navigation';

describe('<LocaleSwitcher>', () => {
  let pushSpy: ReturnType<typeof vi.fn>;

  beforeEach(() => {
    pushSpy = vi.fn();
    vi.mocked(useRouter).mockReturnValue({
      push: pushSpy,
      replace: vi.fn(),
      prefetch: vi.fn(),
      back: vi.fn(),
      forward: vi.fn(),
      refresh: vi.fn(),
    });
  });

  it('marks the current locale (es) as pressed', () => {
    vi.mocked(usePathname).mockReturnValue('/es');
    render(<LocaleSwitcher />);
    const es = screen.getByRole('button', { name: /es/i });
    const en = screen.getByRole('button', { name: /en/i });
    expect(es).toHaveAttribute('aria-pressed', 'true');
    expect(en).toHaveAttribute('aria-pressed', 'false');
  });

  it('navigates to the same path under the new locale', () => {
    vi.mocked(usePathname).mockReturnValue('/es/title/flows');
    render(<LocaleSwitcher />);
    fireEvent.click(screen.getByRole('button', { name: /en/i }));
    expect(pushSpy).toHaveBeenCalledWith('/en/title/flows');
  });

  it('navigates to /en when current path is /es root', () => {
    vi.mocked(usePathname).mockReturnValue('/es');
    render(<LocaleSwitcher />);
    fireEvent.click(screen.getByRole('button', { name: /en/i }));
    expect(pushSpy).toHaveBeenCalledWith('/en');
  });

  it('does not push when clicking the current locale', () => {
    vi.mocked(usePathname).mockReturnValue('/es');
    render(<LocaleSwitcher />);
    fireEvent.click(screen.getByRole('button', { name: /es/i }));
    expect(pushSpy).not.toHaveBeenCalled();
  });
});
