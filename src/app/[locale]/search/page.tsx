import type { Metadata } from 'next';
import { Suspense } from 'react';
import { notFound } from 'next/navigation';
import { sections } from '@/content/generated/content';
import { TopNav } from '@/components/layout/TopNav';
import { SearchResults } from '@/components/search/SearchResults';
import { isLocale, LOCALES } from '@/i18n/config';
import { getDictionary } from '@/i18n/get-dictionary';
import type { Section } from '@/content/types';

export function generateStaticParams() {
  return LOCALES.map((locale) => ({ locale }));
}

export async function generateMetadata({
  params,
}: Readonly<{ params: Promise<{ locale: string }> }>): Promise<Metadata> {
  const { locale } = await params;
  const dict = isLocale(locale) ? getDictionary(locale) : getDictionary('es');
  return {
    title: dict.search.metaTitle,
    description: dict.search.metaDescription,
    robots: { index: false, follow: true },
  };
}

interface PageProps {
  params: Promise<{ locale: string }>;
  searchParams: Promise<{ q?: string }>;
}

function getRecommended(): Section[] {
  return [...sections]
    .filter((s) => s.meta.rank != null)
    .sort((a, b) => (a.meta.rank ?? 99) - (b.meta.rank ?? 99))
    .slice(0, 6);
}

export default async function SearchPage({ params, searchParams }: Readonly<PageProps>) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  const dict = getDictionary(locale);
  const { q } = await searchParams;
  const query = (q ?? '').trim();
  const recommended = getRecommended();

  return (
    <>
      <TopNav />
      <main className="bg-bg min-h-screen pt-20 pb-20">
        <div className="mx-auto max-w-5xl px-4 md:px-8">
          <h1 className="mb-2 text-3xl font-bold tracking-tight md:text-4xl">
            {query ? dict.search.pageTitleResults : dict.search.pageTitleEmpty}
          </h1>
          {query && (
            <p className="text-fg-muted mb-8 text-base">{dict.search.currentQuery(query)}</p>
          )}
          <Suspense fallback={<p className="text-fg-muted">{dict.search.loading}</p>}>
            <SearchResults query={query} recommended={recommended} />
          </Suspense>
        </div>
      </main>
    </>
  );
}
