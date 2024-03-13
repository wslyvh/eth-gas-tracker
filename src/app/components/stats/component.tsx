import { SITE_BLOB_NAME } from "@/app/utils/site";
import { BlobStats } from "@/services/blobs";

interface Props {
  data: BlobStats;
  lastUpdate: number;
}

function toBytes(bytes: number) {
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB']
  if (bytes === 0) return 'n/a'
  const i = Math.floor(Math.log(bytes) / Math.log(1024))
  if (i === 0) return `${bytes}`
  return `${(bytes / (1024 ** i)).toFixed(1)}`
}

function toByteSize(bytes: number) {
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB']
  if (bytes === 0) return 'n/a'
  const i = Math.floor(Math.log(bytes) / Math.log(1024))
  if (i === 0) return `Bytes`
  return `${sizes[i]}`
}

export function BlobStats(props: Props) {
  if (document && props.data.avgBlobGasPrice > 0) {
    document.title = `${props.data.avgBlobGasPrice} Gwei | ${SITE_BLOB_NAME}`;
  }

  return (
    <div className="stats stats-vertical w-full max-w-[1200px] md:stats-horizontal">
      <div className="stat">
        <div className="stat-title">Blobs</div>
        <div className="stat-value">{props.data.totalBlobs}</div>
        <div className="stat-desc">Daily</div>
      </div>

      <div className="stat">
        <div className="stat-title">Avg size</div>
        <div className="stat-value">{toBytes(props.data.avgBlobSize)}</div>
        <div className="stat-desc">{toByteSize(props.data.avgBlobSize)}</div>
      </div>

      <div className="stat">
        <div className="stat-title">Avg price</div>
        <div className="stat-value">{props.data.avgBlobGasPrice}</div>
        <div className="stat-desc">Gwei</div>
      </div>
    </div>
  );
}
