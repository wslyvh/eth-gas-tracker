export interface LatestGas { 
  blockNr: string;
  timestamp: number;
  ethPrice: number;
  baseFee: number;
  gasLimit: number;
  gasUsed: number;
  utilization: number;
  transactionCount: number;
}

export async function fetchLatestGas(): Promise<LatestGas> {
  const response = await fetch("/api/latest");
  return response.json().then((res) => res.data); 
}
