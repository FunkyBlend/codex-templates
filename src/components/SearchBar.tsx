'use client';

import { Search, ChevronDown } from 'lucide-react';
import { useState, useCallback, useEffect } from 'react';
import { CATEGORIES, type CategoryType, type SortOption } from '@/lib/types';

interface SearchBarProps {
  onSearch: (query: string) => void;
  onCategoryChange: (category: CategoryType | 'all') => void;
  onSortChange: (sort: SortOption) => void;
  resultCount: number;
  initialCategory?: CategoryType | 'all';
  showCategoryFilter?: boolean;
}

export function SearchBar({
  onSearch,
  onCategoryChange,
  onSortChange,
  resultCount,
  initialCategory = 'all',
  showCategoryFilter = true,
}: SearchBarProps) {
  const [query, setQuery] = useState('');
  const [category, setCategory] = useState<CategoryType | 'all'>(initialCategory);
  const [sort, setSort] = useState<SortOption>('downloads');

  // Debounced search
  useEffect(() => {
    const timer = setTimeout(() => {
      onSearch(query);
    }, 300);
    return () => clearTimeout(timer);
  }, [query, onSearch]);

  const handleCategoryChange = useCallback((value: string) => {
    const cat = value as CategoryType | 'all';
    setCategory(cat);
    onCategoryChange(cat);
  }, [onCategoryChange]);

  const handleSortChange = useCallback((value: string) => {
    const s = value as SortOption;
    setSort(s);
    onSortChange(s);
  }, [onSortChange]);

  return (
    <div className="space-y-3">
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-dark-muted" />
          <input
            type="text"
            placeholder="Search components..."
            value={query}
            onChange={e => setQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 bg-dark-card border border-dark-border rounded-lg text-dark-text text-sm placeholder:text-dark-muted focus:outline-none focus:border-accent-green transition-colors"
          />
        </div>

        <div className="flex gap-3">
          {showCategoryFilter && (
            <div className="relative">
              <select
                value={category}
                onChange={e => handleCategoryChange(e.target.value)}
                className="appearance-none bg-dark-card border border-dark-border rounded-lg px-4 py-2.5 pr-8 text-dark-text text-sm focus:outline-none focus:border-accent-green cursor-pointer"
              >
                <option value="all">All Categories</option>
                {CATEGORIES.map(cat => (
                  <option key={cat.slug} value={cat.slug}>
                    {cat.emoji} {cat.name}
                  </option>
                ))}
              </select>
              <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 w-4 h-4 text-dark-muted pointer-events-none" />
            </div>
          )}

          <div className="relative">
            <select
              value={sort}
              onChange={e => handleSortChange(e.target.value)}
              className="appearance-none bg-dark-card border border-dark-border rounded-lg px-4 py-2.5 pr-8 text-dark-text text-sm focus:outline-none focus:border-accent-green cursor-pointer"
            >
              <option value="downloads">Most Downloaded</option>
              <option value="name">Alphabetical</option>
              <option value="newest">Newest</option>
            </select>
            <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 w-4 h-4 text-dark-muted pointer-events-none" />
          </div>
        </div>
      </div>

      <div className="text-xs text-dark-muted">
        {resultCount} component{resultCount !== 1 ? 's' : ''} found
      </div>
    </div>
  );
}
