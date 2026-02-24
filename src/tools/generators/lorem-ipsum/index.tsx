import { useState } from 'react';
import { Copy, Check } from 'lucide-react';

const LOREM_WORDS = [
  'lorem', 'ipsum', 'dolor', 'sit', 'amet', 'consectetur', 'adipiscing', 'elit',
  'sed', 'do', 'eiusmod', 'tempor', 'incididunt', 'ut', 'labore', 'et', 'dolore',
  'magna', 'aliqua', 'enim', 'ad', 'minim', 'veniam', 'quis', 'nostrud',
  'exercitation', 'ullamco', 'laboris', 'nisi', 'aliquip', 'commodo', 'consequat',
  'duis', 'aute', 'irure', 'in', 'reprehenderit', 'voluptate', 'velit', 'esse',
  'cillum', 'fugiat', 'nulla', 'pariatur', 'excepteur', 'sint', 'occaecat',
  'cupidatat', 'non', 'proident', 'sunt', 'culpa', 'qui', 'officia', 'deserunt',
  'mollit', 'anim', 'id', 'est', 'laborum',
];

function randomWord(exclude?: string): string {
  let w: string;
  do { w = LOREM_WORDS[Math.floor(Math.random() * LOREM_WORDS.length)]; } while (w === exclude);
  return w;
}

function sentence(wordCount = 8): string {
  const words = Array.from({ length: wordCount }, (_, i) => i === 0 ? randomWord() : randomWord());
  words[0] = words[0].charAt(0).toUpperCase() + words[0].slice(1);
  return words.join(' ') + '.';
}

function paragraph(sentenceCount = 5): string {
  return Array.from({ length: sentenceCount }, () => sentence(5 + Math.floor(Math.random() * 8))).join(' ');
}

type GenType = 'words' | 'sentences' | 'paragraphs';

export default function LoremIpsum() {
  const [type, setType] = useState<GenType>('paragraphs');
  const [count, setCount] = useState(3);
  const [result, setResult] = useState('');
  const [copied, setCopied] = useState(false);

  function generate() {
    let text = '';
    if (type === 'words') {
      text = Array.from({ length: count }, randomWord).join(' ');
    } else if (type === 'sentences') {
      text = Array.from({ length: count }, () => sentence()).join(' ');
    } else {
      text = Array.from({ length: count }, () => paragraph()).join('\n\n');
    }
    setResult(text);
  }

  function copy() {
    if (!result) return;
    navigator.clipboard.writeText(result);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  }

  return (
    <div className="space-y-5">
      <div className="flex flex-wrap gap-3 items-center">
        <div className="flex gap-2">
          {(['words', 'sentences', 'paragraphs'] as GenType[]).map((t) => (
            <button
              key={t}
              onClick={() => setType(t)}
              className={[
                'px-3 py-1.5 text-sm font-medium rounded-lg transition capitalize',
                type === t
                  ? 'bg-[var(--color-accent)] text-white'
                  : 'bg-[var(--color-surface)] text-gray-700 dark:text-slate-300 hover:bg-gray-200 dark:hover:bg-slate-700 border border-[var(--color-border)]',
              ].join(' ')}
            >
              {t}
            </button>
          ))}
        </div>
        <div className="flex items-center gap-2">
          <label className="text-sm text-[var(--color-muted)]">Count:</label>
          <input
            type="number"
            min={1}
            max={50}
            value={count}
            onChange={(e) => setCount(Math.min(50, Math.max(1, Number(e.target.value))))}
            className="w-16 px-2 py-1.5 text-sm border border-[var(--color-border)] rounded-lg outline-none focus:ring-2 focus:ring-[var(--color-accent)] text-center"
          />
        </div>
        <button
          onClick={generate}
          className="px-4 py-1.5 bg-[var(--color-accent)] text-white text-sm font-medium rounded-lg hover:bg-[var(--color-accent-hover)] transition"
        >
          Generate
        </button>
      </div>

      {result && (
        <div>
          <div className="flex items-center justify-between mb-1.5">
            <label className="text-xs font-medium text-[var(--color-muted)]">Output</label>
            <button onClick={copy} className="flex items-center gap-1 text-xs text-[var(--color-muted)] hover:text-gray-900 dark:hover:text-slate-100 transition">
              {copied ? <><Check className="w-3.5 h-3.5 text-green-600 dark:text-green-400" /> Copied</> : <><Copy className="w-3.5 h-3.5" /> Copy</>}
            </button>
          </div>
          <textarea
            readOnly
            value={result}
            className="w-full h-64 p-3 text-sm bg-[var(--color-surface)] border border-[var(--color-border)] rounded-lg resize-none outline-none"
          />
        </div>
      )}

      {!result && (
        <div className="text-center py-10 text-[var(--color-muted)] text-sm">
          Click Generate to produce Lorem Ipsum text
        </div>
      )}
    </div>
  );
}
