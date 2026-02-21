'use client';

import { useStackBuilder } from '@/store/stackBuilder';
import { CATEGORIES } from '@/lib/types';
import { Copy, Trash2, X } from 'lucide-react';
import { useState } from 'react';
import { copyToClipboard } from '@/lib/clipboard';

export function StackBuilderSidebar() {
  const { items, removeItem, clearAll, getCommand } = useStackBuilder();
  const [copied, setCopied] = useState(false);
  const command = getCommand();

  const copyCommand = async () => {
    if (!command) return;
    const copiedToClipboard = await copyToClipboard(command);
    if (!copiedToClipboard) return;
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const shareToX = () => {
    const text = `Check out my Codex stack! ${command}`;
    window.open(`https://x.com/intent/tweet?text=${encodeURIComponent(text)}`, '_blank');
  };

  return (
    <div className="w-full flex flex-col font-mono text-sm">
      <div className="flex items-center justify-between border-b border-dark-border pb-3 mb-6">
        <h3 className="font-bold text-white text-lg">Stack Builder</h3>
        {items.length > 0 && (
          <button
            onClick={clearAll}
            className="text-dark-muted hover:text-red-400 text-[10px] uppercase tracking-wider flex items-center gap-1 transition-colors"
          >
            Clear All ({items.length})
          </button>
        )}
      </div>

      {items.length === 0 && (
        <div className="flex flex-col text-dark-muted mb-8 text-xs gap-1">
          <span className="text-xl mb-1">🛒</span>
          <p className="font-bold text-white">Your stack is empty</p>
          <p className="leading-relaxed opacity-70">Add agents, commands, settings, hooks, or skills to build your development stack</p>
        </div>
      )}

      <div className="flex flex-col gap-6">
        {CATEGORIES.map(cat => {
          const catItems = items.filter(i => i.category === cat.slug);
          
          return (
            <div key={cat.slug} className="flex flex-col gap-2">
              <h4 className={`font-bold text-[13px] flex items-center gap-2 ${catItems.length > 0 ? 'text-white' : 'text-dark-muted'}`}>
                <span>{cat.emoji}</span> {cat.name} ({catItems.length})
              </h4>
              
              {catItems.length > 0 && (
                <div className="flex flex-col gap-1.5 pl-[1.6rem]">
                  {catItems.map(item => (
                    <div key={item.id} className="flex items-center justify-between text-dark-muted hover:text-white transition-colors group">
                      <span className="truncate pr-2 text-xs">{item.name}</span>
                      <button
                        onClick={() => removeItem(item.id)}
                        className="text-dark-muted hover:text-red-400 opacity-0 group-hover:opacity-100 transition-opacity"
                        aria-label={`Remove ${item.name}`}
                      >
                        <X size={14} />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          );
        })}

        {items.length > 0 && (
          <div className="mt-4 pt-4 border-t border-dark-border">
            <div className="text-xs text-dark-muted mb-2">Generated Command:</div>
            <div className="bg-black border border-dark-border rounded p-3 text-accent-green text-[11px] break-all relative group mb-4">
              {command}
              <button 
                onClick={copyCommand}
                className="absolute right-2 top-2 bg-dark-card border border-dark-border px-2 py-1 rounded text-white opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-1 hover:border-accent-green hover:text-accent-green"
              >
                {copied ? "Copied" : "Copy"}
              </button>
            </div>

            <div className="text-[11px] text-dark-muted leading-relaxed mb-4">
              <strong className="text-white block mb-1">Instructions:</strong> Navigate to your project root and run the generated command. All selected components will be installed automatically.
            </div>

            <button 
              onClick={copyCommand}
              className="w-full bg-accent-green hover:bg-accent-green-hover text-black font-bold py-2 rounded transition-colors flex items-center justify-center gap-2 mb-2"
            >
              <Copy size={14} />
              {copied ? "Copied!" : "Copy Command"}
            </button>
            
            <button 
              onClick={shareToX}
              className="w-full bg-transparent border border-dark-border hover:border-white text-dark-muted hover:text-white font-bold py-2 rounded transition-colors text-xs flex justify-center items-center gap-2"
            >
              Share Stack
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

// Keep the persistent one for mobile view, exporting it unchanged to not break dependencies
export function PersistentStackBuilder() {
  return null; // For MVP, we use the sidebar layout. Mobile view can be added back if needed later.
}
