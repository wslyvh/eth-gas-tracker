import { getHistory } from "@/db/db";
import { NextRequest, NextResponse } from "next/server";

export const dynamic = 'force-static'; // force-dynamic to enable searchParams
export const revalidate = 12;

export async function GET(req: NextRequest, { params }: { params: { network: string } }) {
  console.log(`GET /history/${params.network}`);

  try {
    const history = await getHistory(params.network as any, 50);

    return NextResponse.json({
      data: {
        network: params.network,
        blocks: history,
        lastUpdate: Date.now(),
      },
    });
  } catch (e) {
    return NextResponse.json(e, { status: 400 });
  }
}
