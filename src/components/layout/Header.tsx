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
    <header className="fixed inset-x-0 top-0 z-50 border-b border-dark-border bg-dark-bg/90 backdrop-blur">
      <div className="mx-auto flex h-16 w-full max-w-6xl items-center justify-between px-6">
        <Link href="/" className="text-lg font-bold tracking-tight text-dark-text">
          CODEX<span className="text-accent-green">DEPOT</span>
        </Link>

        <nav className="hidden items-center gap-6 md:flex">
          {links.map((link) => (
            <Link
              key={link.name}
              href={link.href}
              className="text-sm font-semibold text-dark-muted transition hover:text-accent-green"
            >
              {link.name}
            </Link>
          ))}
          <a
            href="https://github.com/FunkyBlend/codex-templates"
            target="_blank"
            rel="noopener noreferrer"
            className="rounded border border-dark-border px-3 py-1.5 text-xs font-semibold text-dark-muted transition hover:border-accent-green hover:text-accent-green"
          >
            GitHub
          </a>
        </nav>

        <button
          type="button"
          className="md:hidden"
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
        <nav role="dialog" aria-modal="true" aria-label="Mobile Navigation" className="border-t border-dark-border bg-dark-bg px-6 py-4 md:hidden fixed inset-x-0 top-16 bottom-0 z-40 overflow-y-auto">
          <div className="flex flex-col gap-4">
            {links.map((link) => (
              <Link
                key={link.name}
                href={link.href}
                className="text-lg font-semibold text-dark-muted border-b border-dark-border/50 pb-2"
                onClick={() => setMenuOpen(false)}
              >
                {link.name}
              </Link>
            ))}
            <a
              href="https://github.com/FunkyBlend/codex-templates"
              target="_blank"
              rel="noopener noreferrer"
              className="text-lg font-semibold text-dark-muted border-b border-dark-border/50 pb-2"
              onClick={() => setMenuOpen(false)}
            >
              GitHub
            </a>
          </div>
        </nav>
      ) : null}
    </header>
  );
}