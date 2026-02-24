import { CATEGORIES } from '../registry';
import type { ToolCategory } from '../types/tool';

type ActiveCategory = 'all' | ToolCategory;

interface CategoryTabsProps {
  active: ActiveCategory;
  onChange: (cat: ActiveCategory) => void;
}

const LABELS: Record<ActiveCategory, string> = {
  all: 'All',
  text: 'Text',
  encoders: 'Encoders',
  formatters: 'Formatters',
  generators: 'Generators',
  converters: 'Converters',
};

export default function CategoryTabs({ active, onChange }: CategoryTabsProps) {
  const tabs: ActiveCategory[] = ['all', ...CATEGORIES];

  return (
    <div className="border-b border-[var(--color-border)] bg-white dark:bg-slate-900">
      <div className="max-w-[1440px] mx-auto px-4">
        <nav className="flex gap-1 -mb-px overflow-x-auto" aria-label="Tool categories">
          {tabs.map((tab) => {
            const isActive = tab === active;
            return (
              <button
                key={tab}
                onClick={() => onChange(tab)}
                onMouseEnter={() => onChange(tab)}
                className={[
                  'px-4 py-3 text-sm font-medium whitespace-nowrap border-b-2 transition-colors outline-none',
                  isActive
                    ? 'border-[var(--color-accent)] text-[var(--color-accent)]'
                    : 'border-transparent text-[var(--color-muted)] hover:text-gray-700 dark:hover:text-slate-200 hover:border-gray-300 dark:hover:border-slate-600',
                ].join(' ')}
              >
                {LABELS[tab]}
              </button>
            );
          })}
        </nav>
      </div>
    </div>
  );
}
