'use client';

import { useParams } from 'next/navigation';
import { useState, useCallback, useMemo } from 'react';
import { SearchBar } from '@/components/SearchBar';
import { ComponentCard } from '@/components/ComponentCard';
import { components } from '@/lib/data';
import { getCategoryInfo, CATEGORIES, type CategoryType, type SortOption } from '@/lib/types';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';

const validCategories = CATEGORIES.map(c => c.slug);

export default function CategoryPage() {
  const params = useParams();
  const categorySlug = params.category as string;

  const [searchQuery, setSearchQuery] = useState('');
  const [sortOption, setSortOption] = useState<SortOption>('downloads');

  const category = getCategoryInfo(categorySlug);

  const handleSearch = useCallback((query: string) => setSearchQuery(query), []);
  const handleSortChange = useCallback((sort: SortOption) => setSortOption(sort), []);

  const filteredComponents = useMemo(() => {
    if (!validCategories.includes(categorySlug as CategoryType)) return [];

    let filtered = components.filter(c => c.category === categorySlug);

    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      filtered = filtered.filter(c =>
        c.name.toLowerCase().includes(q) ||
        c.description.toLowerCase().includes(q) ||
        c.tags.some(t => t.toLowerCase().includes(q))
      );
    }

    switch (sortOption) {
      case 'downloads':
        filtered.sort((a, b) => b.downloads - a.downloads);
        break;
      case 'name':
        filtered.sort((a, b) => a.name.localeCompare(b.name));
        break;
      case 'newest':
        filtered.sort((a, b) => b.id.localeCompare(a.id));
        break;
    }

    return filtered;
  }, [categorySlug, searchQuery, sortOption]);

  if (!category) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-20 text-center">
        <h1 className="text-2xl font-bold text-dark-text mb-4">Category Not Found</h1>
        <Link href="/" className="text-accent-green hover:underline">Back to Home</Link>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <Link href="/" className="inline-flex items-center gap-1 text-dark-muted hover:text-dark-text text-sm mb-6 transition-colors">
        <ArrowLeft className="w-4 h-4" /> Back to all
      </Link>

      <div className="mb-8">
        <div className="flex items-center gap-3 mb-2">
          <span className="text-3xl">{category.emoji}</span>
          <h1 className="text-2xl font-bold text-dark-text">{category.name}</h1>
        </div>
        <p className="text-dark-muted text-sm">{category.description}</p>
      </div>

      <div className="flex gap-8">
        <div className="flex-1 min-w-0">
          <SearchBar
            onSearch={handleSearch}
            onCategoryChange={() => { }}
            onSortChange={handleSortChange}
            resultCount={filteredComponents.length}
            initialCategory={categorySlug as CategoryType}
            showCategoryFilter={false}
          />

          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 mt-6">
            {filteredComponents.map(comp => (
              <ComponentCard key={comp.id} {...comp} />
            ))}
          </div>
        </div>

        <aside className="hidden lg:block w-[320px] flex-shrink-0">
          {/* StackBuilder moved to global layout */}
        </aside>
      </div>
    </div>
  );
}
