import { NextRequest, NextResponse } from 'next/server';
import { trendingParamsSchema } from '@/lib/validations';
import { generateTrendingData, topCountries, components } from '@/lib/data';
import { CATEGORIES } from '@/lib/types';

export async function GET(request: NextRequest) {
  try {
    const url = new URL(request.url);
    const params = trendingParamsSchema.parse({
      range: url.searchParams.get('range') || undefined,
    });

    const chartData = generateTrendingData(params.range);

    const trendingByCategory = CATEGORIES.map(cat => ({
      category: cat.name,
      emoji: cat.emoji,
      top: components
        .filter(c => c.category === cat.slug)
        .sort((a, b) => b.downloads - a.downloads)
        .slice(0, 3)
        .map(c => ({ name: c.name, downloads: c.downloads })),
    }));

    return NextResponse.json({
      data: {
        chartData,
        trendingByCategory,
        topCountries,
      },
    });
  } catch (error) {
    return NextResponse.json({ error: 'Invalid parameters' }, { status: 400 });
  }
}
