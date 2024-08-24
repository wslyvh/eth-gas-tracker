import { getGasData } from "@/utils/gas";
import { NextResponse } from "next/server";

export const dynamic = "force-static";
export const revalidate = 12;

export async function GET() {
  console.log("GET /latest");

  const data = await getGasData("mainnet");
  if (data) {
    return NextResponse.json({ data });
  }

  return NextResponse.json({ error: "Failed to fetch data" }, { status: 400 });
}
