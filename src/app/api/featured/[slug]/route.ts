import { NextRequest, NextResponse } from 'next/server';
import { featuredProjects } from '@/lib/data';

export async function GET(
  request: NextRequest,
  { params }: { params: { slug: string } }
) {
  const project = featuredProjects.find(p => p.slug === params.slug);

  if (!project) {
    return NextResponse.json({ error: 'Featured project not found' }, { status: 404 });
  }

  return NextResponse.json({ data: project });
}
