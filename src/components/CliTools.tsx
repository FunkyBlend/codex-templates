"use client";

import { CopyButton } from "@/components/CopyButton";

export function CliTools() {
  const tools = [
    {
      emoji: "📊",
      title: "Codex Analytics",
      description: "Monitor your AI-powered development sessions in real-time. Track Codex performance, tool usage, and productivity metrics.",
      command: "npx codex-templates@latest --analytics"
    },
    {
      emoji: "🔍",
      title: "Codex Health Check",
      description: "Comprehensive diagnostics to ensure your Codex installation is optimized for deep coding at terminal velocity.",
      command: "npx codex-templates@latest --health-check"
    },
    {
      emoji: "🧩",
      title: "Plugin Dashboard",
      description: "Manage Codex plugins with a visual dashboard. View installed marketplaces, enable/disable plugins, and monitor component status.",
      command: "npx codex-templates@latest --plugins"
    }
  ];

  return (
    <section className="w-full mb-16">
      <div className="flex items-center gap-2 mb-6">
        <span className="text-accent-green font-mono">$</span>
        <h2 className="text-xl font-mono font-bold text-white">Additional Tools</h2>
      </div>
      <p className="text-dark-muted font-sans mb-8">
        Advanced tools to maximize your Codex AI development experience
      </p>

      <div className="flex flex-col gap-8">
        {tools.map((tool, idx) => (
          <div key={idx} className="flex flex-col">
            <div className="flex items-center gap-3 mb-2">
              <span className="text-xl">{tool.emoji}</span>
              <h3 className="text-white font-bold font-mono">{tool.title}</h3>
            </div>
            <p className="text-sm text-dark-muted font-sans mb-4 ml-8">
              {tool.description}
            </p>
            
            <div className="ml-8 bg-black border border-dark-border rounded flex items-center justify-between p-3 font-mono text-sm group hover:border-dark-muted transition-colors">
              <div className="flex items-center gap-3 overflow-x-auto whitespace-nowrap scrollbar-hide">
                <span className="text-accent-green">$</span>
                <span className="text-white">npx <span className="text-blue-400">codex-templates@latest</span> {tool.command.split(' ').pop()}</span>
              </div>
              <div className="shrink-0 ml-4 opacity-50 hover:opacity-100 transition-opacity">
                <CopyButton text={tool.command} />
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
