import Link from "next/link";

export function EcosystemStands() {
  const companies = [
    { id: 'openai', emoji: '🤖', name: 'OpenAI', desc: 'GPT, DALL-E & Whisper APIs' },
    { id: 'anthropic', emoji: '🧠', name: 'Anthropic', desc: 'Claude AI integration' },
    { id: 'stripe', emoji: '💳', name: 'Stripe', desc: 'Payment processing APIs' },
    { id: 'vercel', emoji: '▲', name: 'Vercel', desc: 'Next.js & Edge infrastructure' },
    { id: 'supabase', emoji: '⚡', name: 'Supabase', desc: 'Postgres & Auth' },
    { id: 'github', emoji: '🐙', name: 'GitHub', desc: 'Git automation & Actions' },
  ];

  return (
    <section className="rounded-lg border border-dark-border bg-dark-card p-6">
      <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="text-xl font-semibold text-dark-text">Popular Development Stacks</h2>
          <p className="text-sm text-dark-muted mt-1">Complete component collections for major ecosystems</p>
        </div>
        <Link
          href="/companies"
          className="rounded border border-dark-border px-3 py-1.5 text-xs font-semibold text-dark-muted transition hover:border-accent-green hover:text-accent-green"
        >
          View All
        </Link>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {companies.map((company) => (
          <Link 
            key={company.id} 
            href={`/companies/${company.id}`}
            className="flex items-center gap-4 rounded-lg border border-dark-border bg-dark-bg p-4 hover:border-accent-green transition-colors group"
          >
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded border border-dark-border bg-dark-card text-xl">
              {company.emoji}
            </div>
            <div className="flex flex-col">
              <h3 className="font-semibold text-dark-text group-hover:text-accent-green transition-colors">{company.name}</h3>
              <p className="text-xs text-dark-muted mt-0.5">{company.desc}</p>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}
