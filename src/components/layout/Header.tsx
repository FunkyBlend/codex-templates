"use client";

import Link from "next/link";
import { Menu, X } from "lucide-react";
import { useState, useEffect } from "react";

const links = [
  { name: "Browse", href: "/browse" },
  { name: "CLI", href: "/cli" },
  { name: "Contribute", href: "/contribute" },
  { name: "Docs", href: "https://docs.codexdepot.com" },
];

export function Header() {
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    if (menuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }

    return () => {
      document.body.style.overflow = "unset";
    };
  }, [menuOpen]);

  return (
    <header className="fixed inset-x-0 top-0 z-50 border-b-2 border-dark-border bg-dark-bg/95 backdrop-blur-md">
      <div className="mx-auto flex h-16 w-full max-w-6xl items-center justify-between px-6">
        <Link href="/" className="text-lg font-bold tracking-tight text-dark-text uppercase font-mono">
          CODEX<span className="text-accent-green">DEPOT</span>
        </Link>

        <nav className="hidden items-center gap-6 md:flex">
          {links.map((link) => (
            <Link
              key={link.name}
              href={link.href}
              className="text-sm font-semibold text-dark-muted transition hover:text-accent-green uppercase tracking-wide"
            >
              {link.name}
            </Link>
          ))}
          <a
            href="https://github.com/FunkyBlend/codex-templates"
            target="_blank"
            rel="noopener noreferrer"
            className="rounded-sm border-2 border-dark-border px-3 py-1 text-xs font-bold uppercase tracking-wide text-dark-text transition hover:border-accent-green hover:text-accent-green"
          >
            GitHub
          </a>
        </nav>

        <button
          type="button"
          className="md:hidden p-1 border-2 border-transparent hover:border-dark-border transition"
          onClick={() => setMenuOpen((current) => !current)}
          aria-label={menuOpen ? "Close navigation menu" : "Open navigation menu"}
          aria-expanded={menuOpen}
        >
          {menuOpen ? (
            <X className="h-5 w-5 text-dark-text" />
          ) : (
            <Menu className="h-5 w-5 text-dark-text" />
          )}
        </button>
      </div>

      {menuOpen ? (
        <div 
          role="dialog" 
          aria-modal="true"
          aria-label="Mobile Navigation"
          className="fixed inset-0 top-16 z-40 bg-dark-bg md:hidden border-t-2 border-dark-border"
        >
          <div className="flex flex-col p-6 space-y-4">
            {links.map((link) => (
              <Link
                key={link.name}
                href={link.href}
                className="text-xl font-bold uppercase tracking-wide text-dark-text border-b border-dark-border pb-2"
                onClick={() => setMenuOpen(false)}
              >
                {link.name}
              </Link>
            ))}
            <a
              href="https://github.com/FunkyBlend/codex-templates"
              target="_blank"
              rel="noopener noreferrer"
              className="text-xl font-bold uppercase tracking-wide text-accent-green border-b border-dark-border pb-2"
              onClick={() => setMenuOpen(false)}
            >
              GitHub
            </a>
          </div>
        </div>
      ) : null}
    </header>
  );
}
