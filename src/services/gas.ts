export interface GasBlock {
  blockNr: string;
  baseFee: number;
  utilization: number;
}

export interface GasInfo {
  blockNr: string;
  timestamp: number;
  ethPrice: number;
  baseFee: number;
  nextFee: number;
  difference: number;
  gasLimit: number;
  gasUsed: number;
  utilization: number;
  transactionCount: number;
  lastUpdate: number;
}

export async function fetchLatestGas(): Promise<GasInfo> {
  console.log("Fetching latest gas..");
  const response = await fetch("/api/gas/latest", { next: { revalidate: 12 } });
  return response.json().then((res) => res.data);
}

export async function fetchGasHistory(): Promise<GasBlock[]> {
  console.log("Fetching gas history..");
  const response = await fetch("/api/gas/history", { next: { revalidate: 12 } });
  return response.json().then((res) => res.data.blocks);
}

