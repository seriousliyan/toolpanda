import { useState } from 'react';
import { Copy, Check } from 'lucide-react';

interface Base {
  label: string;
  radix: number;
  prefix: string;
  placeholder: string;
  pattern: string;
}

const BASES: Base[] = [
  { label: 'Decimal', radix: 10, prefix: '', placeholder: '255', pattern: '[0-9]*' },
  { label: 'Binary', radix: 2, prefix: '0b', placeholder: '11111111', pattern: '[01]*' },
  { label: 'Octal', radix: 8, prefix: '0o', placeholder: '377', pattern: '[0-7]*' },
  { label: 'Hexadecimal', radix: 16, prefix: '0x', placeholder: 'ff', pattern: '[0-9a-fA-F]*' },
];

type Copied = number | null;

function parseAny(val: string, radix: number): number | null {
  const clean = val.trim().replace(/^0[bBoOxX]/, '').replace(/\s/g, '');
  if (!clean) return null;
  const n = parseInt(clean, radix);
  return isNaN(n) || n < 0 ? null : n;
}

export default function NumberBase() {
  const [values, setValues] = useState<Record<number, string>>({ 10: '255', 2: '', 8: '', 16: '' });
  const [copied, setCopied] = useState<Copied>(null);

  function handleChange(radix: number, raw: string) {
    const n = parseAny(raw, radix);
    if (n === null) {
      setValues((prev) => ({ ...prev, [radix]: raw }));
      return;
    }
    const next: Record<number, string> = {};
    for (const b of BASES) {
      next[b.radix] = radix === b.radix ? raw : n.toString(b.radix).toUpperCase();
    }
    setValues(next);
  }

  function copy(radix: number, value: string) {
    navigator.clipboard.writeText(value);
    setCopied(radix);
    setTimeout(() => setCopied(null), 1500);
  }

  // Determine the current decimal value for the bit visualization
  const decimal = parseAny(values[10] ?? '', 10);

  return (
    <div className="space-y-4">
      <div className="space-y-3">
        {BASES.map(({ label, radix, prefix, placeholder }) => {
          const val = values[radix] ?? '';
          const isInvalid = val !== '' && parseAny(val, radix) === null;
          return (
            <div key={radix} className="flex items-center gap-3">
              <div className="w-28 shrink-0">
                <div className="text-sm font-medium text-gray-700 dark:text-slate-300">{label}</div>
                <div className="text-xs text-[var(--color-muted)]">Base {radix}</div>
              </div>
              <div className="relative flex-1">
                {prefix && (
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--color-muted)] font-mono text-sm select-none">
                    {prefix}
                  </span>
                )}
                <input
                  type="text"
                  value={val}
                  onChange={(e) => handleChange(radix, e.target.value)}
                  placeholder={placeholder}
                  spellCheck={false}
                  className={[
                    'w-full py-2 text-sm font-mono border rounded-lg outline-none focus:ring-2 focus:ring-[var(--color-accent)] focus:border-transparent',
                    prefix ? 'pl-8 pr-3' : 'px-3',
                    isInvalid ? 'border-red-400' : 'border-[var(--color-border)]',
                  ].join(' ')}
                />
              </div>
              <button
                onClick={() => copy(radix, val)}
                disabled={!val}
                className="p-1.5 rounded hover:bg-gray-200 dark:hover:bg-slate-700 transition disabled:opacity-30"
                title={`Copy ${label}`}
              >
                {copied === radix
                  ? <Check className="w-3.5 h-3.5 text-green-600 dark:text-green-400" />
                  : <Copy className="w-3.5 h-3.5 text-[var(--color-muted)]" />}
              </button>
            </div>
          );
        })}
      </div>

      {/* 8-bit visualization */}
      {decimal !== null && decimal >= 0 && decimal <= 255 && (
        <div>
          <div className="text-xs font-medium text-[var(--color-muted)] mb-2 uppercase tracking-wide">8-bit visualization</div>
          <div className="flex gap-1">
            {Array.from({ length: 8 }, (_, i) => {
              const bit = (decimal >> (7 - i)) & 1;
              return (
                <div
                  key={i}
                  className={[
                    'flex-1 h-10 rounded flex items-center justify-center text-sm font-mono font-bold border',
                    bit
                      ? 'bg-[var(--color-accent)] text-white border-[var(--color-accent)]'
                      : 'bg-[var(--color-surface)] text-[var(--color-muted)] border-[var(--color-border)]',
                  ].join(' ')}
                >
                  {bit}
                </div>
              );
            })}
          </div>
          <div className="flex gap-1 mt-1">
            {Array.from({ length: 8 }, (_, i) => (
              <div key={i} className="flex-1 text-center text-xs text-[var(--color-muted)]">
                2<sup>{7 - i}</sup>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
