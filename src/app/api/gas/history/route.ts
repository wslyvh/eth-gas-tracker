import { getHistory } from "@/db/db";
import { NextRequest, NextResponse } from "next/server";

export const dynamic = 'force-static'; // force-dynamic to enable searchParams
export const revalidate = 12;

export async function GET(req: NextRequest) {
  console.log("GET /history");

  try {
    const history = await getHistory('mainnet', 50);

    return NextResponse.json({
      data: {
        network: 'mainnet',
        blocks: history,
        lastUpdate: Date.now(),
      },
    });
  } catch (e) {
    return NextResponse.json(e, { status: 400 });
  }
}
