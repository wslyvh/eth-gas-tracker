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
    <div className="flex flex-col w-80 border border-1 p-4">
      <div className="flex justify-between">
        <h2 className="text-3xl">⛽ {data.nextFee} Gwei </h2>
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
      <span className="text-sm text-slate-400 mt-2">
        #{data.blockNr} |{" "}
        {dayjs.unix(data.timestamp).format("MMM DD · HH:mm:ss")} UTC
      </span>
    </div>
  );
}
