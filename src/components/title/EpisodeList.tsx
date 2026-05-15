import Link from 'next/link';
import { Play } from 'lucide-react';
import type { Episode, Section } from '@/content/types';
import { localizedSection } from '@/content/localized';
import type { Locale } from '@/i18n/config';
import type { Dictionary } from '@/i18n/dictionaries/es';
import { cn } from '@/lib/utils/cn';

interface EpisodeListProps {
  section: Section;
  locale: Locale;
  dict: Dictionary;
}

export function EpisodeList({ section, locale, dict }: Readonly<EpisodeListProps>) {
  const loc = localizedSection(section, locale);
  if (loc.episodes.length === 0) {
    return (
      <section aria-labelledby="episodes-heading" className="mx-auto max-w-7xl px-4 py-10 md:px-8">
        <h2 id="episodes-heading" className="text-2xl font-bold tracking-tight">
          {dict.title.noEpisodes}
        </h2>
        <p className="text-fg-muted mt-2 text-sm">{dict.title.noEpisodesBody}</p>
      </section>
    );
  }

  return (
    <section aria-labelledby="episodes-heading" className="mx-auto max-w-7xl px-4 py-10 md:px-8">
      <div className="mb-6 flex items-end justify-between">
        <h2 id="episodes-heading" className="text-2xl font-bold tracking-tight md:text-3xl">
          {dict.title.episodesHeading}
        </h2>
        <span className="text-fg-muted text-sm">
          {dict.title.seasonSummary(loc.episodes.length)}
        </span>
      </div>
      <ol className="border-border divide-border divide-y border-y">
        {loc.episodes.map((ep) => (
          <EpisodeRow
            key={ep.id}
            episode={ep}
            sectionSlug={section.slug}
            locale={locale}
            dict={dict}
          />
        ))}
      </ol>
    </section>
  );
}

interface EpisodeRowProps {
  episode: Episode;
  sectionSlug: string;
  locale: Locale;
  dict: Dictionary;
}

function EpisodeRow({ episode, sectionSlug, locale, dict }: Readonly<EpisodeRowProps>) {
  const mermaidCount = episode.blocks.filter((b) => b.kind === 'mermaid').length;
  const codeCount = episode.blocks.filter((b) => b.kind === 'code').length;

  return (
    <li>
      <Link
        href={`/${locale}/watch/${sectionSlug}#ep-${episode.number}`}
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
            <span className="text-fg-subtle text-sm">
              {dict.title.runtimeMinutes(episode.runtime)}
            </span>
          </div>
          <p className="text-fg-muted mt-1 line-clamp-2 max-w-3xl text-sm">
            {summary(mermaidCount, codeCount, episode.blocks.length, dict)}
          </p>
        </div>
      </Link>
    </li>
  );
}

function summary(mermaidCount: number, codeCount: number, total: number, dict: Dictionary): string {
  const parts = [dict.title.blocksLabel(total)];
  if (mermaidCount > 0) parts.push(dict.title.diagramsLabel(mermaidCount));
  if (codeCount > 0) parts.push(dict.title.codeSamplesLabel(codeCount));
  if (mermaidCount === 0 && codeCount === 0) parts.push(dict.title.proseOnly);
  return parts.join(' · ');
}
