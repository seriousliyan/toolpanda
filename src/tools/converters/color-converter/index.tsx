import { useState } from 'react';
import { Copy, Check } from 'lucide-react';

interface RGB { r: number; g: number; b: number }
interface HSL { h: number; s: number; l: number }

function hexToRgb(hex: string): RGB | null {
  const clean = hex.replace('#', '');
  const full = clean.length === 3
    ? clean.split('').map((c) => c + c).join('')
    : clean;
  if (!/^[0-9a-f]{6}$/i.test(full)) return null;
  return {
    r: parseInt(full.slice(0, 2), 16),
    g: parseInt(full.slice(2, 4), 16),
    b: parseInt(full.slice(4, 6), 16),
  };
}

function rgbToHex({ r, g, b }: RGB): string {
  return '#' + [r, g, b].map((v) => v.toString(16).padStart(2, '0')).join('');
}

function rgbToHsl({ r, g, b }: RGB): HSL {
  const rn = r / 255, gn = g / 255, bn = b / 255;
  const max = Math.max(rn, gn, bn), min = Math.min(rn, gn, bn);
  const l = (max + min) / 2;
  if (max === min) return { h: 0, s: 0, l: Math.round(l * 100) };
  const d = max - min;
  const s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
  let h = 0;
  if (max === rn) h = ((gn - bn) / d + (gn < bn ? 6 : 0)) / 6;
  else if (max === gn) h = ((bn - rn) / d + 2) / 6;
  else h = ((rn - gn) / d + 4) / 6;
  return { h: Math.round(h * 360), s: Math.round(s * 100), l: Math.round(l * 100) };
}

function hslToRgb({ h, s, l }: HSL): RGB {
  const sn = s / 100, ln = l / 100;
  const c = (1 - Math.abs(2 * ln - 1)) * sn;
  const x = c * (1 - Math.abs((h / 60) % 2 - 1));
  const m = ln - c / 2;
  let r = 0, g = 0, b = 0;
  if (h < 60) { r = c; g = x; }
  else if (h < 120) { r = x; g = c; }
  else if (h < 180) { g = c; b = x; }
  else if (h < 240) { g = x; b = c; }
  else if (h < 300) { r = x; b = c; }
  else { r = c; b = x; }
  return { r: Math.round((r + m) * 255), g: Math.round((g + m) * 255), b: Math.round((b + m) * 255) };
}

function clamp(n: number, min: number, max: number) { return Math.min(max, Math.max(min, n)); }

type Copied = 'hex' | 'rgb' | 'hsl' | null;

