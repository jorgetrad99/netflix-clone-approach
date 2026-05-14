export function DiagramSkeleton() {
  return (
    <div
      role="status"
      aria-label="Cargando diagrama"
      className="border-border bg-bg-elevated/40 flex aspect-video w-full items-center justify-center rounded-md border"
    >
      <div className="text-fg-muted flex flex-col items-center gap-3 text-sm">
        <span className="bg-bg-elevated relative flex h-12 w-12 overflow-hidden rounded-full">
          <span className="animate-shimmer absolute inset-0 bg-linear-to-r from-transparent via-white/20 to-transparent" />
        </span>
        Renderizando diagrama
      </div>
    </div>
  );
}
