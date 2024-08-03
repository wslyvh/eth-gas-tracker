import { getAverage } from "@/db/db";
import { NextRequest, NextResponse } from "next/server";

export const dynamic = "force-static";
export const revalidate = 3600;

export async function GET(req: Request, { params }: { params: { network: string } }) {
  console.log("GET /average", params.network);

  try {
    const data = await getAverage(params.network as any);

    return NextResponse.json({
      data: {
        data: data,
        lastUpdate: Date.now(),
      },
    });
  } catch (e) {
    return NextResponse.json(e, { status: 400 });
  }
}
