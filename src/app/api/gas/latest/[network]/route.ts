import { getGasData } from "@/app/utils/gas";
import { NextRequest, NextResponse } from "next/server";

export const dynamic = "force-static";
export const revalidate = 12;

export async function GET(req: NextRequest, { params }: { params: { network: string } }) {
  console.log(`GET /latest/${params.network}`);

  const data = await getGasData(params.network as any);
  if (data) {
    return NextResponse.json({ data });
  }

  return NextResponse.json({ error: "Failed to fetch data" }, { status: 400 });
}
