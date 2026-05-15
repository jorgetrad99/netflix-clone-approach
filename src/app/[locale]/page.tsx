import { notFound } from 'next/navigation';
import Link from 'next/link';
import { Play, Info } from 'lucide-react';
import { sections } from '@/content/generated/content';
import { TopNav } from '@/components/layout/TopNav';
import { Row } from '@/components/browse/Row';
import { HeroBackdrop } from '@/components/poster/HeroBackdrop';
import { isLocale } from '@/i18n/config';
import { getDictionary } from '@/i18n/get-dictionary';
import { categoryLabel, localizedSection } from '@/content/localized';
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
  const featuredView = localizedSection(featured, locale);
  const featuredCategory = categoryLabel(featured.category, dict);
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
        <section className="relative h-[70vh] min-h-150 w-full overflow-hidden">
          <HeroBackdrop section={featured} locale={locale} />
          <div className="from-bg via-bg/70 absolute inset-0 -z-10 bg-linear-to-t to-transparent" />
          <div className="from-bg via-bg/40 absolute inset-0 -z-10 bg-linear-to-r to-transparent" />
          <div className="from-bg absolute inset-x-0 bottom-0 -z-10 h-32 bg-linear-to-t to-transparent" />
          <div className="mx-auto flex h-full max-w-7xl flex-col justify-end px-4 pb-16 md:px-8 md:pb-20">
            <p className="text-brand text-sm font-bold tracking-[0.3em] uppercase">
              {dict.home.eyebrow(featuredCategory)}
            </p>
            <h1 className="mt-3 max-w-3xl text-4xl font-black tracking-tight md:text-7xl">
              {featuredView.title}
            </h1>
            <p className="text-fg mt-4 max-w-2xl text-lg md:text-xl">{featuredView.tagline}</p>
            <p className="text-fg-muted mt-2 max-w-2xl text-sm md:text-base">
              {featuredView.excerpt}
            </p>
            <div className="mt-6 flex flex-wrap items-center gap-3">
              <Link
                href={`/${locale}/watch/${featured.slug}`}
                className="hover:bg-fg-muted inline-flex items-center gap-2 rounded bg-white px-6 py-2.5 text-sm font-semibold text-black transition md:text-base"
              >
                <Play className="h-5 w-5 fill-current" strokeWidth={0} />
                {dict.title.play}
              </Link>
              <Link
                href={`/${locale}/title/${featured.slug}`}
                className="hover:bg-bg-elevated/80 bg-bg-elevated/60 text-fg inline-flex items-center gap-2 rounded border border-white/30 px-6 py-2.5 text-sm font-semibold backdrop-blur transition md:text-base"
              >
                <Info className="h-5 w-5" />
                {dict.title.moreInfo}
              </Link>
            </div>
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
