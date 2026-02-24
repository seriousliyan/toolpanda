import { useState } from 'react';
import { Copy, Check } from 'lucide-react';

type Mode = 'encode' | 'decode';

export default function Base64() {
  const [mode, setMode] = useState<Mode>('encode');
  const [input, setInput] = useState('');
  const [copied, setCopied] = useState(false);

  let output = '';
  let error = '';
  try {
    if (input) {
      output = mode === 'encode' ? btoa(unescape(encodeURIComponent(input))) : decodeURIComponent(escape(atob(input)));
    }
  } catch {
    error = mode === 'decode' ? 'Invalid Base64 input' : 'Encoding error';
  }

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
          {mode === 'encode' ? 'Plain text' : 'Base64 string'}
        </label>
        <textarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder={mode === 'encode' ? 'Enter text to encode…' : 'Enter Base64 to decode…'}
          className="w-full h-36 p-3 text-sm font-mono border border-[var(--color-border)] rounded-lg resize-none outline-none focus:ring-2 focus:ring-[var(--color-accent)] focus:border-transparent"
        />
      </div>

      <div>
        <div className="flex items-center justify-between mb-1.5">
          <label className="text-xs font-medium text-[var(--color-muted)]">
            {mode === 'encode' ? 'Base64 output' : 'Decoded text'}
          </label>
          <button onClick={copy} disabled={!output} className="flex items-center gap-1 text-xs text-[var(--color-muted)] hover:text-gray-900 dark:hover:text-slate-100 disabled:opacity-30 disabled:cursor-not-allowed transition">
            {copied ? <><Check className="w-3.5 h-3.5 text-green-600 dark:text-green-400" /> Copied</> : <><Copy className="w-3.5 h-3.5" /> Copy</>}
          </button>
        </div>
        {error ? (
          <div className="p-3 text-sm text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">{error}</div>
        ) : (
          <textarea
            readOnly
            value={output}
            placeholder="Output will appear here…"
            className="w-full h-36 p-3 text-sm font-mono bg-[var(--color-surface)] border border-[var(--color-border)] rounded-lg resize-none outline-none"
          />
        )}
      </div>
    </div>
  );
}
