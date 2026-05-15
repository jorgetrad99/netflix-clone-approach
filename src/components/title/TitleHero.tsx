import Link from 'next/link';
import { Play, Plus, Info } from 'lucide-react';
import type { Section } from '@/content/types';
import type { Locale } from '@/i18n/config';
import type { Dictionary } from '@/i18n/dictionaries/es';
import { PosterCanvas } from '@/components/poster/PosterCanvas';

interface TitleHeroProps {
  section: Section;
  locale: Locale;
  dict: Dictionary;
}

export function TitleHero({ section, locale, dict }: Readonly<TitleHeroProps>) {
  const totalEpisodes = section.episodes.length;
  return (
    <header className="relative h-[80vh] min-h-150 w-full overflow-hidden">
      <div aria-hidden className="absolute inset-0 -z-10">
        <PosterCanvas spec={section.hero.backdrop} variant="backdrop" />
      </div>
      <div className="from-bg via-bg/40 absolute inset-0 -z-10 bg-linear-to-t to-transparent" />
      <div className="from-bg via-bg/30 absolute inset-0 -z-10 bg-linear-to-r to-transparent" />

      <div className="mx-auto flex h-full max-w-7xl flex-col justify-end px-4 pb-16 md:px-8 md:pb-24">
        <p className="text-fg-muted text-xs font-bold tracking-[0.3em] uppercase">
          {dict.title.chapter(section.number, section.category)}
        </p>
        <h1 className="mt-3 max-w-3xl text-4xl font-black tracking-tight md:text-6xl">
          {section.title}
        </h1>
        <p className="text-fg mt-4 max-w-2xl text-lg md:text-xl">{section.hero.tagline}</p>

        <div className="text-fg-muted mt-3 flex flex-wrap items-center gap-3 text-sm">
          <span className="text-success font-semibold">{rating(section, dict)}</span>
          <span>{dict.title.runtimeMinutes(section.meta.runtime)}</span>
          {totalEpisodes > 0 && <span>{dict.title.episodes(totalEpisodes)}</span>}
          {section.meta.badges.map((b) => (
            <span
              key={b}
              className="border-border text-fg-muted rounded border px-2 py-0.5 text-xs tracking-widest uppercase"
            >
              {b}
            </span>
          ))}
        </div>

        <p className="text-fg-muted mt-4 max-w-2xl text-base md:text-lg">{section.excerpt}</p>

        <div className="mt-6 flex flex-wrap items-center gap-3">
          <Link
            href={`/${locale}/watch/${section.slug}`}
            className="hover:bg-fg-muted inline-flex items-center gap-2 rounded bg-white px-6 py-2.5 text-sm font-semibold text-black transition md:text-base"
          >
            <Play className="h-5 w-5 fill-current" strokeWidth={0} />
            {dict.title.play}
          </Link>
          <button
            type="button"
            className="hover:bg-bg-elevated/80 bg-bg-elevated/60 text-fg inline-flex items-center gap-2 rounded border border-white/30 px-6 py-2.5 text-sm font-semibold backdrop-blur transition md:text-base"
            aria-label={dict.title.moreInfoFor(section.title)}
          >
            <Info className="h-5 w-5" />
            {dict.title.moreInfo}
          </button>
          <button
            type="button"
            aria-label={dict.title.addToList(section.title)}
            className="hover:border-fg flex h-11 w-11 items-center justify-center rounded-full border border-white/40 bg-black/30 text-white backdrop-blur transition"
          >
            <Plus className="h-5 w-5" />
          </button>
        </div>
      </div>
    </header>
  );
}

function rating(section: Section, dict: Dictionary): string {
  if (section.meta.rank) return dict.title.rankBadge(section.meta.rank);
  if (section.meta.rating === 'P0') return dict.title.essential;
  if (section.meta.rating === 'P1') return dict.title.important;
  return dict.title.recommended;
}
