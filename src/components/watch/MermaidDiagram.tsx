'use client';

import { useEffect, useRef, useState } from 'react';
import mermaid from 'mermaid';
import { Maximize2, X } from 'lucide-react';
import { cn } from '@/lib/utils/cn';

interface MermaidDiagramProps {
  source: string;
  id: string;
}

let initialized = false;
function ensureInit() {
  if (initialized) return;
  mermaid.initialize({
    startOnLoad: false,
    theme: 'dark',
    themeVariables: {
      darkMode: true,
      background: '#141414',
      primaryColor: '#1f1f1f',
      primaryTextColor: '#ffffff',
      primaryBorderColor: '#2a2a2a',
      lineColor: '#b3b3b3',
      secondaryColor: '#7a040a',
      tertiaryColor: '#220505',
      actorBkg: '#1f1f1f',
      actorBorder: '#e50914',
      actorTextColor: '#ffffff',
      noteBkgColor: '#1f1f1f',
      noteTextColor: '#b3b3b3',
      noteBorderColor: '#e50914',
      activationBkgColor: '#7a040a',
    },
    securityLevel: 'strict',
    flowchart: { curve: 'basis' },
  });
  initialized = true;
}

export default function MermaidDiagram({ source, id }: Readonly<MermaidDiagramProps>) {
  const [svg, setSvg] = useState<string>('');
  const [error, setError] = useState<string | null>(null);
  const [fullscreen, setFullscreen] = useState(false);
  const renderId = useRef(`mermaid-${id.replace(/[^a-zA-Z0-9]/g, '-')}`);

  useEffect(() => {
    let cancelled = false;
    ensureInit();
    mermaid
      .render(renderId.current, source)
      .then((result) => {
        if (!cancelled) {
          setSvg(result.svg);
          setError(null);
        }
      })
      .catch((err: unknown) => {
        if (!cancelled) {
          setError(err instanceof Error ? err.message : String(err));
        }
      });
    return () => {
      cancelled = true;
    };
  }, [source]);

  useEffect(() => {
    if (!fullscreen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setFullscreen(false);
    };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [fullscreen]);

  if (error) {
    return (
      <div
        role="alert"
        className="bg-bg-elevated border-brand text-fg-muted rounded-md border-l-4 px-4 py-3 text-sm"
      >
        <p className="text-brand mb-1 font-semibold">Error al renderizar el diagrama</p>
        <pre className="font-mono text-xs whitespace-pre-wrap">{error}</pre>
      </div>
    );
  }

  return (
    <>
      <figure
        className={cn(
          'border-border bg-bg-elevated/40 group relative overflow-hidden rounded-md border',
          'flex min-h-[12rem] items-center justify-center p-6',
        )}
        data-testid="mermaid-figure"
      >
        {svg ? (
          <div
            className="mermaid-host w-full max-w-full overflow-x-auto"
            dangerouslySetInnerHTML={{ __html: svg }}
          />
        ) : (
          <div className="text-fg-muted text-sm">Procesando…</div>
        )}
        <button
          type="button"
          onClick={() => setFullscreen(true)}
          aria-label="Ver diagrama en pantalla completa"
          className="bg-bg/80 hover:bg-bg absolute top-3 right-3 rounded-md p-2 opacity-0 transition group-hover:opacity-100 focus-visible:opacity-100"
        >
          <Maximize2 className="h-4 w-4" />
        </button>
      </figure>

      {fullscreen && (
        <dialog
          open
          aria-label="Diagrama en pantalla completa"
          className="bg-bg/95 fixed inset-0 z-50 flex h-screen max-h-screen w-screen max-w-screen items-center justify-center p-6 backdrop-blur-sm"
        >
          <button
            type="button"
            onClick={() => setFullscreen(false)}
            aria-label="Cerrar pantalla completa"
            className="bg-bg-elevated hover:bg-bg-elevated/70 absolute top-4 right-4 rounded-full p-2"
          >
            <X className="h-5 w-5" />
          </button>
          <div
            className="mermaid-host max-h-[90vh] max-w-7xl overflow-auto"
            dangerouslySetInnerHTML={{ __html: svg }}
          />
        </dialog>
      )}
    </>
  );
}
