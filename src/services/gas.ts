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
  network: string;
  blockNr: string;
  timestamp: number;
  ethPrice: number;
  baseFee: number;
  nextFee: number;
  difference: number;
  block: {
    gasLimit: number;
    gasUsed: number;
    utilization: number;
    transactionCount: number;
  },
  oracle: {
    slow: {
      gasFee: number
      priorityFee: number
      gwei: number
    },
    normal: {
      gasFee: number
      priorityFee: number
      gwei: number
    },
    fast: {
      gasFee: number
      priorityFee: number
      gwei: number
    }
  }
  lastUpdate: number;
}

export interface DataWrapper<T> { 
  data: T;
  lastUpdate: number;
}

export async function fetchLatestGas(network: string = '', baseUri: string = ''): Promise<GasInfo> {
  const uri = network ? `${baseUri}/api/gas/latest/${network}` : `${baseUri}/api/gas/latest`;
  const response = await fetch(uri, { next: { revalidate: 12 } });
  return response.json().then((res) => res.data);
}

export async function fetchGasHistory(network: string = '', baseUri: string = ''): Promise<DataWrapper<GasFee[]>> {
  const uri = network ? `${baseUri}/api/gas/history/${network}` : `${baseUri}/api/gas/history`;
  const response = await fetch(uri, { next: { revalidate: 12 } });
  return response.json().then((res) => {
    return {
      data: res.data.blocks,
      lastUpdate: res.data.lastUpdate
    }
  });
}

export async function fetchGasAverages(network: string = '', baseUri: string = ''): Promise<DataWrapper<GasFee[]>> {
  const uri = network ? `${baseUri}/api/gas/average/${network}` : `${baseUri}/api/gas/average`;
  const response = await fetch(uri, { next: { revalidate: 3600 } });
  return response.json().then((res) => { 
    return {
      data: res.data.data,
      lastUpdate: res.data.lastUpdate
    }
  });
}

