"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export function TerminalSearch() {
  const [query, setQuery] = useState("");
  const router = useRouter();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      router.push(`/browse?search=${encodeURIComponent(query)}`);
    } else {
      router.push(`/browse`);
    }
  };

  return (
    <div className="w-full flex flex-col mb-12">
      <h2 className="text-xl font-mono font-bold mb-4 text-white">
        Search <span className="text-dark-muted text-sm font-normal">(skills/agents/templates)</span>
      </h2>
      
      <div className="w-full flex flex-col font-mono">
        <div className="text-dark-muted mb-2">
          ⎿ Build your personalized development stack
        </div>
        
        <form 
          onSubmit={handleSubmit}
          className="flex items-center text-lg sm:text-2xl text-accent-green"
        >
          <span className="mr-4">{`\>`}</span>
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="flex-1 bg-transparent outline-none text-white placeholder:text-dark-border"
            placeholder=" "
            autoFocus
          />
        </form>
        
        {/* Blinking cursor effect is handled naturally by the input caret, but we style the underline */}
        <div className="w-full h-[1px] bg-dark-border mt-2 relative">
          <div className="absolute left-0 top-0 h-full bg-accent-green/50 w-0 transition-all duration-300" 
               style={{ width: query.length > 0 ? '100%' : '0%' }}></div>
        </div>
      </div>
    </div>
  );
}
