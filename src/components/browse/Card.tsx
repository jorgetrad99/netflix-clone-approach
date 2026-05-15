'use client';

import Link from 'next/link';
import { useEffect, useRef, useState } from 'react';
import type { Section } from '@/content/types';
import { localizedSection } from '@/content/localized';
import type { Locale } from '@/i18n/config';
import { useDictionary } from '@/i18n/LocaleProvider';
import { PosterCanvas } from '@/components/poster/PosterCanvas';
import { CardPreview } from './CardPreview';
import { cn } from '@/lib/utils/cn';

const PREVIEW_DELAY_MS = 400;

interface CardProps {
  section: Section;
  locale: Locale;
  className?: string;
  rank?: number;
}

export function Card({ section, locale, className, rank }: Readonly<CardProps>) {
  const [showPreview, setShowPreview] = useState(false);
  const dict = useDictionary();
  const loc = localizedSection(section, locale);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const open = () => {
    if (timer.current) clearTimeout(timer.current);
    timer.current = setTimeout(() => setShowPreview(true), PREVIEW_DELAY_MS);
  };
  const close = () => {
    if (timer.current) clearTimeout(timer.current);
    setShowPreview(false);
  };

  useEffect(
    () => () => {
      if (timer.current) clearTimeout(timer.current);
    },
    [],
  );

  return (
    <div className={cn('group relative shrink-0', className)}>
      {rank != null && (
        <span
          aria-hidden
          className="text-fg-subtle absolute -bottom-2 -left-1 z-0 font-black tracking-tighter select-none"
          style={{
            fontSize: 'clamp(5rem, 10vw, 9rem)',
            WebkitTextStroke: '2px var(--color-bg-elevated)',
            color: 'transparent',
            lineHeight: 1,
          }}
        >
          {rank}
        </span>
      )}
      <Link
        href={`/${locale}/title/${section.slug}`}
        aria-label={dict.title.moreInfoFor(loc.title)}
        data-testid="section-card"
        onMouseEnter={open}
        onMouseLeave={close}
        onFocus={open}
        onBlur={close}
        className={cn(
          'rounded-card relative block aspect-video w-56 overflow-hidden md:w-64',
          'transition-transform duration-300 ease-[cubic-bezier(0.4,0,0.2,1)] outline-none',
          'motion-safe:hover:scale-110 motion-safe:focus-visible:scale-110',
          'focus-visible:ring-brand focus-visible:ring-2',
          'group-hover:z-30',
          rank != null && 'ml-16',
        )}
      >
        <PosterCanvas spec={section.hero.poster} />
        {/* Always-visible title strip — fades when preview opens */}
        <div
          aria-hidden
          className={cn(
            'pointer-events-none absolute inset-x-0 bottom-0 px-3 pt-8 pb-2',
            'bg-linear-to-t from-black/85 via-black/45 to-transparent',
            'transition-opacity duration-200',
            showPreview && 'opacity-0',
          )}
        >
          <p className="line-clamp-2 text-sm leading-tight font-semibold text-white drop-shadow-sm">
            {loc.title}
          </p>
        </div>
        <CardPreview section={section} visible={showPreview} dict={dict} locale={locale} />
      </Link>
    </div>
  );
}
