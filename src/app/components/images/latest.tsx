import { SITE_EMOJI, SITE_NAME } from "@/app/utils/site";
import { GasInfo } from "@/services/gas";
import dayjs from "dayjs";

export function LatestImageResponse(data: GasInfo) {
  return (
    <div tw="flex flex-col w-full h-full bg-white p-8 text-xl">
      <h1 tw='text-3xl'>
        <span tw="pr-4">{SITE_EMOJI}</span> {SITE_NAME}
      </h1>

      <div tw="flex relative grow w-auto h-auto justify-center my-8">
        <div tw="flex flex-col items-center justify-center rounded-full bg-slate-100 h-72 w-72">
          <span tw="text-8xl">{data.nextFee}</span>
          <span tw="text-2xl text-slate-500 mt-2">Gwei</span>
        </div>

        <div tw="flex flex-col mt-8">
          {data.difference >= 0 && (
            <span tw="text-sm py-1 px-2 rounded-xl bg-green-500 text-green-900">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 320 512"
                width={12}
                style={{
                  marginRight: "8px",
                }}
              >
                <path fill='#14532d' d="M182.6 137.4c-12.5-12.5-32.8-12.5-45.3 0l-128 128c-9.2 9.2-11.9 22.9-6.9 34.9s16.6 19.8 29.6 19.8H288c12.9 0 24.6-7.8 29.6-19.8s2.2-25.7-6.9-34.9l-128-128z" />
              </svg>
              {data.difference}%
            </span>
          )}
          {data.difference < 0 && (
            <span tw="text-sm py-1 px-2 rounded-xl bg-red-500 text-red-900">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 320 512"
                width={12}
                style={{
                  marginRight: "8px",
                }}
              >
                <path fill="#7f1d1d" d="M137.4 374.6c12.5 12.5 32.8 12.5 45.3 0l128-128c9.2-9.2 11.9-22.9 6.9-34.9s-16.6-19.8-29.6-19.8L32 192c-12.9 0-24.6 7.8-29.6 19.8s-2.2 25.7 6.9 34.9l128 128z" />
              </svg>
              {Math.abs(data.difference)}%
            </span>
          )}
        </div>
      </div>

      <div tw="flex flex-col">
        <div tw="flex justify-between">
          <div tw="flex flex-col">
            <span tw="text-4xl">Block # {data.blockNr}</span>
            <span tw="text-slate-400">
              {data.transactionCount} transactions
            </span>
          </div>
          <div tw="flex flex-col">
            <span tw="text-4xl">{data.utilization}%</span>
            <span tw="text-slate-400">
              {Math.round(data.gasUsed / 1e6)}M /{" "}
              {Math.round(data.gasLimit / 1e6)}M
            </span>
          </div>
        </div>

        <div tw="flex bg-slate-300 mt-4 w-full rounded-xl">
          <span
            tw={`bg-[#4a00ff] w-[${data.utilization}%] h-2 rounded-xl`}
          ></span>
        </div>

        <span tw="text-slate-600 mt-2">
          {dayjs.unix(data.timestamp).format("MMM DD · HH:mm:ss")} UTC
        </span>
      </div>
    </div>
  )
}
