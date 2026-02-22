import { NextResponse } from 'next/server';
import { components, companies } from '@/lib/data';
import { CATEGORIES } from '@/lib/types';

export async function GET() {
  const totalDownloads = components.reduce((sum, c) => sum + c.downloads, 0);
  const totalComponents = components.length;
  const totalCompanies = companies.length;

  const categoryStats = CATEGORIES.map(cat => ({
    category: cat.name,
    emoji: cat.emoji,
    count: components.filter(c => c.category === cat.slug).length,
    downloads: components
      .filter(c => c.category === cat.slug)
      .reduce((sum, c) => sum + c.downloads, 0),
  }));

  return NextResponse.json({
    data: {
      totalDownloads,
      totalComponents,
      totalCompanies,
      categoryStats,
    },
  });
}
