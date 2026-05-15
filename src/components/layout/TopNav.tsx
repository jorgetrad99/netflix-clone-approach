'use client';

import Link from 'next/link';
import { Suspense, useEffect, useState } from 'react';
import { Logo } from './Logo';
import { LocaleSwitcher } from './LocaleSwitcher';
import { SearchBar } from '@/components/search/SearchBar';
import { useDictionary, useLocale } from '@/i18n/LocaleProvider';
import { cn } from '@/lib/utils/cn';

export function TopNav() {
  const [scrolled, setScrolled] = useState(false);
  const locale = useLocale();
  const dict = useDictionary();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 32);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const navLinks = [
    { href: `/${locale}`, label: dict.nav.home },
    { href: `/${locale}/title/security`, label: dict.nav.security },
    { href: `/${locale}/title/components`, label: dict.nav.components },
    { href: `/${locale}/title/roadmap`, label: dict.nav.roadmap },
    { href: `/${locale}/my-list`, label: dict.nav.myList },
  ];

  return (
    <header
      className={cn(
        'fixed inset-x-0 top-0 z-40 transition-colors duration-300',
        scrolled
          ? 'bg-bg/95 supports-backdrop-filter:bg-bg/70 backdrop-blur'
          : 'bg-linear-to-b from-black/80 to-transparent',
      )}
    >
      <nav
        aria-label="Primary"
        className="mx-auto flex h-14 max-w-7xl items-center gap-6 px-4 md:px-8"
      >
        <Logo />
        <ul className="text-fg-muted hidden items-center gap-5 text-sm md:flex">
          {navLinks.map((link) => (
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
        <div className="ml-auto flex items-center gap-3">
          <Suspense fallback={<div className="h-9 w-9" aria-hidden />}>
            <SearchBar />
          </Suspense>
          <LocaleSwitcher />
        </div>
      </nav>
    </header>
  );
}
