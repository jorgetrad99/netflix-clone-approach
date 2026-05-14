import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { sectionsBySlug, SECTION_SLUGS } from '@/content/generated/content';
import { TopNav } from '@/components/layout/TopNav';
import { WatchHeader } from '@/components/watch/WatchHeader';
import { ScrollProgressBar } from '@/components/watch/ScrollProgressBar';
import { BlockRenderer } from '@/components/watch/BlockRenderer';

interface PageProps {
  params: Promise<{ slug: string }>;
}

export function generateStaticParams() {
  return SECTION_SLUGS.map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: Readonly<PageProps>): Promise<Metadata> {
  const { slug } = await params;
  const section = sectionsBySlug[slug];
  if (!section) return { title: 'No encontrado' };
  return {
    title: `Reproducir · ${section.title}`,
    description: section.excerpt,
    robots: { index: false, follow: true },
  };
}

export default async function WatchPage({ params }: Readonly<PageProps>) {
  const { slug } = await params;
  const section = sectionsBySlug[slug];
  if (!section) notFound();

  return (
    <>
      <TopNav />
      <ScrollProgressBar />
      <main className="bg-bg pt-14">
        <WatchHeader section={section} />

        <article className="mx-auto max-w-5xl px-4 py-10 md:px-8">
          {section.intro.length > 0 && (
            <section aria-labelledby="intro" className="space-y-6">
              <h2 id="intro" className="sr-only">
                Introducción
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
                  Episodio {ep.number} · {ep.runtime} min
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
            <span>Fin del capítulo · {section.meta.runtime} min de lectura</span>
            <a href="#" className="hover:text-fg">
              Volver arriba ↑
            </a>
          </footer>
        </article>
      </main>
    </>
  );
}
