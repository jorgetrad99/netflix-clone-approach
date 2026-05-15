import Link from 'next/link';
import { Play, Info } from 'lucide-react';
import type { Section } from '@/content/types';
import { categoryLabel, localizedSection } from '@/content/localized';
import type { Locale } from '@/i18n/config';
import type { Dictionary } from '@/i18n/dictionaries/es';
import { HeroBackdrop } from '@/components/poster/HeroBackdrop';
import { AddToListButton } from '@/components/my-list/AddToListButton';

interface TitleHeroProps {
  section: Section;
  locale: Locale;
  dict: Dictionary;
}

export function TitleHero({ section, locale, dict }: Readonly<TitleHeroProps>) {
  const loc = localizedSection(section, locale);
  const totalEpisodes = loc.episodes.length;
  return (
    <header className="relative h-[80vh] min-h-150 w-full overflow-hidden">
      <HeroBackdrop section={section} locale={locale} />
      <div className="from-bg via-bg/40 absolute inset-0 -z-10 bg-linear-to-t to-transparent" />
      <div className="from-bg via-bg/30 absolute inset-0 -z-10 bg-linear-to-r to-transparent" />

      <div className="mx-auto flex h-full max-w-7xl flex-col justify-end px-4 pb-16 md:px-8 md:pb-24">
        <p className="text-fg-muted text-xs font-bold tracking-[0.3em] uppercase">
          {dict.title.chapter(section.number, categoryLabel(section.category, dict))}
        </p>
        <h1 className="mt-3 max-w-3xl text-4xl font-black tracking-tight md:text-6xl">
          {loc.title}
        </h1>
        <p className="text-fg mt-4 max-w-2xl text-lg md:text-xl">{loc.tagline}</p>

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

        <p className="text-fg-muted mt-4 max-w-2xl text-base md:text-lg">{loc.excerpt}</p>

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
            aria-label={dict.title.moreInfoFor(loc.title)}
          >
            <Info className="h-5 w-5" />
            {dict.title.moreInfo}
          </button>
          <AddToListButton section={section} />
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
