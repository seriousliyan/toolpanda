import { useState } from 'react';
import { diffWords } from 'diff';

export default function TextDiff() {
  const [left, setLeft] = useState('');
  const [right, setRight] = useState('');

  const parts = diffWords(left, right);

  const hasChanges = parts.some((p) => p.added || p.removed);

  return (
    <div className="space-y-5">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-xs font-medium text-[var(--color-muted)] mb-1.5">Original</label>
          <textarea
            value={left}
            onChange={(e) => setLeft(e.target.value)}
            placeholder="Paste original text…"
            className="w-full h-44 p-3 text-sm font-mono border border-[var(--color-border)] rounded-lg resize-none outline-none focus:ring-2 focus:ring-[var(--color-accent)] focus:border-transparent"
          />
        </div>
        <div>
          <label className="block text-xs font-medium text-[var(--color-muted)] mb-1.5">Modified</label>
          <textarea
            value={right}
            onChange={(e) => setRight(e.target.value)}
            placeholder="Paste modified text…"
            className="w-full h-44 p-3 text-sm font-mono border border-[var(--color-border)] rounded-lg resize-none outline-none focus:ring-2 focus:ring-[var(--color-accent)] focus:border-transparent"
          />
        </div>
      </div>

      {(left || right) && (
        <div>
          <div className="text-xs font-medium text-[var(--color-muted)] mb-2">Diff result</div>
          {!hasChanges ? (
            <div className="p-4 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg text-sm text-green-700 dark:text-green-400">
              ✓ Texts are identical
            </div>
          ) : (
            <div className="p-4 bg-[var(--color-surface)] border border-[var(--color-border)] rounded-lg font-mono text-sm leading-relaxed">
              {parts.map((part, i) => (
                <span
                  key={i}
                  className={
                    part.added
                      ? 'bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300'
                      : part.removed
                      ? 'bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-300 line-through'
                      : 'text-gray-700 dark:text-slate-300'
                  }
                >
                  {part.value}
                </span>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
