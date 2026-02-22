"use client";

import React, { useState } from 'react';
import { 
  Terminal, 
  Search, 
  Code2, 
  Cpu, 
  ShieldAlert, 
  Database, 
  Zap, 
  ChevronRight, 
  Github, 
  Command,
  Star,
  Download,
  Filter,
  Layers,
  Copy,
  Check,
  Folder,
  Plus,
  X
} from 'lucide-react';

interface MockItem {
  id: number;
  title: string;
  author: string;
  description: string;
  downloads: string;
  category: string;
  tags: string[];
  icon: React.ReactNode;
  installCommand: string;
}

// --- MOCK DATA ---
const categories = [
  'All', 
  'skills', 
  'agents', 
  'mcps', 
  'commands', 
  'hooks'
];

const mockItems: MockItem[] = [
  {
    id: 1,
    title: 'Neural Net Scaffolding v2.0',
    author: '@cyber_ghost',
    description: 'Pre-configured PyTorch scaffolding for rapid deployment of transformer models with distributed training support.',
    downloads: '1.2k',
    category: 'agents',
    tags: ['Python', 'PyTorch', 'AI'],
    icon: <Cpu className="w-8 h-8 text-cyan-400" />,
    installCommand: 'npx codex-cli@latest --skill=agents/neural-net-scaffold --yes'
  },
  {
    id: 2,
    title: 'Zero-Knowledge Auth Protocol',
    author: '@0xCryptography',
    description: 'A complete ZK-rollup authentication flow for Web3 dApps. Completely passwordless and decentralized.',
    downloads: '8.4k',
    category: 'hooks',
    tags: ['Solidity', 'Web3', 'Auth'],
    icon: <ShieldAlert className="w-8 h-8 text-purple-400" />,
    installCommand: 'npx codex-cli@latest --skill=hooks/zk-auth-protocol --yes'
  },
  {
    id: 3,
    title: 'Quantum-Resistant Ledger',
    author: '@node_runner',
    description: 'Next-generation database schema optimized for post-quantum cryptographic hashing algorithms.',
    downloads: '450',
    category: 'mcps',
    tags: ['Rust', 'PostgreSQL', 'Crypto'],
    icon: <Database className="w-8 h-8 text-emerald-400" />,
    installCommand: 'npx codex-cli@latest --skill=mcps/quantum-ledger --yes'
  },
  {
    id: 4,
    title: 'Neon Glassmorphism UI Kit',
    author: '@pixel_shaper',
    description: 'Over 200 fully responsive, dark-mode first UI components built with Tailwind CSS and Framer Motion.',
    downloads: '3.1k',
    category: 'skills',
    tags: ['React', 'Tailwind', 'UI/UX'],
    icon: <Layers className="w-8 h-8 text-pink-400" />,
    installCommand: 'npx codex-cli@latest --skill=skills/neon-ui-kit --yes'
  },
  {
    id: 5,
    title: 'LLM Prompt Injection Firewall',
    author: '@ai_sentinel',
    description: 'Middleware component to sanitize and block malicious prompt injections before they hit your OpenAI API.',
    downloads: '920',
    category: 'commands',
    tags: ['TypeScript', 'Node.js', 'AI'],
    icon: <Terminal className="w-8 h-8 text-orange-400" />,
    installCommand: 'npx codex-cli@latest --skill=commands/llm-firewall --yes'
  },
  {
    id: 6,
    title: 'Algorithmic Trading Bot Core',
    author: '@quant_mechanic',
    description: 'High-frequency trading bot core logic with built-in backtesting and Binance/Coinbase API integration.',
    downloads: '310',
    category: 'agents',
    tags: ['C++', 'Finance', 'API'],
    icon: <Zap className="w-8 h-8 text-blue-400" />,
    installCommand: 'npx codex-cli@latest --skill=agents/algo-trading-core --yes'
  },
  {
    id: 7,
    title: 'Sentient NLP Agent',
    author: '@neural_weaver',
    description: 'An advanced conversational agent framework capable of multi-turn memory and tool use via LangChain.',
    downloads: '1.5k',
    category: 'agents',
    tags: ['Python', 'LangChain', 'NLP'],
    icon: <Code2 className="w-8 h-8 text-cyan-400" />,
    installCommand: 'npx codex-cli@latest --skill=agents/sentient-nlp --yes'
  },
  {
    id: 8,
    title: 'Cyberpunk Dashboard Template',
    author: '@neo_tokyo',
    description: 'A visually stunning admin dashboard template with glitch effects, neon borders, and real-time chart widgets.',
    downloads: '12.4k',
    category: 'skills',
    tags: ['Vue', 'CSS', 'Dashboard'],
    icon: <Layers className="w-8 h-8 text-fuchsia-400" />,
    installCommand: 'npx codex-cli@latest --skill=skills/cyberpunk-dash --yes'
  }
];

