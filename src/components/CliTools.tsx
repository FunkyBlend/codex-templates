"use client";

import { CopyButton } from "@/components/CopyButton";
import { Activity, HeartPulse, Puzzle } from "lucide-react";

export function CliTools() {
  const tools = [
    {
      icon: <Activity className="h-5 w-5 text-accent-green" />,
      title: "Codex Analytics",
      description: "Monitor your AI-powered development sessions in real-time. Track Codex performance, tool usage, and productivity metrics.",
      command: "npx codex-templates@latest --analytics"
    },
    {
      icon: <HeartPulse className="h-5 w-5 text-accent-green" />,
      title: "Codex Health Check",
      description: "Comprehensive diagnostics to ensure your Codex installation is optimized for deep coding at terminal velocity.",
      command: "npx codex-templates@latest --health-check"
    },
    {
      icon: <Puzzle className="h-5 w-5 text-accent-green" />,
      title: "Plugin Dashboard",
      description: "Manage Codex plugins with a visual dashboard. View installed marketplaces, enable/disable plugins, and monitor component status.",
      command: "npx codex-templates@latest --plugins"
    }
  ];

  return (
    <section className="rounded-lg border border-dark-border bg-dark-card p-6">
      <div className="mb-6">
        <h2 className="text-xl font-semibold text-dark-text">Additional Tools</h2>
        <p className="text-sm text-dark-muted mt-1">Advanced tools to maximize your Codex AI development experience</p>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        {tools.map((tool, idx) => (
          <div key={idx} className="flex flex-col rounded-lg border border-dark-border bg-dark-bg p-5">
            <div className="mb-3 flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-accent-green/10">
                {tool.icon}
              </div>
              <h3 className="font-semibold text-dark-text">{tool.title}</h3>
            </div>
            
            <p className="mb-5 text-sm text-dark-muted flex-1">
              {tool.description}
            </p>
            
            <div className="mt-auto">
              <div className="mb-2 flex items-center justify-between rounded border border-dark-border bg-dark-card px-3 py-2">
                <code className="text-[11px] text-accent-green font-mono overflow-hidden text-ellipsis whitespace-nowrap mr-2">
                  {tool.command}
                </code>
                <CopyButton text={tool.command} className="!px-2 !py-1 !text-[10px] shrink-0" />
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
