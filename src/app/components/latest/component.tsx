import { SITE_NAME } from "@/app/utils/site";
import { GasInfo } from "@/services/gas";
import dayjs from "dayjs";

interface Props {
  data: GasInfo;
}

export function Latest({ data }: Props) {
  if (document) {
    document.title = `${data.baseFee} Gwei | ${SITE_NAME}`;
  }

  return (
    <div className="flex flex-col bg-white rounded-xl w-full max-w-[1200px] aspect-[1.91/1] p-4 md:p-12">
      <div className="flex justify-between">
        <h2 className="text-3xl">Gas Price</h2>
      </div>

      <div className="flex relative grow w-auto h-auto justify-center items-center my-4">
        <div className="flex flex-col items-center justify-center rounded-full bg-slate-100 h-48 w-48">
          <span className="text-6xl">{data.nextFee}</span>
          <span className="text-slate-500 mt-2">Gwei</span>
        </div>

        <div className="absolute -mt-32 ml-72">
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
      </div>

      <div className="flex flex-col">
        <div className="flex justify-between">
          <div className="flex flex-col">
            <span className="text-2xl">Block # {data.blockNr}</span>
            <span className="text-sm text-slate-400">
              {data.transactionCount} transactions
            </span>
          </div>
          <div className="flex flex-col align-right text-right">
            <span className="text-2xl">{data.utilization}%</span>
            <span className="text-sm text-slate-400">
              {Math.round(data.gasUsed / 1e6)}M /{" "}
              {Math.round(data.gasLimit / 1e6)}M
            </span>
          </div>
        </div>

        <progress
          className="progress progress-primary mt-4"
          value={`${data.utilization}`}
          max="100"
        ></progress>

        <span className="text-sm text-slate-600 mt-2">
          {dayjs.unix(data.timestamp).format("MMM DD · HH:mm:ss")} UTC
        </span>
      </div>
    </div>
  );
}