export default function App() {
  const [activeCategory, setActiveCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedItem, setSelectedItem] = useState<MockItem | null>(null);
  const [copiedId, setCopiedId] = useState<number | string | null>(null);

  // Filter items based on search and category
  const filteredItems = mockItems.filter(item => {
    const matchesCategory = activeCategory === 'All' || item.category === activeCategory;
    const matchesSearch = item.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          item.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesCategory && matchesSearch;
  });

  // iFrame safe copy function
  const copyToClipboard = (e: React.MouseEvent, text: string, id: number | string) => {
    e.stopPropagation();
    const textArea = document.createElement("textarea");
    textArea.value = text;
    textArea.style.position = "fixed"; // Avoid scrolling
    document.body.appendChild(textArea);
    textArea.focus();
    textArea.select();
    try {
      document.execCommand('copy');
      setCopiedId(id);
      setTimeout(() => setCopiedId(null), 2000);
    } catch (err) {
      console.error('Copy failed', err);
    }
    document.body.removeChild(textArea);
  };

  return (
    <div className="min-h-screen bg-[#030305] text-slate-300 font-sans selection:bg-cyan-500/30 selection:text-cyan-100 relative overflow-hidden">
      
      {/* --- BACKGROUND EFFECTS --- */}
      {/* Subtle grid pattern */}
      <div className="fixed inset-0 z-0 bg-[linear-gradient(to_right,#ffffff05_1px,transparent_1px),linear-gradient(to_bottom,#ffffff05_1px,transparent_1px)] bg-[size:32px_32px] pointer-events-none"></div>
      {/* Ambient glowing orbs */}
      <div className="fixed top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-cyan-900/20 blur-[120px] pointer-events-none"></div>
      <div className="fixed bottom-[-10%] right-[-10%] w-[40%] h-[40%] rounded-full bg-purple-900/20 blur-[120px] pointer-events-none"></div>

      <div className="relative z-10 flex flex-col min-h-screen">
        
        {/* --- NAVBAR --- */}
        <header className="sticky top-0 z-50 border-b border-white/5 bg-[#030305]/80 backdrop-blur-md">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
            {/* Logo */}
            <div className="flex items-center space-x-2 cursor-pointer group">
              <div className="w-8 h-8 bg-cyan-500/10 rounded-md border border-cyan-500/30 flex items-center justify-center group-hover:bg-cyan-500/20 transition-colors">
                <Terminal className="w-5 h-5 text-cyan-400" />
              </div>
              <span className="font-mono font-bold text-xl tracking-wider text-white">
                C<span className="text-cyan-400">O</span>DEX
              </span>
            </div>

            {/* Desktop Nav */}
            <nav className="hidden md:flex space-x-8">
              <a href="#" className="text-sm font-mono text-slate-400 hover:text-cyan-400 transition-colors">/discover</a>
              <a href="#" className="text-sm font-mono text-slate-400 hover:text-cyan-400 transition-colors">/creators</a>
              <a href="#" className="text-sm font-mono text-slate-400 hover:text-cyan-400 transition-colors">/docs</a>
            </nav>

            {/* Actions */}
            <div className="flex items-center space-x-4">
              <a 
                href="https://github.com" 
                target="_blank" 
                rel="noopener noreferrer"
                className="group flex items-center space-x-2 px-3 py-1.5 sm:px-4 sm:py-2 bg-[#0a0a0f] border border-white/10 rounded-lg hover:border-cyan-500/50 hover:bg-cyan-500/5 transition-all duration-300 shadow-sm hover:shadow-[0_0_15px_rgba(0,240,255,0.15)]"
              >
                <Github className="w-4 h-4 text-slate-300 group-hover:text-cyan-400 transition-colors" />
                <span className="text-sm font-mono font-bold text-slate-300 group-hover:text-cyan-50 transition-colors hidden sm:inline-block">GitHub</span>
                <div className="hidden sm:flex items-center pl-3 ml-1 border-l border-white/10 group-hover:border-cyan-500/30 transition-colors">
                  <Star className="w-3.5 h-3.5 text-yellow-500 mr-1.5" />
                  <span className="text-xs font-mono text-slate-400 group-hover:text-cyan-100">12.4k</span>
                </div>
              </a>
            </div>
          </div>
        </header>

        {/* --- MAIN CONTENT --- */}
        <main className="flex-grow max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full py-12">
          
          {/* Hero Section */}
          <div className="flex flex-col items-center text-center mb-16 mt-8">
            <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-xs font-mono text-cyan-400 mb-6 backdrop-blur-sm">
              <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse"></span>
              <span>System Online // v2.4.1</span>
            </div>
            <h1 className="text-5xl md:text-7xl font-mono font-extrabold text-white tracking-tight mb-6 drop-shadow-lg flex items-center justify-center">
              <span>Codex<span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-purple-500">Depot</span></span>
              <span className="w-4 h-10 md:h-14 bg-cyan-400 ml-3 animate-[pulse_1.5s_ease-in-out_infinite] shadow-[0_0_15px_rgba(0,240,255,0.6)]"></span>
            </h1>
            <p className="text-lg text-slate-400 max-w-2xl mb-10 font-light">
              Discover, deploy, and scale elite code architectures, UI modules, and AI models built by top-tier developers.
            </p>

            {/* Global Search - CLI Style */}
            <div className="w-full max-w-2xl mt-2 group relative">
              <div className="relative flex items-center w-full bg-[#0a0a0f]/90 backdrop-blur-xl border border-white/10 rounded-xl overflow-hidden shadow-xl transition-all duration-300 focus-within:border-cyan-500/50 focus-within:shadow-[0_0_25px_rgba(0,240,255,0.15)] focus-within:bg-[#050508]">
                
                {/* Sleek Terminal Prefix */}
                <div className="flex items-center pl-4 pr-3 py-3.5 bg-white/[0.02] border-r border-white/5 select-none shrink-0">
                  <span className="font-mono text-sm flex items-center">
                    <span className="text-cyan-400">~</span>
                    <span className="text-slate-500">/</span>
                    <span className="text-purple-400 hidden sm:inline">query</span>
                    <span className="text-cyan-400 ml-1.5 animate-[pulse_1s_ease-in-out_infinite]">_</span>
                  </span>
                </div>

                {/* Input */}
                <input
                  type="text"
                  placeholder="find frameworks, modules, or templates..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="flex-grow bg-transparent border-none outline-none px-4 py-3.5 text-cyan-50 font-mono text-sm placeholder-slate-600 w-full"
                  spellCheck={false}
                />

                {/* Suffix / Key Hint */}
                <div className="pr-4 flex items-center shrink-0 space-x-3">
                  <kbd className="hidden sm:inline-flex items-center px-2 py-1 border border-white/10 rounded text-[10px] font-mono text-slate-400 bg-white/5 group-focus-within:border-cyan-500/30 group-focus-within:text-cyan-400 transition-colors">
                    ↵ Enter
                  </kbd>
                </div>
              </div>
            </div>
          </div>

          {/* Filters & Categories */}
          <div className="flex flex-col md:flex-row items-center justify-between mb-8 space-y-4 md:space-y-0">
            <div className="flex overflow-x-auto pb-2 -mx-4 px-4 md:mx-0 md:px-0 md:pb-0 hide-scrollbar w-full md:w-auto space-x-2">
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setActiveCategory(cat)}
                  className={`whitespace-nowrap px-4 py-2 rounded-lg font-mono text-sm border transition-all duration-300 ${
                    activeCategory === cat
                      ? 'bg-cyan-500/10 border-cyan-500/50 text-cyan-300 shadow-[0_0_10px_rgba(0,240,255,0.1)]'
                      : 'bg-white/5 border-transparent text-slate-400 hover:bg-white/10 hover:text-white'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
            
            <button className="flex items-center space-x-2 px-4 py-2 bg-[#0a0a0f] border border-white/10 rounded-lg text-sm font-mono text-slate-400 hover:text-white hover:border-white/20 transition-colors shrink-0">
              <Filter className="w-4 h-4" />
              <span>Filters</span>
            </button>
          </div>

          {/* Grid Layout Redesigned */}
          {filteredItems.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {filteredItems.map((item) => (
                <div 
                  key={item.id} 
                  onClick={() => setSelectedItem(item)}
                  className="group relative flex flex-col bg-[#0f1115] border border-white/5 rounded-xl h-[280px] cursor-pointer hover:border-cyan-500/30 hover:shadow-[0_8px_30px_rgb(0,0,0,0.5)] transition-all duration-500 hover:-translate-y-1 overflow-hidden"
                >
                  {/* --- NORMAL STATE FACE --- */}
                  <div className="absolute inset-0 p-5 flex flex-col items-center text-center transition-opacity duration-300 group-hover:opacity-0">
                    {/* Top Bar (Category & Downloads) */}
                    <div className="flex justify-between items-center w-full mb-6">
                      <span className="text-[10px] font-mono text-orange-500 uppercase tracking-wider font-bold">
                        {item.category}
                      </span>
                      <span className="text-[10px] font-mono text-emerald-400 border border-emerald-500/20 bg-emerald-500/10 px-2 py-0.5 rounded flex items-center gap-1">
                        <Download size={10} /> {item.downloads}
                      </span>
                    </div>

                    {/* Central Icon */}
                    <div className="w-16 h-16 rounded-full bg-black/40 border border-white/5 flex items-center justify-center mb-5 shadow-inner">
                      {item.icon}
                    </div>

                    {/* Text Content */}
                    <h3 className="text-base font-bold text-white mb-2 leading-tight">
                      {item.title}
                    </h3>
                    <p className="text-xs text-slate-400 line-clamp-3 px-1">
                      {item.description}
                    </p>
                  </div>

                  {/* --- HOVER STATE FACE (Installation Command) --- */}
                  <div className="absolute inset-0 p-5 flex flex-col bg-[#14161a] opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-10">
                    <div className="text-center text-xs font-mono text-orange-500 mb-4 font-bold tracking-wide">
                      Installation Command
                    </div>
                    
                    {/* Command Box */}
                    <div className="bg-[#050508] border border-white/10 rounded-md p-4 mb-auto relative group/code hover:border-cyan-500/30 transition-colors">
                      <code className="text-xs font-mono text-slate-300 break-words leading-relaxed select-all block pr-8">
                        {item.installCommand}
                      </code>
                      <button 
                        onClick={(e) => copyToClipboard(e, item.installCommand, item.id)}
                        className="absolute top-2 right-2 p-1.5 bg-white/5 hover:bg-white/10 border border-white/10 rounded text-slate-400 hover:text-cyan-400 transition-all"
                        title="Copy Command"
                      >
                        {copiedId === item.id ? <Check size={14} className="text-emerald-400" /> : <Copy size={14} />}
                      </button>
                    </div>

                    {/* Actions */}
                    <div className="flex gap-3 mt-4">
                      <button 
                        onClick={(e) => { e.stopPropagation(); setSelectedItem(item); }}
                        className="flex-1 flex items-center justify-center gap-2 py-2.5 text-xs font-mono text-slate-300 bg-white/5 hover:bg-white/10 rounded border border-white/10 transition-colors"
                      >
                        <Folder size={14} /> View Details
                      </button>
                      <button 
                        onClick={(e) => { e.stopPropagation(); /* Add to stack logic here */ }}
                        className="flex-1 flex items-center justify-center gap-2 py-2.5 text-xs font-mono text-black font-bold bg-orange-500 hover:bg-orange-400 rounded transition-colors shadow-[0_0_15px_rgba(249,115,22,0.2)]"
                      >
                        <Plus size={14} /> Add to Stack
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            /* Empty State */
            <div className="w-full py-20 flex flex-col items-center justify-center text-center border border-dashed border-white/10 rounded-2xl bg-white/5">
              <Terminal className="w-12 h-12 text-slate-600 mb-4" />
              <h3 className="text-xl font-bold text-white mb-2">No modules found</h3>
              <p className="text-slate-400 text-sm max-w-md font-mono">
                Query returned 0 results. Try adjusting your parameters or deploying a new search matrix.
              </p>
            </div>
          )}

          {/* Load More */}
          {filteredItems.length > 0 && (
            <div className="mt-12 flex justify-center">
              <button className="px-6 py-3 bg-transparent border border-white/10 text-white font-mono text-sm rounded-lg hover:border-cyan-500/50 hover:text-cyan-400 transition-all flex items-center space-x-2 group">
                <span>LOAD_MORE_RECORDS</span>
                <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </button>
            </div>
          )}
        </main>

        {/* --- FOOTER --- */}
        <footer className="border-t border-white/5 bg-[#010101] py-12 mt-auto">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row justify-between items-center space-y-6 md:space-y-0">
            <div className="flex items-center space-x-2">
              <Terminal className="w-5 h-5 text-cyan-500" />
              <span className="font-mono font-bold text-lg text-white">CODEX</span>
            </div>
            
            <div className="flex items-center space-x-6">
              <a href="#" className="text-sm font-mono text-slate-500 hover:text-white transition-colors">STATUS</a>
              <a href="#" className="text-sm font-mono text-slate-500 hover:text-white transition-colors">API</a>
              <a href="#" className="text-sm font-mono text-slate-500 hover:text-white transition-colors">TERMS</a>
            </div>

            <div className="flex items-center space-x-4">
              <a href="#" className="text-slate-500 hover:text-cyan-400 transition-colors">
                <Github className="w-5 h-5" />
              </a>
            </div>
          </div>
          <div className="max-w-7xl mx-auto px-4 mt-8 text-center text-xs font-mono text-slate-700">
            © {new Date().getFullYear()} CODEX MARKETPLACE. END OF LINE.
          </div>
        </footer>

      </div>

      {/* --- DETAILS MODAL --- */}
      {selectedItem && (
        <div 
          className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6 bg-black/80 backdrop-blur-md transition-opacity"
          onClick={() => setSelectedItem(null)}
        >
          <div 
            className="bg-[#0f1115] border border-cyan-500/30 rounded-2xl w-full max-w-3xl max-h-[90vh] overflow-y-auto shadow-[0_0_50px_rgba(0,240,255,0.1)] relative flex flex-col hide-scrollbar"
            onClick={e => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="sticky top-0 bg-[#0f1115]/90 backdrop-blur-md p-6 border-b border-white/5 flex justify-between items-start z-10">
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 rounded-xl bg-black/50 border border-white/10 flex items-center justify-center shadow-inner">
                  {selectedItem.icon}
                </div>
                <div>
                  <div className="flex items-center gap-3 mb-1">
                    <span className="text-[10px] font-mono text-orange-500 uppercase tracking-wider font-bold bg-orange-500/10 px-2 py-0.5 rounded">
                      {selectedItem.category}
                    </span>
                    <span className="text-[10px] font-mono text-emerald-400 border border-emerald-500/20 bg-emerald-500/10 px-2 py-0.5 rounded flex items-center gap-1">
                      <Download size={10} /> {selectedItem.downloads}
                    </span>
                  </div>
                  <h2 className="text-2xl font-bold text-white leading-tight">{selectedItem.title}</h2>
                  <span className="text-xs font-mono text-slate-500">{selectedItem.author}</span>
                </div>
              </div>
              <button 
                onClick={() => setSelectedItem(null)}
                className="p-2 bg-white/5 hover:bg-white/10 rounded-full text-slate-400 hover:text-white transition-colors"
              >
                <X size={20} />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6 flex flex-col gap-8">
              <div>
                <h4 className="text-sm font-mono text-cyan-400 mb-3 border-b border-white/5 pb-2">_DESCRIPTION</h4>
                <p className="text-slate-300 leading-relaxed text-sm">
                  {selectedItem.description}
                  <br/><br/>
                  This module has been verified by the Codex community. It includes built-in safeguards, optimal performance pathways, and zero-configuration setup for immediate deployment into your environment.
                </p>
              </div>

              <div>
                <h4 className="text-sm font-mono text-cyan-400 mb-3 border-b border-white/5 pb-2">_INSTALLATION</h4>
                <div className="bg-[#050508] border border-white/10 rounded-lg p-4 relative group/modalcode">
                  <div className="absolute top-0 left-0 px-3 py-1 bg-white/5 rounded-br-lg text-[10px] font-mono text-slate-500">Terminal</div>
                  <code className="text-sm font-mono text-slate-300 block mt-4 pr-10 whitespace-pre-wrap">
                    {selectedItem.installCommand}
                  </code>
                  <button 
                    onClick={(e) => copyToClipboard(e, selectedItem.installCommand, 'modal')}
                    className="absolute top-4 right-4 p-2 bg-white/5 hover:bg-white/10 border border-white/10 rounded text-slate-400 hover:text-cyan-400 transition-all"
                    title="Copy Command"
                  >
                    {copiedId === 'modal' ? <Check size={16} className="text-emerald-400" /> : <Copy size={16} />}
                  </button>
                </div>
              </div>

              <div>
                <h4 className="text-sm font-mono text-cyan-400 mb-3 border-b border-white/5 pb-2">_TAGS & METADATA</h4>
                <div className="flex flex-wrap gap-2">
                  {selectedItem.tags.map(tag => (
                    <span key={tag} className="px-3 py-1 bg-white/5 border border-white/10 rounded text-xs font-mono text-slate-300 uppercase tracking-wider">
                      {tag}
                    </span>
                  ))}
                  <span className="px-3 py-1 bg-cyan-500/10 border border-cyan-500/30 rounded text-xs font-mono text-cyan-400 uppercase tracking-wider">
                    License: MIT
                  </span>
                </div>
              </div>
            </div>
            
            {/* Modal Footer */}
            <div className="mt-auto p-6 border-t border-white/5 bg-black/20 flex justify-end gap-4">
               <button 
                  onClick={() => setSelectedItem(null)}
                  className="px-6 py-2.5 text-sm font-mono text-slate-300 hover:text-white transition-colors"
                >
                  CANCEL
                </button>
               <button className="px-6 py-2.5 text-sm font-mono text-black font-bold bg-cyan-400 hover:bg-cyan-300 rounded shadow-[0_0_15px_rgba(0,240,255,0.3)] transition-all flex items-center gap-2">
                 <Plus size={16} /> ADD TO STACK
               </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
