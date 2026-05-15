import { sections } from '@/content/generated/content';
import { Row } from '@/components/browse/Row';
import type { Section } from '@/content/types';
import type { Locale } from '@/i18n/config';
import type { Dictionary } from '@/i18n/dictionaries/es';

interface MoreLikeThisProps {
  current: Section;
  locale: Locale;
  dict: Dictionary;
  limit?: number;
}

export function MoreLikeThis({ current, locale, dict, limit = 6 }: Readonly<MoreLikeThisProps>) {
  const related = sections
    .filter((s) => s.category === current.category && s.id !== current.id)
    .slice(0, limit);
  if (related.length === 0) return null;
  return (
    <div className="mx-auto max-w-7xl pb-20">
      <Row title={dict.title.moreLikeThis} sections={related} locale={locale} />
    </div>
  );
}
