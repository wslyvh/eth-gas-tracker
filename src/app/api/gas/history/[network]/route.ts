import { CreatePublicClient } from "@/app/utils/web3";
import { NextResponse } from "next/server";
import { formatGwei } from "viem";

export const dynamic = 'force-static';
export const revalidate = 12;

export async function GET(req: Request, { params }: { params: { network: string } }) {
  console.log("GET /history", params.network);

  const client = CreatePublicClient(params.network as any);

  try {
    const historicalBlocks = 50;
    const feeHistory = await client
      .getFeeHistory({ blockCount: historicalBlocks, rewardPercentiles: [30] })
      .then((res) => {
        let blockNr = res.oldestBlock;
        let index = 0;
        const blocks = [];
        while (blockNr < res.oldestBlock + BigInt(historicalBlocks)) {
          blocks.push({
            blockNr: blockNr.toString(),
            baseFee: Math.round(Number(formatGwei(res.baseFeePerGas[index])) * 100) / 100, // Number(res.baseFeePerGas[index]),
            utilization: Math.round((Number(res.gasUsedRatio[index])) * 100),
          });

          blockNr++;
          index++;
        }

        return blocks;
      });

    return NextResponse.json({
      data: {
        blocks: feeHistory,
        lastUpdate: Date.now(),
      },
    });
  } catch (e) {
    return NextResponse.json(e, { status: 400 });
  }
}
