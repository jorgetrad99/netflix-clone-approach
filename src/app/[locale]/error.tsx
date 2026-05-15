'use client';

import Link from 'next/link';
import { useEffect } from 'react';
import { useDictionary, useLocale } from '@/i18n/LocaleProvider';

interface ErrorProps {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function LocaleError({ error, reset }: Readonly<ErrorProps>) {
  const dict = useDictionary();
  const locale = useLocale();

  useEffect(() => {
    console.error('LocaleError boundary captured:', error);
  }, [error]);

  return (
    <main
      id="main-content"
      className="bg-bg flex min-h-screen flex-col items-center justify-center px-6 text-center"
    >
      <p className="text-brand mb-3 text-sm font-bold tracking-[0.3em] uppercase">Error</p>
      <h1 className="text-4xl font-black tracking-tight md:text-6xl">{dict.errors.fatalTitle}</h1>
      <p className="text-fg-muted mt-4 max-w-xl text-base md:text-lg">{dict.errors.fatalBody}</p>
      <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
        <button
          type="button"
          onClick={reset}
          className="hover:bg-fg-muted inline-flex items-center rounded bg-white px-6 py-2.5 text-sm font-semibold text-black transition md:text-base"
        >
          {dict.errors.fatalRetry}
        </button>
        <Link
          href={`/${locale}`}
          className="hover:bg-bg-elevated/80 bg-bg-elevated/60 text-fg inline-flex items-center rounded border border-white/30 px-6 py-2.5 text-sm font-semibold backdrop-blur transition md:text-base"
        >
          {dict.errors.fatalHome}
        </Link>
      </div>
    </main>
  );
}
