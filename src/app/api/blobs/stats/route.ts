import { BLOBSCAN_BASE_URI } from "@/services/blobs";
import dayjs from "dayjs";
import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";
export const revalidate = 12;

export async function GET() {
  console.log("GET /info");

  try {

    const res = await fetch(`${BLOBSCAN_BASE_URI}/api/stats/overall`)
    const data = await res.json()
    return NextResponse.json({
      data: {
        timePeriod: dayjs(data.blob.updatedAt).valueOf(),

        totalBlobs: data.blob.totalBlobs,
        totalBlobSize: data.blob.totalBlobSize,
        avgBlobSize: data.blob.avgBlobSize,

        avgBlobFee: data.block.avgBlobFee,
        avgBlobGasPrice: Math.round(Number(data.block.avgBlobGasPrice) * 100) / 100,
      },
      lastUpdate: Date.now(),
    });

    const [blobs, blocks] = await Promise.all([
      await fetch(`${BLOBSCAN_BASE_URI}/api/stats/blobs?timeFrame=1d`).then(res => res.json()),
      await fetch(`${BLOBSCAN_BASE_URI}/api/stats/blocks?timeFrame=1d`).then(res => res.json()),
    ]);

    const blobGasPrice = blocks.avgBlobGasPrices?.length > 0 ? Math.round(Number(blocks.avgBlobGasPrices[0] / 1e9) * 100) / 100 : 0
    return NextResponse.json({
      data: {
        timePeriod: dayjs(blobs.days).valueOf(),

        totalBlobs: blobs.totalBlobs?.length > 0 ? blobs.totalBlobs[0] : 0,
        totalBlobSize: blobs.totalBlobSizes?.length > 0 ? blobs.totalBlobSizes[0] : 0,
        avgBlobSize: blobs.avgBlobSizes?.length > 0 ? blobs.avgBlobSizes[0] : 0,

        avgBlobFee: blocks.avgBlobFees?.length > 0 ? blocks.avgBlobFees[0] : 0,
        avgBlobGasPrice: blobGasPrice,
      },
      lastUpdate: Date.now(),
    });
  } catch (e) {
    console.error(e)
    return NextResponse.json(e, { status: 400 });
  }
}
