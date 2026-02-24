import { useState } from 'react';
import { Copy, Check } from 'lucide-react';

type CaseType = 'upper' | 'lower' | 'title' | 'sentence' | 'camel' | 'pascal' | 'snake' | 'kebab' | 'constant';

function toWords(str: string): string[] {
  return str
    .replace(/([a-z])([A-Z])/g, '$1 $2')
    .replace(/([A-Z]+)([A-Z][a-z])/g, '$1 $2')
    .replace(/[-_]+/g, ' ')
    .split(/\s+/)
    .filter(Boolean);
}

function convert(text: string, type: CaseType): string {
  const words = toWords(text);
  switch (type) {
    case 'upper': return text.toUpperCase();
    case 'lower': return text.toLowerCase();
    case 'title': return words.map((w) => w[0].toUpperCase() + w.slice(1).toLowerCase()).join(' ');
    case 'sentence': {
      const lower = text.toLowerCase();
      return lower.charAt(0).toUpperCase() + lower.slice(1);
    }
    case 'camel': return words.map((w, i) => i === 0 ? w.toLowerCase() : w[0].toUpperCase() + w.slice(1).toLowerCase()).join('');
    case 'pascal': return words.map((w) => w[0].toUpperCase() + w.slice(1).toLowerCase()).join('');
    case 'snake': return words.map((w) => w.toLowerCase()).join('_');
    case 'kebab': return words.map((w) => w.toLowerCase()).join('-');
    case 'constant': return words.map((w) => w.toUpperCase()).join('_');
  }
}

const CASES: { type: CaseType; label: string }[] = [
  { type: 'upper', label: 'UPPER CASE' },
  { type: 'lower', label: 'lower case' },
  { type: 'title', label: 'Title Case' },
  { type: 'sentence', label: 'Sentence case' },
  { type: 'camel', label: 'camelCase' },
  { type: 'pascal', label: 'PascalCase' },
  { type: 'snake', label: 'snake_case' },
  { type: 'kebab', label: 'kebab-case' },
  { type: 'constant', label: 'CONSTANT_CASE' },
];

export default function CaseConverter() {
  const [text, setText] = useState('');
  const [copied, setCopied] = useState<CaseType | null>(null);

  function copyResult(type: CaseType) {
    navigator.clipboard.writeText(convert(text, type));
    setCopied(type);
    setTimeout(() => setCopied(null), 1500);
  }

  return (
    <div className="space-y-5">
      <textarea
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder="Enter text to convert…"
        className="w-full h-32 p-3 text-sm font-mono border border-[var(--color-border)] rounded-lg resize-none outline-none focus:ring-2 focus:ring-[var(--color-accent)] focus:border-transparent"
      />
      <div className="space-y-2">
        {CASES.map(({ type, label }) => {
          const result = text ? convert(text, type) : '';
          return (
            <div key={type} className="flex items-center gap-3 p-3 bg-[var(--color-surface)] rounded-lg group">
              <div className="w-28 shrink-0">
                <span className="text-xs font-medium text-[var(--color-muted)]">{label}</span>
              </div>
              <div className="flex-1 font-mono text-sm text-gray-800 dark:text-slate-200 truncate">
                {result || <span className="text-[var(--color-muted)] italic">{`(${label})`}</span>}
              </div>
              <button
                onClick={() => copyResult(type)}
                disabled={!text}
                className="shrink-0 p-1.5 rounded hover:bg-gray-200 dark:hover:bg-slate-700 transition disabled:opacity-30 disabled:cursor-not-allowed"
                title="Copy"
              >
                {copied === type ? <Check className="w-3.5 h-3.5 text-green-600 dark:text-green-400" /> : <Copy className="w-3.5 h-3.5 text-[var(--color-muted)]" />}
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
}
