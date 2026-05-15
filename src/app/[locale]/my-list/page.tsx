import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { TopNav } from '@/components/layout/TopNav';
import { MyListGrid } from '@/components/my-list/MyListGrid';
import { isLocale, LOCALES } from '@/i18n/config';
import { getDictionary } from '@/i18n/get-dictionary';

export function generateStaticParams() {
  return LOCALES.map((locale) => ({ locale }));
}

export async function generateMetadata({
  params,
}: Readonly<{ params: Promise<{ locale: string }> }>): Promise<Metadata> {
  const { locale } = await params;
  const dict = isLocale(locale) ? getDictionary(locale) : getDictionary('es');
  return {
    title: dict.myList.pageTitle,
    description: dict.myList.metaDescription,
    robots: { index: false, follow: true },
  };
}

interface PageProps {
  params: Promise<{ locale: string }>;
}

export default async function MyListPage({ params }: Readonly<PageProps>) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  const dict = getDictionary(locale);

  return (
    <>
      <TopNav />
      <main className="bg-bg min-h-screen pt-20 pb-20">
        <div className="mx-auto max-w-7xl px-4 md:px-8">
          <h1 className="text-3xl font-bold tracking-tight md:text-4xl">{dict.myList.pageTitle}</h1>
          <MyListGrid />
        </div>
      </main>
    </>
  );
}
