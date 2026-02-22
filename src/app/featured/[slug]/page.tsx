'use client';

import { useParams } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, ExternalLink, CheckCircle, Puzzle } from 'lucide-react';
import { featuredProjects } from '@/lib/data';

export default function FeaturedDetailPage() {
  const params = useParams();
  const slug = params.slug as string;

  const project = featuredProjects.find(p => p.slug === slug);

  if (!project) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-20 text-center">
        <h1 className="text-2xl font-bold text-dark-text mb-4">Project Not Found</h1>
        <Link href="/" className="text-accent-green hover:underline">Back to Home</Link>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <Link href="/" className="inline-flex items-center gap-1 text-dark-muted hover:text-dark-text text-sm mb-8 transition-colors">
        <ArrowLeft className="w-4 h-4" /> Back to home
      </Link>

      {/* Hero */}
      <div className="card p-8 mb-8">
        <div className="flex items-center gap-2 mb-3">
          <span className="badge bg-accent-green/20 text-accent-green">Featured Project</span>
          {project.sponsorName && (
            <span className="text-xs text-dark-muted">by {project.sponsorName}</span>
          )}
        </div>
        <h1 className="text-3xl font-bold text-dark-text mb-2">{project.name}</h1>
        <p className="text-accent-green font-medium mb-4">{project.tagline}</p>
        <p className="text-dark-muted leading-relaxed">{project.description}</p>

        <div className="mt-6">
          <a href={project.ctaUrl} className="btn-primary inline-flex items-center gap-2">
            {project.ctaText} <ExternalLink className="w-4 h-4" />
          </a>
        </div>
      </div>

      {/* Problem Statement */}
      {project.problemStatement && (
        <div className="card p-6 mb-6">
          <h2 className="text-lg font-semibold text-dark-text mb-3">The Problem</h2>
          <p className="text-dark-muted leading-relaxed">{project.problemStatement}</p>
        </div>
      )}

      {/* Features */}
      <div className="card p-6 mb-6">
        <h2 className="text-lg font-semibold text-dark-text mb-4">Features</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {project.features.map((feature, i) => (
            <div key={i} className="flex items-start gap-2">
              <CheckCircle className="w-4 h-4 text-accent-green mt-0.5 flex-shrink-0" />
              <span className="text-dark-text text-sm">{feature}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Integrations */}
      <div className="card p-6">
        <h2 className="text-lg font-semibold text-dark-text mb-4">Integrations</h2>
        <div className="flex flex-wrap gap-2">
          {project.integrations.map((integration, i) => (
            <span key={i} className="badge bg-dark-bg border border-dark-border text-dark-muted flex items-center gap-1.5">
              <Puzzle className="w-3 h-3" />
              {integration}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}
