import { CreatePublicClient } from "./web3";
import { NETWORKS } from "./config";
import { getAverage, toRoundedGwei } from "./math";
import { GetBlockParameters } from "viem/actions";
import { getEthPrice } from "@/services/ether";

export async function getGasData(network: NETWORKS, blockNr?: number) {
  const client = CreatePublicClient(network);
  const mainnet = CreatePublicClient("mainnet");

  const blockParams: GetBlockParameters = blockNr
    ? { blockNumber: BigInt(blockNr) }
    : { blockTag: "latest" };
  const pendingParams: GetBlockParameters = blockNr
    ? { blockNumber: BigInt(blockNr + 1) }
    : { blockTag: "pending" };
  let feeHistoryParams: any = {
    blockCount: 25,
    rewardPercentiles: [1, 40, 80],
  };
  if (blockNr) feeHistoryParams.blockNumber = BigInt(blockNr);
  if (!blockNr) feeHistoryParams.blockTag = "pending";

  try {
    const [block, pending, history, ethPrice] = await Promise.all([
      await client.getBlock(blockParams),
      await client.getBlock(pendingParams),
      await client.getFeeHistory(feeHistoryParams),
      await getEthPrice(),
    ]);

    if (!block.baseFeePerGas || !pending.baseFeePerGas) {
      return "No baseFee found (pre-1559 block).";
    }

    const fees = formatFeeHistory(history);
    const slow = getAverage(fees.map((b) => b.priorityFeePerGas[0]));
    const normal = getAverage(fees.map((b) => b.priorityFeePerGas[1]));
    const fast = getAverage(fees.map((b) => b.priorityFeePerGas[2]));

    const baseFee = toRoundedGwei(block.baseFeePerGas);
    const nextFee = toRoundedGwei(pending.baseFeePerGas);

    return {
      network: network,
      blockNr: String(block.number),
      timestamp: Number(block.timestamp),
      ethPrice: ethPrice,
      baseFee: Number(block.baseFeePerGas),
      nextFee: Number(pending.baseFeePerGas),
      difference: Math.round((nextFee - baseFee) * 100) / 100,
      block: {
        gasLimit: Number(block.gasLimit),
        gasUsed: Number(block.gasUsed),
        utilization: Math.round(
          (Number(block.gasUsed) / Number(block.gasLimit)) * 100
        ),
        transactionCount: block.transactions.length,
      },
      oracle: {
        slow: {
          gasFee: Math.round(slow + Number(pending.baseFeePerGas)),
          priorityFee: Math.round(slow),
          gwei: toRoundedGwei(Math.round(slow + Number(pending.baseFeePerGas))),
        },
        normal: {
          gasFee: Math.round(normal + Number(pending.baseFeePerGas)),
          priorityFee: Math.round(normal),
          gwei: toRoundedGwei(
            Math.round(normal + Number(pending.baseFeePerGas))
          ),
        },
        fast: {
          gasFee: Math.round(fast + Number(pending.baseFeePerGas)),
          priorityFee: Math.round(fast),
          gwei: toRoundedGwei(Math.round(fast + Number(pending.baseFeePerGas))),
        },
      },
      lastUpdate: Date.now(),
    };
  } catch (e) {
    console.error(e);
  }
}

export function formatFeeHistory(result: any, inclPending = false) {
  const blocks = [];
  for (let i = 0; i < result.reward.length; i++) {
    blocks.push({
      number: result.baseFeePerGas[i],
      baseFeePerGas: Number(result.baseFeePerGas[i]),
      gasUsedRatio: Number(result.gasUsedRatio[i]),
      priorityFeePerGas: result.reward[i].map((x: any) =>
        Number(x)
      ) as number[],
    });
  }

  if (inclPending) {
    blocks.push({
      number: "pending",
      baseFeePerGas: Number(result.baseFeePerGas[result.reward.length]),
      gasUsedRatio: NaN,
      priorityFeePerGas: [],
    });
  }

  return blocks;
}
