import { describe, it, expect } from 'vitest';
import { getDictionary } from './get-dictionary';
import { LOCALES } from './config';
import { es } from './dictionaries/es';
import { en } from './dictionaries/en';

describe('getDictionary', () => {
  it('returns the Spanish dictionary for "es"', () => {
    expect(getDictionary('es')).toBe(es);
  });

  it('returns the English dictionary for "en"', () => {
    expect(getDictionary('en')).toBe(en);
  });

  it('every locale has the same shape (parity check)', () => {
    const keys = (obj: unknown, prefix = ''): string[] => {
      if (obj === null || typeof obj !== 'object') return [prefix];
      return Object.entries(obj as Record<string, unknown>).flatMap(([k, v]) =>
        keys(v, prefix ? `${prefix}.${k}` : k),
      );
    };
    const esKeys = keys(es).sort();
    for (const loc of LOCALES) {
      const dict = getDictionary(loc);
      expect(keys(dict).sort()).toEqual(esKeys);
    }
  });
});
