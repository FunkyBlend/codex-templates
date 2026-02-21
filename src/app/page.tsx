import Link from "next/link";
import { getCatalogIndex, getStatsIndex } from "@/lib/catalog-data";
import { HeroBadges } from "@/components/HeroBadges";
import { FeaturedCards } from "@/components/FeaturedCards";
import { TerminalSearch } from "@/components/TerminalSearch";
import { CategoryNav } from "@/components/CategoryNav";
import { EcosystemStands } from "@/components/EcosystemStands";
import { CliTools } from "@/components/CliTools";
import { StackBuilderSidebar } from "@/components/StackBuilder";

export default async function HomePage() {
  const [index, stats] = await Promise.all([getCatalogIndex(), getStatsIndex()]);

  return (
    <div className="mx-auto flex w-full max-w-[1200px] flex-col lg:flex-row gap-12 px-6 py-4">
      
      {/* LEFT COLUMN - Main Content */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* 1. ASCII Art Hero Section */}
        <section className="w-full flex flex-col mt-8 mb-4">
          <div className="overflow-x-auto max-w-full hidden sm:block">
            <pre className="text-accent-green font-mono text-[10px] sm:text-xs md:text-[13px] leading-[1.15] text-left inline-block drop-shadow-[0_0_8px_rgba(16,163,127,0.3)]">
{` ██████╗ ██████╗ ██████╗ ███████╗██╗  ██╗    ██████╗ ███████╗██████╗  ██████╗ ████████╗
 ██╔════╝██╔═══██╗██╔══██╗██╔════╝╚██╗██╔╝    ██╔══██╗██╔════╝██╔══██╗██╔═══██╗╚══██╔══╝
 ██║     ██║   ██║██║  ██║█████╗   ╚███╔╝     ██║  ██║█████╗  ██████╔╝██║   ██║   ██║   
 ██║     ██║   ██║██║  ██║██╔══╝   ██╔██╗     ██║  ██║██╔══╝  ██╔═══╝ ██║   ██║   ██║   
 ╚██████╗╚██████╔╝██████╔╝███████╗██╔╝ ██╗    ██████╔╝███████╗██║     ╚██████╔╝   ██║   
  ╚═════╝ ╚═════╝ ╚═════╝ ╚══════╝╚═╝  ╚═╝    ╚═════╝ ╚══════╝╚═╝      ╚═════╝    ╚═╝   `}
            </pre>
          </div>
          <div className="sm:hidden w-full text-left">
            <h1 className="text-4xl font-bold font-mono text-accent-green mb-4 drop-shadow-[0_0_8px_rgba(16,163,127,0.3)]">
              CODEX DEPOT
            </h1>
          </div>

          <p className="mt-6 text-lg sm:text-xl text-dark-text max-w-2xl font-sans">
            Ready-to-use configurations for your <strong className="font-bold text-white">Codex</strong> projects
          </p>

          <div className="mt-4 flex items-center gap-4 text-sm font-medium text-dark-muted font-mono">
            <Link href="/blog" className="hover:text-white transition-colors">[Blog]</Link>
            <a href="https://discord.gg" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors">[Discord]</a>
            <a href="https://github.com/FunkyBlend/codex-templates" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors">[GitHub]</a>
          </div>

          <div className="mt-6">
            <HeroBadges />
          </div>
        </section>

        {/* 2. Featured Section */}
        <FeaturedCards />

        {/* 3. Search & Categories */}
        <TerminalSearch />
        <CategoryNav />
        
        {/* 4. Bottom Content Space (Tools & Ecosystem) */}
        <div className="w-full pt-4 mt-4">
          <EcosystemStands />
          <CliTools />
        </div>
      </div>

      {/* RIGHT COLUMN - Stack Builder Sidebar */}
      <div className="hidden lg:block w-[320px] shrink-0">
        <div className="sticky top-24 border border-dark-border bg-dark-bg p-6 rounded-lg">
          <StackBuilderSidebar />
        </div>
      </div>

    </div>
  );
}
