import { useState, useEffect } from 'react';
import { Clock, Star } from 'lucide-react';
import CategoryTabs from '../components/CategoryTabs';
import ToolCard from '../components/ToolCard';
import { tools } from '../registry';
import { useFavorites } from '../hooks/useFavorites';
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
  const { ids: favoriteIds, toggle: toggleFavorite, isFavorite, atMax } = useFavorites();

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

  const favoriteTools = favoriteIds
    .map((id) => tools.find((t) => t.id === id))
    .filter(Boolean) as typeof tools;

  const recentTools = recentIds
    .map((id) => tools.find((t) => t.id === id))
    .filter(Boolean) as typeof tools;

  const showSections = !query.trim() && activeCategory === 'all';

  return (
    <div className="min-h-screen bg-[var(--color-surface)]">
      <CategoryTabs active={activeCategory} onChange={setActiveCategory} />

      <main className="max-w-6xl mx-auto px-4 py-8">

        {/* Favorites */}
        {showSections && favoriteTools.length > 0 && (
          <section className="mb-10">
            <div className="flex items-center gap-2 mb-4">
              <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
              <h2 className="text-sm font-medium text-[var(--color-muted)] uppercase tracking-wide">
                Favorites
              </h2>
              <span className="text-xs text-[var(--color-muted)]">({favoriteTools.length}/8)</span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3">
              {favoriteTools.map((tool) => (
                <ToolCard
                  key={tool.id}
                  tool={tool}
                  isFavorite={isFavorite(tool.id)}
                  atMax={atMax}
                  onToggleFavorite={toggleFavorite}
                />
              ))}
            </div>
          </section>
        )}

        {/* Recently used */}
        {showSections && recentTools.length > 0 && (
          <section className="mb-10">
            <div className="flex items-center gap-2 mb-4">
              <Clock className="w-4 h-4 text-[var(--color-muted)]" />
              <h2 className="text-sm font-medium text-[var(--color-muted)] uppercase tracking-wide">
                Recently used
              </h2>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3">
              {recentTools.map((tool) => (
                <ToolCard
                  key={tool.id}
                  tool={tool}
                  isFavorite={isFavorite(tool.id)}
                  atMax={atMax}
                  onToggleFavorite={toggleFavorite}
                />
              ))}
            </div>
          </section>
        )}

        {/* All tools / search results */}
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
                <ToolCard
                  key={tool.id}
                  tool={tool}
                  isFavorite={isFavorite(tool.id)}
                  atMax={atMax}
                  onToggleFavorite={toggleFavorite}
                />
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
