'use client';

import { Search, X } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { cn } from '@/lib/utils/cn';

const DEBOUNCE_MS = 200;

export function SearchBar() {
  const router = useRouter();
  const params = useSearchParams();
  const [open, setOpen] = useState(false);
  const [value, setValue] = useState(params.get('q') ?? '');
  const inputRef = useRef<HTMLInputElement>(null);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (open) inputRef.current?.focus();
  }, [open]);

  useEffect(() => {
    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
    };
  }, []);

  const updateQuery = (next: string) => {
    setValue(next);
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => {
      const trimmed = next.trim();
      if (trimmed.length >= 2) {
        router.push(`/search?q=${encodeURIComponent(trimmed)}`);
      } else if (trimmed.length === 0 && window.location.pathname === '/search') {
        router.push('/search');
      }
    }, DEBOUNCE_MS);
  };

  const close = () => {
    setOpen(false);
    setValue('');
  };

  return (
    <div className="relative flex items-center">
      <button
        type="button"
        aria-label={open ? 'Cerrar búsqueda' : 'Abrir búsqueda'}
        onClick={() => (open ? close() : setOpen(true))}
        className="hover:text-fg text-fg-muted flex h-9 w-9 items-center justify-center transition-colors"
      >
        {open ? <X className="h-5 w-5" /> : <Search className="h-5 w-5" />}
      </button>
      <div
        className={cn(
          'overflow-hidden transition-[width] duration-200 ease-out',
          open ? 'w-56 md:w-72' : 'w-0',
        )}
      >
        <input
          ref={inputRef}
          type="search"
          role="searchbox"
          name="q"
          value={value}
          onChange={(e) => updateQuery(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Escape') close();
            if (e.key === 'Enter') {
              const trimmed = value.trim();
              if (trimmed.length > 0) router.push(`/search?q=${encodeURIComponent(trimmed)}`);
            }
          }}
          placeholder="Buscar títulos, episodios, conceptos…"
          aria-label="Buscar"
          className="bg-bg-elevated/80 text-fg placeholder:text-fg-subtle focus:ring-brand h-9 w-full rounded-sm border border-white/20 px-3 text-sm outline-none focus:ring-1 focus:ring-inset"
        />
      </div>
    </div>
  );
}
