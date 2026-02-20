'use client';

import { useParams } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, ExternalLink } from 'lucide-react';
import { companies, components } from '@/lib/data';
import { ComponentCard } from '@/components/ComponentCard';

export default function CompanyDetailPage() {
  const params = useParams();
  const slug = params.slug as string;

  const company = companies.find(c => c.slug === slug);
  const companyComponents = components.filter(c => c.companyName === company?.name);

  if (!company) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-20 text-center">
        <h1 className="text-2xl font-bold text-dark-text mb-4">Company Not Found</h1>
        <Link href="/companies" className="text-accent-green hover:underline">Back to Companies</Link>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <Link href="/companies" className="inline-flex items-center gap-1 text-dark-muted hover:text-dark-text text-sm mb-6 transition-colors">
        <ArrowLeft className="w-4 h-4" /> Back to companies
      </Link>

      <div className="flex items-start gap-4 mb-8">
        <span className="text-5xl">{company.icon}</span>
        <div>
          <h1 className="text-2xl font-bold text-dark-text mb-1">{company.name}</h1>
          <p className="text-dark-muted text-sm mb-2">{company.description}</p>
          {company.websiteUrl && (
            <a
              href={company.websiteUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-accent-green text-sm hover:underline inline-flex items-center gap-1"
            >
              Visit Website <ExternalLink className="w-3 h-3" />
            </a>
          )}
        </div>
      </div>

      <div className="flex gap-8">
        <div className="flex-1 min-w-0">
          <h2 className="text-lg font-semibold text-dark-text mb-4">
            {companyComponents.length} Component{companyComponents.length !== 1 ? 's' : ''}
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
            {companyComponents.map(comp => (
              <ComponentCard key={comp.id} {...comp} />
            ))}
          </div>
          {companyComponents.length === 0 && (
            <p className="text-dark-muted text-sm">No components found for this company.</p>
          )}
        </div>

        <aside className="hidden lg:block w-[320px] flex-shrink-0">
          {/* StackBuilder moved to global layout */}
        </aside>
      </div>
    </div>
  );
}
