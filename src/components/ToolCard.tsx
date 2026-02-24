import { useNavigate } from 'react-router-dom';
import type { ToolManifest } from '../types/tool';

interface ToolCardProps {
  tool: ToolManifest;
}

const CATEGORY_COLORS: Record<string, string> = {
  text: 'bg-purple-50 text-purple-700 dark:bg-purple-900/30 dark:text-purple-300',
  encoders: 'bg-blue-50 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300',
  formatters: 'bg-green-50 text-green-700 dark:bg-green-900/30 dark:text-green-300',
  generators: 'bg-orange-50 text-orange-700 dark:bg-orange-900/30 dark:text-orange-300',
  converters: 'bg-teal-50 text-teal-700 dark:bg-teal-900/30 dark:text-teal-300',
};

export default function ToolCard({ tool }: ToolCardProps) {
  const navigate = useNavigate();

  return (
    <button
      onClick={() => navigate(`/tools/${tool.id}`)}
      className="group flex flex-col items-start gap-3 p-5 bg-white dark:bg-slate-900 border border-[var(--color-border)] rounded-[var(--radius-card)] text-left hover:border-[var(--color-accent)] hover:shadow-md transition-all duration-150 outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-accent)]"
    >
      <div className="flex items-center gap-3 w-full">
        <span className="text-2xl">{tool.icon}</span>
        <div className="flex-1 min-w-0">
          <h3 className="font-semibold text-gray-900 dark:text-slate-100 text-sm leading-tight group-hover:text-[var(--color-accent)] transition-colors">
            {tool.name}
          </h3>
        </div>
        <span className={`shrink-0 text-xs font-medium px-2 py-0.5 rounded-full capitalize ${CATEGORY_COLORS[tool.category] ?? ''}`}>
          {tool.category}
        </span>
      </div>
      <p className="text-xs text-[var(--color-muted)] leading-relaxed line-clamp-2">
        {tool.description}
      </p>
    </button>
  );
}
