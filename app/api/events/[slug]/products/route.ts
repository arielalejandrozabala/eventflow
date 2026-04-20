import { NextRequest, NextResponse } from "next/server";
import { getEvent } from "@/lib/api/events";
import { logger } from "@/lib/logger";

// Client-side fetch endpoint for product data.
// Kept separate from the SSR page so the browser can fetch
// fresh prices/stock independently after the shell renders.
export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params;
    logger.info("GET /api/events/[slug]/products", { slug });

    const event = await getEvent(slug);

    if (!event) {
      logger.warn("products request for unknown event", { slug });
      return NextResponse.json({ error: "Event not found" }, { status: 404 });
    }

    return NextResponse.json(event.products ?? []);
  } catch (e) {
    logger.error("GET /api/events/[slug]/products failed", { error: String(e) });
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
