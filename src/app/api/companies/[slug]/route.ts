import { NextRequest, NextResponse } from 'next/server';
import { companies, components } from '@/lib/data';

export async function GET(
  request: NextRequest,
  { params }: { params: { slug: string } }
) {
  const company = companies.find(c => c.slug === params.slug);

  if (!company) {
    return NextResponse.json({ error: 'Company not found' }, { status: 404 });
  }

  const companyComponents = components.filter(c => c.companyName === company.name);

  return NextResponse.json({
    data: {
      ...company,
      components: companyComponents,
    },
  });
}
