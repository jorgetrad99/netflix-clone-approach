'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { Logo } from './Logo';
import { cn } from '@/lib/utils/cn';

const NAV_LINKS = [
  { href: '/', label: 'Home' },
  { href: '/browse/security', label: 'Security' },
  { href: '/browse/components', label: 'Components' },
  { href: '/browse/roadmap', label: 'Roadmap' },
  { href: '/my-list', label: 'My List' },
] as const;

export function TopNav() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 32);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <header
      className={cn(
        'fixed inset-x-0 top-0 z-40 transition-colors duration-300',
        scrolled
          ? 'bg-bg/95 supports-[backdrop-filter]:bg-bg/70 backdrop-blur'
          : 'bg-gradient-to-b from-black/80 to-transparent',
      )}
    >
      <nav
        aria-label="Primary"
        className="mx-auto flex h-14 max-w-7xl items-center gap-8 px-4 md:px-8"
      >
        <Logo />
        <ul className="text-fg-muted hidden items-center gap-5 text-sm md:flex">
          {NAV_LINKS.map((link) => (
            <li key={link.href}>
              <Link
                href={link.href}
                className="hover:text-fg focus-visible:text-fg focus-visible:outline-brand transition-colors outline-none"
              >
                {link.label}
              </Link>
            </li>
          ))}
        </ul>
      </nav>
    </header>
  );
}
