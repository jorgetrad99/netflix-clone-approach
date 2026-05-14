export default function HomePage() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center px-6 py-24">
      <div className="max-w-2xl text-center">
        <p className="text-brand mb-4 text-sm font-bold tracking-[0.3em] uppercase">NF · DOCS</p>
        <h1 className="text-5xl font-black tracking-tight md:text-7xl">Netflix Docs Viewer</h1>
        <p className="text-fg-muted mt-6 text-lg md:text-xl">
          Plan maestro del Netflix Clone, presentado con la estética y los patrones de navegación de
          Netflix.
        </p>
        <div className="mt-10 flex items-center justify-center gap-3 text-sm">
          <span className="bg-bg-elevated text-fg-muted rounded-full px-3 py-1">
            Phase 0 · Foundation
          </span>
        </div>
      </div>
    </main>
  );
}
