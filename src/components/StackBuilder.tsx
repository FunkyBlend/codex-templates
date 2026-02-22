'use client';

import { useStackBuilder } from '@/store/stackBuilder';
import { CATEGORIES, getCategoryInfo } from '@/lib/types';
import { Copy, X, Trash2, Share2, Check } from 'lucide-react';
import { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { copyToClipboard } from '@/lib/clipboard';

export function StackBuilder() {
  const { items, removeItem, clearAll, getCommand, getCategoryCounts } = useStackBuilder();
  const [copied, setCopied] = useState(false);
  const command = getCommand();
  const counts = getCategoryCounts();

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
    <div className="card p-4">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-semibold text-dark-text text-sm">Stack Builder</h3>
        <span className="text-xs text-dark-muted">{items.length} items</span>
      </div>

      {/* Category counts */}
      <div className="space-y-1.5 mb-4">
        {CATEGORIES.map(cat => {
          const count = counts[cat.slug] || 0;
          if (count === 0) return null;
          return (
            <div key={cat.slug} className="flex items-center justify-between text-xs">
              <span className="text-dark-muted">
                {cat.emoji} {cat.name}
              </span>
              <span className="text-dark-text font-mono">{count}</span>
            </div>
          );
        })}
      </div>

      {/* Items list */}
      {items.length > 0 ? (
        <div className="space-y-2 mb-4 max-h-60 overflow-y-auto">
          {items.map(item => {
            const cat = getCategoryInfo(item.category);
            return (
              <div key={item.id} className="flex items-center justify-between bg-dark-bg rounded px-2 py-1.5 group">
                <span className="text-xs text-dark-text truncate flex-1">
                  {cat?.emoji} {item.name}
                </span>
                <button
                  type="button"
                  onClick={() => removeItem(item.id)}
                  aria-label={`Remove ${item.name} from stack`}
                  className="text-dark-muted hover:text-red-400 opacity-0 group-hover:opacity-100 transition-all ml-2"
                >
                  <X className="w-3 h-3" />
                </button>
              </div>
            );
          })}
        </div>
      ) : (
        <p className="text-dark-muted text-xs text-center py-6">
          Click &quot;+ Add&quot; on any component to build your stack
        </p>
      )}

      {/* Command output */}
      {command && (
        <div className="mb-3">
          <div className="bg-dark-bg rounded-lg p-3 font-mono text-xs text-accent-green break-all border border-dark-border">
            {command}
          </div>
          <div className="flex gap-2 mt-2">
            <button type="button" onClick={copyCommand} className="btn-primary text-xs flex-1 flex items-center justify-center gap-1.5 py-1.5">
              {copied ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
              {copied ? 'Copied!' : 'Copy'}
            </button>
            <button type="button" onClick={shareToX} className="btn-secondary text-xs px-3 py-1.5" title="Share to X" aria-label="Share stack to X">
              <Share2 className="w-3 h-3" />
            </button>
          </div>
        </div>
      )}

      {/* Actions */}
      {items.length > 0 && (
        <button
          type="button"
          onClick={clearAll}
          className="text-dark-muted hover:text-red-400 text-xs flex items-center gap-1 transition-colors w-full justify-center mt-2"
        >
          <Trash2 className="w-3 h-3" />
          Clear All
        </button>
      )}
    </div>
  );
}

export function PersistentStackBuilder() {
  const { items } = useStackBuilder();
  const [open, setOpen] = useState(false);

  if (items.length === 0) return null;

  return (
    <>
      <AnimatePresence>
        {!open && (
          <motion.button
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0, opacity: 0 }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setOpen(true)}
            aria-label={`Open stack builder with ${items.length} items`}
            className="fixed bottom-6 right-6 bg-accent-green text-[#0d1117] rounded-full w-14 h-14 flex items-center justify-center shadow-[0_0_20px_rgba(16,163,127,0.3)] z-40 border border-green-400 group"
          >
            <span className="font-bold text-lg font-mono">{items.length}</span>
          </motion.button>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {open && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/50 z-40 md:hidden"
              onClick={() => setOpen(false)}
            />
            <motion.div
              initial={{ opacity: 0, y: 20, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 20, scale: 0.95 }}
              transition={{ type: "spring", stiffness: 300, damping: 25 }}
              className="fixed bottom-0 md:bottom-6 left-0 right-0 md:left-auto md:right-6 bg-[#0d1117] md:rounded-xl rounded-t-2xl p-0 w-full md:w-[350px] max-h-[80vh] md:max-h-[600px] overflow-hidden border border-gray-800 shadow-[0_0_40px_rgba(0,0,0,0.5)] z-50 flex flex-col ring-1 ring-white/5"
            >
              <div className="flex justify-between items-center p-4 border-b border-gray-800 bg-[#161b22]">
                <h3 className="font-bold text-white text-sm flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-accent-green animate-pulse"></span>
                  Active Stack
                </h3>
                <button
                  type="button"
                  onClick={() => setOpen(false)}
                  className="text-gray-500 hover:text-white transition-colors p-1"
                  aria-label="Close stack builder"
                >
                  <span className="sr-only">Close stack builder</span>
                  <X className="w-4 h-4" />
                </button>
              </div>
              <div className="p-4 overflow-y-auto flex-1 scrollbar-thin scrollbar-thumb-gray-800">
                <StackBuilder />
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
