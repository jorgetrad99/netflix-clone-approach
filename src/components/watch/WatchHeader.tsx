import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import type { Section } from '@/content/types';

interface WatchHeaderProps {
  section: Section;
}

export function WatchHeader({ section }: Readonly<WatchHeaderProps>) {
  return (
    <div className="border-border border-b">
      <div className="mx-auto flex max-w-5xl items-center justify-between px-4 py-6 md:px-8">
        <div>
          <p className="text-fg-subtle text-xs tracking-widest uppercase">
            Capítulo {section.number} · {section.category}
          </p>
          <h1 className="mt-1 text-2xl font-bold tracking-tight md:text-3xl">{section.title}</h1>
          <p className="text-fg-muted mt-1 text-sm md:text-base">{section.hero.tagline}</p>
        </div>
        <Link
          href={`/title/${section.slug}`}
          className="text-fg-muted hover:text-fg inline-flex items-center gap-2 text-sm transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
          Detalle
        </Link>
      </div>
    </div>
  );
}
