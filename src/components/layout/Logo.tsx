'use client';

import Link from 'next/link';
import { useDictionary, useLocale } from '@/i18n/LocaleProvider';
import { cn } from '@/lib/utils/cn';

export function Logo({ className }: Readonly<{ className?: string }>) {
  const locale = useLocale();
  const dict = useDictionary();
  return (
    <Link
      href={`/${locale}`}
      aria-label={dict.nav.homeLink}
      className={cn(
        'text-brand text-xl font-black tracking-[0.2em] uppercase select-none',
        'hover:text-brand-hover transition-colors',
        className,
      )}
    >
      NF·DOCS
    </Link>
  );
}
