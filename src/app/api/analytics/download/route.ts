import { NextRequest, NextResponse } from 'next/server';
import { downloadEventSchema } from '@/lib/validations';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const validated = downloadEventSchema.parse(body);

    // In production, this would save to the database
    // await prisma.downloadEvent.create({ data: validated });

    return NextResponse.json({
      message: 'Download event recorded',
      data: {
        componentId: validated.componentId,
        country: validated.country || 'unknown',
        createdAt: new Date().toISOString(),
      },
    });
  } catch (error) {
    return NextResponse.json({ error: 'Invalid request body' }, { status: 400 });
  }
}
