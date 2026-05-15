'use client';

import { Plus, Check } from 'lucide-react';
import type { Section } from '@/content/types';
import { useDictionary } from '@/i18n/LocaleProvider';
import { useIsInMyList, useMyListStore } from '@/lib/store/my-list';
import { cn } from '@/lib/utils/cn';

interface AddToListButtonProps {
  section: Section;
  size?: 'sm' | 'md';
  className?: string;
}

export function AddToListButton({
  section,
  size = 'md',
  className,
}: Readonly<AddToListButtonProps>) {
  const dict = useDictionary();
  const inList = useIsInMyList(section.id);
  const toggle = useMyListStore((s) => s.toggle);
  const dim = size === 'sm' ? 'h-8 w-8' : 'h-11 w-11';
  const icon = size === 'sm' ? 'h-4 w-4' : 'h-5 w-5';

  return (
    <button
      type="button"
      aria-label={
        inList ? dict.title.removeFromList(section.title) : dict.title.addToList(section.title)
      }
      aria-pressed={inList}
      onClick={() => toggle(section.id)}
      className={cn(
        'hover:border-fg flex items-center justify-center rounded-full border border-white/40 bg-black/30 text-white backdrop-blur transition',
        dim,
        className,
      )}
    >
      {inList ? <Check className={icon} /> : <Plus className={icon} />}
    </button>
  );
}
