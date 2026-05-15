import type { Section } from '@/content/types';

/** Test factory: a Section with sane defaults. Override any field via `over`. */
export function makeSection(
  over: Partial<Section> & Pick<Section, 'id' | 'slug' | 'title'>,
): Section {
  const title = over.title;
  return {
    number: 1,
    category: 'product',
    hero: {
      tagline: 't',
      poster: { gradient: ['#000', '#fff'], icon: 'Film' },
      backdrop: { gradient: ['#000', '#fff'], icon: 'Film' },
    },
    meta: { runtime: 1, badges: [] },
    excerpt: '',
    intro: [],
    episodes: [],
    localized: {
      es: { title, tagline: 't', excerpt: '', intro: [], episodes: [] },
      en: { title: `${title} (en)`, tagline: 't (en)', excerpt: '', intro: [], episodes: [] },
    },
    ...over,
  };
}
