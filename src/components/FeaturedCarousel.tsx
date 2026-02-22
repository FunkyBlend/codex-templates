'use client';

import { ChevronLeft, ChevronRight, ArrowRight } from 'lucide-react';
import { useState } from 'react';
import Link from 'next/link';
import type { MockFeaturedProject } from '@/lib/data';

interface FeaturedCarouselProps {
  projects: MockFeaturedProject[];
}

export function FeaturedCarousel({ projects }: FeaturedCarouselProps) {
  const [current, setCurrent] = useState(0);

  const next = () => setCurrent((current + 1) % projects.length);
  const prev = () => setCurrent((current - 1 + projects.length) % projects.length);

  const project = projects[current];
  if (!project) return null;

  return (
    <div className="relative">
      <div className="card p-6 md:p-8 overflow-hidden">
        <div className="flex items-center gap-2 mb-2">
          <span className="badge bg-accent-green/20 text-accent-green">Featured</span>
          {project.sponsorName && (
            <span className="text-xs text-dark-muted">by {project.sponsorName}</span>
          )}
        </div>
        <h3 className="text-xl md:text-2xl font-bold text-dark-text mb-2">{project.name}</h3>
        <p className="text-accent-green font-medium text-sm mb-3">{project.tagline}</p>
        <p className="text-dark-muted text-sm leading-relaxed mb-4 max-w-2xl">{project.description}</p>

        <div className="flex flex-wrap gap-2 mb-4">
          {project.integrations.slice(0, 4).map(integration => (
            <span key={integration} className="badge bg-dark-bg border border-dark-border text-dark-muted">
              {integration}
            </span>
          ))}
        </div>

        <Link
          href={`/featured/${project.slug}`}
          className="inline-flex items-center gap-2 btn-primary text-sm"
        >
          Learn More <ArrowRight className="w-4 h-4" />
        </Link>
      </div>

      {/* Navigation */}
      <div className="flex items-center justify-between mt-4">
        <div className="flex gap-2">
          {projects.map((_, i) => (
            <button
              type="button"
              key={i}
              onClick={() => setCurrent(i)}
              aria-label={`Go to featured project ${i + 1}`}
              aria-current={i === current}
              className={`w-2 h-2 rounded-full transition-colors ${
                i === current ? 'bg-accent-green' : 'bg-dark-border'
              }`}
            />
          ))}
        </div>
        <div className="flex gap-2">
          <button
            type="button"
            onClick={prev}
            aria-label="Previous featured project"
            className="p-2 rounded-lg bg-dark-card border border-dark-border hover:border-dark-muted transition-colors"
          >
            <ChevronLeft className="w-4 h-4 text-dark-muted" />
          </button>
          <button
            type="button"
            onClick={next}
            aria-label="Next featured project"
            className="p-2 rounded-lg bg-dark-card border border-dark-border hover:border-dark-muted transition-colors"
          >
            <ChevronRight className="w-4 h-4 text-dark-muted" />
          </button>
        </div>
      </div>
    </div>
  );
}
