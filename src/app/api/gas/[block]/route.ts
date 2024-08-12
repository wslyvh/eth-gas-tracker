import { getGasData } from "@/app/utils/gas";
import { NextResponse } from "next/server";

export const dynamic = "force-static";

export async function GET(req: Request, { params }: { params: { block: string } }) {
  const blockNr = parseInt(params.block) || 0
  console.log(`GET /${blockNr}`);

  const data = await getGasData("mainnet", blockNr);
  if (data) {
    return NextResponse.json({ data });
  }

  return NextResponse.json({ error: "Failed to fetch data" }, { status: 400 });
}
