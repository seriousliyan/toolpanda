import { useState, useMemo } from 'react';
import { Copy, Check } from 'lucide-react';

function parseCsv(raw: string, delimiter: string): { headers: string[]; rows: Record<string, string>[] } | null {
  const lines = raw.trim().split('\n').filter(Boolean);
  if (lines.length < 1) return null;

  function splitLine(line: string): string[] {
    const result: string[] = [];
    let current = '';
    let inQuotes = false;
    for (let i = 0; i < line.length; i++) {
      const ch = line[i];
      if (ch === '"') {
        if (inQuotes && line[i + 1] === '"') { current += '"'; i++; }
        else inQuotes = !inQuotes;
      } else if (ch === delimiter && !inQuotes) {
        result.push(current.trim());
        current = '';
      } else {
        current += ch;
      }
    }
    result.push(current.trim());
    return result;
  }

  const headers = splitLine(lines[0]);
  const rows = lines.slice(1).map((line) => {
    const values = splitLine(line);
    return Object.fromEntries(headers.map((h, i) => [h, values[i] ?? '']));
  });
  return { headers, rows };
}

type Copied = 'compact' | 'pretty' | null;

export default function CsvToJson() {
  const [csv, setCsv] = useState('name,age,city\nAlice,30,New York\nBob,25,London\nCarol,35,Tokyo');
  const [delimiter, setDelimiter] = useState(',');
  const [copied, setCopied] = useState<Copied>(null);

  const { result, error } = useMemo(() => {
    if (!csv.trim()) return { result: null, error: '' };
    try {
      const parsed = parseCsv(csv, delimiter || ',');
      if (!parsed) return { result: null, error: 'Could not parse CSV' };
      return { result: parsed.rows, error: '' };
    } catch (e) {
      return { result: null, error: e instanceof Error ? e.message : 'Parse error' };
    }
  }, [csv, delimiter]);

  const prettyJson = result ? JSON.stringify(result, null, 2) : '';
  const compactJson = result ? JSON.stringify(result) : '';

  function copy(type: Copied, value: string) {
    navigator.clipboard.writeText(value);
    setCopied(type);
    setTimeout(() => setCopied(null), 1500);
  }

  return (
    <div className="space-y-4">
      {/* Controls */}
      <div className="flex items-center gap-4 flex-wrap">
        <div className="flex items-center gap-2">
          <label className="text-xs text-[var(--color-muted)]">Delimiter:</label>
          <select
            value={delimiter}
            onChange={(e) => setDelimiter(e.target.value)}
            className="text-sm border border-[var(--color-border)] rounded-lg px-2 py-1.5 outline-none focus:ring-2 focus:ring-[var(--color-accent)] bg-[var(--color-input-bg)] text-gray-800 dark:text-slate-200"
          >
            <option value=",">, (comma)</option>
            <option value=";">; (semicolon)</option>
            <option value={'\t'}>⇥ (tab)</option>
            <option value="|">| (pipe)</option>
          </select>
        </div>
        {result && (
          <span className="text-xs text-[var(--color-muted)] ml-auto">
            {result.length} row{result.length !== 1 ? 's' : ''}
          </span>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* CSV input */}
        <div>
          <label className="block text-xs font-medium text-[var(--color-muted)] mb-1.5">CSV input</label>
          <textarea
            value={csv}
            onChange={(e) => setCsv(e.target.value)}
            spellCheck={false}
            className="w-full h-56 p-3 text-sm font-mono border border-[var(--color-border)] rounded-lg resize-none outline-none focus:ring-2 focus:ring-[var(--color-accent)] focus:border-transparent"
          />
        </div>

        {/* JSON output */}
        <div>
          <div className="flex items-center justify-between mb-1.5">
            <label className="text-xs font-medium text-[var(--color-muted)]">JSON output</label>
            {result && (
              <div className="flex gap-2">
                <button
                  onClick={() => copy('compact', compactJson)}
                  className="flex items-center gap-1 text-xs text-[var(--color-muted)] hover:text-gray-900 dark:hover:text-slate-100 transition"
                >
                  {copied === 'compact' ? <Check className="w-3.5 h-3.5 text-green-600 dark:text-green-400" /> : <Copy className="w-3.5 h-3.5" />}
                  Minified
                </button>
                <button
                  onClick={() => copy('pretty', prettyJson)}
                  className="flex items-center gap-1 text-xs text-[var(--color-muted)] hover:text-gray-900 dark:hover:text-slate-100 transition"
                >
                  {copied === 'pretty' ? <Check className="w-3.5 h-3.5 text-green-600 dark:text-green-400" /> : <Copy className="w-3.5 h-3.5" />}
                  Pretty
                </button>
              </div>
            )}
          </div>
          {error ? (
            <div className="p-3 text-sm text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">{error}</div>
          ) : (
            <pre className="h-56 p-3 text-sm font-mono bg-[var(--color-surface)] border border-[var(--color-border)] rounded-lg overflow-auto text-gray-800 dark:text-slate-200 whitespace-pre">
              {prettyJson || <span className="text-[var(--color-muted)]">JSON will appear here…</span>}
            </pre>
          )}
        </div>
      </div>
    </div>
  );
}
