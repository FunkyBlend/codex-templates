import Link from "next/link";

export function Footer() {
  return (
    <footer className="border-t border-dark-border bg-dark-card/40">
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-4 px-6 py-8 text-xs text-dark-muted md:flex-row md:items-center md:justify-between">
        <p>
          CodexDepot MVP. Static index from repository content. No database, no auth.
        </p>
        <div className="flex flex-wrap items-center gap-4">
          <Link href="/browse" className="hover:text-accent-green">
            Browse
          </Link>
          <Link href="/contribute" className="hover:text-accent-green">
            Contribute
          </Link>
          <a
            href="https://github.com"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-accent-green"
          >
            GitHub
          </a>
        </div>
      </div>
    </footer>
  );
}
