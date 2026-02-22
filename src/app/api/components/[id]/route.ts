import { NextRequest, NextResponse } from 'next/server';
import { componentUpdateSchema } from '@/lib/validations';
import { components } from '@/lib/data';

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const component = components.find(c => c.id === params.id);

  if (!component) {
    return NextResponse.json({ error: 'Component not found' }, { status: 404 });
  }

  return NextResponse.json({ data: component });
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const component = components.find(c => c.id === params.id);

    if (!component) {
      return NextResponse.json({ error: 'Component not found' }, { status: 404 });
    }

    const body = await request.json();
    const validated = componentUpdateSchema.parse(body);

    return NextResponse.json({
      message: 'Component updated',
      data: { ...component, ...validated },
    });
  } catch (error) {
    return NextResponse.json({ error: 'Invalid request body' }, { status: 400 });
  }
}
