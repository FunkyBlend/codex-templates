import Link from "next/link";
import { Github, Play } from "lucide-react";

export function HeroBadges() {
  return (
    <div className="flex flex-wrap items-center justify-center gap-3 mt-8 font-mono text-xs">
      {/* Sponsored by Z.AI */}
      <a href="https://z.ai" target="_blank" rel="noopener noreferrer" className="flex items-center rounded overflow-hidden shadow-sm hover:opacity-90 transition-opacity">
        <div className="bg-[#555] text-white px-2 py-1 flex items-center gap-1.5">
          <div className="w-2 h-2 bg-white rotate-45"></div>
          Sponsored by
        </div>
        <div className="bg-[#2563eb] text-white px-2 py-1 font-bold">
          Z.AI
        </div>
      </a>

      {/* npm downloads */}
      <a href="https://www.npmjs.com/package/codex-templates" target="_blank" rel="noopener noreferrer" className="flex items-center rounded overflow-hidden shadow-sm hover:opacity-90 transition-opacity">
        <div className="bg-[#555] text-white px-2 py-1">
          downloads
        </div>
        <div className="bg-[#4c1] text-white px-2 py-1 font-bold">
          102k
        </div>
      </a>

      {/* GitHub Stars */}
      <a href="https://github.com/FunkyBlend/codex-templates" target="_blank" rel="noopener noreferrer" className="flex items-center rounded overflow-hidden shadow-sm hover:opacity-90 transition-opacity">
        <div className="bg-white text-black px-2 py-1 flex items-center gap-1 font-bold">
          <Github size={12} className="fill-black" />
          Star
        </div>
        <div className="bg-white text-black px-2 py-1 border-l border-gray-300 relative font-bold">
          <span className="absolute -left-1 top-1.5 w-2 h-2 bg-white rotate-45 border-l border-b border-gray-300"></span>
          21k
        </div>
      </a>

      {/* License */}
      <a href="https://github.com/FunkyBlend/codex-templates/blob/main/LICENSE" target="_blank" rel="noopener noreferrer" className="flex items-center rounded overflow-hidden shadow-sm hover:opacity-90 transition-opacity">
        <div className="bg-[#555] text-white px-2 py-1">
          License
        </div>
        <div className="bg-[#007ec6] text-white px-2 py-1 font-bold">
          MIT
        </div>
      </a>

      {/* Vercel OSS */}
      <a href="https://vercel.com/oss" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 px-2 py-1 text-white hover:text-gray-300 transition-colors">
        <Play size={12} className="-rotate-90 fill-white" />
        <div className="flex flex-col text-[8px] leading-tight tracking-widest font-bold">
          <div>VERCEL INC. // 2025</div>
          <div>OPEN SOURCE SOFTWARE PROGRAM</div>
        </div>
      </a>

      {/* Neon OSS */}
      <a href="https://neon.tech" target="_blank" rel="noopener noreferrer" className="flex items-center rounded overflow-hidden shadow-sm hover:opacity-90 transition-opacity">
        <div className="bg-[#555] text-white px-2 py-1 flex items-center gap-1.5">
          <div className="w-2.5 h-2.5 bg-[#00e599] rounded-full"></div>
          Neon
        </div>
        <div className="bg-[#00e599] text-black px-2 py-1 font-bold">
          Open Source Program
        </div>
      </a>
    </div>
  );
}
