import { BLOBSCAN_BASE_URI, BLOB_LIMIT } from "@/services/blobs";
import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";
export const revalidate = 12;

export async function GET() {
  console.log("GET /api/blobs/history");

  try {
    // Create AbortController for timeout handling
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 5000); // 5 second timeout

    const historicalBlocks = 50;
    const res = await fetch(
      `${BLOBSCAN_BASE_URI}/blocks?ps=${historicalBlocks}`,
      {
        signal: controller.signal,
        headers: {
          "User-Agent": "eth-gas-tracker/1.0",
        },
      }
    );

    if (!res.ok) {
      throw new Error(`Blobscan API error: ${res.status}`);
    }

    const data = await res.json();
    clearTimeout(timeoutId);

    return NextResponse.json({
      data: data.blocks.map((i: any) => {
        const blobGasPrice =
          Math.round(Number(i.blobGasPrice / 1e9) * 100) / 100;
        return {
          blockNr: i.number,
          timestamp: i.timestamp,
          ethPrice: 0,
          blobSize: i.totalBlobSize,
          blobGasPrice: blobGasPrice,
          blobGasUsed: i.blobGasUsed,
          blobLimit: BLOB_LIMIT,
          utilization: (i.blobs.length / BLOB_LIMIT) * 100,
          blobCount: i.blobs.length,
        };
      }),
      lastUpdate: Date.now(),
    });
  } catch (e) {
    console.error("Error fetching blob history:", e);

    // Return fallback data instead of error to prevent build failures
    return NextResponse.json({
      data: [],
      lastUpdate: Date.now(),
      error: e instanceof Error ? e.message : "Unknown error",
    });
  }
}
