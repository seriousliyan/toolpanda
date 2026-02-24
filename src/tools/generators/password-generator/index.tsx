import { useState, useCallback } from 'react';
import { Copy, Check, RefreshCw } from 'lucide-react';

const CHARS = {
  upper: 'ABCDEFGHIJKLMNOPQRSTUVWXYZ',
  lower: 'abcdefghijklmnopqrstuvwxyz',
  digits: '0123456789',
  symbols: '!@#$%^&*()-_=+[]{}|;:,.<>?',
};

function generate(length: number, opts: Record<keyof typeof CHARS, boolean>): string {
  const pool = Object.entries(opts)
    .filter(([, v]) => v)
    .map(([k]) => CHARS[k as keyof typeof CHARS])
    .join('');
  if (!pool) return '';
  const arr = new Uint32Array(length);
  crypto.getRandomValues(arr);
  return Array.from(arr, (n) => pool[n % pool.length]).join('');
}

function strengthLabel(pw: string): { label: string; color: string; width: string } {
  if (!pw) return { label: '', color: 'bg-gray-200 dark:bg-slate-700', width: 'w-0' };
  let score = 0;
  if (pw.length >= 12) score++;
  if (pw.length >= 16) score++;
  if (/[A-Z]/.test(pw)) score++;
  if (/[a-z]/.test(pw)) score++;
  if (/[0-9]/.test(pw)) score++;
  if (/[^A-Za-z0-9]/.test(pw)) score++;
  if (score <= 2) return { label: 'Weak', color: 'bg-red-400', width: 'w-1/4' };
  if (score <= 4) return { label: 'Fair', color: 'bg-yellow-400', width: 'w-2/4' };
  if (score <= 5) return { label: 'Strong', color: 'bg-blue-400', width: 'w-3/4' };
  return { label: 'Very strong', color: 'bg-green-400', width: 'w-full' };
}

export default function PasswordGenerator() {
  const [length, setLength] = useState(16);
  const [opts, setOpts] = useState({ upper: true, lower: true, digits: true, symbols: false });
  const [password, setPassword] = useState(() => generate(16, { upper: true, lower: true, digits: true, symbols: false }));
  const [copied, setCopied] = useState(false);

  const regen = useCallback(() => {
    setPassword(generate(length, opts));
  }, [length, opts]);

  function toggle(key: keyof typeof CHARS) {
    const next = { ...opts, [key]: !opts[key] };
    if (!Object.values(next).some(Boolean)) return;
    setOpts(next);
    setPassword(generate(length, next));
  }

  function handleLengthChange(val: number) {
    const l = Math.min(64, Math.max(4, val));
    setLength(l);
    setPassword(generate(l, opts));
  }

  function copy() {
    navigator.clipboard.writeText(password);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  }

  const strength = strengthLabel(password);

  return (
    <div className="space-y-5">
      <div className="flex items-center gap-3 p-4 bg-[var(--color-surface)] border border-[var(--color-border)] rounded-lg">
        <span className="flex-1 font-mono text-base text-gray-800 dark:text-slate-200 break-all">{password || '—'}</span>
        <button onClick={regen} className="p-1.5 rounded hover:bg-gray-200 dark:hover:bg-slate-700 transition" title="Regenerate">
          <RefreshCw className="w-4 h-4 text-[var(--color-muted)]" />
        </button>
        <button onClick={copy} className="flex items-center gap-1.5 px-3 py-1.5 text-sm bg-[var(--color-accent)] text-white rounded-lg hover:bg-[var(--color-accent-hover)] transition">
          {copied ? <><Check className="w-3.5 h-3.5" /> Copied</> : <><Copy className="w-3.5 h-3.5" /> Copy</>}
        </button>
      </div>

      {password && (
        <div className="flex items-center gap-3">
          <div className="flex-1 h-1.5 bg-gray-200 dark:bg-slate-700 rounded-full overflow-hidden">
            <div className={`h-full ${strength.color} ${strength.width} transition-all`} />
          </div>
          <span className="text-xs font-medium text-[var(--color-muted)] w-20 text-right">{strength.label}</span>
        </div>
      )}

      <div className="space-y-4">
        <div>
          <div className="flex items-center justify-between mb-2">
            <label className="text-sm font-medium text-gray-700 dark:text-slate-300">Length: {length}</label>
          </div>
          <input
            type="range"
            min={4}
            max={64}
            value={length}
            onChange={(e) => handleLengthChange(Number(e.target.value))}
            className="w-full accent-[var(--color-accent)]"
          />
          <div className="flex justify-between text-xs text-[var(--color-muted)] mt-1">
            <span>4</span>
            <span>64</span>
          </div>
        </div>

        <div>
          <label className="text-sm font-medium text-gray-700 dark:text-slate-300 block mb-2">Character sets</label>
          <div className="grid grid-cols-2 gap-2">
            {(Object.keys(opts) as (keyof typeof CHARS)[]).map((key) => (
              <label key={key} className="flex items-center gap-2 cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={opts[key]}
                  onChange={() => toggle(key)}
                  className="accent-[var(--color-accent)]"
                />
                <span className="text-sm text-gray-700 dark:text-slate-300">{key === 'digits' ? 'Numbers (0-9)' : key === 'upper' ? 'Uppercase (A-Z)' : key === 'lower' ? 'Lowercase (a-z)' : 'Symbols (!@#…)'}</span>
              </label>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
