import Link from 'next/link';
import { cn } from '@/lib/utils/cn';

export function Logo({ className }: Readonly<{ className?: string }>) {
  return (
    <Link
      href="/"
      aria-label="Netflix Docs Viewer — home"
      className={cn(
        'text-brand text-xl font-black tracking-[0.2em] uppercase select-none',
        'hover:text-brand-hover transition-colors',
        className,
      )}
    >
      NF·DOCS
    </Link>
  );
}
