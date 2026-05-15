import { Plus, Play, ChevronDown } from 'lucide-react';
import type { Section } from '@/content/types';
import type { Dictionary } from '@/i18n/dictionaries/es';
import { cn } from '@/lib/utils/cn';

interface CardPreviewProps {
  section: Section;
  visible: boolean;
  dict: Dictionary;
}

export function CardPreview({ section, visible, dict }: Readonly<CardPreviewProps>) {
  return (
    <div
      data-testid="card-preview"
      aria-hidden={!visible}
      className={cn(
        'pointer-events-none absolute inset-x-0 bottom-0 flex flex-col gap-2 p-3',
        'bg-linear-to-t from-black/90 via-black/60 to-transparent',
        'translate-y-1 opacity-0 transition-all duration-200',
        visible && 'pointer-events-auto translate-y-0 opacity-100',
      )}
    >
      <p className="text-fg-subtle text-[10px] tracking-widest uppercase">{section.category}</p>
      <p className="text-sm leading-tight font-semibold">{section.title}</p>
      <p className="text-fg-muted line-clamp-2 text-xs">{section.hero.tagline}</p>
      <div className="mt-1 flex items-center gap-2">
        <button
          type="button"
          aria-label={`${dict.title.play} ${section.title}`}
          className="hover:bg-bg-elevated flex h-7 w-7 items-center justify-center rounded-full border border-white/40 bg-white text-black transition"
        >
          <Play className="h-3.5 w-3.5 fill-current" strokeWidth={0} />
        </button>
        <button
          type="button"
          aria-label={dict.title.addToList(section.title)}
          className="hover:border-fg flex h-7 w-7 items-center justify-center rounded-full border border-white/40 text-white transition"
        >
          <Plus className="h-3.5 w-3.5" />
        </button>
        <button
          type="button"
          aria-label={dict.title.moreInfoFor(section.title)}
          className="hover:border-fg ml-auto flex h-7 w-7 items-center justify-center rounded-full border border-white/40 text-white transition"
        >
          <ChevronDown className="h-3.5 w-3.5" />
        </button>
      </div>
    </div>
  );
}
