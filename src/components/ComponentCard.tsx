'use client';

import { getCategoryInfo, type CategoryType } from '@/lib/types';
import { useStackBuilder } from '@/store/stackBuilder';
import { Download, Plus, Check, Copy } from 'lucide-react';
import { useState } from 'react';
import { copyToClipboard } from '@/lib/clipboard';

interface ComponentCardProps {
  id: string;
  name: string;
  slug: string;
  description: string;
  category: CategoryType;
  installCommand: string;
  downloads: number;
  tags: string[];
  companyName?: string;
}

export function ComponentCard({
  id,
  name,
  slug,
  description,
  category,
  installCommand,
  downloads,
  tags,
  companyName,
}: ComponentCardProps) {
  const { addItem, removeItem, hasItem } = useStackBuilder();
  const [copied, setCopied] = useState(false);
  const isInStack = hasItem(id);
  const cat = getCategoryInfo(category);

  const toggleStack = () => {
    if (isInStack) {
      removeItem(id);
    } else {
      addItem({ id, name, slug, category, installCommand });
    }
  };

  const copyInstall = async () => {
    const copiedToClipboard = await copyToClipboard(`npx codex-templates@latest add ${installCommand}`);
    if (!copiedToClipboard) return;

    setCopied(true);
    // Track download
    fetch('/api/analytics/download', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ componentId: id }),
    }).catch(() => {});
    setTimeout(() => setCopied(false), 2000);
  };

  const formatDownloads = (n: number) => {
    if (n >= 1000) return `${(n / 1000).toFixed(1)}k`;
    return n.toString();
  };

  return (
    <div className="card p-4 flex flex-col h-full">
      <div className="flex items-start justify-between mb-2">
        <div className="flex items-center gap-2">
          <span className="text-lg">{cat?.emoji}</span>
          <h3 className="font-semibold text-dark-text text-sm">{name}</h3>
        </div>
        <button
          type="button"
          onClick={toggleStack}
          aria-label={isInStack ? `Remove ${name} from stack` : `Add ${name} to stack`}
          className={`flex items-center gap-1 text-xs px-2 py-1 rounded-md transition-colors ${
            isInStack
              ? 'bg-accent-green/20 text-accent-green'
              : 'bg-dark-bg text-dark-muted hover:text-dark-text hover:bg-dark-border'
          }`}
        >
          {isInStack ? <Check className="w-3 h-3" /> : <Plus className="w-3 h-3" />}
          {isInStack ? 'Added' : 'Add'}
        </button>
      </div>

      <p className="text-dark-muted text-xs leading-relaxed mb-3 flex-1">{description}</p>

      <div className="flex flex-wrap gap-1 mb-3">
        {tags.slice(0, 3).map(tag => (
          <span key={tag} className="badge bg-dark-bg text-dark-muted border border-dark-border">
            {tag}
          </span>
        ))}
      </div>

      <div className="flex items-center justify-between mt-auto pt-3 border-t border-dark-border">
        <div className="flex items-center gap-3 text-xs text-dark-muted">
          <span className="flex items-center gap-1">
            <Download className="w-3 h-3" />
            {formatDownloads(downloads)}
          </span>
          {companyName && <span>{companyName}</span>}
        </div>
        <button
          type="button"
          onClick={copyInstall}
          aria-label={`Copy install command for ${name}`}
          className="flex items-center gap-1 text-xs text-dark-muted hover:text-accent-green transition-colors font-mono"
        >
          {copied ? <Check className="w-3 h-3 text-accent-green" /> : <Copy className="w-3 h-3" />}
          {copied ? 'Copied!' : 'Install'}
        </button>
      </div>
    </div>
  );
}
