"use client";

import { fetchLatestGas } from "@/services/gas";
import { useQuery } from "@tanstack/react-query";
import dayjs from "dayjs";

export function Latest() {
  const { data, isLoading } = useQuery({
    queryKey: ["posts"],
    refetchInterval: 12 * 1000,
    refetchOnWindowFocus: true,
    queryFn: fetchLatestGas,
  });

  if (isLoading) return <>Loading...</>;

  if (!data) return <>No data</>;

  return (
    <div className="flex flex-col border border-1 p-12 w-[1200px] aspect-[1.91/1]">
      <div className="flex justify-between">
        <h2 className="text-3xl">⛽ ETH Gas Tracker</h2>
      </div>

      <div className="flex relative grow w-auto h-auto justify-center items-center">
        <div className='flex flex-col h-52 w-52 items-center justify-center rounded-full bg-slate-100'>
          <span className='text-6xl'>{data.nextFee}</span>
          <span className='text-slate-500 mt-2'>Gwei</span>
        </div>

        <div className="absolute -mt-32 ml-72 shrink-0 flex-none">
          {data.difference > 0 && (
            <div className="badge badge-success text-xs gap-2">
              ↗ {data.difference}%
            </div>
          )}
          {data.difference < 0 && (
            <div className="badge badge-error text-xs gap-2">
              ↘ {Math.abs(data.difference)}%
            </div>
          )}
        </div>
      </div>

      <div className="flex flex-col my-4">
        <div className="flex justify-between">
          <div className='flex flex-col'>
            <span className="text-2xl">Block # {data.blockNr}</span>
            <span className='text-sm text-slate-400'>{data.transactionCount} transactions</span>
          </div>
          <div className='flex flex-col align-right text-right'>
            <span className="text-2xl">{data.utilization}%</span>
            <span className='text-sm text-slate-400'>{Math.round(data.gasUsed / 1e6)}M / {Math.round(data.gasLimit / 1e6)}M</span>
          </div>
        </div>

        <progress className="progress progress-primary mt-4" value={`${data.utilization}`} max="100"></progress>

        <span className='text-sm text-slate-600 mt-2'>{dayjs.unix(data.timestamp).format("MMM DD · HH:mm:ss")} UTC</span>
      </div>
    </div>
  );
}
