import Link from "next/link";

export function FeaturedCards() {
  const featured = [
    {
      id: "agent.refactor-review",
      slug: "refactor-review",
      title: "RefactorReview",
      subtitle: "Code Refactoring Agent",
      logo: "🤖",
      url: "/items/agent/refactor-review",
    },
    {
      id: "skill.commit-message-helper",
      slug: "commit-message-helper",
      title: "CommitHelper",
      subtitle: "Git Commit Skill",
      logo: "🎨",
      url: "/items/skill/commit-message-helper",
    },
    {
      id: "template.nextjs-codex-starter",
      slug: "nextjs-codex-starter",
      title: "Next.js Codex",
      subtitle: "Complete Starter Template",
      logo: "📦",
      url: "/items/template/nextjs-codex-starter",
    }
  ];

  return (
    <section className="rounded-lg border border-dark-border bg-dark-card p-6">
      <h2 className="mb-5 text-xl font-semibold text-dark-text">Featured Items</h2>
      <div className="grid gap-4 md:grid-cols-3">
        {featured.map((item) => (
          <Link 
            key={item.id} 
            href={item.url}
            className="flex flex-col p-4 rounded-lg border border-dark-border bg-dark-bg hover:border-accent-green transition-colors group"
          >
            <div className="text-3xl mb-3 h-12 w-12 flex items-center justify-center rounded-lg border border-dark-border bg-dark-card">
              {item.logo}
            </div>
            <h3 className="font-semibold text-dark-text group-hover:text-accent-green transition-colors">{item.title}</h3>
            <p className="text-sm text-dark-muted mt-1">{item.subtitle}</p>
          </Link>
        ))}
      </div>
    </section>
  );
}
