import { Search, Sun, Moon } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useTheme } from '../hooks/useTheme';

interface HeaderProps {
  query: string;
  onQueryChange: (q: string) => void;
}

export default function Header({ query, onQueryChange }: HeaderProps) {
  const { isDark, toggle } = useTheme();

  return (
    <header className="sticky top-0 z-10 bg-white dark:bg-slate-900 border-b border-[var(--color-border)] shadow-sm">
      <div className="max-w-6xl mx-auto px-4 h-14 flex items-center gap-4">
        <Link to="/" className="flex items-center gap-2 shrink-0 no-underline">
          <span className="text-xl">🐼</span>
          <span className="font-semibold text-gray-900 dark:text-slate-100 text-base tracking-tight">ToolPanda</span>
        </Link>

        <div className="relative flex-1 max-w-md ml-auto">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--color-muted)]" />
          <input
            type="search"
            placeholder="Search tools…"
            value={query}
            onChange={(e) => onQueryChange(e.target.value)}
            className="w-full pl-9 pr-4 py-1.5 text-sm bg-[var(--color-surface)] border border-[var(--color-border)] rounded-lg outline-none focus:ring-2 focus:ring-[var(--color-accent)] focus:border-transparent transition"
          />
        </div>

        <button
          onClick={toggle}
          aria-label={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
          className="shrink-0 p-2 rounded-lg text-[var(--color-muted)] hover:text-gray-900 dark:hover:text-slate-100 hover:bg-gray-100 dark:hover:bg-slate-800 transition"
        >
          {isDark ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
        </button>
      </div>
    </header>
  );
}
