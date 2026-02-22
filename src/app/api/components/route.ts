import { NextRequest, NextResponse } from 'next/server';
import { searchParamsSchema, componentCreateSchema } from '@/lib/validations';
import { components } from '@/lib/data';
import type { CategoryType, SortOption } from '@/lib/types';

export async function GET(request: NextRequest) {
  try {
    const url = new URL(request.url);
    const params = searchParamsSchema.parse({
      search: url.searchParams.get('search') || undefined,
      category: url.searchParams.get('category') || undefined,
      sort: url.searchParams.get('sort') || undefined,
      page: url.searchParams.get('page') || undefined,
      limit: url.searchParams.get('limit') || undefined,
    });

    let filtered = [...components];

    if (params.search) {
      const q = params.search.toLowerCase();
      filtered = filtered.filter(c =>
        c.name.toLowerCase().includes(q) ||
        c.description.toLowerCase().includes(q) ||
        c.tags.some(t => t.toLowerCase().includes(q))
      );
    }

    if (params.category !== 'all') {
      filtered = filtered.filter(c => c.category === params.category);
    }

    switch (params.sort as SortOption) {
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

    const total = filtered.length;
    const start = (params.page - 1) * params.limit;
    const end = start + params.limit;
    const data = filtered.slice(start, end);

    return NextResponse.json({
      data,
      pagination: {
        page: params.page,
        limit: params.limit,
        total,
        totalPages: Math.ceil(total / params.limit),
      },
    });
  } catch (error) {
    return NextResponse.json({ error: 'Invalid parameters' }, { status: 400 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const validated = componentCreateSchema.parse(body);

    // In production, this would create in the database
    return NextResponse.json({ message: 'Component created', data: validated }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: 'Invalid request body' }, { status: 400 });
  }
}
