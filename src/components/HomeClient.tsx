"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { 
  Terminal, Search, Copy, Command, Box, Cpu, Zap, Settings, Shield, X, Check, Download, Plus 
} from 'lucide-react';
import type { CatalogItem } from '@/lib/catalog-types';

interface HomeClientProps {
  items: CatalogItem[];
}

function IconForType({ type, className = "w-4 h-4" }: { type: string, className?: string }) {
  switch(type) {
    case 'agent': return <Cpu className={className} />;
    case 'skill': return <Zap className={className} />;
    case 'mcp': return <Settings className={className} />;
    case 'security': return <Shield className={className} />;
    case 'template': return <Box className={className} />;
    case 'hook': return <Command className={className} />;
    default: return <Box className={className} />;
  }
}

export function HomeClient({ items }: HomeClientProps) {
  const router = useRouter();
  const [search, setSearch] = useState('');
  const [activeCategory, setActiveCategory] = useState('all');
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const handleCopy = (e: React.MouseEvent, cmd: string, id: string) => {
    e.preventDefault();
    e.stopPropagation();
    navigator.clipboard.writeText(cmd);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleSearchKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && search.trim() !== '') {
      router.push(`/browse?q=${encodeURIComponent(search.trim())}`);
    } else if (e.key === 'Escape') {
      setSearch('');
    }
  };

  const filteredItems = items.filter(item =>
    (activeCategory === 'all' || item.type === activeCategory) &&
    (item.title.toLowerCase().includes(search.toLowerCase()) ||  
     item.summary.toLowerCase().includes(search.toLowerCase()) ||
     item.tags.some(t => t.toLowerCase().includes(search.toLowerCase())))
  ).slice(0, 12); // Limit to top 12 for homepage

  // Brutalist styling mappings
  const typeColors: Record<string, string> = {
    agent: 'text-category-agents border-category-agents',
    skill: 'text-category-plugins border-category-plugins',
    command: 'text-category-commands border-category-commands',
    template: 'text-category-templates border-category-templates',
    hook: 'text-category-hooks border-category-hooks',
    setting: 'text-category-settings border-category-settings',
    mcp: 'text-accent-blue border-accent-blue',
  };

  const typeBgs: Record<string, string> = {
    agent: 'bg-category-agents/10 text-category-agents',
    skill: 'bg-category-plugins/10 text-category-plugins',
    command: 'bg-category-commands/10 text-category-commands',
    template: 'bg-category-templates/10 text-category-templates',
    hook: 'bg-category-hooks/10 text-category-hooks',
    setting: 'bg-category-settings/10 text-category-settings',
    mcp: 'bg-accent-blue/10 text-accent-blue',
  };

  return (
    <div className="min-h-screen bg-dark-bg text-dark-text font-mono flex flex-col relative overflow-hidden selection:bg-accent-green selection:text-white">

      {/* Main Content */}
      <div className="flex-1 max-w-[1600px] mx-auto w-full px-6 py-12 pb-24">
        
        {/* Hero Section - Brutalist & Clean */}
        <div className="flex flex-col items-center text-center mb-16 relative z-10 pt-10">
          
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-dark-card border-2 border-dark-border text-xs font-bold tracking-widest text-dark-muted mb-8 rounded-none shadow-[4px_4px_0_0_#30363d]">
            <span className="w-2 h-2 bg-accent-green block"></span>
            SYSTEM_ONLINE // V2.4.1
          </div>
          
          <h1 className="text-5xl md:text-7xl font-mono font-extrabold text-white tracking-tighter mb-6 flex items-center justify-center uppercase">
            <span className="bg-dark-text text-dark-bg px-2">Codex</span>
            <span className="text-dark-text ml-2">Depot</span>
            <span className="w-4 md:w-6 h-10 md:h-14 bg-accent-green ml-4 animate-pulse"></span>
          </h1>
          
          <p className="text-base md:text-xl text-dark-muted max-w-2xl mb-10 font-mono tracking-tight leading-relaxed">
            Ready-to-use configurations for your <span className="text-white font-bold border-b-2 border-accent-green pb-0.5">Codex projects</span>. Built for power users.
          </p>
        </div>

        {/* Brutalist Search Bar */}
        <div className="mb-12 max-w-3xl mx-auto">
          <div className="relative flex items-center bg-dark-bg border-2 border-dark-border h-16 shadow-[6px_6px_0_0_#10a37f] focus-within:translate-y-[2px] focus-within:translate-x-[2px] focus-within:shadow-[4px_4px_0_0_#10a37f] transition-all">
            <div className="pl-5 pr-4 text-accent-green font-bold text-xl select-none font-mono">
              {'>_'}
            </div>
            <input
              type="text"
              placeholder="SEARCH PACKAGES..."
              className="w-full bg-transparent border-none text-white focus:outline-none font-mono text-sm placeholder-dark-muted h-full tracking-wider uppercase"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              onKeyDown={handleSearchKeyDown}
            />
            <div className="absolute right-4 flex items-center pointer-events-none">
                <div className="flex items-center gap-1 px-2 py-1 bg-dark-card border border-dark-border text-[10px] text-dark-muted font-bold tracking-widest uppercase">
                  Press Enter
                </div>
            </div>
          </div>

          {/* Categories */}
          <div className="flex flex-wrap justify-center gap-3 mt-8">
            {['all', 'agent', 'skill', 'template', 'hook', 'command'].map(cat => (
              <button 
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`px-4 py-1.5 text-[11px] font-bold uppercase tracking-widest border-2 transition-all duration-200 ${
                  activeCategory === cat 
                    ? 'bg-dark-text text-dark-bg border-dark-text shadow-[3px_3px_0_0_#10a37f]' 
                    : 'bg-dark-card border-dark-border text-dark-muted hover:text-white hover:border-dark-muted shadow-[3px_3px_0_0_#30363d]'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Results Grid - Solid borders, no blur */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          
          {/* Add New Card */}
          <Link href="/contribute" className="bg-dark-bg border-2 border-dashed border-dark-border hover:border-accent-green hover:bg-dark-card transition-all flex flex-col items-center justify-center p-6 min-h-[220px] group shadow-[4px_4px_0_0_#30363d] hover:shadow-[4px_4px_0_0_#10a37f]">
              <div className="w-12 h-12 bg-dark-card border-2 border-dark-border flex items-center justify-center text-dark-muted mb-4 group-hover:bg-accent-green group-hover:text-dark-bg group-hover:border-accent-green transition-colors">
                <Plus size={24} strokeWidth={3} />
              </div>
              <h3 className="text-white font-bold text-sm mb-1 uppercase tracking-wider">Publish Item</h3>
              <p className="text-dark-muted text-[11px] text-center max-w-[150px] uppercase">
                Add to the registry.
              </p>
          </Link>

          {filteredItems.map(item => {
            const colorClass = typeColors[item.type] || 'text-dark-muted border-dark-muted';
            const bgClass = typeBgs[item.type] || 'bg-dark-border text-white';

            return (
            <Link 
              href={item.route}
              key={item.id} 
              className="group bg-dark-card border-2 border-dark-border p-5 transition-all duration-200 hover:-translate-y-1 hover:-translate-x-1 hover:shadow-[6px_6px_0_0_#10a37f] flex flex-col h-full relative"
            >
              {/* Card Header */}
              <div className="flex justify-between items-start mb-5">
                 <span className={`text-[10px] font-bold uppercase tracking-widest border-b-2 pb-0.5 ${colorClass}`}>
                    {item.type}
                 </span>
                 <div className="flex items-center gap-1.5 px-2 py-0.5 border-2 border-dark-border bg-dark-bg text-[10px] text-dark-text font-bold">
                    <Download size={12} />
                    {/* Placeholder for downloads since CatalogItem doesn't have it natively yet */}
                    1.2k
                 </div>
              </div>
              
              {/* Icon & Title */}
              <div className="flex flex-col items-start mb-5 flex-1">
                  <div className={`w-10 h-10 flex items-center justify-center mb-4 border-2 border-dark-border ${bgClass}`}>
                      <IconForType type={item.type} className="w-5 h-5" />
                  </div>
                  <h3 className="font-bold text-white text-base mb-2 uppercase tracking-tight">{item.title}</h3>
                  <p className="text-dark-muted text-xs line-clamp-2 leading-relaxed font-sans">
                    {item.summary}
                  </p>
              </div>

              {/* Install Command (Footer) */}
              <div className="mt-auto">
                 <div 
                    className="bg-dark-bg border-2 border-dark-border px-3 py-2 flex items-center justify-between group-hover:border-accent-green transition-colors"
                    onClick={(e) => handleCopy(e, item.install_hint, item.id)}
                 >
                    <div className="flex items-center gap-2 overflow-hidden w-full">
                       <span className="text-accent-green text-[12px] font-bold shrink-0">$</span>
                       <code className="text-[11px] text-dark-text truncate font-bold">{item.install_hint}</code>
                    </div>
                    <button className="text-dark-muted hover:text-accent-green transition-colors pl-2">
                       {copiedId === item.id ? <Check size={14} strokeWidth={3} /> : <Copy size={14} />}
                    </button>
                 </div>
              </div>
            </Link>
          )})}
        </div>
      </div>
    </div>
  );
}