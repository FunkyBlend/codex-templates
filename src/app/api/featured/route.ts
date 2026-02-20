import { NextResponse } from 'next/server';
import { featuredProjects } from '@/lib/data';

export async function GET() {
  const active = featuredProjects
    .filter(p => p.isActive)
    .sort((a, b) => a.sortOrder - b.sortOrder);

  return NextResponse.json({ data: active });
}
