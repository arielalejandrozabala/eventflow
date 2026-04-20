import { NextRequest, NextResponse } from "next/server";
import { getEvent } from "@/lib/api/events";

// Client-side fetch endpoint for product data.
// Kept separate from the SSR page so the browser can fetch
// fresh prices/stock independently after the shell renders.
export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params;
    const event = await getEvent(slug);

    if (!event) {
      return NextResponse.json({ error: "Event not found" }, { status: 404 });
    }

    return NextResponse.json(event.products ?? []);
  } catch (e) {
    console.error("[GET /api/events/[slug]/products]", e);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
