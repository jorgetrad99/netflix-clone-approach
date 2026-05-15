'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { Sparkles } from 'lucide-react';
import type { SearchHit } from '@/lib/search';
import { getSearchEngine } from '@/lib/search';
import type { SearchDoc, Section } from '@/content/types';
import { useDictionary, useLocale } from '@/i18n/LocaleProvider';

interface SearchResultsProps {
  query: string;
  recommended: Section[];
}

export function SearchResults({ query, recommended }: Readonly<SearchResultsProps>) {
  const dict = useDictionary();
  const locale = useLocale();
  const [hitsByQuery, setHitsByQuery] = useState<{ q: string; hits: SearchHit[] } | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!query) return;
    let cancelled = false;
    getSearchEngine()
      .then((engine) => {
        if (!cancelled) setHitsByQuery({ q: query, hits: engine(query, 30) });
      })
      .catch((e: unknown) => {
        if (!cancelled) setError(e instanceof Error ? e.message : 'search failed');
      });
    return () => {
      cancelled = true;
    };
  }, [query]);

  const hits = query && hitsByQuery?.q === query ? hitsByQuery.hits : null;

  if (error) {
    return (
      <div role="alert" className="text-fg-muted py-12 text-center">
        {dict.search.error(error)}
      </div>
    );
  }

  if (!query) {
    return (
      <section aria-labelledby="recommended-heading" className="space-y-6">
        <div className="flex items-center gap-2">
          <Sparkles className="text-brand h-5 w-5" />
          <h2 id="recommended-heading" className="text-2xl font-bold tracking-tight">
            {dict.search.recommendedHeading}
          </h2>
        </div>
        <p className="text-fg-muted">{dict.search.recommendedIntro}</p>
        <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {recommended.map((s) => (
            <li key={s.id}>
              <Link
                href={`/${locale}/title/${s.slug}`}
                className="bg-bg-elevated hover:bg-bg-elevated/70 focus-visible:outline-brand block rounded-md p-4 transition-colors outline-none focus-visible:outline-2"
              >
                <p className="text-fg-subtle text-xs tracking-widest uppercase">
                  {s.category}
                  {s.meta.rank != null && ` · ${dict.title.rankBadge(s.meta.rank)}`}
                </p>
                <p className="mt-1 text-lg font-semibold">{s.title}</p>
                <p className="text-fg-muted mt-1 line-clamp-2 text-sm">{s.hero.tagline}</p>
              </Link>
            </li>
          ))}
        </ul>
      </section>
    );
  }

  if (hits == null) {
    return (
      <output className="text-fg-muted block py-12 text-center" aria-busy>
        {dict.search.loading}
      </output>
    );
  }

  if (hits.length === 0) {
    return (
      <section className="space-y-6 py-8">
        <p className="text-fg-muted text-lg">{dict.search.noResults(query)}</p>
        <Recommended sections={recommended} title={dict.search.maybe} locale={locale} />
      </section>
    );
  }

  return (
    <section aria-label={`${dict.search.pageTitleResults}: ${query}`}>
      <p className="text-fg-muted mb-6 text-sm">{dict.search.resultsCount(hits.length, query)}</p>
      <ul className="space-y-3">
        {hits.map(({ doc }) => (
          <li key={doc.id}>
            <ResultLink doc={doc} locale={locale} episodeBadge={dict.search.episodeBadge} />
          </li>
        ))}
      </ul>
    </section>
  );
}

interface ResultLinkProps {
  doc: SearchDoc;
  locale: string;
  episodeBadge: string;
}

function ResultLink({ doc, locale, episodeBadge }: Readonly<ResultLinkProps>) {
  const href = doc.episodeId
    ? `/${locale}/watch/${doc.sectionId}#ep-${doc.episodeId.split('/')[1]}`
    : `/${locale}/title/${doc.sectionId}`;
  return (
    <Link
      href={href}
      className="bg-bg-elevated/40 hover:bg-bg-elevated focus-visible:outline-brand block rounded-md p-4 transition-colors outline-none focus-visible:outline-2"
    >
      <p className="text-fg-subtle text-xs tracking-widest uppercase">
        {doc.category} {doc.episodeId && episodeBadge}
      </p>
      <p className="mt-1 text-base font-semibold md:text-lg">{doc.title}</p>
      {doc.excerpt && <p className="text-fg-muted mt-1 line-clamp-2 text-sm">{doc.excerpt}</p>}
    </Link>
  );
}

interface RecommendedProps {
  sections: Section[];
  title: string;
  locale: string;
}

function Recommended({ sections, title, locale }: Readonly<RecommendedProps>) {
  return (
    <div>
      <h3 className="mb-3 text-lg font-semibold">{title}</h3>
      <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {sections.map((s) => (
          <li key={s.id}>
            <Link
              href={`/${locale}/title/${s.slug}`}
              className="bg-bg-elevated hover:bg-bg-elevated/70 block rounded-md p-4"
            >
              <p className="text-fg-subtle text-xs tracking-widest uppercase">{s.category}</p>
              <p className="mt-1 font-semibold">{s.title}</p>
              <p className="text-fg-muted mt-1 line-clamp-2 text-sm">{s.hero.tagline}</p>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
