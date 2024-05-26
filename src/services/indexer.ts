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
  console.log("Current block", currentBlock);
  const lastProcessedBlock = await db.blocks.findFirst({
    where: { network },
    orderBy: { blockNr: "desc" },
  });
  console.log("Last processed block", lastProcessedBlock);

  const runUntil =
    lastProcessedBlock?.blockNr || currentBlock - BigInt(DEFAULT_LIMIT);
  console.log(`[${network}] Process blocks # ${runUntil} / ${currentBlock}`);

  console.log("Run Until", runUntil);
  let blockNr = currentBlock;
  while (blockNr >= runUntil) {
    console.log(`[${network}] # ${blockNr}`);

    const block = await client.getBlock({ blockNumber: blockNr });
    const fees = block.transactions
      .map((i: any) => toRoundedGwei(i.maxFeePerGas))
      .filter((i: any) => i > 0);
    const ethPrice = await getEthPrice();

    const record = {
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
    };

    console.log(`[${network}] Add to db`, record);
    try {
      await db.blocks.upsert({
        where: { blockNr: record.blockNr, network: network },
        update: record,
        create: record,
      });
    } catch (e) {
      console.log(`[${network}] Unable to save block # ${blockNr}`, record);
      console.error(e);
    }

    blockNr--;
  }

  console.log(`[${network}] Completed.`);
  return;
}
