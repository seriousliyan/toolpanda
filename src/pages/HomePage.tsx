import { useState, useEffect } from 'react';
import { Clock } from 'lucide-react';
import CategoryTabs from '../components/CategoryTabs';
import ToolCard from '../components/ToolCard';
import { tools } from '../registry';
import type { ToolCategory } from '../types/tool';

type ActiveCategory = 'all' | ToolCategory;

const RECENT_KEY = 'toolpanda:recent';
const MAX_RECENT = 4;

interface HomePageProps {
  query: string;
}

function getRecent(): string[] {
  try {
    return JSON.parse(localStorage.getItem(RECENT_KEY) ?? '[]');
  } catch {
    return [];
  }
}

export function addRecent(id: string) {
  const prev = getRecent().filter((x) => x !== id);
  localStorage.setItem(RECENT_KEY, JSON.stringify([id, ...prev].slice(0, MAX_RECENT)));
}

export default function HomePage({ query }: HomePageProps) {
  const [activeCategory, setActiveCategory] = useState<ActiveCategory>('all');
  const [recentIds, setRecentIds] = useState<string[]>([]);

  useEffect(() => {
    setRecentIds(getRecent());
  }, []);

  const filtered = tools.filter((tool) => {
    const matchCat = activeCategory === 'all' || tool.category === activeCategory;
    if (!matchCat) return false;
    if (!query.trim()) return true;
    const q = query.toLowerCase();
    return (
      tool.name.toLowerCase().includes(q) ||
      tool.description.toLowerCase().includes(q) ||
      tool.tags.some((t) => t.toLowerCase().includes(q))
    );
  });

  const recentTools = recentIds
    .map((id) => tools.find((t) => t.id === id))
    .filter(Boolean) as typeof tools;

  const showRecent = !query.trim() && activeCategory === 'all' && recentTools.length > 0;

  return (
    <div className="min-h-screen bg-[var(--color-surface)]">
      <CategoryTabs active={activeCategory} onChange={setActiveCategory} />

      <main className="max-w-6xl mx-auto px-4 py-8">
        {showRecent && (
          <section className="mb-10">
            <div className="flex items-center gap-2 mb-4">
              <Clock className="w-4 h-4 text-[var(--color-muted)]" />
              <h2 className="text-sm font-medium text-[var(--color-muted)] uppercase tracking-wide">
                Recently used
              </h2>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3">
              {recentTools.map((tool) => (
                <ToolCard key={tool.id} tool={tool} />
              ))}
            </div>
          </section>
        )}

        <section>
          {query.trim() || activeCategory !== 'all' ? (
            <div className="flex items-center gap-2 mb-4">
              <h2 className="text-sm font-medium text-[var(--color-muted)]">
                {filtered.length} tool{filtered.length !== 1 ? 's' : ''}
                {query.trim() ? ` for "${query}"` : ''}
              </h2>
            </div>
          ) : (
            <div className="flex items-center gap-2 mb-4">
              <h2 className="text-sm font-medium text-[var(--color-muted)] uppercase tracking-wide">
                All tools
              </h2>
            </div>
          )}

          {filtered.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3">
              {filtered.map((tool) => (
                <ToolCard key={tool.id} tool={tool} />
              ))}
            </div>
          ) : (
            <div className="text-center py-16 text-[var(--color-muted)]">
              <p className="text-4xl mb-3">🔍</p>
              <p className="font-medium">No tools found for "{query}"</p>
              <p className="text-sm mt-1">Try a different search term</p>
            </div>
          )}
        </section>
      </main>
    </div>
  );
}
