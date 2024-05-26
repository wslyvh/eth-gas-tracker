import {
  getMin,
  getMax,
  getAverage,
  getMedian,
  toRoundedGwei,
} from "@/app/utils/math";
import { CreatePublicClient } from "@/app/utils/web3";
import { DEFAULT_LIMIT, NETWORKS } from "@/app/utils/config";
import { PrismaClient } from "@prisma/client";
import { getEthPrice } from "./ether";

const db = new PrismaClient();

export async function Index(network: NETWORKS = "mainnet") {
  console.log(`[${network}] Start indexing..`);

  const client = CreatePublicClient(network);

  const currentBlock = await client.getBlockNumber();
  const lastProcessedBlock = await db.blocks.findFirst({
    where: { network },
    orderBy: { blockNr: "desc" },
  });

  const runUntil =
    lastProcessedBlock?.blockNr || currentBlock - BigInt(DEFAULT_LIMIT);
  console.log(`[${network}] Process blocks # ${runUntil} / ${currentBlock}`);

  let blockNr = currentBlock;
  let records = [];
  while (blockNr >= runUntil) {
    console.log(`[${network}] # ${blockNr}`);

    const block = await client.getBlock({ blockNumber: blockNr });
    const fees = block.transactions
      .map((i: any) => toRoundedGwei(i.maxFeePerGas))
      .filter((i: any) => i > 0);
    const ethPrice = await getEthPrice();

    records.push({
      blockNr: Number(block.number),
      timestamp: new Date(Number(block.timestamp) * 1000),
      network: network,
      baseFee: toRoundedGwei(block.baseFeePerGas),
      gasLimit: Number(block.gasLimit),
      gasUsed: Number(block.gasUsed),
      txCount: block.transactions.length,
      min: getMin(fees),
      max: getMax(fees),
      avg: getAverage(fees),
      median: getMedian(fees),
      ethPrice: ethPrice,
    });

    blockNr--;
  }

  console.log(`[${network}] Adding ${records.length} block records to the database..`);
  try {
    await db.blocks.createMany({
      data: records,
      skipDuplicates: true,
    });
  } catch (e) {
    console.log(`[${network}] Unable to save records`);
    console.error(e);
  }

  console.log(`[${network}] Completed.`);
  return;
}
