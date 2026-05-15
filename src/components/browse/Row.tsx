'use client';

import { useRef, useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import type { Section } from '@/content/types';
import type { Locale } from '@/i18n/config';
import { Card } from './Card';
import { cn } from '@/lib/utils/cn';

interface RowProps {
  title: string;
  sections: Section[];
  locale: Locale;
  variant?: 'default' | 'top10';
  className?: string;
}

export function Row({
  title,
  sections,
  locale,
  variant = 'default',
  className,
}: Readonly<RowProps>) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);

  const checkScroll = () => {
    if (!scrollRef.current) return;
    const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current;
    setCanScrollLeft(scrollLeft > 0);
    setCanScrollRight(scrollLeft + clientWidth < scrollWidth - 10);
  };

  useEffect(() => {
    checkScroll();
    const container = scrollRef.current;
    if (!container) return;
    container.addEventListener('scroll', checkScroll);
    window.addEventListener('resize', checkScroll);
    return () => {
      container.removeEventListener('scroll', checkScroll);
      window.removeEventListener('resize', checkScroll);
    };
  }, [sections.length]);

  const scroll = (direction: 'left' | 'right') => {
    if (!scrollRef.current) return;
    const scrollAmount = 400;
    scrollRef.current.scrollBy({
      left: direction === 'left' ? -scrollAmount : scrollAmount,
      behavior: 'smooth',
    });
  };

  if (sections.length === 0) return null;

  return (
    <section aria-labelledby={`row-${slugify(title)}`} className={cn('relative', className)}>
      <h2
        id={`row-${slugify(title)}`}
        className="mb-3 px-4 text-lg font-semibold tracking-tight md:px-8 md:text-xl"
      >
        {title}
      </h2>
      <div className="group relative">
        <div
          ref={scrollRef}
          className={cn(
            'flex scrollbar-none gap-3 overflow-x-auto px-4 pt-2 pb-12 md:px-8',
            variant === 'top10' && 'gap-2 md:gap-4',
          )}
        >
          {sections.map((section, idx) => (
            <Card
              key={section.id}
              section={section}
              locale={locale}
              rank={variant === 'top10' ? idx + 1 : undefined}
            />
          ))}
        </div>

        {canScrollLeft && (
          <button
            onClick={() => scroll('left')}
            className="hover:bg-fg/20 absolute top-1/2 left-0 z-20 -translate-y-1/2 rounded-full bg-black/40 p-2 opacity-0 backdrop-blur transition-all group-hover:opacity-100"
            aria-label="Scroll left"
          >
            <ChevronLeft className="h-6 w-6" />
          </button>
        )}

        {canScrollRight && (
          <button
            onClick={() => scroll('right')}
            className="hover:bg-fg/20 absolute top-1/2 right-0 z-20 -translate-y-1/2 rounded-full bg-black/40 p-2 opacity-0 backdrop-blur transition-all group-hover:opacity-100"
            aria-label="Scroll right"
          >
            <ChevronRight className="h-6 w-6" />
          </button>
        )}
      </div>
    </section>
  );
}

function slugify(s: string): string {
  return s
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}
