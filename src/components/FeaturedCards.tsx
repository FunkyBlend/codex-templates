import Link from "next/link";
import Image from "next/image";

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
    <section className="w-full mt-12 mb-8">
      <h2 className="text-xl font-mono font-bold mb-4 text-white">Featured</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
        {featured.map((item) => (
          <Link 
            key={item.id} 
            href={item.url}
            className="flex items-center justify-between p-4 bg-transparent border border-dark-border rounded hover:border-dark-muted transition-colors group"
          >
            <div className="flex items-center gap-4">
              <div className="text-3xl bg-dark-card w-12 h-12 flex items-center justify-center rounded border border-dark-border">
                {item.logo}
              </div>
              <div className="flex flex-col">
                <h3 className="font-bold text-white text-lg">{item.title}</h3>
                <p className="text-xs text-dark-muted font-mono">{item.subtitle}</p>
              </div>
            </div>
            <div className="text-dark-muted group-hover:text-accent-green transition-colors font-mono">
              →
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}
