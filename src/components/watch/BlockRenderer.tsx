import type { Block } from '@/content/types';
import { DiagramBlock } from './DiagramBlock';

export function BlockRenderer({ block }: Readonly<{ block: Block }>) {
  switch (block.kind) {
    case 'prose':
      return (
        <div
          className="docs-prose text-fg-muted text-base leading-relaxed md:text-lg"
          dangerouslySetInnerHTML={{ __html: block.html }}
        />
      );
    case 'code':
      return (
        <div
          className="docs-code text-sm md:text-base"
          dangerouslySetInnerHTML={{ __html: block.html }}
        />
      );
    case 'mermaid':
      return <DiagramBlock source={block.source} id={block.id} />;
    case 'table':
      return (
        <div
          className="docs-prose text-fg-muted overflow-x-auto text-sm"
          dangerouslySetInnerHTML={{ __html: block.html }}
        />
      );
    case 'callout':
      return (
        <aside
          className={
            block.variant === 'warn'
              ? 'border-warning bg-warning/10 text-fg-muted rounded border-l-4 px-4 py-3'
              : 'border-brand bg-brand/10 text-fg-muted rounded border-l-4 px-4 py-3'
          }
          dangerouslySetInnerHTML={{ __html: block.html }}
        />
      );
    default:
      return null;
  }
}
