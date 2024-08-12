import { getGasData } from "@/app/utils/gas";
import { NextRequest, NextResponse } from "next/server";

export const dynamic = 'force-static';
export const revalidate = 12;

export async function GET(req: NextRequest, { params }: { params: { block: string, network: string } }) {
  const blockNr = parseInt(params.block) || 0
  console.log(`GET /${blockNr}/history/${params.network}`, );

  const data = await getGasData(params.network as any, blockNr);
  if (data) {
    return NextResponse.json({ data });
  }

  return NextResponse.json({ error: "Failed to fetch data" }, { status: 400 });
}
