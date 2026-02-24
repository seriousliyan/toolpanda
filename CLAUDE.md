# ToolPanda — Claude Reference

## Project
Client-side tool hub. All tools run 100% in the browser. No backend.
- **Stack**: React 19 + Vite 7 + TypeScript + Tailwind CSS v4 (`@tailwindcss/vite` plugin)
- **Router**: React Router v6 `createBrowserRouter`
- **Location**: `/Users/noralee/toolpanda`

## Commands
```bash
npm run dev      # dev server
npm run build    # production build (tsc -b && vite build)
npm run preview  # preview production build
```

## Key Files
| File | Purpose |
|------|---------|
| `src/registry/index.ts` | Central tool manifest array — the only file to edit when adding a tool |
| `src/types/tool.ts` | `ToolManifest` and `ToolCategory` types |
| `src/App.tsx` | Routes: `/` → HomeLayout, `/tools/:toolId` → ToolLayout |
| `src/pages/HomePage.tsx` | Search + category filter logic; exports `addRecent()` |
| `src/pages/ToolPage.tsx` | `React.lazy` loads tool, error boundary, sets page title |
| `src/components/ToolShell.tsx` | Wrapper for tool pages (back link + heading) |
| `src/index.css` | `@import "tailwindcss"` + `@theme` tokens + `.dark` overrides |
| `src/hooks/useTheme.ts` | Dark mode toggle — reads/writes `toolpanda:theme` in localStorage, applies `.dark` class to `<html>` |
| `src/hooks/useFavorites.ts` | Favorites state — reads/writes `toolpanda:favorites` in localStorage, max 8 tools |

## Tool Categories
`text` | `encoders` | `formatters` | `generators` | `converters`

## Adding a New Tool — 2 Steps
1. Create `src/tools/<category>/<tool-id>/index.tsx` — default export a React component
2. Add one entry to the `tools` array in `src/registry/index.ts`:
```ts
{
  id: 'my-tool',          // URL slug → /tools/my-tool
  name: 'My Tool',
  description: 'One-liner shown on card',
  category: 'converters', // text | encoders | formatters | generators | converters
  tags: ['keyword', ...], // searched by search bar
  icon: '🔧',
  load: () => import('../tools/converters/my-tool'),
}
```

## Design Tokens (CSS vars from @theme / .dark)
| Var | Light | Dark |
|-----|-------|------|
| `--color-accent` | `#3b82f6` | (unchanged) |
| `--color-accent-hover` | `#2563eb` | (unchanged) |
| `--color-bg` | `#ffffff` | `#0f172a` |
| `--color-fg` | `#111827` | `#f1f5f9` |
| `--color-surface` | `#f8f9fa` | `#1e293b` |
| `--color-border` | `#e5e7eb` | `#334155` |
| `--color-muted` | `#6b7280` | `#94a3b8` |
| `--color-input-bg` | `#ffffff` | `#1e293b` |
| `--font-mono` | JetBrains Mono | — |
| `--radius-card` | `10px` | — |

Dark mode is class-based (`.dark` on `<html>`). Toggle configured with `@custom-variant dark (&:where(.dark, .dark *))`. `textarea`/`input` backgrounds are handled globally in CSS via `--color-input-bg`, so tool components don't need explicit dark bg on inputs.

## Current Tools (18)
| ID | Name | Category |
|----|------|----------|
| `word-counter` | Word Counter | text |
| `case-converter` | Case Converter | text |
| `text-diff` | Text Diff | text |
| `regex-tester` | Regex Tester | text |
| `base64` | Base64 | encoders |
| `url-encode` | URL Encode / Decode | encoders |
| `jwt-decoder` | JWT Decoder | encoders |
| `html-entities` | HTML Entities | encoders |
| `json-formatter` | JSON Formatter | formatters |
| `markdown-preview` | Markdown Preview | formatters |
| `uuid-generator` | UUID Generator | generators |
| `lorem-ipsum` | Lorem Ipsum | generators |
| `password-generator` | Password Generator | generators |
| `color-converter` | Color Converter | converters |
| `timestamp` | Timestamp Converter | converters |
| `csv-to-json` | CSV → JSON | converters |
| `number-base` | Number Base Converter | converters |
| `pomodoro` | Pomodoro Timer | generators |

## Architecture Notes
- Tools are **lazy-loaded** — each ships as a separate Vite chunk; zero tool code on the home page
- `localStorage` key `toolpanda:recent` stores last **4** visited tool IDs (matches the 4-column xl grid)
- `localStorage` key `toolpanda:theme` stores `'light'` or `'dark'`; falls back to `prefers-color-scheme`
- `localStorage` key `toolpanda:favorites` stores up to **8** favorited tool IDs; shown above Recently Used on home page
- **Favorites UX**: star icon appears on card hover (top-right, absolute-positioned sibling button) and always visible next to tool title in ToolShell. `ToolCard` must receive `onToggleFavorite` prop to show the star — cards without it (future read-only contexts) render without the star. `ToolCard` outer element is `<div>` (not `<button>`) to allow valid HTML nesting of the star `<button>` alongside the navigate `<button>`.
- Unknown `:toolId` routes redirect to `/` via `<Navigate replace>`
- Error boundary in `ToolPage` catches broken tool components gracefully
- `document.title` is set per tool on mount and restored on unmount

## Known Gotchas
- `uuid` v13: call as `uuidv4()` with no args — `Array.from({length: n}, uuidv4)` breaks because `Array.from` passes `(value, index)` to the mapper, triggering the buffer overload
- Tailwind v4 uses `@import "tailwindcss"` + `@theme {}` in CSS — no `tailwind.config.js`
- `@tailwindcss/vite` plugin must come **before** `@vitejs/plugin-react` in `vite.config.ts`
