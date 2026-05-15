import type { Block, Section } from '@/content/types';
import type { Dictionary } from '@/i18n/dictionaries/es';

interface IntroProps {
  section: Section;
  dict: Dictionary;
}

export function Intro({ section, dict }: Readonly<IntroProps>) {
  const proseBlocks = section.intro.filter(
    (b): b is Extract<Block, { kind: 'prose' }> => b.kind === 'prose',
  );
  if (proseBlocks.length === 0) return null;

  return (
    <section aria-labelledby="intro-heading" className="mx-auto max-w-7xl px-4 py-10 md:px-8">
      <h2 id="intro-heading" className="sr-only">
        {dict.title.summary}
      </h2>
      <div className="grid gap-10 md:grid-cols-[2fr_1fr]">
        <div className="docs-prose text-fg-muted max-w-3xl text-base leading-relaxed md:text-lg">
          {proseBlocks.map((block, i) => (
            <div
              key={`${section.id}-intro-${i}`}
              dangerouslySetInnerHTML={{ __html: block.html }}
            />
          ))}
        </div>
        <aside className="text-fg-muted space-y-3 text-sm">
          <SidebarRow label={dict.title.sidebar.category} value={section.category} />
          <SidebarRow label={dict.title.sidebar.chapter} value={String(section.number)} />
          <SidebarRow
            label={dict.title.sidebar.readingTime}
            value={dict.title.runtimeMinutes(section.meta.runtime)}
          />
          {section.meta.rank != null && (
            <SidebarRow label={dict.title.sidebar.top10} value={`#${section.meta.rank}`} />
          )}
          {section.meta.badges.length > 0 && (
            <SidebarRow label={dict.title.sidebar.tags} value={section.meta.badges.join(' · ')} />
          )}
        </aside>
      </div>
    </section>
  );
}

function SidebarRow({ label, value }: Readonly<{ label: string; value: string }>) {
  return (
    <div className="border-border flex justify-between border-b pb-2">
      <span className="text-fg-subtle text-xs tracking-widest uppercase">{label}</span>
      <span className="text-fg text-sm font-medium">{value}</span>
    </div>
  );
}
