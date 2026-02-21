"use client";

import Link from "next/link";

export function Header() {
  return (
    <header className="w-full">
      <div className="mx-auto flex h-14 w-full max-w-6xl items-center justify-end px-6">
        <nav className="flex items-center gap-6">
          <Link
            href="/blog"
            className="text-sm font-semibold text-dark-muted transition hover:text-white"
          >
            Blog
          </Link>
          <a
            href="https://discord.gg"
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm font-semibold text-dark-muted transition hover:text-white"
          >
            Discord
          </a>
          <a
            href="https://github.com/FunkyBlend/codex-templates"
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm font-semibold text-dark-muted transition hover:text-white"
          >
            GitHub
          </a>
        </nav>
      </div>
    </header>
  );
}
