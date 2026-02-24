import React, { Suspense, useEffect } from 'react';
import { useParams, Navigate } from 'react-router-dom';
import ToolShell from '../components/ToolShell';
import { tools } from '../registry';
import { addRecent } from './HomePage';

function ToolSkeleton() {
  return (
    <div className="animate-pulse space-y-4">
      <div className="h-4 bg-gray-200 dark:bg-slate-700 rounded w-3/4" />
      <div className="h-32 bg-gray-200 dark:bg-slate-700 rounded" />
      <div className="h-4 bg-gray-200 dark:bg-slate-700 rounded w-1/2" />
    </div>
  );
}

class ToolErrorBoundary extends React.Component<
  { children: React.ReactNode },
  { hasError: boolean; error: Error | null }
> {
  constructor(props: { children: React.ReactNode }) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error) {
    return { hasError: true, error };
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="text-center py-8 text-red-600 dark:text-red-400">
          <p className="text-2xl mb-2">⚠️</p>
          <p className="font-medium">Failed to load tool</p>
          <p className="text-sm text-[var(--color-muted)] mt-1">
            {this.state.error?.message ?? 'Unknown error'}
          </p>
        </div>
      );
    }
    return this.props.children;
  }
}

export default function ToolPage() {
  const { toolId } = useParams<{ toolId: string }>();
  const manifest = tools.find((t) => t.id === toolId);

  useEffect(() => {
    if (manifest) {
      addRecent(manifest.id);
      document.title = `${manifest.name} — ToolPanda`;
    }
    return () => {
      document.title = 'ToolPanda — Browser Tools Hub';
    };
  }, [manifest]);

  if (!manifest) {
    return <Navigate to="/" replace />;
  }

  const ToolComponent = React.lazy(manifest.load);

  return (
    <ToolShell manifest={manifest}>
      <ToolErrorBoundary>
        <Suspense fallback={<ToolSkeleton />}>
          <ToolComponent />
        </Suspense>
      </ToolErrorBoundary>
    </ToolShell>
  );
}
