import { sections } from '@/content/generated/content';
import { Row } from '@/components/browse/Row';
import type { Section } from '@/content/types';

interface MoreLikeThisProps {
  current: Section;
  limit?: number;
}

export function MoreLikeThis({ current, limit = 6 }: Readonly<MoreLikeThisProps>) {
  const related = sections
    .filter((s) => s.category === current.category && s.id !== current.id)
    .slice(0, limit);
  if (related.length === 0) return null;
  return (
    <div className="mx-auto max-w-7xl pb-20">
      <Row title="Más como esto" sections={related} />
    </div>
  );
}
