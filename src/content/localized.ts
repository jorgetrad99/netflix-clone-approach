import type { Category, LocalizedSection, Section } from './types';
import type { Locale } from '@/i18n/config';
import type { Dictionary } from '@/i18n/dictionaries/es';

/** Returns the title/tagline/excerpt for the active locale, falling back to es. */
export function localizedSection(section: Section, locale: Locale): LocalizedSection {
  return section.localized[locale] ?? section.localized.es;
}

export function categoryLabel(category: Category, dict: Dictionary): string {
  return dict.categories[category] ?? category;
}

export interface LocalizedSectionView extends LocalizedSection {
  categoryLabel: string;
}

/** Convenience: locale-aware fields + dict-aware category label. */
export function sectionView(
  section: Section,
  locale: Locale,
  dict: Dictionary,
): LocalizedSectionView {
  return {
    ...localizedSection(section, locale),
    categoryLabel: categoryLabel(section.category, dict),
  };
}
