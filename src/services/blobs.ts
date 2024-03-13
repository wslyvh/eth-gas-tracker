export interface BlobInfo {
  blockNr: string;
  timestamp: number;
  ethPrice: number;

  blobSize: number;
  blobGasPrice: number;
  blobGasUsed: number;
  blobLimit: number;
  utilization: number;
  blobCount: number;
}

export interface BlobStats {
  timePeriod: number;

  totalBlobs: number;
  totalBlobSize: number;

  avgBlobSize: number;
  avgBlobFee: number,
  avgBlobGasPrice: number
}

export interface DataWrapper<T> { 
  data: T;
  lastUpdate: number;
}

export const BLOB_LIMIT = 6;
export const BLOBSCAN_BASE_URI = 'https://api.blobscan.com';

export async function fetchBlobStats(baseUri: string = ''): Promise<DataWrapper<BlobStats>> {
  console.log("Fetching latest blob stats..", baseUri);
  const response = await fetch(`${baseUri}/api/blobs/stats`, { next: { revalidate: 12 } });
  return response.json().then((res) => res);
}

export async function fetchBlobHistory(baseUri: string = ''): Promise<DataWrapper<BlobInfo[]>> {
  console.log("Fetching latest blob history..", baseUri);
  const response = await fetch(`${baseUri}/api/blobs/history`, { next: { revalidate: 12 } });
  return response.json().then((res) => res);
}

