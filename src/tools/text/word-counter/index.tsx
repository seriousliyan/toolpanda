import { useState } from 'react';

function countStats(text: string) {
  const trimmed = text.trim();
  const words = trimmed === '' ? 0 : trimmed.split(/\s+/).length;
  const chars = text.length;
  const charsNoSpace = text.replace(/\s/g, '').length;
  const sentences = trimmed === '' ? 0 : trimmed.split(/[.!?]+/).filter(Boolean).length;
  const paragraphs = trimmed === '' ? 0 : text.split(/\n\s*\n/).filter((p) => p.trim()).length;
  const readingTime = Math.max(1, Math.ceil(words / 200));
  return { words, chars, charsNoSpace, sentences, paragraphs, readingTime };
}

const STAT_ITEMS = [
  { key: 'words', label: 'Words' },
  { key: 'chars', label: 'Characters' },
  { key: 'charsNoSpace', label: 'Chars (no spaces)' },
  { key: 'sentences', label: 'Sentences' },
  { key: 'paragraphs', label: 'Paragraphs' },
  { key: 'readingTime', label: 'Read time (min)' },
] as const;

export default function WordCounter() {
  const [text, setText] = useState('');
  const stats = countStats(text);

  return (
    <div className="space-y-5">
      <textarea
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder="Paste or type your text here…"
        className="w-full h-52 p-3 text-sm font-mono border border-[var(--color-border)] rounded-lg resize-none outline-none focus:ring-2 focus:ring-[var(--color-accent)] focus:border-transparent"
      />
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
        {STAT_ITEMS.map(({ key, label }) => (
          <div key={key} className="bg-[var(--color-surface)] rounded-lg p-4 text-center">
            <div className="text-2xl font-bold text-[var(--color-accent)]">{stats[key]}</div>
            <div className="text-xs text-[var(--color-muted)] mt-1">{label}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
