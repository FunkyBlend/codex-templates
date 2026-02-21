const fs = require('fs');

const replacement = `
    <div className="mx-auto flex w-full max-w-6xl flex-col gap-10 px-6 py-12">
      {/* Hero Section */}
      <section className="relative overflow-hidden rounded-2xl border border-dark-border bg-dark-card p-10 text-center shadow-2xl">
        <div className="absolute inset-0 bg-gradient-to-b from-accent-green/5 to-transparent opacity-50" />
        
        <p className="relative mb-4 text-xs font-bold uppercase tracking-[0.2em] text-accent-green">
          Repository-Driven Codex Catalog
        </p>
        
        <h1 className="relative mb-6 text-5xl font-extrabold tracking-tight text-white sm:text-6xl">
          CodexDepot
        </h1>
        
        <p className="relative mx-auto mb-10 max-w-2xl text-base text-dark-muted sm:text-lg leading-relaxed">
          Discover, share, and install <strong className="text-white font-medium">Codex Skills, Agents, Templates, and Hooks.</strong> Source of truth is GitHub content plus generated static indexes.
        </p>

        <form action="/browse" className="relative mx-auto mb-8 flex max-w-xl flex-col gap-3 sm:flex-row shadow-lg">
          <input
            type="text"
            name="q"
            placeholder="Search by keyword, tag, or compatibility..."
            className="w-full rounded-lg border border-dark-border bg-dark-bg/80 px-5 py-3 text-sm text-white outline-none backdrop-blur-sm transition-all focus:border-accent-green focus:ring-1 focus:ring-accent-green/50 placeholder:text-dark-muted/70"
          />
          <button
            type="submit"
            className="rounded-lg bg-accent-green hover:bg-accent-green-hover px-6 py-3 text-sm font-bold text-black transition-colors shadow-[0_0_15px_rgba(16,163,127,0.3)] whitespace-nowrap"
          >
            Browse Catalog
          </button>
        </form>

        <div className="relative flex flex-wrap items-center justify-center gap-3">
          <a href={\`https://github.com/\${repository}\`} target="_blank" rel="noopener noreferrer" className="hover:opacity-80 transition-opacity">
            <Image src={badgeUrls.stars} alt="GitHub stars badge" width={110} height={28} unoptimized className="rounded" />
          </a>
          <a href={\`https://github.com/\${repository}\`} target="_blank" rel="noopener noreferrer" className="hover:opacity-80 transition-opacity">
            <Image src={badgeUrls.license} alt="License badge" width={110} height={28} unoptimized className="rounded" />
          </a>
          <Image src={badgeUrls.items} alt="Validated items badge" width={110} height={28} unoptimized className="rounded" />
          <a href="/cli" className="hover:opacity-80 transition-opacity">
            <Image src={badgeUrls.cli} alt="CLI version badge" width={110} height={28} unoptimized className="rounded" />
          </a>
        </div>
      </section>

      {/* Stats Cards */}
      <section className="grid gap-4 sm:grid-cols-2 md:grid-cols-3">
        {typeCards.map((entry) => (
          <article
            key={entry.type}
            className="group rounded-xl border border-dark-border bg-dark-card p-6 transition-all hover:border-dark-muted hover:bg-dark-border/10"
          >
            <div className="flex items-center justify-between mb-4">
              <p className="text-xs font-bold uppercase tracking-wider text-dark-muted">
                {TYPE_LABELS[entry.type]}
              </p>
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-dark-bg border border-dark-border text-xs">
                {entry.type === 'skill' ? '🎨' : entry.type === 'agent' ? '🤖' : entry.type === 'template' ? '📦' : '⚡'}
              </div>
            </div>
            
            <p className="text-4xl font-bold text-white mb-4">{entry.count}</p>
            
            <Link
              href={\`/browse?type=\${entry.type}\`}
              className="inline-flex items-center gap-2 text-sm font-medium text-accent-green group-hover:underline"
            >
              Explore {TYPE_LABELS[entry.type]} →
            </Link>
          </article>
        ))}
      </section>

      {/* Latest Items */}
      <section className="rounded-xl border border-dark-border bg-dark-card p-8">
        <div className="mb-6 flex flex-wrap items-center justify-between gap-4 border-b border-dark-border pb-4">
          <h2 className="text-2xl font-bold text-white">Latest Additions</h2>
          <Link
            href="/browse"
            className="rounded-lg border border-dark-border bg-dark-bg px-4 py-2 text-sm font-medium text-white transition hover:border-accent-green hover:text-accent-green"
          >
            View Full Catalog
          </Link>
        </div>

        <div className="grid gap-5 md:grid-cols-2">
          {latestItems.map((item) => (
            <article
              key={item.id}
              className="flex flex-col justify-between rounded-lg border border-dark-border bg-dark-bg p-5 transition-all hover:border-dark-muted"
            >
              <div>
                <div className="mb-3 flex items-center justify-between">
                  <span className="rounded bg-accent-green/10 px-2 py-1 text-[10px] font-bold uppercase tracking-wider text-accent-green">
                    {item.type}
                  </span>
                  <span className="text-[11px] font-medium text-dark-muted">{item.updated_at.split('T')[0]}</span>
                </div>
                
                <h3 className="mb-2 text-lg font-bold text-white">{item.title}</h3>
                <p className="mb-4 text-sm text-dark-muted line-clamp-2 leading-relaxed">{item.summary}</p>
                
                <div className="mb-5 flex flex-wrap gap-2">
                  {item.tags.map((tag) => (
                    <span
                      key={\`\${item.id}-\${tag}\`}
                      className="rounded border border-dark-border bg-dark-card px-2 py-0.5 text-[11px] font-medium text-dark-muted"
                    >
                      #{tag}
                    </span>
                  ))}
                </div>
              </div>

              <div className="flex flex-wrap items-center gap-3 pt-4 border-t border-dark-border/50 mt-auto">
                <Link
                  href={item.route}
                  className="rounded-md border border-dark-border bg-dark-card px-4 py-2 text-xs font-semibold text-white transition hover:border-accent-green hover:text-accent-green"
                >
                  View Details
                </Link>
                <CopyButton
                  text={item.install_hint}
                  label="Copy Command"
                  analyticsId={item.id}
                />
              </div>
            </article>
          ))}
        </div>
      </section>

      {/* Contribute CTA */}
      <section className="relative overflow-hidden rounded-xl border border-dark-border bg-gradient-to-r from-dark-card to-dark-bg p-8 flex flex-col sm:flex-row items-center justify-between gap-6">
        <div className="flex-1">
          <h2 className="mb-2 text-xl font-bold text-white">Contribute to CodexDepot</h2>
          <p className="text-sm text-dark-muted max-w-xl">
            Add new content by opening a PR with files under the <code className="text-accent-green">content/</code> directory. Automated checks validate schema, safety, and index integrity.
          </p>
        </div>
        <Link
          href="/contribute"
          className="rounded-lg border border-accent-green bg-accent-green/10 px-6 py-3 text-sm font-bold text-accent-green transition hover:bg-accent-green hover:text-black whitespace-nowrap"
        >
          Read Contribution Guide
        </Link>
      </section>
    </div>
  );
}
`;

let code = fs.readFileSync('src/app/page.tsx', 'utf8');
const startIndex = code.indexOf('    <div className="mx-auto');
const startPart = code.substring(0, startIndex);
fs.writeFileSync('src/app/page.tsx', startPart + replacement);
