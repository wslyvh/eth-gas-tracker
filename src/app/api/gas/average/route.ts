import { createClient as sqlite } from "@libsql/client";
import { createClient } from "@supabase/supabase-js";
import { NextResponse } from "next/server";

export const dynamic = "force-static";
export const revalidate = 3600;

export async function GET() {
  console.log("GET /average");

  if (!process.env.SUPABASE_URL || !process.env.SUPABASE_KEY) {
    throw new Error("SUPABASE_URL or SUPABASE_KEY env variables are not set.");
  }

  const db = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_KEY);

  try {
    // period: 'hour' | 'day'
    const period = "hour";
    // network: 'mainnet' | 'polygon' | 'optimism' | 'arbitrum'
    const network = "mainnet";
    // limit: 24 | 168
    const limit = 168;

    try {
      console.log("Fetching Sqlite data...");
      const db1 = sqlite({
        url: `file:src/db/${network}.db`,
      });
      const { rows: blocks } = await db1.execute("SELECT * FROM blocks");
      console.log("BLOCKS", blocks);
    } catch (e) {
      console.error("Error:", e);
    }

    const { data, error } = await db
      .from(`gasdata_${network}_${period}`)
      .select("*")
      .limit(limit);

    if (error) {
      console.error("Error:", error);
      throw new Error(error.message);
    }

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
