'use client';

import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { CategoryType } from '@/lib/types';

export interface StackItem {
  id: string;
  name: string;
  slug: string;
  category: CategoryType;
  installCommand: string;
}

interface StackBuilderState {
  items: StackItem[];
  addItem: (item: StackItem) => void;
  removeItem: (id: string) => void;
  clearAll: () => void;
  hasItem: (id: string) => boolean;
  getCommand: () => string;
  getCategoryCounts: () => Record<string, number>;
}

export const useStackBuilder = create<StackBuilderState>()(
  persist(
    (set, get) => ({
      items: [],

      addItem: (item) => {
        const { items } = get();
        if (!items.find(i => i.id === item.id)) {
          set({ items: [...items, item] });
        }
      },

      removeItem: (id) => {
        set({ items: get().items.filter(i => i.id !== id) });
      },

      clearAll: () => set({ items: [] }),

      hasItem: (id) => get().items.some(i => i.id === id),

      getCommand: () => {
        const { items } = get();
        if (items.length === 0) return '';
        const names = items.map(i => i.installCommand).join(' ');
        return `npx codex-templates@latest add ${names}`;
      },

      getCategoryCounts: () => {
        const { items } = get();
        return items.reduce((acc, item) => {
          acc[item.category] = (acc[item.category] || 0) + 1;
          return acc;
        }, {} as Record<string, number>);
      },
    }),
    {
      name: 'codex-stack-builder',
    }
  )
);
