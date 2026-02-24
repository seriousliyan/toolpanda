import { useState } from 'react';
import { marked } from 'marked';

const DEFAULT_MD = `# Hello, ToolPanda!

Write **Markdown** here and see a *live preview*.

## Features

- Headings, lists, and links
- \`inline code\` and code blocks
- > Blockquotes

\`\`\`js
console.log("Hello!");
\`\`\`

---

[Learn Markdown](https://www.markdownguide.org)
`;

export default function MarkdownPreview() {
  const [md, setMd] = useState(DEFAULT_MD);

  const html = marked(md) as string;

  return (
    <div className="space-y-2">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div>
          <div className="text-xs font-medium text-[var(--color-muted)] mb-1.5">Markdown</div>
          <textarea
            value={md}
            onChange={(e) => setMd(e.target.value)}
            className="w-full h-[480px] p-3 text-sm font-mono border border-[var(--color-border)] rounded-lg resize-none outline-none focus:ring-2 focus:ring-[var(--color-accent)] focus:border-transparent"
          />
        </div>
        <div>
          <div className="text-xs font-medium text-[var(--color-muted)] mb-1.5">Preview</div>
          <div
            className="h-[480px] overflow-y-auto p-4 bg-[var(--color-surface)] border border-[var(--color-border)] rounded-lg text-gray-800 dark:text-slate-200 prose prose-sm max-w-none"
            dangerouslySetInnerHTML={{ __html: html }}
          />
        </div>
      </div>
    </div>
  );
}
