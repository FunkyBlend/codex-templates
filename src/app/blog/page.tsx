'use client';

import { useState, useMemo } from 'react';
import Link from 'next/link';
import { blogPosts } from '@/lib/data';
import { BookOpen, Calendar, ChevronDown } from 'lucide-react';

type Difficulty = 'all' | 'basic' | 'intermediate' | 'advanced';

const difficultyColors = {
  basic: 'bg-green-500/20 text-green-400',
  intermediate: 'bg-yellow-500/20 text-yellow-400',
  advanced: 'bg-red-500/20 text-red-400',
};

export default function BlogPage() {
  const [difficulty, setDifficulty] = useState<Difficulty>('all');

  const filteredPosts = useMemo(() => {
    if (difficulty === 'all') return blogPosts;
    return blogPosts.filter(p => p.difficulty === difficulty);
  }, [difficulty]);

  const featuredPosts = blogPosts.filter(p => p.isFeatured);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex items-center gap-3 mb-2">
        <BookOpen className="w-6 h-6 text-accent-green" />
        <h1 className="text-2xl font-bold text-dark-text">Blog</h1>
      </div>
      <p className="text-dark-muted text-sm mb-8">Tutorials, guides, and best practices for Codex development</p>

      {/* Featured Posts */}
      {featuredPosts.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-10">
          {featuredPosts.map(post => (
            <Link key={post.id} href={`/blog/${post.slug}`} className="card p-5 group hover:border-accent-green/50">
              <span className={`badge ${difficultyColors[post.difficulty]} text-[10px] mb-3`}>
                {post.difficulty}
              </span>
              <h3 className="font-semibold text-dark-text text-sm mb-2 group-hover:text-accent-green transition-colors">
                {post.title}
              </h3>
              <p className="text-dark-muted text-xs leading-relaxed mb-3">{post.excerpt}</p>
              <div className="flex items-center gap-1 text-dark-muted text-xs">
                <Calendar className="w-3 h-3" />
                {new Date(post.publishedAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
              </div>
            </Link>
          ))}
        </div>
      )}

      {/* Difficulty Filter */}
      <div className="flex items-center gap-4 mb-6">
        <span className="text-sm text-dark-muted">Filter:</span>
        <div className="flex gap-2">
          {(['all', 'basic', 'intermediate', 'advanced'] as Difficulty[]).map(d => (
            <button
              key={d}
              onClick={() => setDifficulty(d)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                difficulty === d
                  ? 'bg-accent-green text-white'
                  : 'bg-dark-card border border-dark-border text-dark-muted hover:text-dark-text'
              }`}
            >
              {d.charAt(0).toUpperCase() + d.slice(1)}
            </button>
          ))}
        </div>
      </div>

      {/* All Posts */}
      <div className="space-y-4">
        {filteredPosts.map(post => (
          <Link key={post.id} href={`/blog/${post.slug}`} className="card p-5 block group hover:border-dark-muted">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2">
                  <span className={`badge ${difficultyColors[post.difficulty]} text-[10px]`}>
                    {post.difficulty}
                  </span>
                  <span className="text-dark-muted text-xs flex items-center gap-1">
                    <Calendar className="w-3 h-3" />
                    {new Date(post.publishedAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                  </span>
                </div>
                <h3 className="font-semibold text-dark-text mb-1 group-hover:text-accent-green transition-colors">
                  {post.title}
                </h3>
                <p className="text-dark-muted text-sm">{post.excerpt}</p>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
