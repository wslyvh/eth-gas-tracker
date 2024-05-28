import { Index } from "@/services/indexer";
import { NextResponse } from "next/server";

export const dynamic = 'force-dynamic' // defaults to auto

export async function GET() {
  console.log("GET /indexer");

  try {
    await Promise.all([Index("mainnet"), Index("optimism"), Index("base"), Index('arbitrum')]);

    return NextResponse.json({
      data: {
        lastUpdate: Date.now(),
      },
    });
  } catch (e) {
    return NextResponse.json(e, { status: 400 });
  }
}
