import { useState, useMemo } from 'react';
import { AlertCircle } from 'lucide-react';

type Flag = 'g' | 'i' | 'm' | 's';

const FLAG_LABELS: { flag: Flag; label: string; title: string }[] = [
  { flag: 'g', label: 'g', title: 'Global — find all matches' },
  { flag: 'i', label: 'i', title: 'Case insensitive' },
  { flag: 'm', label: 'm', title: 'Multiline — ^ and $ match line boundaries' },
  { flag: 's', label: 's', title: 'Dot-all — . matches newlines' },
];

interface Match {
  index: number;
  length: number;
  value: string;
  groups: Record<string, string> | null;
}

export default function RegexTester() {
  const [pattern, setPattern] = useState('');
  const [flags, setFlags] = useState<Set<Flag>>(new Set(['g']));
  const [text, setText] = useState('The quick brown fox jumps over the lazy dog.\nPack my box with five dozen liquor jugs.');

  const flagStr = [...flags].join('');

  const { matches, error, highlighted } = useMemo<{
    matches: Match[];
    error: string;
    highlighted: { text: string; match: boolean }[];
  }>(() => {
    if (!pattern) return { matches: [], error: '', highlighted: [{ text, match: false }] };
    try {
      const re = new RegExp(pattern, flagStr);
      const found: Match[] = [];
      let m: RegExpExecArray | null;

      if (flags.has('g')) {
        while ((m = re.exec(text)) !== null) {
          found.push({ index: m.index, length: m[0].length, value: m[0], groups: m.groups ?? null });
          if (m[0].length === 0) re.lastIndex++; // prevent infinite loop on zero-width match
        }
      } else {
        m = re.exec(text);
        if (m) found.push({ index: m.index, length: m[0].length, value: m[0], groups: m.groups ?? null });
      }

      // Build highlighted segments
      const segments: { text: string; match: boolean }[] = [];
      let cursor = 0;
      for (const match of found) {
        if (match.index > cursor) segments.push({ text: text.slice(cursor, match.index), match: false });
        segments.push({ text: match.value, match: true });
        cursor = match.index + match.length;
      }
      if (cursor < text.length) segments.push({ text: text.slice(cursor), match: false });

      return { matches: found, error: '', highlighted: segments.length ? segments : [{ text, match: false }] };
    } catch (e) {
      return {
        matches: [],
        error: e instanceof Error ? e.message : 'Invalid regex',
        highlighted: [{ text, match: false }],
      };
    }
  }, [pattern, flagStr, text]);

  function toggleFlag(f: Flag) {
    setFlags((prev) => {
      const next = new Set(prev);
      next.has(f) ? next.delete(f) : next.add(f);
      return next;
    });
  }

  return (
    <div className="space-y-4">
      {/* Pattern input */}
      <div>
        <label className="block text-xs font-medium text-[var(--color-muted)] mb-1.5">Regular expression</label>
        <div className="flex items-center gap-2">
          <div className="relative flex-1">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--color-muted)] font-mono text-sm select-none">/</span>
            <input
              type="text"
              value={pattern}
              onChange={(e) => setPattern(e.target.value)}
              placeholder="(\w+)"
              spellCheck={false}
              className="w-full pl-6 pr-6 py-2 text-sm font-mono border border-[var(--color-border)] rounded-lg outline-none focus:ring-2 focus:ring-[var(--color-accent)] focus:border-transparent"
            />
            <span className="absolute right-3 top-1/2 -translate-y-1/2 text-[var(--color-muted)] font-mono text-sm select-none">/{flagStr}</span>
          </div>
          <div className="flex gap-1">
            {FLAG_LABELS.map(({ flag, label, title }) => (
              <button
                key={flag}
                onClick={() => toggleFlag(flag)}
                title={title}
                className={[
                  'w-8 h-8 text-xs font-mono rounded border transition',
                  flags.has(flag)
                    ? 'bg-[var(--color-accent)] text-white border-[var(--color-accent)]'
                    : 'border-[var(--color-border)] text-[var(--color-muted)] hover:bg-gray-100 dark:hover:bg-slate-700',
                ].join(' ')}
              >
                {label}
              </button>
            ))}
          </div>
        </div>
        {error && (
          <div className="mt-2 flex items-center gap-1.5 text-xs text-red-600 dark:text-red-400">
            <AlertCircle className="w-3.5 h-3.5 shrink-0" />
            {error}
          </div>
        )}
      </div>

      {/* Test string */}
      <div>
        <div className="flex items-center justify-between mb-1.5">
          <label className="text-xs font-medium text-[var(--color-muted)]">Test string</label>
          {pattern && !error && (
            <span className="text-xs font-medium text-[var(--color-accent)]">
              {matches.length} match{matches.length !== 1 ? 'es' : ''}
            </span>
          )}
        </div>
        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          rows={4}
          spellCheck={false}
          className="w-full p-3 text-sm font-mono border border-[var(--color-border)] rounded-lg resize-none outline-none focus:ring-2 focus:ring-[var(--color-accent)] focus:border-transparent"
        />
      </div>

      {/* Highlighted result */}
      {pattern && !error && (
        <div>
          <label className="block text-xs font-medium text-[var(--color-muted)] mb-1.5">Highlighted matches</label>
          <div className="p-3 bg-[var(--color-surface)] border border-[var(--color-border)] rounded-lg font-mono text-sm leading-relaxed whitespace-pre-wrap break-all">
            {highlighted.map((seg, i) =>
              seg.match ? (
                <mark key={i} className="bg-yellow-200 dark:bg-yellow-700/60 text-gray-900 dark:text-yellow-100 rounded px-0.5">
                  {seg.text}
                </mark>
              ) : (
                <span key={i} className="text-gray-700 dark:text-slate-300">{seg.text}</span>
              )
            )}
          </div>
        </div>
      )}

      {/* Match details */}
      {matches.length > 0 && (
        <div>
          <label className="block text-xs font-medium text-[var(--color-muted)] mb-1.5">Match details</label>
          <div className="space-y-1.5 max-h-48 overflow-y-auto">
            {matches.map((m, i) => (
              <div key={i} className="flex items-start gap-3 px-3 py-2 bg-[var(--color-surface)] border border-[var(--color-border)] rounded-lg text-xs font-mono">
                <span className="text-[var(--color-muted)] shrink-0">#{i + 1}</span>
                <span className="text-yellow-700 dark:text-yellow-300 font-medium">{JSON.stringify(m.value)}</span>
                <span className="text-[var(--color-muted)] ml-auto shrink-0">index {m.index}</span>
                {m.groups && Object.keys(m.groups).length > 0 && (
                  <span className="text-[var(--color-muted)]">
                    {Object.entries(m.groups).map(([k, v]) => `${k}=${JSON.stringify(v)}`).join(', ')}
                  </span>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
