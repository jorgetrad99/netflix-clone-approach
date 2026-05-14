import type { Section } from '@/content/types';
import { Card } from './Card';
import { cn } from '@/lib/utils/cn';

interface RowProps {
  title: string;
  sections: Section[];
  variant?: 'default' | 'top10';
  className?: string;
}

export function Row({ title, sections, variant = 'default', className }: Readonly<RowProps>) {
  if (sections.length === 0) return null;
  return (
    <section aria-labelledby={`row-${slugify(title)}`} className={cn('relative', className)}>
      <h2
        id={`row-${slugify(title)}`}
        className="mb-3 px-4 text-lg font-semibold tracking-tight md:px-8 md:text-xl"
      >
        {title}
      </h2>
      <div
        className={cn(
          'flex scrollbar-none gap-3 overflow-x-auto px-4 pt-2 pb-12 md:px-8',
          variant === 'top10' && 'gap-2 md:gap-4',
        )}
      >
        {sections.map((section, idx) => (
          <Card
            key={section.id}
            section={section}
            rank={variant === 'top10' ? idx + 1 : undefined}
          />
        ))}
      </div>
    </section>
  );
}

function slugify(s: string): string {
  return s
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}
