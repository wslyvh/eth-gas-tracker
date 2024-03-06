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

export async function fetchLatestGas(baseUri: string = ''): Promise<GasInfo> {
  console.log("Fetching latest gas..", baseUri);
  const response = await fetch(`${baseUri}/api/gas/latest`, { next: { revalidate: 12 } });
  return response.json().then((res) => res.data);
}

export async function fetchGasHistory(baseUri: string = ''): Promise<GasBlock[]> {
  console.log("Fetching gas history..", baseUri);
  const response = await fetch(`${baseUri}/api/gas/history`, { next: { revalidate: 12 } });
  return response.json().then((res) => res.data.blocks);
}

