const fs = require('fs');
let file = fs.readFileSync('src/app/page.tsx', 'utf8');

const oldHero = `{/* Hero Section */}
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
        </div>`;

const newHero = `{/* Hero Section */}
        <div className="flex flex-col items-center text-center mb-16 mt-8 relative z-10">
          
          {/* Subtle glowing orb behind title */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[300px] h-[100px] bg-green-900/30 blur-[80px] rounded-full pointer-events-none -z-10"></div>

          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#0d1117]/80 backdrop-blur-sm border border-green-500/20 text-[11px] font-mono font-bold tracking-widest text-green-400 mb-8 shadow-[0_0_20px_rgba(34,197,94,0.15)] ring-1 ring-white/5">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
            </span>
            <span>SYSTEM_ONLINE // V2.4.1</span>
          </div>
          
          <h1 className="text-5xl md:text-7xl font-sans font-extrabold text-white tracking-tight mb-6 flex items-center justify-center drop-shadow-2xl">
            <span className="relative">
              Codex
              {/* Subtle bottom border glow on Codex */}
              <span className="absolute -bottom-2 left-0 w-full h-0.5 bg-gradient-to-r from-transparent via-green-500/50 to-transparent"></span>
            </span>
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-emerald-600 ml-1">Depot</span>
            <span className="w-3 md:w-4 h-10 md:h-14 bg-green-400 ml-4 animate-[pulse_1s_ease-in-out_infinite] shadow-[0_0_20px_rgba(34,197,94,0.7)] rounded-sm"></span>
          </h1>
          
          <p className="text-base md:text-lg text-gray-400 max-w-2xl mb-10 font-sans tracking-wide leading-relaxed">
            Ready-to-use configurations for your <span className="text-gray-300 font-semibold border-b border-gray-700/50 pb-0.5">Codex projects</span>
          </p>
        </div>`;

file = file.replace(oldHero, newHero);
fs.writeFileSync('src/app/page.tsx', file);
