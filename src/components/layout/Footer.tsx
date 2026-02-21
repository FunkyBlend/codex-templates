import Link from "next/link";

export function Footer() {
  return (
    <footer className="border-t border-dark-border bg-dark-bg mt-12 py-12">
      <div className="mx-auto w-full max-w-5xl px-6 flex flex-col md:flex-row justify-between gap-12 text-sm">
        
        {/* Left column */}
        <div className="flex flex-col max-w-[300px]">
          <pre className="text-accent-green font-mono text-[8px] leading-[1.15] mb-4 text-left inline-block">
{` ██████╗ ██████╗ ██████╗ ███████╗██╗  ██╗
 ██╔════╝██╔═══██╗██╔══██╗██╔════╝╚██╗██╔╝
 ██║     ██║   ██║██║  ██║█████╗   ╚███╔╝ 
 ██║     ██║   ██║██║  ██║██╔══╝   ██╔██╗ 
 ╚██████╗╚██████╔╝██████╔╝███████╗██╔╝ ██╗
  ╚═════╝ ╚═════╝ ╚═════╝ ╚══════╝╚═╝  ╚═╝`}
          </pre>
          <p className="font-bold text-white mb-1">Supercharge Codex</p>
          <p className="text-dark-muted text-xs">
            © 2026 Codex Depot. Open source project.
          </p>
        </div>

        {/* Right columns */}
        <div className="flex gap-16 font-mono text-dark-muted text-[13px]">
          <div className="flex flex-col gap-3">
            <h4 className="font-bold text-white mb-1">Product</h4>
            <Link href="/trending" className="hover:text-accent-green transition-colors">Trending</Link>
            <Link href="/blog" className="hover:text-accent-green transition-colors">Blog</Link>
            <a href="https://github.com/FunkyBlend/codex-templates" className="hover:text-accent-green transition-colors">CodexDepot</a>
          </div>

          <div className="flex flex-col gap-3">
            <h4 className="font-bold text-white mb-1">Community</h4>
            <a href="https://discord.gg" target="_blank" rel="noopener noreferrer" className="hover:text-accent-green transition-colors">Discord</a>
            <a href="https://github.com/FunkyBlend/codex-templates" target="_blank" rel="noopener noreferrer" className="hover:text-accent-green transition-colors">GitHub</a>
          </div>

          <div className="flex flex-col gap-3">
            <h4 className="font-bold text-white mb-1">Resources</h4>
            <a href="https://github.com/FunkyBlend/codex-templates" className="hover:text-accent-green transition-colors">Documentation</a>
            <a href="https://npmjs.com/package/codex-templates" className="hover:text-accent-green transition-colors">npm Package</a>
          </div>
        </div>
        
      </div>
    </footer>
  );
}
