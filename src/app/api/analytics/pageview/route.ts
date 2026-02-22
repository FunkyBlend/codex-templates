import { NextRequest, NextResponse } from "next/server";
import { pageViewEventSchema } from "@/lib/validations";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const validated = pageViewEventSchema.parse(body);

    return NextResponse.json({
      message: "Page view event recorded",
      data: {
        path: validated.path,
        createdAt: new Date().toISOString(),
      },
    });
  } catch {
    return NextResponse.json({ error: "Invalid request body" }, { status: 400 });
  }
}
