import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { sectionsBySlug, SECTION_SLUGS } from '@/content/generated/content';
import { TopNav } from '@/components/layout/TopNav';
import { TitleHero } from '@/components/title/TitleHero';
import { Intro } from '@/components/title/Intro';
import { EpisodeList } from '@/components/title/EpisodeList';
import { MoreLikeThis } from '@/components/title/MoreLikeThis';
import { LOCALES, isLocale } from '@/i18n/config';
import { getDictionary } from '@/i18n/get-dictionary';

interface PageProps {
  params: Promise<{ locale: string; slug: string }>;
}

export function generateStaticParams() {
  return LOCALES.flatMap((locale) => SECTION_SLUGS.map((slug) => ({ locale, slug })));
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
  const { locale, slug } = await params;
  if (!isLocale(locale)) notFound();
  const section = sectionsBySlug[slug];
  if (!section) notFound();
  const dict = getDictionary(locale);

  return (
    <>
      <TopNav />
      <main id="main-content">
        <TitleHero section={section} locale={locale} dict={dict} />
        <Intro section={section} dict={dict} />
        <EpisodeList section={section} locale={locale} dict={dict} />
        <MoreLikeThis current={section} locale={locale} dict={dict} />
      </main>
    </>
  );
}
