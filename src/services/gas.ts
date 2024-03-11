export interface GasBlock {
  blockNr: string;
  baseFee: number;
  utilization: number;
}

// Old useWeb3 format used in Heatmap
export interface GasFee {
  blockNr: number
  period: string // timestamp
  baseFee: number
  gasLimit: number
  gasUsed: number
  min: number
  median: number
  ethPrice: number
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

export interface DataWrapper<T> { 
  data: T;
  lastUpdate: number;
}

export async function fetchLatestGas(baseUri: string = ''): Promise<GasInfo> {
  console.log("Fetching latest gas..", baseUri);
  const response = await fetch(`${baseUri}/api/gas/latest`, { next: { revalidate: 12 } });
  return response.json().then((res) => res.data);
}

export async function fetchGasHistory(baseUri: string = ''): Promise<DataWrapper<GasBlock[]>> {
  console.log("Fetching gas history..", baseUri);
  const response = await fetch(`${baseUri}/api/gas/history`, { next: { revalidate: 12 } });
  return response.json().then((res) => {
    return {
      data: res.data.blocks,
      lastUpdate: res.data.lastUpdate
    }
  });
}

export async function fetchGasAverages(baseUri: string = ''): Promise<DataWrapper<GasFee[]>> {
  console.log("Fetching gas averages..", baseUri);
  const response = await fetch(`${baseUri}/api/gas/average`, { next: { revalidate: 3600 } });
  return response.json().then((res) => { 
    return {
      data: res.data.data,
      lastUpdate: res.data.lastUpdate
    }
  });
}

