import { notFound } from 'next/navigation';
import { sections } from '@/content/generated/content';
import { TopNav } from '@/components/layout/TopNav';
import { Row } from '@/components/browse/Row';
import { isLocale } from '@/i18n/config';
import { getDictionary } from '@/i18n/get-dictionary';
import type { Section } from '@/content/types';

const FEATURED_ID = 'overview';

interface PageProps {
  params: Promise<{ locale: string }>;
}

function pickByIds(ids: readonly string[]): Section[] {
  return ids.map((id) => sections.find((s) => s.id === id)).filter((s): s is Section => Boolean(s));
}

function pickByCategory(category: Section['category']): Section[] {
  return sections.filter((s) => s.category === category);
}

function top10(): Section[] {
  return [...sections]
    .filter((s) => s.meta.rank != null)
    .sort((a, b) => (a.meta.rank ?? 0) - (b.meta.rank ?? 0))
    .slice(0, 10);
}

export default async function HomePage({ params }: Readonly<PageProps>) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  const dict = getDictionary(locale);

  const featured = sections.find((s) => s.id === FEATURED_ID) ?? sections[0]!;
  const flagship = pickByIds(['overview', 'architecture', 'flows', 'testing', 'security']);
  const top = top10();
  const architecture = pickByIds([
    'architecture',
    'data-model',
    'routes',
    'cross-cutting',
    'components',
  ]);
  const product = pickByCategory('product');

  return (
    <>
      <TopNav />
      <main id="main-content" className="pt-14">
        <section className="to-bg relative h-[60vh] min-h-105 w-full overflow-hidden bg-linear-to-b from-black/60 via-black/30">
          <div
            aria-hidden
            className="absolute inset-0 -z-10 opacity-90"
            style={{
              background: `linear-gradient(135deg, ${featured.hero.backdrop.gradient[0]} 0%, ${featured.hero.backdrop.gradient[1]} 100%)`,
            }}
          />
          <div className="from-bg via-bg/40 absolute inset-0 -z-10 bg-linear-to-r to-transparent" />
          <div className="from-bg absolute inset-x-0 bottom-0 -z-10 h-32 bg-linear-to-t to-transparent" />
          <div className="mx-auto flex h-full max-w-7xl flex-col justify-center px-4 md:px-8">
            <p className="text-brand text-sm font-bold tracking-[0.3em] uppercase">
              {dict.home.eyebrow(featured.category)}
            </p>
            <h1 className="mt-3 max-w-2xl text-4xl font-black tracking-tight md:text-6xl">
              {featured.title}
            </h1>
            <p className="text-fg-muted mt-4 max-w-xl text-base md:text-lg">
              {featured.hero.tagline}
            </p>
            <p className="text-fg-muted mt-2 max-w-xl text-sm md:text-base">{featured.excerpt}</p>
          </div>
        </section>

        <div className="bg-bg relative z-10 -mt-16 space-y-10 pb-20">
          <Row title={dict.home.rowTop10} sections={top} variant="top10" locale={locale} />
          <Row title={dict.home.rowFlagship} sections={flagship} locale={locale} />
          <Row title={dict.home.rowArchitecture} sections={architecture} locale={locale} />
          <Row title={dict.home.rowProduct} sections={product} locale={locale} />
        </div>
      </main>
    </>
  );
}
