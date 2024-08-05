import { getAverage } from "@/db/db";
import { NextRequest, NextResponse } from "next/server";

export const dynamic = 'force-static'; // force-dynamic to enable searchParams
export const revalidate = 3600;

export async function GET(req: NextRequest) {
  console.log("GET /average");

  try {
    const data = await getAverage();

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
