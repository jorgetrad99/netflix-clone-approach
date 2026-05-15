import {
  AlertTriangle,
  Calendar,
  Component,
  Database,
  Film,
  GitBranch,
  Layers,
  Network,
  Settings,
  Shield,
  Star,
  TestTube,
  Workflow,
  type LucideIcon,
} from 'lucide-react';
import type { Section } from '@/content/types';
import { localizedSection } from '@/content/localized';
import type { Locale } from '@/i18n/config';
import { PosterCanvas } from './PosterCanvas';

const ICON_MAP: Record<string, LucideIcon> = {
  AlertTriangle,
  Calendar,
  Component,
  Database,
  Film,
  GitBranch,
  Layers,
  Network,
  Settings,
  Shield,
  Star,
  TestTube,
  Workflow,
};

interface HeroBackdropProps {
  section: Section;
  locale: Locale;
}

/**
 * Multi-layer hero backdrop so the hero never feels empty:
 *   1. Base: large blurred PosterCanvas (gradient + pattern + icon).
 *   2. Diagram/code-like SVG mesh, blurred and very low-opacity.
 *   3. Constellation of small floating icons of the same family.
 *   4. Blurred excerpt fragment as soft body-text watermark.
 *   5. Oversized chapter number watermark.
 *
 * All layers are aria-hidden and z-(-10).
 */
export function HeroBackdrop({ section, locale }: Readonly<HeroBackdropProps>) {
  const Icon = ICON_MAP[section.hero.backdrop.icon] ?? Film;
  const loc = localizedSection(section, locale);
  const excerptSnippet = (loc.excerpt || loc.tagline).slice(0, 280);

  return (
    <div aria-hidden className="absolute inset-0 -z-10">
      {/* Base poster, scaled and blurred */}
      <div className="absolute inset-0 scale-110 blur-2xl saturate-150">
        <PosterCanvas spec={section.hero.backdrop} variant="backdrop" />
      </div>
      {/* Tinted vignette to darken the edges */}
      <div className="from-bg/60 absolute inset-0 bg-radial-[ellipse_at_center] from-30% to-transparent" />

      <DiagramMesh />
      <ConstellationLayer Icon={Icon} />
      <TextWatermark text={excerptSnippet} />

      {/* Oversized chapter number watermark */}
      <span
        className="text-fg-muted/5 pointer-events-none absolute right-4 -bottom-12 font-black tracking-tighter select-none md:right-12"
        style={{
          fontSize: 'clamp(14rem, 28vw, 28rem)',
          lineHeight: 0.85,
        }}
      >
        {section.number.toString().padStart(2, '0')}
      </span>
    </div>
  );
}

const POSITIONS: { top: string; left: string; size: number; opacity: number; rotate: number }[] = [
  { top: '12%', left: '8%', size: 28, opacity: 0.06, rotate: -8 },
  { top: '24%', left: '72%', size: 36, opacity: 0.07, rotate: 12 },
  { top: '40%', left: '20%', size: 22, opacity: 0.05, rotate: 24 },
  { top: '55%', left: '85%', size: 30, opacity: 0.05, rotate: -16 },
  { top: '70%', left: '12%', size: 40, opacity: 0.06, rotate: 8 },
  { top: '78%', left: '60%', size: 24, opacity: 0.04, rotate: -22 },
  { top: '15%', left: '45%', size: 18, opacity: 0.05, rotate: 0 },
  { top: '60%', left: '40%', size: 32, opacity: 0.05, rotate: 30 },
];

function ConstellationLayer({ Icon }: Readonly<{ Icon: LucideIcon }>) {
  return (
    <div aria-hidden className="absolute inset-0 overflow-hidden">
      {POSITIONS.map((p, i) => (
        <Icon
          key={i}
          strokeWidth={1.25}
          className="absolute text-white"
          style={{
            top: p.top,
            left: p.left,
            width: `${p.size}px`,
            height: `${p.size}px`,
            opacity: p.opacity,
            transform: `rotate(${p.rotate}deg)`,
            filter: 'blur(0.5px)',
          }}
        />
      ))}
    </div>
  );
}

/**
 * SVG mesh of nodes connected by lines — evokes an architecture / flow diagram
 * without binding to any specific content. Heavily blurred and faded.
 */
function DiagramMesh() {
  const nodes: { x: number; y: number; r: number }[] = [
    { x: 80, y: 110, r: 6 },
    { x: 200, y: 70, r: 8 },
    { x: 340, y: 140, r: 5 },
    { x: 470, y: 90, r: 7 },
    { x: 600, y: 160, r: 6 },
    { x: 740, y: 120, r: 9 },
    { x: 150, y: 260, r: 6 },
    { x: 310, y: 300, r: 8 },
    { x: 460, y: 250, r: 5 },
    { x: 620, y: 310, r: 7 },
    { x: 770, y: 270, r: 6 },
    { x: 230, y: 420, r: 8 },
    { x: 410, y: 460, r: 6 },
    { x: 570, y: 410, r: 7 },
  ];
  const edges: [number, number][] = [
    [0, 1],
    [1, 2],
    [2, 3],
    [3, 4],
    [4, 5],
    [1, 6],
    [2, 7],
    [4, 8],
    [5, 9],
    [6, 7],
    [7, 8],
    [8, 9],
    [9, 10],
    [7, 11],
    [8, 12],
    [9, 13],
    [11, 12],
    [12, 13],
  ];
  return (
    <svg
      aria-hidden
      viewBox="0 0 840 540"
      preserveAspectRatio="xMidYMid slice"
      className="absolute inset-0 h-full w-full opacity-[0.09]"
      style={{ filter: 'blur(1px)' }}
    >
      <g stroke="currentColor" strokeWidth={1} className="text-white">
        {edges.map(([a, b], i) => {
          const na = nodes[a]!;
          const nb = nodes[b]!;
          return <line key={i} x1={na.x} y1={na.y} x2={nb.x} y2={nb.y} strokeDasharray="2 4" />;
        })}
      </g>
      <g fill="currentColor" className="text-white">
        {nodes.map((n, i) => (
          <circle key={i} cx={n.x} cy={n.y} r={n.r} />
        ))}
      </g>
    </svg>
  );
}

/**
 * Heavily blurred body-text watermark: a faint paragraph echoing the section
 * excerpt. Repeats to fill space so the hero never looks empty. aria-hidden.
 */
function TextWatermark({ text }: Readonly<{ text: string }>) {
  const safe = text.replace(/\s+/g, ' ').trim();
  const repeated = `${safe} · ${safe} · ${safe}`;
  return (
    <div
      aria-hidden
      className="pointer-events-none absolute inset-0 overflow-hidden select-none"
      style={{ filter: 'blur(2px)' }}
    >
      <p
        className="text-fg/10 absolute font-mono leading-relaxed tracking-wide"
        style={{
          top: '14%',
          left: '6%',
          right: '38%',
          fontSize: 'clamp(0.7rem, 0.95vw, 0.95rem)',
        }}
      >
        {repeated}
      </p>
      <p
        className="text-fg/[0.06] absolute font-mono leading-relaxed tracking-wide"
        style={{
          top: '48%',
          left: '50%',
          right: '4%',
          fontSize: 'clamp(0.65rem, 0.85vw, 0.85rem)',
        }}
      >
        {repeated}
      </p>
    </div>
  );
}
