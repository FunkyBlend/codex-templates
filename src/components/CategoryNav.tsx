import Link from "next/link";
import { CATEGORIES } from "@/lib/types";

export function CategoryNav() {
  return (
    <div className="w-full flex flex-col mb-16">
      <div className="text-dark-muted font-mono mb-3">⎿</div>
      <div className="flex flex-wrap items-center gap-3 font-mono text-sm">
        {CATEGORIES.map((cat) => (
          <Link 
            key={cat.slug} 
            href={`/browse?category=${cat.slug}`}
            className="text-dark-muted hover:text-white transition-colors flex items-center gap-1"
          >
            <span className="text-dark-border">[</span>
            {cat.emoji}
            {cat.name.toLowerCase()}
            <span className="text-dark-border">]</span>
          </Link>
        ))}
      </div>
    </div>
  );
}
