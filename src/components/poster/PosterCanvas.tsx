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
import type { PosterSpec } from '@/content/types';
import { cn } from '@/lib/utils/cn';

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

interface PosterCanvasProps {
  spec: PosterSpec;
  variant?: 'card' | 'backdrop';
  className?: string;
  ariaHidden?: boolean;
}

export function PosterCanvas({
  spec,
  variant = 'card',
  className,
  ariaHidden = true,
}: Readonly<PosterCanvasProps>) {
  const Icon = ICON_MAP[spec.icon] ?? Film;
  const [from, to] = spec.gradient;
  const gradientId = `pg-${variant}-${from.replace('#', '')}-${to.replace('#', '')}`;
  const patternId = `pp-${gradientId}`;

  return (
    <div
      aria-hidden={ariaHidden}
      className={cn('relative h-full w-full overflow-hidden', className)}
    >
      <svg
        viewBox="0 0 16 9"
        preserveAspectRatio="xMidYMid slice"
        className="absolute inset-0 h-full w-full"
        aria-hidden
      >
        <defs>
          <linearGradient id={gradientId} x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor={from} />
            <stop offset="100%" stopColor={to} />
          </linearGradient>
          {spec.pattern === 'dots' && (
            <pattern
              id={patternId}
              x="0"
              y="0"
              width="0.5"
              height="0.5"
              patternUnits="userSpaceOnUse"
            >
              <circle cx="0.25" cy="0.25" r="0.04" fill="white" fillOpacity="0.12" />
            </pattern>
          )}
          {spec.pattern === 'grid' && (
            <pattern
              id={patternId}
              x="0"
              y="0"
              width="0.6"
              height="0.6"
              patternUnits="userSpaceOnUse"
            >
              <path
                d="M0.6 0 L0 0 L0 0.6"
                fill="none"
                stroke="white"
                strokeOpacity="0.08"
                strokeWidth="0.02"
              />
            </pattern>
          )}
          {spec.pattern === 'noise' && (
            <pattern
              id={patternId}
              x="0"
              y="0"
              width="0.4"
              height="0.4"
              patternUnits="userSpaceOnUse"
            >
              <rect width="0.4" height="0.4" fill="url(#noise-stripes)" />
              <circle cx="0.1" cy="0.2" r="0.015" fill="white" fillOpacity="0.06" />
              <circle cx="0.3" cy="0.05" r="0.012" fill="white" fillOpacity="0.05" />
              <circle cx="0.25" cy="0.32" r="0.018" fill="white" fillOpacity="0.07" />
            </pattern>
          )}
        </defs>
        <rect x="0" y="0" width="16" height="9" fill={`url(#${gradientId})`} />
        {spec.pattern && <rect x="0" y="0" width="16" height="9" fill={`url(#${patternId})`} />}
      </svg>
      <div className="absolute inset-0 flex items-center justify-center">
        <Icon
          aria-hidden
          className={cn(
            'text-white/85 drop-shadow-[0_4px_24px_rgba(0,0,0,0.55)]',
            variant === 'backdrop' ? 'h-32 w-32' : 'h-16 w-16',
          )}
          strokeWidth={1.5}
        />
      </div>
    </div>
  );
}
