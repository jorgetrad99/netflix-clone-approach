'use client';

import { usePathname, useRouter } from 'next/navigation';
import { Globe } from 'lucide-react';
import { LOCALES, type Locale } from '@/i18n/config';
import { useDictionary, useLocale } from '@/i18n/LocaleProvider';
import { cn } from '@/lib/utils/cn';

export function LocaleSwitcher() {
  const router = useRouter();
  const pathname = usePathname();
  const current = useLocale();
  const dict = useDictionary();

  const switchTo = (next: Locale) => {
    if (next === current) return;
    const stripped = pathname.replace(/^\/(es|en)(?=\/|$)/, '') || '/';
    const target = `/${next}${stripped === '/' ? '' : stripped}`;
    router.push(target);
  };

  return (
    <div className="flex items-center gap-1" aria-label={dict.nav.languageLabel}>
      <Globe aria-hidden className="text-fg-muted h-4 w-4" />
      {LOCALES.map((loc) => (
        <button
          key={loc}
          type="button"
          aria-pressed={loc === current}
          aria-label={`${dict.nav.languageSwitch}: ${loc.toUpperCase()}`}
          onClick={() => switchTo(loc)}
          className={cn(
            'rounded px-1.5 py-0.5 text-xs font-semibold tracking-widest uppercase transition-colors',
            loc === current
              ? 'text-fg'
              : 'text-fg-subtle hover:text-fg focus-visible:text-fg outline-none',
          )}
        >
          {loc}
        </button>
      ))}
    </div>
  );
}
