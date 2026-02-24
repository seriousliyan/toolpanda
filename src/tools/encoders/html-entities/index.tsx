import { useState } from 'react';
import { Copy, Check } from 'lucide-react';

type Mode = 'encode' | 'decode';

function encodeEntities(str: string): string {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;')
    .replace(/`/g, '&#96;');
}

function decodeEntities(str: string): string {
  const el = document.createElement('textarea');
  el.innerHTML = str;
  return el.value;
}

export default function HtmlEntities() {
  const [mode, setMode] = useState<Mode>('encode');
  const [input, setInput] = useState('');
  const [copied, setCopied] = useState(false);

  const output = input
    ? mode === 'encode'
      ? encodeEntities(input)
      : decodeEntities(input)
    : '';

  function copy() {
    if (!output) return;
    navigator.clipboard.writeText(output);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  }

  return (
    <div className="space-y-4">
      <div className="flex gap-2">
        {(['encode', 'decode'] as Mode[]).map((m) => (
          <button
            key={m}
            onClick={() => { setMode(m); setInput(''); }}
            className={[
              'px-4 py-1.5 text-sm font-medium rounded-lg transition capitalize',
              mode === m
                ? 'bg-[var(--color-accent)] text-white'
                : 'bg-[var(--color-surface)] text-gray-700 dark:text-slate-300 hover:bg-gray-200 dark:hover:bg-slate-700 border border-[var(--color-border)]',
            ].join(' ')}
          >
            {m}
          </button>
        ))}
      </div>

      <div>
        <label className="block text-xs font-medium text-[var(--color-muted)] mb-1.5">
          {mode === 'encode' ? 'Plain HTML / text' : 'HTML with entities'}
        </label>
        <textarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder={mode === 'encode' ? '<h1>Hello "World" & friends</h1>' : '&lt;h1&gt;Hello &quot;World&quot;&lt;/h1&gt;'}
          className="w-full h-36 p-3 text-sm font-mono border border-[var(--color-border)] rounded-lg resize-none outline-none focus:ring-2 focus:ring-[var(--color-accent)] focus:border-transparent"
        />
      </div>

      <div>
        <div className="flex items-center justify-between mb-1.5">
          <label className="text-xs font-medium text-[var(--color-muted)]">Output</label>
          <button
            onClick={copy}
            disabled={!output}
            className="flex items-center gap-1 text-xs text-[var(--color-muted)] hover:text-gray-900 dark:hover:text-slate-100 disabled:opacity-30 disabled:cursor-not-allowed transition"
          >
            {copied ? <><Check className="w-3.5 h-3.5 text-green-600 dark:text-green-400" /> Copied</> : <><Copy className="w-3.5 h-3.5" /> Copy</>}
          </button>
        </div>
        <textarea
          readOnly
          value={output}
          placeholder="Output will appear here…"
          className="w-full h-36 p-3 text-sm font-mono bg-[var(--color-surface)] border border-[var(--color-border)] rounded-lg resize-none outline-none"
        />
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 text-xs">
        {[
          ['&', '&amp;'], ['<', '&lt;'], ['>', '&gt;'],
          ['"', '&quot;'], ["'", '&#39;'], ['`', '&#96;'],
        ].map(([char, entity]) => (
          <div key={char} className="flex items-center gap-2 px-3 py-2 bg-[var(--color-surface)] border border-[var(--color-border)] rounded-lg font-mono">
            <span className="text-[var(--color-accent)] font-bold">{char}</span>
            <span className="text-[var(--color-muted)]">→</span>
            <span className="text-gray-700 dark:text-slate-300">{entity}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
