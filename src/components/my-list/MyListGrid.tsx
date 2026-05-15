'use client';

import Link from 'next/link';
import { Trash2 } from 'lucide-react';
import { sectionsById } from '@/content/generated/content';
import { Card } from '@/components/browse/Card';
import { useDictionary, useLocale } from '@/i18n/LocaleProvider';
import { useMyListHydrated, useMyListIds, useMyListStore } from '@/lib/store/my-list';
import type { Section, SectionId } from '@/content/types';

export function MyListGrid() {
  const dict = useDictionary();
  const locale = useLocale();
  const ids = useMyListIds();
  const hydrated = useMyListHydrated();
  const clear = useMyListStore((s) => s.clear);

  if (!hydrated) {
    return (
      <output className="text-fg-muted block py-12 text-center" aria-busy>
        {dict.myList.loading}
      </output>
    );
  }

  const items = ids
    .map((id) => sectionsById[id as SectionId])
    .filter((s): s is Section => Boolean(s));

  if (items.length === 0) {
    return (
      <section className="border-border bg-bg-elevated/30 mt-6 rounded-lg border px-6 py-16 text-center">
        <h2 className="text-2xl font-bold tracking-tight">{dict.myList.emptyTitle}</h2>
        <p className="text-fg-muted mx-auto mt-3 max-w-xl text-base">{dict.myList.emptyBody}</p>
        <Link
          href={`/${locale}`}
          className="hover:bg-fg-muted mt-6 inline-flex items-center gap-2 rounded bg-white px-5 py-2 text-sm font-semibold text-black transition"
        >
          {dict.myList.emptyCta}
        </Link>
      </section>
    );
  }

  return (
    <section aria-label={dict.myList.pageTitle}>
      <div className="mb-4 flex items-center justify-between">
        <p className="text-fg-muted text-sm">{dict.myList.headingWithCount(items.length)}</p>
        <button
          type="button"
          onClick={() => {
            if (globalThis.confirm(dict.myList.confirmClear)) clear();
          }}
          className="text-fg-muted hover:text-fg inline-flex items-center gap-2 text-sm transition-colors"
        >
          <Trash2 className="h-4 w-4" />
          {dict.myList.clearAll}
        </button>
      </div>
      <ul className="flex flex-wrap gap-4">
        {items.map((section) => (
          <li key={section.id}>
            <Card section={section} locale={locale} />
          </li>
        ))}
      </ul>
    </section>
  );
}
