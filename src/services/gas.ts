export interface LatestGas {
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

export async function fetchLatestGas(): Promise<LatestGas> {
  console.log("Fetching latest gas..");
  const response = await fetch("/api/gas", { next: { revalidate: 12 } });
  return response.json().then((res) => res.data);
}
