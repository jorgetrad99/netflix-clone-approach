import { sections } from '@/content/generated/content';

export default function HomePage() {
  const totalEpisodes = sections.reduce((n, s) => n + s.episodes.length, 0);

  return (
    <main className="flex min-h-screen flex-col items-center justify-center px-6 py-24">
      <div className="max-w-3xl text-center">
        <p className="text-brand mb-4 text-sm font-bold tracking-[0.3em] uppercase">NF · DOCS</p>
        <h1 className="text-5xl font-black tracking-tight md:text-7xl">Netflix Docs Viewer</h1>
        <p className="text-fg-muted mt-6 text-lg md:text-xl">
          Plan maestro del Netflix Clone, presentado con la estética y los patrones de navegación de
          Netflix.
        </p>
        <div className="mt-10 flex flex-wrap items-center justify-center gap-3 text-sm">
          <span className="bg-bg-elevated text-fg-muted rounded-full px-3 py-1">
            Phase 1 · Content Pipeline
          </span>
          <span className="bg-bg-elevated text-fg-muted rounded-full px-3 py-1">
            {sections.length} secciones
          </span>
          <span className="bg-bg-elevated text-fg-muted rounded-full px-3 py-1">
            {totalEpisodes} episodios
          </span>
        </div>

        <ul className="mt-12 grid grid-cols-1 gap-3 text-left sm:grid-cols-2">
          {sections.map((s) => (
            <li
              key={s.id}
              className="bg-bg-elevated border-border rounded-md border px-4 py-3"
              data-testid="section-card"
            >
              <p className="text-fg-subtle text-xs tracking-widest uppercase">{s.category}</p>
              <p className="mt-1 font-semibold">{s.title}</p>
              <p className="text-fg-muted mt-1 line-clamp-2 text-sm">{s.hero.tagline}</p>
            </li>
          ))}
        </ul>
      </div>
    </main>
  );
}
