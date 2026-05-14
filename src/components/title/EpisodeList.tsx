import Link from 'next/link';
import { Play } from 'lucide-react';
import type { Episode, Section } from '@/content/types';
import { cn } from '@/lib/utils/cn';

interface EpisodeListProps {
  section: Section;
}

export function EpisodeList({ section }: Readonly<EpisodeListProps>) {
  if (section.episodes.length === 0) {
    return (
      <section aria-labelledby="episodes-heading" className="mx-auto max-w-7xl px-4 py-10 md:px-8">
        <h2 id="episodes-heading" className="text-2xl font-bold tracking-tight">
          Sin episodios
        </h2>
        <p className="text-fg-muted mt-2 text-sm">
          Esta sección no se subdivide; el contenido completo está en el reproductor.
        </p>
      </section>
    );
  }

  return (
    <section aria-labelledby="episodes-heading" className="mx-auto max-w-7xl px-4 py-10 md:px-8">
      <div className="mb-6 flex items-end justify-between">
        <h2 id="episodes-heading" className="text-2xl font-bold tracking-tight md:text-3xl">
          Episodios
        </h2>
        <span className="text-fg-muted text-sm">
          Temporada 1 · {section.episodes.length} episodios
        </span>
      </div>
      <ol className="border-border divide-border divide-y border-y">
        {section.episodes.map((ep) => (
          <EpisodeRow key={ep.id} episode={ep} sectionSlug={section.slug} />
        ))}
      </ol>
    </section>
  );
}

interface EpisodeRowProps {
  episode: Episode;
  sectionSlug: string;
}

function EpisodeRow({ episode, sectionSlug }: Readonly<EpisodeRowProps>) {
  return (
    <li>
      <Link
        href={`/watch/${sectionSlug}#ep-${episode.number}`}
        className={cn(
          'group flex items-center gap-4 px-2 py-4 transition-colors',
          'hover:bg-bg-elevated focus-visible:bg-bg-elevated outline-none',
        )}
      >
        <span className="text-fg-subtle w-12 shrink-0 text-center text-2xl font-bold tabular-nums md:text-3xl">
          {episode.number}
        </span>
        <span
          className={cn(
            'border-border bg-bg-elevated relative flex h-16 w-28 shrink-0 items-center justify-center overflow-hidden rounded border md:h-20 md:w-36',
            'group-hover:border-fg group-focus-visible:border-fg transition-colors',
          )}
          aria-hidden
        >
          <Play
            className="h-6 w-6 text-white/40 transition-colors group-hover:text-white group-focus-visible:text-white"
            strokeWidth={0}
            fill="currentColor"
          />
        </span>
        <div className="flex-1">
          <div className="flex flex-wrap items-baseline gap-x-3">
            <h3 className="text-base font-semibold md:text-lg">{episode.title}</h3>
            <span className="text-fg-subtle text-sm">{episode.runtime} min</span>
          </div>
          <p className="text-fg-muted mt-1 line-clamp-2 max-w-3xl text-sm">
            {episode.blocks.length} {episode.blocks.length === 1 ? 'bloque' : 'bloques'} ·{' '}
            {countBlocks(episode, 'mermaid') > 0 &&
              `${countBlocks(episode, 'mermaid')} diagrama${
                countBlocks(episode, 'mermaid') === 1 ? '' : 's'
              } · `}
            {countBlocks(episode, 'code') > 0 &&
              `${countBlocks(episode, 'code')} ejemplo${
                countBlocks(episode, 'code') === 1 ? '' : 's'
              } de código`}
            {countBlocks(episode, 'code') === 0 && countBlocks(episode, 'mermaid') === 0 && 'prosa'}
          </p>
        </div>
      </Link>
    </li>
  );
}

function countBlocks(episode: Episode, kind: 'mermaid' | 'code'): number {
  return episode.blocks.filter((b) => b.kind === kind).length;
}
