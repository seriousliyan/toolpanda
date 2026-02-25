import { ArrowLeft, Star } from 'lucide-react';
import { Link } from 'react-router-dom';
import type { ToolManifest } from '../types/tool';
import { useFavorites, MAX_FAVORITES } from '../hooks/useFavorites';

interface ToolShellProps {
  manifest: ToolManifest;
  children: React.ReactNode;
}

export default function ToolShell({ manifest, children }: ToolShellProps) {
  const { isFavorite, toggle, atMax } = useFavorites();
  const fav = isFavorite(manifest.id);
  const canFavorite = fav || !atMax;

  return (
    <div className="min-h-screen bg-[var(--color-surface)]">
      <div className="max-w-[1440px] mx-auto px-4 py-8">
        <Link
          to="/"
          className="inline-flex items-center gap-1.5 text-sm text-[var(--color-muted)] hover:text-gray-900 dark:hover:text-slate-100 mb-6 no-underline transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to tools
        </Link>

        <div className="flex items-center gap-3 mb-8">
          <span className="text-3xl">{manifest.icon}</span>
          <div className="flex-1">
            <div className="flex items-center gap-2">
              <h1 className="text-xl font-bold text-gray-900 dark:text-slate-100 leading-tight">
                {manifest.name}
              </h1>
              <button
                onClick={() => toggle(manifest.id)}
                disabled={!canFavorite}
                title={fav ? 'Remove from favorites' : atMax ? `Max ${MAX_FAVORITES} favorites reached` : 'Add to favorites'}
                className={[
                  'p-1 rounded transition-colors',
                  fav
                    ? 'text-yellow-400 hover:text-yellow-500'
                    : 'text-gray-300 dark:text-slate-600 hover:text-yellow-400 dark:hover:text-yellow-400',
                  !canFavorite ? 'cursor-not-allowed opacity-40' : '',
                ].join(' ')}
              >
                <Star className={`w-5 h-5 ${fav ? 'fill-yellow-400' : ''}`} />
              </button>
            </div>
            <p className="text-sm text-[var(--color-muted)] mt-0.5">{manifest.description}</p>
          </div>
        </div>

        <div className="bg-white dark:bg-slate-900 border border-[var(--color-border)] rounded-[var(--radius-card)] p-6">
          {children}
        </div>
      </div>
    </div>
  );
}
