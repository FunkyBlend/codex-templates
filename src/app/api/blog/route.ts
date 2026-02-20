import { NextRequest, NextResponse } from 'next/server';
import { blogPosts } from '@/lib/data';
import { z } from 'zod';

const blogParamsSchema = z.object({
  difficulty: z.enum(['basic', 'intermediate', 'advanced', 'all']).optional().default('all'),
});

export async function GET(request: NextRequest) {
  try {
    const url = new URL(request.url);
    const params = blogParamsSchema.parse({
      difficulty: url.searchParams.get('difficulty') || undefined,
    });

    let posts = [...blogPosts];

    if (params.difficulty !== 'all') {
      posts = posts.filter(p => p.difficulty === params.difficulty);
    }

    posts.sort((a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime());

    return NextResponse.json({ data: posts });
  } catch (error) {
    return NextResponse.json({ error: 'Invalid parameters' }, { status: 400 });
  }
}
