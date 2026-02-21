"use client";

import Link from "next/link";
import { Menu, X } from "lucide-react";
import { useState } from "react";

const links = [
  { name: "Browse", href: "/browse" },
  { name: "CLI", href: "/cli" },
  { name: "Contribute", href: "/contribute" },
  { name: "Docs", href: "/contribute" },
];

export function Header() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <header className="fixed inset-x-0 top-0 z-50 border-b border-dark-border bg-[#05070a]/90 backdrop-blur">
      <div className="mx-auto flex h-16 w-full max-w-6xl items-center justify-between px-6">
        <Link href="/" className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded bg-accent-green text-black font-bold text-lg">
            C
          </div>
          <span className="text-lg font-bold tracking-tight text-white">
            Codex<span className="text-accent-green">Depot</span>
          </span>
        </Link>

        <nav className="hidden items-center gap-8 md:flex">
          {links.map((link) => (
            <Link
              key={link.name}
              href={link.href}
              className="text-sm font-semibold text-dark-muted transition-colors hover:text-white"
            >
              {link.name}
            </Link>
          ))}
          <a
            href="https://github.com/FunkyBlend/codex-templates"
            target="_blank"
            rel="noopener noreferrer"
            className="rounded-lg bg-white px-4 py-2 text-sm font-bold text-black transition-transform hover:scale-105 active:scale-95"
          >
            GitHub
          </a>
        </nav>

        <button
          type="button"
          className="md:hidden text-white"
          onClick={() => setMenuOpen((current) => !current)}
          aria-label={menuOpen ? "Close navigation menu" : "Open navigation menu"}
          aria-expanded={menuOpen}
        >
          {menuOpen ? (
            <X className="h-6 w-6" />
          ) : (
            <Menu className="h-6 w-6" />
          )}
        </button>
      </div>

      {menuOpen ? (
        <nav className="border-t border-dark-border bg-[#05070a] px-6 py-4 md:hidden shadow-xl">
          <div className="flex flex-col gap-4">
            {links.map((link) => (
              <Link
                key={link.name}
                href={link.href}
                className="text-base font-semibold text-white"
                onClick={() => setMenuOpen(false)}
              >
                {link.name}
              </Link>
            ))}
            <a
              href="https://github.com/FunkyBlend/codex-templates"
              target="_blank"
              rel="noopener noreferrer"
              className="mt-2 rounded-lg bg-white px-4 py-3 text-center text-sm font-bold text-black"
            >
              GitHub
            </a>
          </div>
        </nav>
      ) : null}
    </header>
  );
}
