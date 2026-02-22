"use client";

import React, { useState } from 'react';
import { 
  Terminal, Search, Copy, Command, Box, Cpu, Zap, Settings, Shield, X, Check, ChevronRight, Globe, Github, Download, Eye, Plus 
} from 'lucide-react';

interface CodexItem {
  id: number;
  name: string;
  type: string;
  version: string;
  downloads: string;
  desc: string;
  cmd: string;
  tags: string[];
  readme: string;
}

const items: CodexItem[] = [
  {
      id: 1,
      name: 'react-architect',
      type: 'agent',
      version: '2.4.0',
      downloads: '12.4k',
      desc: 'Senior React architecture patterns and folder structure enforcement.',
      cmd: 'npx codex add react-architect',
      tags: ['react', 'structure', 'best-practices'],
      readme: `# React Architect Agent\n\nThis agent enforces strict folder structure...`
  },
  { 
      id: 2,
      name: 'postgres-optimizer',
      type: 'skill',
      version: '1.1.2',
      downloads: '8.1k',
      desc: 'Analyzes queries and suggests indexes for PostgreSQL databases.',
      cmd: 'npx codex add pg-opt',
      tags: ['database', 'sql', 'performance'],
      readme: `# PostgreSQL Optimizer\n\nA skill that connects to your local...`
  },
  { 
      id: 3,
      name: 'stripe-mcp',
      type: 'mcp',
      version: '3.0.0',
      downloads: '5.2k',
      desc: 'Model Context Protocol server for Stripe API integration.',
      cmd: 'npx codex add stripe-mcp',
      tags: ['payment', 'api', 'integration'],
      readme: `# Stripe MCP Server\n\nExposes the Stripe API context...`
  },
  { 
      id: 4,
      name: 'docker-scaffold',
      type: 'template',
      version: '0.9.5',
      downloads: '9.9k',
      desc: 'Production-ready Dockerfiles for Node, Python, and Go.',
      cmd: 'npx codex add docker-tmpl',
      tags: ['devops', 'containers', 'cicd'],
      readme: `# Docker Scaffold Template\n\nGenerates multi-stage Dockerfiles...`
  },
  { 
      id: 5,
      name: 'security-audit',
      type: 'agent',
      version: '1.0.1',
      downloads: '3.4k',
      desc: 'Scans code for OWASP vulnerabilities before commit.',
      cmd: 'npx codex add sec-audit',
      tags: ['security', 'owasp', 'linter'],
      readme: `# Security Audit Agent\n\nA proactive security scanner...`
  },
  { 
      id: 6,
      name: 'git-commit-semantic',
      type: 'hook',
      version: '4.2.0',
      downloads: '15.1k',
      desc: 'Enforces semantic commit messages based on diff analysis.',
      cmd: 'npx codex add git-semantic',
      tags: ['git', 'workflow', 'automation'],
      readme: `# Semantic Commit Hook\n\nAnalyzes your staged changes...`
  },
  { 
      id: 7,
      name: 'nextjs-15-expert',
      type: 'agent',
      version: '15.0.0-rc',
      downloads: '22k',
      desc: 'Expert knowledge on Next.js 15 Server Actions and RSCs.',
      cmd: 'npx codex add next-expert',
      tags: ['nextjs', 'react', 'web'],
      readme: `# Next.js 15 Expert Agent\n\nSpecialized in the latest Next.js paradigms...`
  },
  { 
      id: 8,
      name: 'python-pandas-ai',
      type: 'skill',
      version: '2.1.0',
      downloads: '18.5k',
      desc: 'Conversational data analysis for Pandas DataFrames.',
      cmd: 'npx codex add pandas-ai',
      tags: ['data-science', 'python', 'analytics'],
      readme: `# Pandas AI Skill\n\nAllows you to ask questions about your dataframes...`
  }
];

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

