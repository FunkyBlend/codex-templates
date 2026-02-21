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
    <section className="w-full mb-16">
      <div className="flex items-center gap-2 mb-6">
        <span className="text-accent-green font-mono">$</span>
        <h2 className="text-xl font-mono font-bold text-white">Popular Development Stacks</h2>
      </div>
      <p className="text-dark-muted font-sans mb-8">
        Complete component collections for major ecosystems and technologies
      </p>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
        {companies.map((company) => (
          <Link 
            key={company.id} 
            href={`/companies/${company.id}`}
            className="flex items-center justify-between p-4 bg-transparent border border-dark-border rounded hover:border-dark-muted transition-colors group"
          >
            <div className="flex items-center gap-4">
              <div className="text-2xl w-8 text-center">{company.emoji}</div>
              <div className="flex flex-col">
                <h3 className="font-bold text-white text-[15px]">{company.name}</h3>
                <p className="text-[11px] text-dark-muted font-mono mt-0.5">{company.desc}</p>
              </div>
            </div>
            <div className="text-dark-muted group-hover:text-accent-green transition-colors font-mono">
              →
            </div>
          </Link>
        ))}
        
        <Link 
          href="/companies"
          className="flex items-center justify-between p-4 bg-dark-card border border-dark-border rounded hover:border-dark-muted transition-colors group"
        >
          <div className="flex items-center gap-4">
            <div className="text-2xl w-8 text-center">👀</div>
            <div className="flex flex-col">
              <h3 className="font-bold text-white text-[15px]">View All</h3>
              <p className="text-[11px] text-dark-muted font-mono mt-0.5">Explore all ecosystems</p>
            </div>
          </div>
          <div className="text-dark-muted group-hover:text-accent-green transition-colors font-mono">
            →
          </div>
        </Link>
      </div>
    </section>
  );
}
