'use client';

import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { useEffect, useState } from 'react';

interface MyListState {
  ids: string[];
  add: (id: string) => void;
  remove: (id: string) => void;
  toggle: (id: string) => void;
  clear: () => void;
  has: (id: string) => boolean;
}

export const useMyListStore = create<MyListState>()(
  persist(
    (set, get) => ({
      ids: [],
      add: (id) => set((state) => (state.ids.includes(id) ? state : { ids: [...state.ids, id] })),
      remove: (id) => set((state) => ({ ids: state.ids.filter((x) => x !== id) })),
      toggle: (id) =>
        set((state) =>
          state.ids.includes(id)
            ? { ids: state.ids.filter((x) => x !== id) }
            : { ids: [...state.ids, id] },
        ),
      clear: () => set({ ids: [] }),
      has: (id) => get().ids.includes(id),
    }),
    {
      name: 'nf-docs:my-list',
      storage: createJSONStorage(() => globalThis.localStorage),
      version: 1,
    },
  ),
);

export function useMyListIds(): string[] {
  return useMyListStore((s) => s.ids);
}

export function useIsInMyList(id: string): boolean {
  return useMyListStore((s) => s.ids.includes(id));
}

export function useMyListHydrated(): boolean {
  const [hydrated, setHydrated] = useState(() => useMyListStore.persist.hasHydrated());
  useEffect(() => {
    return useMyListStore.persist.onFinishHydration(() => setHydrated(true));
  }, []);
  return hydrated;
}
