import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { LOCALES, isLocale, type Locale } from '@/i18n/config';
import { getDictionary } from '@/i18n/get-dictionary';
import { LocaleProvider } from '@/i18n/LocaleProvider';

interface LayoutProps {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}

export function generateStaticParams() {
  return LOCALES.map((locale) => ({ locale }));
}

export async function generateMetadata({
  params,
}: Readonly<Pick<LayoutProps, 'params'>>): Promise<Metadata> {
  const { locale } = await params;
  if (!isLocale(locale)) return {};
  const dict = getDictionary(locale);
  return {
    title: {
      default: dict.meta.siteTitle,
      template: `%s · ${dict.meta.siteTitle}`,
    },
    description: dict.meta.siteDescription,
    openGraph: {
      locale: locale === 'es' ? 'es_ES' : 'en_US',
      title: dict.meta.siteTitle,
      description: dict.meta.siteDescription,
    },
    alternates: {
      languages: {
        es: '/es',
        en: '/en',
      },
    },
  };
}

export default async function LocaleLayout({ children, params }: Readonly<LayoutProps>) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  return <LocaleProvider locale={locale as Locale}>{children}</LocaleProvider>;
}
