import { NextRequest, NextResponse } from "next/server";
import { getEvent } from "@/lib/api/events";

// Client-side fetch endpoint for product data.
// Kept separate from the SSR page so the browser can fetch
// fresh prices/stock independently after the shell renders.
export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params;
  const event = await getEvent(slug);

  if (!event) {
    return NextResponse.json({ error: "Event not found" }, { status: 404 });
  }

  return NextResponse.json(event.products ?? []);
}
