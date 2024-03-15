import { BLOBSCAN_BASE_URI, BLOB_LIMIT } from "@/services/blobs";
import { NextResponse } from "next/server";

export const dynamic = 'force-static';
export const revalidate = 12;

export async function GET() {
  console.log("GET /info");

  try {
    const historicalBlocks = 50;
    const res = await fetch(`${BLOBSCAN_BASE_URI}/blocks?ps=${historicalBlocks}`);
    const data = await res.json();

    return NextResponse.json({
      data: data.blocks.map((i: any) => {
        const blobGasPrice = Math.round(Number(i.blobGasPrice / 1e9) * 100) / 100
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
    console.error(e)
    return NextResponse.json(e, { status: 400 });
  }
}
