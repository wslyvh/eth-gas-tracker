import { CreatePublicClient } from "@/app/utils/web3";
import { NextRequest, NextResponse } from "next/server";
import { formatGwei } from "viem/utils";

export const dynamic = 'force-static';
export const revalidate = 12;

export async function GET(req: NextRequest, { params }: { params: { block: string, network: string } }) {
  const blockNr = parseInt(params.block) || 0
  console.log(`GET /${blockNr}/history/${params.network}`, );

  const client = CreatePublicClient(params.network as any);
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
