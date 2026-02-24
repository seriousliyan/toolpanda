import { useState } from 'react';
import { Copy, Check, Minimize2, Maximize2 } from 'lucide-react';

export default function JsonFormatter() {
  const [input, setInput] = useState('');
  const [copied, setCopied] = useState(false);
  const [indent, setIndent] = useState(2);

  let output = '';
  let error = '';

  if (input.trim()) {
    try {
      const parsed = JSON.parse(input);
      output = JSON.stringify(parsed, null, indent);
    } catch (e) {
      error = e instanceof Error ? e.message : 'Invalid JSON';
    }
  }

  function copy() {
    if (!output) return;
    navigator.clipboard.writeText(output);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  }

  function minify() {
    if (!output) return;
    try {
      const parsed = JSON.parse(input);
      navigator.clipboard.writeText(JSON.stringify(parsed));
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch { /* empty */ }
  }

  return (
    <div className="space-y-4">
      <div>
        <label className="block text-xs font-medium text-[var(--color-muted)] mb-1.5">Input JSON</label>
        <textarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder='{"name":"ToolPanda","version":1}'
          className="w-full h-44 p-3 text-sm font-mono border border-[var(--color-border)] rounded-lg resize-none outline-none focus:ring-2 focus:ring-[var(--color-accent)] focus:border-transparent"
        />
      </div>

      <div className="flex items-center gap-4 flex-wrap">
        <div className="flex items-center gap-2">
          <label className="text-xs text-[var(--color-muted)]">Indent:</label>
          {[2, 4].map((n) => (
            <button
              key={n}
              onClick={() => setIndent(n)}
              className={[
                'px-2.5 py-1 text-xs rounded border transition',
                indent === n
                  ? 'bg-[var(--color-accent)] text-white border-[var(--color-accent)]'
                  : 'border-[var(--color-border)] text-gray-700 dark:text-slate-300 hover:bg-gray-100 dark:hover:bg-slate-700',
              ].join(' ')}
            >
              {n}
            </button>
          ))}
        </div>

        <div className="flex gap-2 ml-auto">
          <button
            onClick={minify}
            disabled={!output}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs text-gray-700 dark:text-slate-300 border border-[var(--color-border)] rounded-lg hover:bg-gray-100 dark:hover:bg-slate-700 disabled:opacity-30 disabled:cursor-not-allowed transition"
          >
            <Minimize2 className="w-3.5 h-3.5" /> Copy minified
          </button>
          <button
            onClick={copy}
            disabled={!output}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs text-gray-700 dark:text-slate-300 border border-[var(--color-border)] rounded-lg hover:bg-gray-100 dark:hover:bg-slate-700 disabled:opacity-30 disabled:cursor-not-allowed transition"
          >
            {copied ? <><Check className="w-3.5 h-3.5 text-green-600 dark:text-green-400" /> Copied</> : <><Copy className="w-3.5 h-3.5" /> Copy</>}
          </button>
        </div>
      </div>

      <div>
        <div className="flex items-center justify-between mb-1.5">
          <label className="text-xs font-medium text-[var(--color-muted)]">Formatted output</label>
          {output && (
            <span className="text-xs text-green-600 dark:text-green-400 flex items-center gap-1">
              <Maximize2 className="w-3 h-3" /> Valid JSON
            </span>
          )}
        </div>
        {error ? (
          <div className="p-3 text-sm text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg font-mono">{error}</div>
        ) : (
          <pre className="w-full min-h-44 p-3 text-sm font-mono bg-[var(--color-surface)] border border-[var(--color-border)] rounded-lg overflow-auto text-gray-800 dark:text-slate-200 whitespace-pre-wrap">
            {output || <span className="text-[var(--color-muted)]">Output will appear here…</span>}
          </pre>
        )}
      </div>
    </div>
  );
}
