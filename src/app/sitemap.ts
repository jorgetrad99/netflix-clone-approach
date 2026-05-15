import type { MetadataRoute } from 'next';
import { SECTION_SLUGS } from '@/content/generated/content';
import { LOCALES } from '@/i18n/config';

const BASE = process.env.NEXT_PUBLIC_SITE_URL ?? 'http://localhost:3000';

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();

  const root: MetadataRoute.Sitemap = [
    { url: `${BASE}/`, lastModified: now, changeFrequency: 'weekly', priority: 1 },
  ];

  const localized = LOCALES.flatMap((locale) => {
    const home = {
      url: `${BASE}/${locale}`,
      lastModified: now,
      changeFrequency: 'weekly' as const,
      priority: 0.9,
      alternates: {
        languages: Object.fromEntries(LOCALES.map((l) => [l, `${BASE}/${l}`])),
      },
    };
    const titles = SECTION_SLUGS.map((slug) => ({
      url: `${BASE}/${locale}/title/${slug}`,
      lastModified: now,
      changeFrequency: 'weekly' as const,
      priority: 0.8,
      alternates: {
        languages: Object.fromEntries(LOCALES.map((l) => [l, `${BASE}/${l}/title/${slug}`])),
      },
    }));
    const watch = SECTION_SLUGS.map((slug) => ({
      url: `${BASE}/${locale}/watch/${slug}`,
      lastModified: now,
      changeFrequency: 'monthly' as const,
      priority: 0.4,
    }));
    return [home, ...titles, ...watch];
  });

  return [...root, ...localized];
}
