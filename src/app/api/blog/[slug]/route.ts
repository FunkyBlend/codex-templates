import { NextRequest, NextResponse } from 'next/server';
import { blogPosts } from '@/lib/data';

export async function GET(
  request: NextRequest,
  { params }: { params: { slug: string } }
) {
  const post = blogPosts.find(p => p.slug === params.slug);

  if (!post) {
    return NextResponse.json({ error: 'Post not found' }, { status: 404 });
  }

  return NextResponse.json({ data: post });
}
