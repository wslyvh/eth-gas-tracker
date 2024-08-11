import { avg, formatFeeHistory } from "@/app/utils/gas";
import { CreatePublicClient } from "@/app/utils/web3";
import { NextResponse } from "next/server";
import { formatGwei, parseAbi } from "viem/utils";

export const dynamic = "force-static";
export const revalidate = 12;

export async function GET() {
  console.log("GET /oracle");

  const client = CreatePublicClient("mainnet");

  try {
    const [block, pending, estimates, history, ethPrice] = await Promise.all([
      await client.getBlock({ blockTag: "latest" }),
      await client.getBlock({ blockTag: "pending" }),
      await client.estimateFeesPerGas(),
      await client.getFeeHistory({ blockCount: 20, blockTag: 'pending', rewardPercentiles: [10, 60, 90] }),
      client
        .readContract({
          address: "0x5f4eC3Df9cbd43714FE2740f5E3616155c5b8419", // Chainlink Price Feed
          abi: parseAbi(["function latestAnswer() view returns (int256)"]),
          functionName: "latestAnswer",
        })
        .then((res) => Math.round((Number(res) / 1e8) * 100) / 100),
    ]);

    const fees = formatFeeHistory(history)
    const slow = avg(fees.map(b => b.priorityFeePerGas[0]));
    const normal = avg(fees.map(b => b.priorityFeePerGas[1]));
    const fast = avg(fees.map(b => b.priorityFeePerGas[2]));

    return NextResponse.json({
      data: {
        blockNr: String(block.number),
        timestamp: Number(block.timestamp),
        ethPrice: ethPrice,
        baseFee: Number(block.baseFeePerGas),
        nextFee: Number(pending.baseFeePerGas),
        estimates: {
          maxFeePerGas: Number(estimates.maxFeePerGas),
          maxPriorityFeePerGas: Number(estimates.maxPriorityFeePerGas),
        },
        oracle: {
          slow: Math.round(Number(formatGwei(BigInt(slow + Number(pending.baseFeePerGas!!)))) * 100) / 100,
          normal: Math.round(Number(formatGwei(BigInt(normal + Number(pending.baseFeePerGas!!)))) * 100) / 100,
          fast: Math.round(Number(formatGwei(BigInt(fast + Number(pending.baseFeePerGas!!)))) * 100) / 100,
        },
        lastUpdate: Date.now(),
      },
    });
  } catch (e) {
    return NextResponse.json(e, { status: 400 });
  }
}
