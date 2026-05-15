import { es, type Dictionary } from './dictionaries/es';
import { en } from './dictionaries/en';
import type { Locale } from './config';

const DICTS: Record<Locale, Dictionary> = { es, en };

export function getDictionary(locale: Locale): Dictionary {
  return DICTS[locale];
}
