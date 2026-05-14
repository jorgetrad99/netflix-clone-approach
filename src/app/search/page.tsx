import type { Metadata } from 'next';
import { Suspense } from 'react';
import { sections } from '@/content/generated/content';
import { TopNav } from '@/components/layout/TopNav';
import { SearchResults } from '@/components/search/SearchResults';
import type { Section } from '@/content/types';

export const metadata: Metadata = {
  title: 'Buscar',
  description: 'Buscar entre títulos y episodios del plan Netflix Clone.',
  robots: { index: false, follow: true },
};

interface PageProps {
  searchParams: Promise<{ q?: string }>;
}

function getRecommended(): Section[] {
  return [...sections]
    .filter((s) => s.meta.rank != null)
    .sort((a, b) => (a.meta.rank ?? 99) - (b.meta.rank ?? 99))
    .slice(0, 6);
}

export default async function SearchPage({ searchParams }: Readonly<PageProps>) {
  const { q } = await searchParams;
  const query = (q ?? '').trim();
  const recommended = getRecommended();

  return (
    <>
      <TopNav />
      <main className="bg-bg min-h-screen pt-20 pb-20">
        <div className="mx-auto max-w-5xl px-4 md:px-8">
          <h1 className="mb-2 text-3xl font-bold tracking-tight md:text-4xl">
            {query ? `Resultados` : 'Buscar'}
          </h1>
          {query && <p className="text-fg-muted mb-8 text-base">Búsqueda actual: “{query}”</p>}
          <Suspense fallback={<p className="text-fg-muted">Cargando…</p>}>
            <SearchResults query={query} recommended={recommended} />
          </Suspense>
        </div>
      </main>
    </>
  );
}
