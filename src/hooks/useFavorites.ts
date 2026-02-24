import { useState } from 'react';

const KEY = 'toolpanda:favorites';
export const MAX_FAVORITES = 8;

function load(): string[] {
  try {
    return JSON.parse(localStorage.getItem(KEY) ?? '[]');
  } catch {
    return [];
  }
}

export function useFavorites() {
  const [ids, setIds] = useState<string[]>(load);

  const toggle = (id: string) => {
    setIds((prev) => {
      let next: string[];
      if (prev.includes(id)) {
        next = prev.filter((x) => x !== id);
      } else {
        if (prev.length >= MAX_FAVORITES) return prev; // at cap, ignore
        next = [...prev, id];
      }
      localStorage.setItem(KEY, JSON.stringify(next));
      return next;
    });
  };

  return {
    ids,
    toggle,
    isFavorite: (id: string) => ids.includes(id),
    atMax: ids.length >= MAX_FAVORITES,
  };
}
