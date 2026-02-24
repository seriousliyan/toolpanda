import { useState } from 'react';

const THEME_KEY = 'toolpanda:theme';

type Theme = 'light' | 'dark';

function resolveInitialTheme(): Theme {
  const stored = localStorage.getItem(THEME_KEY) as Theme | null;
  if (stored === 'dark' || stored === 'light') return stored;
  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
}

function applyTheme(theme: Theme) {
  document.documentElement.classList.toggle('dark', theme === 'dark');
}

export function useTheme() {
  const [theme, setTheme] = useState<Theme>(() => {
    const t = resolveInitialTheme();
    applyTheme(t);
    return t;
  });

  const toggle = () => {
    const next: Theme = theme === 'dark' ? 'light' : 'dark';
    localStorage.setItem(THEME_KEY, next);
    applyTheme(next);
    setTheme(next);
  };

  return { theme, toggle, isDark: theme === 'dark' };
}
