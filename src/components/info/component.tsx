import { toRoundedGwei } from "@/utils/math";
import { SITE_NAME } from "@/utils/site";
import { GasInfo } from "@/services/gas";
import dayjs from "dayjs";

interface Props {
  data: GasInfo;
}

export function Info({ data }: Props) {
  if (document) {
    document.title = `${toRoundedGwei(data.baseFee)} Gwei | ${SITE_NAME}`;
  }

  return (
    <div className="grid grid-cols-1 grid-rows-4 sm:grid-cols-2 sm:grid-rows-2 lg:grid-rows-1 lg:grid-cols-4 w-full max-w-[1200px] gap-4">
      <div className="flex flex-col relative bg-white rounded-xl w-full p-4 md:p-8">
        <span className="absolute w-full top-0 right-0 text-right text-4xl text-slate-200 p-4">
          #
        </span>
        <span className="text-2xl">{data.blockNr}</span>
        <span className="text-sm text-slate-500">
          {data.block.transactionCount} transactions
        </span>
        <div className="flex flex-row justify-between items-center mt-6">
          <span>{data.block.utilization}%</span>
          <span className="text-slate-400">
            {Math.round(data.block.gasUsed / 1e6)}M /{" "}
            {Math.round(data.block.gasLimit / 1e6)}M
          </span>
        </div>

        <progress
          className="progress progress-primary mt-2"
          value={`${data.block.utilization}`}
          max="100"
        ></progress>

        <span className="text-xs text-slate-600 mt-2">
          {dayjs.unix(data.timestamp).format("MMM DD · HH:mm:ss")} UTC
        </span>
      </div>

      <div className="flex flex-col relative items-center bg-white rounded-xl w-full p-4 md:p-8">
        <div className="absolute top-0 right-0 text-right text-4xl text-slate-200 p-4">
          <div
            className={`flex text-xs items-center p-1 rounded-xl ${
              data.difference >= 0
                ? "badge-success fill-green-900 text-green-900"
                : "badge-error fill-red-900 text-red-900"
            }`}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 320 512"
              className="w-4 h-4 mr-1"
            >
              {data.difference >= 0 && (
                <path d="M182.6 137.4c-12.5-12.5-32.8-12.5-45.3 0l-128 128c-9.2 9.2-11.9 22.9-6.9 34.9s16.6 19.8 29.6 19.8H288c12.9 0 24.6-7.8 29.6-19.8s2.2-25.7-6.9-34.9l-128-128z" />
              )}
              {data.difference < 0 && (
                <path d="M137.4 374.6c12.5 12.5 32.8 12.5 45.3 0l128-128c9.2-9.2 11.9-22.9 6.9-34.9s-16.6-19.8-29.6-19.8L32 192c-12.9 0-24.6 7.8-29.6 19.8s-2.2 25.7 6.9 34.9l128 128z" />
              )}
            </svg>
            <span>
              {data.difference >= 0 && <>{data.difference}%</>}
              {data.difference < 0 && <>{Math.abs(data.difference)}%</>}
            </span>
          </div>
        </div>

        <div className="flex flex-col items-center justify-center rounded-full bg-slate-100 h-32 w-32 mt-2">
          <span className="text-4xl">{toRoundedGwei(data.nextFee, true)}</span>
          <span className="text-sm text-slate-500 mt-1">Gwei</span>
        </div>
      </div>

      <div className="flex flex-col relative bg-white rounded-xl w-full p-4 md:p-8">
        <span className="absolute w-full top-0 right-0 text-right text-4xl text-slate-200 p-4">
          Normal
        </span>

        <span className="text-2xl">{data.oracle.slow.gwei} Gwei</span>
        <span className="text-sm text-slate-500">
          {toRoundedGwei(data.oracle.slow.priorityFee)} priority fee
        </span>

        <span className="text-slate-600 mt-6">
          ${((toRoundedGwei(data.oracle.slow.gasFee) * 21000) / 1e9 * data.ethPrice).toFixed(2)} transfer
        </span>
        <span className="text-xs text-slate-400 mt-2">
          @ {Math.round(data.ethPrice)} ETH
        </span>
      </div>
      <div className="flex flex-col relative bg-white rounded-xl w-full p-4 md:p-8">
        <span className="absolute w-full top-0 right-0 text-right text-4xl text-slate-200 p-4">
          Fast
        </span>

        <span className="text-2xl">{data.oracle.fast.gwei} Gwei</span>
        <span className="text-sm text-slate-500">
          {toRoundedGwei(data.oracle.fast.priorityFee)} priority fee
        </span>

        <span className="text-slate-600 mt-6">
          ${((toRoundedGwei(data.oracle.fast.gasFee) * 21000) / 1e9 * data.ethPrice).toFixed(2)} transfer
        </span>
        <span className="text-xs text-slate-400 mt-2">
          @ {Math.round(data.ethPrice)} ETH
        </span>
      </div>
    </div>
  );
}
