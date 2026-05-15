'use client';

import Link from 'next/link';
import { useDictionary, useLocale } from '@/i18n/LocaleProvider';

export default function LocaleNotFound() {
  const dict = useDictionary();
  const locale = useLocale();
  return (
    <main
      id="main-content"
      className="bg-bg flex min-h-screen flex-col items-center justify-center px-6 text-center"
    >
      <p className="text-brand mb-3 text-sm font-bold tracking-[0.3em] uppercase">404</p>
      <h1 className="text-4xl font-black tracking-tight md:text-6xl">
        {dict.errors.notFoundTitle}
      </h1>
      <p className="text-fg-muted mt-4 max-w-xl text-base md:text-lg">{dict.errors.notFoundBody}</p>
      <Link
        href={`/${locale}`}
        className="hover:bg-fg-muted mt-8 inline-flex items-center rounded bg-white px-6 py-2.5 text-sm font-semibold text-black transition md:text-base"
      >
        {dict.errors.notFoundCta}
      </Link>
    </main>
  );
}
