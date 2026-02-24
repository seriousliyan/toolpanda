import { useState } from 'react';
import { Copy, Check, RefreshCw } from 'lucide-react';

type Copied = 'unix' | 'iso' | 'local' | 'utc' | null;

function nowUnix() { return Math.floor(Date.now() / 1000); }

function parseUnix(val: string): Date | null {
  const n = Number(val.trim());
  if (isNaN(n)) return null;
  // Support ms timestamps too
  const ms = val.trim().length >= 13 ? n : n * 1000;
  const d = new Date(ms);
  return isNaN(d.getTime()) ? null : d;
}

function formatRow(label: string, value: string, type: Copied, copied: Copied, onCopy: (t: Copied, v: string) => void) {
  return (
    <div className="flex items-center gap-3 px-3 py-2.5 bg-[var(--color-surface)] border border-[var(--color-border)] rounded-lg">
      <span className="text-xs font-medium text-[var(--color-muted)] w-20 shrink-0">{label}</span>
      <span className="flex-1 font-mono text-sm text-gray-800 dark:text-slate-200 truncate">{value}</span>
      <button onClick={() => onCopy(type, value)} className="p-1 rounded hover:bg-gray-200 dark:hover:bg-slate-700 transition shrink-0">
        {copied === type
          ? <Check className="w-3.5 h-3.5 text-green-600 dark:text-green-400" />
          : <Copy className="w-3.5 h-3.5 text-[var(--color-muted)]" />}
      </button>
    </div>
  );
}

export default function TimestampConverter() {
  const [unix, setUnix] = useState(String(nowUnix()));
  const [dateInput, setDateInput] = useState('');
  const [copied, setCopied] = useState<Copied>(null);

  function copy(type: Copied, value: string) {
    navigator.clipboard.writeText(value);
    setCopied(type);
    setTimeout(() => setCopied(null), 1500);
  }

  function setNow() { setUnix(String(nowUnix())); setDateInput(''); }

  // Parse unix → date
  const date = parseUnix(unix);

  // Parse date string → unix
  function handleDateChange(val: string) {
    setDateInput(val);
    const d = new Date(val);
    if (!isNaN(d.getTime())) setUnix(String(Math.floor(d.getTime() / 1000)));
  }

  return (
    <div className="space-y-5">
      {/* Unix input */}
      <div>
        <div className="flex items-center justify-between mb-1.5">
          <label className="text-xs font-medium text-[var(--color-muted)]">Unix timestamp (seconds or ms)</label>
          <button
            onClick={setNow}
            className="flex items-center gap-1 text-xs text-[var(--color-muted)] hover:text-gray-900 dark:hover:text-slate-100 transition"
          >
            <RefreshCw className="w-3 h-3" /> Now
          </button>
        </div>
        <input
          type="text"
          value={unix}
          onChange={(e) => { setUnix(e.target.value); setDateInput(''); }}
          placeholder="1700000000"
          className="w-full px-3 py-2 text-sm font-mono border border-[var(--color-border)] rounded-lg outline-none focus:ring-2 focus:ring-[var(--color-accent)] focus:border-transparent"
        />
      </div>

      {/* Date string input */}
      <div>
        <label className="block text-xs font-medium text-[var(--color-muted)] mb-1.5">
          Date string → Unix (ISO 8601 or any parseable format)
        </label>
        <input
          type="text"
          value={dateInput}
          onChange={(e) => handleDateChange(e.target.value)}
          placeholder="2024-11-15T00:00:00Z"
          className="w-full px-3 py-2 text-sm font-mono border border-[var(--color-border)] rounded-lg outline-none focus:ring-2 focus:ring-[var(--color-accent)] focus:border-transparent"
        />
      </div>

      {/* Converted outputs */}
      {date ? (
        <div className="space-y-2">
          <div className="text-xs font-medium text-[var(--color-muted)] uppercase tracking-wide">Converted</div>
          {formatRow('Unix (s)', String(Math.floor(date.getTime() / 1000)), 'unix', copied, copy)}
          {formatRow('ISO 8601', date.toISOString(), 'iso', copied, copy)}
          {formatRow('UTC', date.toUTCString(), 'utc', copied, copy)}
          {formatRow('Local', date.toLocaleString(), 'local', copied, copy)}
        </div>
      ) : unix.trim() ? (
        <div className="p-3 text-sm text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
          Could not parse "{unix}" as a timestamp
        </div>
      ) : null}
    </div>
  );
}
