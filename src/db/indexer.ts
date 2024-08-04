import { cleanup, dbClient, getLatestBlock } from "./db";
import { Chain, createPublicClient, http } from "viem";
import { mainnet, arbitrum, optimism } from "viem/chains";
import { formatGwei } from "viem/utils";
import dotenv from "dotenv";

dotenv.config();

run();

async function run() {
  console.log("Index db..");
  await Promise.all([
    index("mainnet"),
    index("optimism"),
    index("base"),
    index("arbitrum"),
  ]);

  console.log("Cleanup..");
  await Promise.all([
    cleanup("mainnet"),
    cleanup("optimism"),
    cleanup("base"),
    cleanup("arbitrum"),
  ]);
}

async function index(network: string = "mainnet") {
  console.log(`[${network}] Start indexing..`);

  const client = CreatePublicClient(network as any);
  const db = await dbClient(network as any);

  const currentBlock = await client.getBlockNumber();
  const latestBlock = await getLatestBlock(network as any);

  let runUntil = currentBlock - BigInt(100);
  if (network === "mainnet" && latestBlock?.blockNr) {
    runUntil = BigInt(latestBlock.blockNr as number);
  }
  console.log(`[${network}] Process blocks # ${runUntil} / ${currentBlock}`);

  let blockNr = currentBlock;
  let records = [];
  while (blockNr > runUntil) {
    console.log(`[${network}] # ${blockNr}`);

    const block = await client.getBlock({ blockNumber: blockNr });
    const fees = block.transactions
      .map((i: any) => toRoundedGwei(i.maxFeePerGas))
      .filter((i: any) => i > 0);
    const ethPrice = await getEthPrice();

    try {
      const result = await db.execute({
        sql: "INSERT INTO blocks VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)",
        args: [
          Number(block.number),
          toRoundedGwei(block.baseFeePerGas),
          block.transactions.length,
          getMin(fees),
          getMax(fees),
          getAverage(fees),
          getMedian(fees),
          ethPrice,
          Number(block.gasLimit),
          Number(block.gasUsed),
          new Date(Number(block.timestamp) * 1000).toISOString(),
          Number(block.timestamp),
        ],
      });
      records.push(result);
    } catch (e) {
      console.log(`[${network}] Unable to save block # ${blockNr}`);
      console.error(e);
    }

    blockNr--;
  }

  console.log(`[${network}] Completed. ${records.length} records processed`);
  return;
}

export function CreatePublicClient(network: string = "mainnet") {
  let chain: Chain = mainnet;
  let url = `https://mainnet.infura.io/v3/${process.env.INFURA_API_KEY}`;

  if (network === "arbitrum") {
    chain = arbitrum;
    url = `https://arb-mainnet.g.alchemy.com/v2/${process.env.ALCHEMY_API_KEY}`;
  }

  if (network === "base") {
    chain = arbitrum;
    url = `https://mainnet.base.org`;
  }

  if (network === "optimism") {
    chain = optimism;
    url = `https://optimism.publicnode.com`;
  }

  return createPublicClient({
    chain: chain,
    batch: {
      multicall: true,
    },
    transport: http(url),
  });
}

export async function getEthPrice() {
  try {
    const response = await fetch(
      "https://api.coinbase.com/v2/exchange-rates?currency=ETH"
    );
    const body = await response.json();

    if (body.data.rates.USD) {
      return parseFloat(body.data.rates.USD);
    }
  } catch (e) {
    console.log("Unable to fetch price from coinbase..");
  }

  try {
    const response = await fetch(
      "https://min-api.cryptocompare.com/data/price?fsym=ETH&tsyms=USD"
    );
    const body = await response.json();

    if (body.USD) {
      return parseFloat(body.usdPrice);
    }
  } catch (e) {
    console.log("Unable to fetch price from cryptocompare..");
  }

  return -1;
}

export function toRoundedGwei(value: any) {
  return Math.round(Number(formatGwei(value ?? 0)) * 100) / 100;
}

export function getMin(numbers: Array<number>) {
  if (numbers.length === 0) return 0;

  return numbers.sort((a, b) => a - b)[0];
}

export function getMax(numbers: Array<number>) {
  if (numbers.length === 0) return 0;

  return numbers.sort((a, b) => b - a)[0];
}

export function getAverage(numbers: Array<number>) {
  if (numbers.length === 0) return 0;

  return (
    Math.round((numbers.reduce((a, b) => a + b) / numbers.length) * 100) / 100
  );
}

export function getMedian(numbers: Array<number>) {
  if (numbers.length === 0) return 0;

  let middle = Math.floor(numbers.length / 2);
  numbers = [...numbers].sort((a, b) => a - b);
  return numbers.length % 2 !== 0
    ? numbers[middle]
    : (numbers[middle - 1] + numbers[middle]) / 2;
}
