import { BLOBSCAN_BASE_URI } from "@/services/blobs";
import dayjs from "dayjs";
import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";
export const revalidate = 12;

// Default fallback data for when external API fails
const DEFAULT_STATS = {
  timePeriod: Date.now(),
  totalBlobs: 0,
  totalBlobSize: 0,
  avgBlobSize: 0,
  avgBlobFee: 0,
  avgBlobGasPrice: 0,
};

export async function GET() {
  console.log("GET /api/blobs/stats");

  try {
    // Create AbortController for timeout handling
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 10000); // 10 second timeout

    const [blobs, blocks] = await Promise.all([
      fetch(`${BLOBSCAN_BASE_URI}/stats/blobs?timeFrame=1d`, {
        signal: controller.signal,
        headers: {
          "User-Agent": "eth-gas-tracker/1.0",
        },
      }).then((res) => {
        if (!res.ok) throw new Error(`Blobscan API error: ${res.status}`);
        return res.json();
      }),
      fetch(`${BLOBSCAN_BASE_URI}/stats/blocks?timeFrame=1d`, {
        signal: controller.signal,
        headers: {
          "User-Agent": "eth-gas-tracker/1.0",
        },
      }).then((res) => {
        if (!res.ok) throw new Error(`Blobscan API error: ${res.status}`);
        return res.json();
      }),
    ]);

    clearTimeout(timeoutId);

    const blobGasPrice =
      blocks.avgBlobGasPrices?.length > 0
        ? Math.round(Number(blocks.avgBlobGasPrices[0] / 1e9) * 100) / 100
        : 0;

    return NextResponse.json({
      data: {
        timePeriod: dayjs(blobs.days).valueOf(),
        totalBlobs: blobs.totalBlobs?.length > 0 ? blobs.totalBlobs[0] : 0,
        totalBlobSize:
          blobs.totalBlobSizes?.length > 0 ? blobs.totalBlobSizes[0] : 0,
        avgBlobSize: blobs.avgBlobSizes?.length > 0 ? blobs.avgBlobSizes[0] : 0,
        avgBlobFee: blocks.avgBlobFees?.length > 0 ? blocks.avgBlobFees[0] : 0,
        avgBlobGasPrice: blobGasPrice,
      },
      lastUpdate: Date.now(),
    });
  } catch (e) {
    console.error("Error fetching blob stats:", e);

    // Return fallback data instead of error to prevent build failures
    return NextResponse.json({
      data: DEFAULT_STATS,
      lastUpdate: Date.now(),
      error: e instanceof Error ? e.message : "Unknown error",
    });
  }
}
