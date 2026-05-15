'use client';

import { useDictionary } from '@/i18n/LocaleProvider';

export function SkipLink() {
  const dict = useDictionary();
  return (
    <a
      href="#main-content"
      className="bg-brand sr-only z-50 rounded px-4 py-2 text-sm font-semibold text-white focus:not-sr-only focus:fixed focus:top-3 focus:left-3 focus:outline-2 focus:outline-white"
    >
      {dict.nav.skipToContent}
    </a>
  );
}
