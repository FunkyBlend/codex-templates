import { NextResponse } from 'next/server';
import { companies } from '@/lib/data';

export async function GET() {
  return NextResponse.json({ data: companies });
}
