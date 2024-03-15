import { NextResponse } from "next/server";
import { createPublicClient, formatGwei, http } from "viem";
import { mainnet } from "viem/chains";

export const dynamic = 'force-static';
export const revalidate = 12;

export async function GET() {
  console.log("GET /history");

  const client = createPublicClient({
    chain: mainnet,
    transport: http(
      `https://mainnet.infura.io/v3/${process.env.INFURA_API_KEY}`,
      { batch: true }
    ),
  });

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
