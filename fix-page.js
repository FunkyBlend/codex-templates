const fs = require('fs');

let page = fs.readFileSync('src/app/page.tsx', 'utf8');

const heroSection = `
        {/* Hero Section */}
        <div className="flex flex-col items-center text-center mb-12 mt-4">
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-xs font-mono text-cyan-400 mb-6 backdrop-blur-sm">
            <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse"></span>
            <span>System Online // v2.4.1</span>
          </div>
          <h1 className="text-5xl md:text-7xl font-mono font-extrabold text-white tracking-tight mb-6 drop-shadow-lg flex items-center justify-center">
            <span>Codex<span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-purple-500">Depot</span></span>
            <span className="w-4 h-10 md:h-14 bg-cyan-400 ml-3 animate-[pulse_1.5s_ease-in-out_infinite] shadow-[0_0_15px_rgba(0,240,255,0.6)]"></span>
          </h1>
          <p className="text-lg text-slate-400 max-w-2xl mb-8 font-light">
            Ready-to-use configurations for your Codex projects
          </p>
        </div>

        {/* REFINED SEARCH BAR */}`;

page = page.replace('{/* REFINED SEARCH BAR */}', heroSection);

fs.writeFileSync('src/app/page.tsx', page);
