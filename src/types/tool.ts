import type React from 'react';

export type ToolCategory = 'text' | 'encoders' | 'formatters' | 'generators' | 'converters';

export interface ToolManifest {
  id: string;
  name: string;
  description: string;
  category: ToolCategory;
  tags: string[];
  icon: string;
  load: () => Promise<{ default: React.ComponentType }>;
}
