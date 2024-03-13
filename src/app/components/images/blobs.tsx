import { toByteSize, toBytes } from "@/app/utils/bytes";
import { SITE_BLOB_NAME, SITE_EMOJI } from "@/app/utils/site";
import { BlobStats } from "@/services/blobs";
import dayjs from "dayjs";

export function BlobStatsImageResponse(stats: BlobStats) {
  return (
    <div tw="flex flex-col w-full h-full bg-white p-8 text-xl">
      <h1 tw='text-3xl'>
        <span tw="pr-4">{SITE_EMOJI}</span> {SITE_BLOB_NAME} .oO
      </h1>

      <div tw="flex relative grow w-auto h-auto justify-center my-8">
        <div tw="flex flex-col items-center justify-center rounded-full bg-slate-100 h-72 w-72">
          <span tw="text-8xl">{stats.avgBlobGasPrice}</span>
          <span tw="text-2xl text-slate-500 mt-2">Gwei</span>
        </div>
      </div>

        <div className="stat-value"></div>
        <div className="stat-desc"></div>
        
      <div tw="flex flex-col">
        <div tw="flex justify-between">
          <div tw="flex flex-col">
            <span tw="text-4xl">{stats.totalBlobs} blobs</span>
            <span tw="text-slate-400">
              / Daily
            </span>
          </div>
          <div tw="flex flex-col">
            <span tw="text-4xl">{toBytes(stats.avgBlobSize)} {toByteSize(stats.avgBlobSize)}</span>
            <span tw="text-slate-400">
              / Average
            </span>
          </div>
        </div>

        <div tw="flex bg-slate-300 mt-4 w-full rounded-xl">
          <span
            tw={`bg-[#4a00ff] w-[0%] h-2 rounded-xl`}
          ></span>
        </div>

        <span tw="text-slate-600 mt-2">
          {dayjs(stats.timePeriod).format("MMM DD · HH:mm:ss")} UTC
        </span>
      </div>
    </div>
  )
}
