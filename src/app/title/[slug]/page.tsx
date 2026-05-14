import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { sectionsBySlug, SECTION_SLUGS } from '@/content/generated/content';
import { TopNav } from '@/components/layout/TopNav';
import { TitleHero } from '@/components/title/TitleHero';
import { Intro } from '@/components/title/Intro';
import { EpisodeList } from '@/components/title/EpisodeList';
import { MoreLikeThis } from '@/components/title/MoreLikeThis';

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
    title: section.title,
    description: section.excerpt,
    openGraph: {
      title: section.title,
      description: section.excerpt,
      type: 'video.tv_show',
    },
    twitter: {
      card: 'summary_large_image',
      title: section.title,
      description: section.excerpt,
    },
  };
}

export default async function TitlePage({ params }: Readonly<PageProps>) {
  const { slug } = await params;
  const section = sectionsBySlug[slug];
  if (!section) notFound();

  return (
    <>
      <TopNav />
      <main>
        <TitleHero section={section} />
        <Intro section={section} />
        <EpisodeList section={section} />
        <MoreLikeThis current={section} />
      </main>
    </>
  );
}
