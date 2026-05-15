import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { sectionsBySlug, SECTION_SLUGS } from '@/content/generated/content';
import { TopNav } from '@/components/layout/TopNav';
import { WatchHeader } from '@/components/watch/WatchHeader';
import { ScrollProgressBar } from '@/components/watch/ScrollProgressBar';
import { BlockRenderer } from '@/components/watch/BlockRenderer';
import { LOCALES, isLocale } from '@/i18n/config';
import { getDictionary } from '@/i18n/get-dictionary';

interface PageProps {
  params: Promise<{ locale: string; slug: string }>;
}

export function generateStaticParams() {
  return LOCALES.flatMap((locale) => SECTION_SLUGS.map((slug) => ({ locale, slug })));
}

export async function generateMetadata({ params }: Readonly<PageProps>): Promise<Metadata> {
  const { locale, slug } = await params;
  const section = sectionsBySlug[slug];
  if (!section) return { title: 'No encontrado' };
  const dict = isLocale(locale) ? getDictionary(locale) : getDictionary('es');
  return {
    title: `${dict.title.play} · ${section.title}`,
    description: section.excerpt,
    robots: { index: false, follow: true },
  };
}

export default async function WatchPage({ params }: Readonly<PageProps>) {
  const { locale, slug } = await params;
  if (!isLocale(locale)) notFound();
  const section = sectionsBySlug[slug];
  if (!section) notFound();
  const dict = getDictionary(locale);

  return (
    <>
      <TopNav />
      <ScrollProgressBar />
      <main className="bg-bg pt-14">
        <WatchHeader section={section} locale={locale} dict={dict} />

        <article className="mx-auto max-w-5xl px-4 py-10 md:px-8">
          {section.intro.length > 0 && (
            <section aria-labelledby="intro" className="space-y-6">
              <h2 id="intro" className="sr-only">
                {dict.watch.introHeading}
              </h2>
              {section.intro.map((block, i) => (
                <BlockRenderer key={`intro-${i}`} block={block} />
              ))}
            </section>
          )}

          {section.episodes.map((ep) => (
            <section
              key={ep.id}
              id={`ep-${ep.number}`}
              aria-labelledby={`ep-${ep.number}-title`}
              className="border-border mt-14 scroll-mt-24 border-t pt-10"
            >
              <header className="mb-6">
                <p className="text-fg-subtle text-xs tracking-widest uppercase">
                  {dict.watch.episode(ep.number, ep.runtime)}
                </p>
                <h2
                  id={`ep-${ep.number}-title`}
                  className="mt-1 text-2xl font-bold tracking-tight md:text-3xl"
                >
                  {ep.title}
                </h2>
              </header>
              <div className="space-y-6">
                {ep.blocks.map((block, i) => (
                  <BlockRenderer key={`${ep.id}-${i}`} block={block} />
                ))}
              </div>
            </section>
          ))}

          <footer className="text-fg-subtle border-border mt-20 flex items-center justify-between border-t pt-6 text-sm">
            <span>{dict.watch.chapterEnd(section.meta.runtime)}</span>
            <a href="#" className="hover:text-fg">
              {dict.watch.backToTop}
            </a>
          </footer>
        </article>
      </main>
    </>
  );
}
