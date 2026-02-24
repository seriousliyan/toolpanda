import { useState } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { Copy, Check, RefreshCw } from 'lucide-react';

export default function UuidGenerator() {
  const [count, setCount] = useState(5);
  const [uuids, setUuids] = useState<string[]>(() => Array.from({ length: 5 }, () => uuidv4()));
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);
  const [copiedAll, setCopiedAll] = useState(false);

  function generate() {
    setUuids(Array.from({ length: count }, () => uuidv4()));
  }

  function copyOne(i: number) {
    navigator.clipboard.writeText(uuids[i]);
    setCopiedIndex(i);
    setTimeout(() => setCopiedIndex(null), 1500);
  }

  function copyAll() {
    navigator.clipboard.writeText(uuids.join('\n'));
    setCopiedAll(true);
    setTimeout(() => setCopiedAll(false), 1500);
  }

  return (
    <div className="space-y-5">
      <div className="flex items-center gap-3 flex-wrap">
        <div className="flex items-center gap-2">
          <label className="text-sm text-[var(--color-muted)]">Count:</label>
          <input
            type="number"
            min={1}
            max={50}
            value={count}
            onChange={(e) => setCount(Math.min(50, Math.max(1, Number(e.target.value))))}
            className="w-16 px-2 py-1.5 text-sm border border-[var(--color-border)] rounded-lg outline-none focus:ring-2 focus:ring-[var(--color-accent)] focus:border-transparent text-center"
          />
        </div>
        <button
          onClick={generate}
          className="flex items-center gap-2 px-4 py-1.5 bg-[var(--color-accent)] text-white text-sm font-medium rounded-lg hover:bg-[var(--color-accent-hover)] transition"
        >
          <RefreshCw className="w-3.5 h-3.5" /> Generate
        </button>
        <button
          onClick={copyAll}
          className="flex items-center gap-2 px-3 py-1.5 text-sm text-gray-700 dark:text-slate-300 border border-[var(--color-border)] rounded-lg hover:bg-gray-100 dark:hover:bg-slate-700 transition ml-auto"
        >
          {copiedAll ? <><Check className="w-3.5 h-3.5 text-green-600 dark:text-green-400" /> Copied all</> : <><Copy className="w-3.5 h-3.5" /> Copy all</>}
        </button>
      </div>

      <div className="space-y-1.5">
        {uuids.slice(0, count).map((uuid, i) => (
          <div key={i} className="flex items-center gap-3 px-3 py-2 bg-[var(--color-surface)] border border-[var(--color-border)] rounded-lg group">
            <span className="flex-1 font-mono text-sm text-gray-800 dark:text-slate-200">{uuid}</span>
            <button
              onClick={() => copyOne(i)}
              className="p-1 rounded hover:bg-gray-200 dark:hover:bg-slate-700 transition opacity-0 group-hover:opacity-100"
              title="Copy"
            >
              {copiedIndex === i ? <Check className="w-3.5 h-3.5 text-green-600 dark:text-green-400" /> : <Copy className="w-3.5 h-3.5 text-[var(--color-muted)]" />}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