export default function App() {
  const [selectedItem, setSelectedItem] = useState<CodexItem | null>(null);
  const [search, setSearch] = useState('');
  const [activeCategory, setActiveCategory] = useState('all');
  const [copiedId, setCopiedId] = useState<number | null>(null);

  const handleCopy = (e: React.MouseEvent, cmd: string, id: number) => {
    e.stopPropagation();
    navigator.clipboard.writeText(cmd);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const filteredItems = items.filter(item =>
    (activeCategory === 'all' || item.type === activeCategory) &&
    (item.name.toLowerCase().includes(search.toLowerCase()) ||  
     item.desc.toLowerCase().includes(search.toLowerCase()) ||
     item.tags.some(t => t.toLowerCase().includes(search.toLowerCase())))
  );

  return (
    <div className="min-h-screen bg-[#05070a] text-gray-300 font-mono flex flex-col relative overflow-hidden selection:bg-green-900 selection:text-white">

      {/* Top Navigation */}
      <header className="border-b border-gray-800/60 bg-[#0d1117]/80 backdrop-blur-md sticky top-0 z-30">
        <div className="max-w-[1600px] mx-auto px-6 h-16 flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="bg-green-900/10 p-2 rounded border border-green-500/20 shadow-[0_0_15px_rgba(34,197,94,0.1)]">
               <Terminal size={18} className="text-green-500" />
            </div>
            <h1 className="font-bold text-gray-100 tracking-tight text-lg leading-none">
              CODEX<span className="text-gray-600 font-normal">_DEPOT</span>
            </h1>
          </div>
          <div className="hidden md:flex gap-6 text-[11px] font-bold tracking-widest text-gray-500">
            <a href="#" className="hover:text-green-400 transition-colors flex items-center gap-2">GLOBAL_INDEX</a>
            <a href="#" className="hover:text-green-400 transition-colors flex items-center gap-2">DOCS</a>
            <a href="#" className="hover:text-green-400 transition-colors flex items-center gap-2">GITHUB</a>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="flex-1 max-w-[1600px] mx-auto w-full px-6 py-12 pb-24">

        
        {/* Hero Section */}
        <div className="flex flex-col items-center text-center mb-12 mt-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-green-500/10 border border-green-500/30 text-[10px] font-mono font-bold tracking-widest text-green-400 mb-6 shadow-[0_0_15px_rgba(34,197,94,0.1)]">
            <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse"></span>
            <span>SYSTEM ONLINE // V2.4.1</span>
          </div>
          
          <h1 className="text-4xl md:text-6xl font-black text-gray-100 tracking-tight mb-6 flex items-center justify-center font-mono">
            <span>CODEX<span className="text-gray-600 font-normal">_DEPOT</span></span>
            <span className="w-3 md:w-4 h-8 md:h-12 bg-green-500 ml-3 animate-[pulse_1.5s_ease-in-out_infinite] shadow-[0_0_20px_rgba(34,197,94,0.5)]"></span>
          </h1>
          
          <p className="text-sm md:text-base text-gray-500 max-w-2xl mb-8 font-mono tracking-tight">
            Ready-to-use configurations for your codex projects
          </p>
        </div>

        {/* REFINED SEARCH BAR */}
        <div className="mb-12 max-w-3xl mx-auto">
          <div className="relative group">
            {/* Ambient Glow */}
            <div className="absolute -inset-0.5 bg-gradient-to-r from-green-500/20 to-emerald-500/20 rounded-lg blur opacity-20 group-hover:opacity-40 transition duration-500"></div>

            {/* Input Container */}
            <div className="relative flex items-center bg-[#0d1117] border border-gray-800 rounded-lg shadow-2xl h-14 group-focus-within:border-gray-700 transition-colors">
                {/* Prompt Character */}
                <div className="pl-5 pr-4 text-green-500 font-bold text-lg select-none font-mono animate-pulse">
                  {'>_'}
                </div>

                {/* Input Field */}
                <input
                  type="text"
                  placeholder="search packages by name, description or tag..."
                  className="w-full bg-transparent border-none text-gray-200 focus:outline-none font-mono text-sm placeholder-gray-600 h-full tracking-tight"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  autoFocus
                />

                {/* ESC Badge */}
                <div className="absolute right-3 flex items-center pointer-events-none">
                   <div className="flex items-center gap-1.5 px-2 py-1 bg-[#161b22] border border-gray-800 rounded text-[10px] text-gray-500 font-mono tracking-wide shadow-sm">
                      <span className="font-bold">ESC</span> to clear
                   </div>
                </div>
            </div>
          </div>

          {/* Categories */}
          <div className="flex flex-wrap justify-center gap-2 mt-6">
            {['all', 'agent', 'skill', 'mcp', 'template', 'hook'].map(cat => (
              <button 
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`px-3 py-1 rounded text-[10px] font-bold uppercase tracking-wider border transition-all duration-200 ${activeCategory === cat ? 'bg-green-500/10 border-green-500/50 text-green-400' : 'bg-[#0d1117] border-gray-800 text-gray-600 hover:border-gray-600 hover:text-gray-400'}`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Results Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          
          {/* Add New Placeholder Card */}
          <div className="border border-dashed border-gray-800 rounded-lg bg-[#0d1117]/30 hover:bg-[#0d1117]/50 hover:border-gray-700 transition-all cursor-pointer flex flex-col items-center justify-center p-6 min-h-[180px] group">
              <div className="w-10 h-10 rounded-full bg-gray-800/50 flex items-center justify-center text-gray-500 mb-3 group-hover:bg-green-900/20 group-hover:text-green-500 transition-colors">
                <Plus size={20} />
              </div>
              <h3 className="text-gray-300 font-bold text-sm mb-1">Add New Skill</h3>
              <p className="text-gray-600 text-[10px] text-center max-w-[150px]">
                Create a custom capability or agent for your registry.
              </p>
          </div>

          {filteredItems.map(item => (
            <div 
              key={item.id} 
              className="group bg-[#0d1117] border border-gray-800 rounded-lg p-5 transition-all duration-200 hover:border-gray-700 hover:shadow-[0_4px_20px_rgba(0,0,0,0.4)] flex flex-col h-full cursor-pointer relative"
              onClick={() => setSelectedItem(item)}
            >
              {/* Card Header */}
              <div className="flex justify-between items-start mb-4">
                 <span className={`text-[9px] font-bold uppercase tracking-widest ${
                    item.type === 'agent' ? 'text-purple-400' :
                    item.type === 'mcp' ? 'text-blue-400' :
                    item.type === 'skill' ? 'text-yellow-400' :
                    'text-gray-500'
                 }`}>
                    {item.type}
                 </span>
                 
                 <div className="flex items-center gap-1.5 px-1.5 py-0.5 rounded border border-gray-800 bg-[#161b22] text-[10px] text-green-500 font-mono">
                    <Download size={10} />
                    {item.downloads}
                 </div>
              </div>
              
              {/* Icon & Title */}
              <div className="flex flex-col items-center text-center mb-4">
                  <div className={`w-12 h-12 rounded-xl flex items-center justify-center mb-3 shadow-lg ${
                    item.type === 'agent' ? 'bg-purple-900/10 text-purple-400 ring-1 ring-purple-900/30' :
                    item.type === 'mcp' ? 'bg-blue-900/10 text-blue-400 ring-1 ring-blue-900/30' :
                    item.type === 'skill' ? 'bg-yellow-900/10 text-yellow-400 ring-1 ring-yellow-900/30' :
                    'bg-gray-800 text-gray-400 ring-1 ring-gray-700'
                  }`}>
                      <IconForType type={item.type} className="w-6 h-6" />
                  </div>
                  <h3 className="font-bold text-gray-200 text-sm mb-1">{item.name}</h3>
                  <p className="text-gray-500 text-[10px] line-clamp-2 h-8 leading-relaxed px-2">
                    {item.desc}
                  </p>
              </div>

              {/* Install Command (Footer) */}
              <div className="mt-auto">
                 <div 
                    className="bg-[#05070a] border border-gray-800 rounded px-3 py-2 flex items-center justify-between group-hover:border-green-900/50 transition-colors cursor-text"
                    onClick={(e) => handleCopy(e, item.cmd, item.id)}
                 >
                    <div className="flex items-center gap-2 overflow-hidden w-full">
                       <span className="text-green-600 text-[10px] font-bold shrink-0">$</span>
                       <code className="text-[10px] text-gray-400 truncate font-mono">{item.cmd}</code>
                    </div>
                    <button className="text-gray-600 hover:text-green-400 transition-colors pl-2">
                       {copiedId === item.id ? <Check size={12} /> : <Copy size={12} />}
                    </button>
                 </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Details Modal Overlay */}
      {selectedItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 md:p-10 backdrop-blur-sm bg-black/60">
           
           <div className="relative bg-[#0d1117] border border-gray-700 w-full max-w-4xl h-[80vh] rounded-lg shadow-2xl flex flex-col md:flex-row overflow-hidden animate-in fade-in zoom-in-95 duration-200">
              
              <button onClick={() => setSelectedItem(null)} className="absolute top-4 right-4 text-gray-500 hover:text-white z-10 p-1.5 bg-black/50 rounded-md transition-colors">
                 <X size={16} />
              </button>

              {/* Sidebar Info */}
              <div className="w-full md:w-72 bg-[#161b22] border-r border-gray-800 p-8 flex flex-col shrink-0">
                 <div className="mb-8">
                    <div className="w-16 h-16 bg-gray-800/50 rounded-2xl flex items-center justify-center border border-gray-700/50 mb-5 shadow-inner">
                       <IconForType type={selectedItem.type} className="w-8 h-8" />
                    </div>
                    <h2 className="text-xl font-bold text-white break-words tracking-tight">{selectedItem.name}</h2>
                    <span className="text-xs text-green-500 font-mono mt-2 block">v{selectedItem.version}</span>
                 </div>

                 <div className="space-y-6 flex-1">
                    <div>
                       <h3 className="text-[10px] text-gray-500 uppercase font-bold mb-3 tracking-widest">Install</h3>
                       <div 
                          className="bg-black border border-gray-700 p-3 rounded text-xs text-green-400 font-mono break-all cursor-pointer hover:border-green-500 relative group transition-colors"
                          onClick={(e) => handleCopy(e, selectedItem.cmd, selectedItem.id)}
                       >
                          <span className="opacity-50 select-none">$ </span>{selectedItem.cmd}
                          <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity bg-gray-800 p-1 rounded">
                              {copiedId === selectedItem.id ? <Check size={12} /> : <Copy size={12} />}
                          </div>
                       </div>
                    </div>
                 </div>
              </div>

              {/* Main Docs Content */}
              <div className="flex-1 p-8 overflow-y-auto bg-[#0d1117] relative scrollbar-thin scrollbar-thumb-gray-800">
                 <div className="prose prose-invert prose-sm max-w-none">
                    <div className="font-mono text-xs text-gray-600 mb-6 border-b border-gray-800 pb-2 flex justify-between">
                        <span>README.md</span>
                        <span>{selectedItem.id * 120}KB</span>
                    </div>
                    {selectedItem.readme.split('\n').map((line, i) => {
                       if (line.startsWith('# ')) return <h1 key={i} className="text-2xl font-bold text-white mb-4">{line.replace('# ', '')}</h1>;
                       if (line.startsWith('## ')) return <h2 key={i} className="text-base font-bold text-white mt-8 mb-3 flex items-center gap-2"><span className="text-green-500">#</span> {line.replace('## ', '')}</h2>;
                       if (line.startsWith('- ')) return <li key={i} className="text-gray-400 ml-4 mb-1 list-disc marker:text-gray-600">{line.replace('- ', '')}</li>;
                       if (line.trim() === '') return <br key={i} />;
                       return <p key={i} className="text-gray-400 mb-2 leading-relaxed">{line}</p>;
                    })}
                 </div>
              </div>

           </div>
        </div>
      )}
      
      {/* Background Decor */}
      <div className="fixed top-0 left-0 w-full h-full pointer-events-none z-[-1] bg-[radial-gradient(circle_at_50%_0%,_#111827_0%,_#05070a_50%)]"></div>
    </div>
  );
}