export default function ColorConverter() {
  const [hex, setHex] = useState('#3b82f6');
  const [copied, setCopied] = useState<Copied>(null);

  const rgb = hexToRgb(hex) ?? { r: 59, g: 130, b: 246 };
  const hsl = rgbToHsl(rgb);
  const validHex = hexToRgb(hex) !== null;

  function fromRgb(field: keyof RGB, val: number) {
    const next = { ...rgb, [field]: clamp(val, 0, 255) };
    setHex(rgbToHex(next));
  }

  function fromHsl(field: keyof HSL, val: number) {
    const max = field === 'h' ? 360 : 100;
    const next = { ...hsl, [field]: clamp(val, 0, max) };
    setHex(rgbToHex(hslToRgb(next)));
  }

  function copy(type: Copied, value: string) {
    navigator.clipboard.writeText(value);
    setCopied(type);
    setTimeout(() => setCopied(null), 1500);
  }

  const previewColor = validHex ? hex : rgbToHex(rgb);

  const CopyBtn = ({ type, value }: { type: Copied; value: string }) => (
    <button onClick={() => copy(type, value)} className="p-1 rounded hover:bg-gray-200 dark:hover:bg-slate-700 transition shrink-0">
      {copied === type
        ? <Check className="w-3.5 h-3.5 text-green-600 dark:text-green-400" />
        : <Copy className="w-3.5 h-3.5 text-[var(--color-muted)]" />}
    </button>
  );

  return (
    <div className="space-y-6">
      {/* Color preview + picker */}
      <div className="flex items-center gap-4">
        <div
          className="w-20 h-20 rounded-xl border border-[var(--color-border)] shrink-0 shadow-sm"
          style={{ backgroundColor: previewColor }}
        />
        <div className="flex-1 space-y-2">
          <label className="block text-xs font-medium text-[var(--color-muted)]">Color picker</label>
          <input
            type="color"
            value={previewColor}
            onChange={(e) => setHex(e.target.value)}
            className="w-full h-10 rounded-lg border border-[var(--color-border)] cursor-pointer bg-transparent"
          />
        </div>
      </div>

      {/* HEX */}
      <div>
        <div className="flex items-center justify-between mb-1.5">
          <label className="text-xs font-medium text-[var(--color-muted)]">HEX</label>
          <CopyBtn type="hex" value={previewColor} />
        </div>
        <input
          type="text"
          value={hex}
          onChange={(e) => setHex(e.target.value)}
          placeholder="#3b82f6"
          spellCheck={false}
          className={[
            'w-full px-3 py-2 text-sm font-mono border rounded-lg outline-none focus:ring-2 focus:ring-[var(--color-accent)] focus:border-transparent',
            !validHex ? 'border-red-400' : 'border-[var(--color-border)]',
          ].join(' ')}
        />
      </div>

      {/* RGB */}
      <div>
        <div className="flex items-center justify-between mb-1.5">
          <label className="text-xs font-medium text-[var(--color-muted)]">RGB</label>
          <CopyBtn type="rgb" value={`rgb(${rgb.r}, ${rgb.g}, ${rgb.b})`} />
        </div>
        <div className="grid grid-cols-3 gap-2">
          {(['r', 'g', 'b'] as (keyof RGB)[]).map((ch) => (
            <div key={ch}>
              <div className="text-xs text-[var(--color-muted)] text-center mb-1">{ch.toUpperCase()}</div>
              <input
                type="number"
                min={0}
                max={255}
                value={rgb[ch]}
                onChange={(e) => fromRgb(ch, Number(e.target.value))}
                className="w-full px-2 py-1.5 text-sm font-mono border border-[var(--color-border)] rounded-lg outline-none focus:ring-2 focus:ring-[var(--color-accent)] text-center"
              />
            </div>
          ))}
        </div>
        <div className="text-xs font-mono text-[var(--color-muted)] mt-1.5 text-center">
          rgb({rgb.r}, {rgb.g}, {rgb.b})
        </div>
      </div>

      {/* HSL */}
      <div>
        <div className="flex items-center justify-between mb-1.5">
          <label className="text-xs font-medium text-[var(--color-muted)]">HSL</label>
          <CopyBtn type="hsl" value={`hsl(${hsl.h}, ${hsl.s}%, ${hsl.l}%)`} />
        </div>
        <div className="grid grid-cols-3 gap-2">
          {([
            { key: 'h', label: 'H', max: 360 },
            { key: 's', label: 'S%', max: 100 },
            { key: 'l', label: 'L%', max: 100 },
          ] as { key: keyof HSL; label: string; max: number }[]).map(({ key, label, max }) => (
            <div key={key}>
              <div className="text-xs text-[var(--color-muted)] text-center mb-1">{label}</div>
              <input
                type="number"
                min={0}
                max={max}
                value={hsl[key]}
                onChange={(e) => fromHsl(key, Number(e.target.value))}
                className="w-full px-2 py-1.5 text-sm font-mono border border-[var(--color-border)] rounded-lg outline-none focus:ring-2 focus:ring-[var(--color-accent)] text-center"
              />
            </div>
          ))}
        </div>
        <div className="text-xs font-mono text-[var(--color-muted)] mt-1.5 text-center">
          hsl({hsl.h}, {hsl.s}%, {hsl.l}%)
        </div>
      </div>
    </div>
  );
}
