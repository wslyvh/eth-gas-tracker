export function formatFeeHistory(result: any, inclPending = false) {
  const blocks = [];
  for (let i = 0; i < result.reward.length; i++) {
    blocks.push({
      number: result.baseFeePerGas[i],
      baseFeePerGas: Number(result.baseFeePerGas[i]),
      gasUsedRatio: Number(result.gasUsedRatio[i]),
      priorityFeePerGas: result.reward[i].map((x: any) => Number(x)),
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

export function avg(arr: any[]) {
  const sum = arr.reduce((a, v) => a + v);
  return Math.round(sum/arr.length);
}