import { NextResponse } from "next/server";
import { createPublicClient, formatGwei, http, parseAbi } from "viem";
import { mainnet } from "viem/chains";

export const dynamic = "force-dynamic";
export const revalidate = 12;

export async function GET() {
  console.log("GET /gas");

  const client = createPublicClient({
    chain: mainnet,
    transport: http(
      `https://mainnet.infura.io/v3/${process.env.INFURA_API_KEY}`,
      { batch: true }
    ),
  });

  try {
    const [block, ethPrice] = await Promise.all([
      await client.getBlock({ blockTag: "latest" }),
      client
        .readContract({
          address: "0x5f4eC3Df9cbd43714FE2740f5E3616155c5b8419", // Chainlink Price Feed
          abi: parseAbi(["function latestAnswer() view returns (int256)"]),
          functionName: "latestAnswer",
        })
        .then((res) => Math.round((Number(res) / 1e8) * 100) / 100),
    ]);

    console.log("Gas from block #", block.number);
    return NextResponse.json({
      data: {
        blockNr: String(block.number),
        timestamp: Number(block.timestamp),
        ethPrice: ethPrice,
        baseFee:
          Math.round(Number(formatGwei(block.baseFeePerGas!!)) * 100) / 100,
        gasLimit: Number(block.gasLimit),
        gasUsed: Number(block.gasUsed),
        utilization: Math.round(
          (Number(block.gasUsed) / Number(block.gasLimit)) * 100
        ),
        transactionCount: block.transactions.length,
      },
    });
  } catch (e) {
    return NextResponse.json(e, { status: 400 });
  }
}
