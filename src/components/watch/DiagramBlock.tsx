'use client';

import dynamic from 'next/dynamic';
import { DiagramSkeleton } from './DiagramSkeleton';

const MermaidDiagram = dynamic(() => import('./MermaidDiagram'), {
  ssr: false,
  loading: () => <DiagramSkeleton />,
});

interface DiagramBlockProps {
  source: string;
  id: string;
}

export function DiagramBlock({ source, id }: Readonly<DiagramBlockProps>) {
  return <MermaidDiagram source={source} id={id} />;
}
