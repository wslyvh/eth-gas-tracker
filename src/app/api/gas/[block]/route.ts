import { NextResponse } from "next/server";
import { createPublicClient, formatGwei, http, parseAbi } from "viem";
import { mainnet } from "viem/chains";

export const dynamic = "force-static";

export async function GET(req: Request, { params }: { params: { block: string } }) {
  const blockNr = parseInt(params.block) || 0
  console.log(`GET /${blockNr}`);

  const client = createPublicClient({
    chain: mainnet,
    transport: http(
      `https://mainnet.infura.io/v3/${process.env.INFURA_API_KEY}`,
      { batch: true }
    ),
  });

  try {
    const [block, pending] = await Promise.all([
      await client.getBlock({ blockNumber: BigInt(blockNr) }),
      await client.getBlock({ blockNumber: BigInt(blockNr + 1) }),
    ]);

    if (!block.baseFeePerGas || !pending.baseFeePerGas) {
      return NextResponse.json('No baseFee found (pre-1559 block).', { status: 400 });
    }

    const baseFee = Math.round(Number(formatGwei(block.baseFeePerGas!!)) * 100) / 100;
    const nextFee = Math.round(Number(formatGwei(pending.baseFeePerGas!!)) * 100) / 100;
    return NextResponse.json({
      data: {
        blockNr: String(block.number),
        timestamp: Number(block.timestamp),
        baseFee: baseFee,
        nextFee: nextFee,
        difference: Math.round((nextFee - baseFee) * 100) / 100,
        gasLimit: Number(block.gasLimit),
        gasUsed: Number(block.gasUsed),
        utilization: Math.round(
          (Number(block.gasUsed) / Number(block.gasLimit)) * 100
        ),
        transactionCount: block.transactions.length,
        lastUpdate: Date.now(),
      },
    });
  } catch (e) {
    console.error(e);
    return NextResponse.json(e, { status: 400 });
  }
}
