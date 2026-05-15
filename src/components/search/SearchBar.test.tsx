import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, act, fireEvent } from '@testing-library/react';
import { SearchBar } from './SearchBar';
import { useRouter } from 'next/navigation';

describe('<SearchBar>', () => {
  let pushSpy: ReturnType<typeof vi.fn>;

  beforeEach(() => {
    vi.useFakeTimers();
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
  afterEach(() => {
    vi.useRealTimers();
  });

  it('starts collapsed; clicking the icon reveals the input', () => {
    render(<SearchBar />);
    const trigger = screen.getByRole('button', { name: /abrir búsqueda/i });
    fireEvent.click(trigger);
    expect(screen.getByRole('searchbox')).toBeVisible();
    expect(screen.getByRole('button', { name: /cerrar búsqueda/i })).toBeVisible();
  });

  it('debounces and pushes /search?q= after 200ms', async () => {
    render(<SearchBar />);
    fireEvent.click(screen.getByRole('button', { name: /abrir búsqueda/i }));
    const input = screen.getByRole('searchbox');
    fireEvent.change(input, { target: { value: 'OAuth' } });
    expect(pushSpy).not.toHaveBeenCalled();
    await act(async () => {
      vi.advanceTimersByTime(250);
    });
    expect(pushSpy).toHaveBeenCalledWith('/es/search?q=OAuth');
  });

  it('Escape closes and clears the input', () => {
    render(<SearchBar />);
    fireEvent.click(screen.getByRole('button', { name: /abrir búsqueda/i }));
    const input = screen.getByRole('searchbox') as HTMLInputElement;
    fireEvent.change(input, { target: { value: 'foo' } });
    fireEvent.keyDown(input, { key: 'Escape' });
    expect(screen.getByRole('button', { name: /abrir búsqueda/i })).toBeInTheDocument();
    expect((screen.getByRole('searchbox') as HTMLInputElement).value).toBe('');
  });

  it('Enter pushes the route immediately for non-empty query', () => {
    render(<SearchBar />);
    fireEvent.click(screen.getByRole('button', { name: /abrir búsqueda/i }));
    const input = screen.getByRole('searchbox');
    fireEvent.change(input, { target: { value: 'Mux' } });
    fireEvent.keyDown(input, { key: 'Enter' });
    expect(pushSpy).toHaveBeenCalledWith('/es/search?q=Mux');
  });
});
