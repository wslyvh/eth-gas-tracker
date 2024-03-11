"use client";

import { fetchGasHistory } from "@/services/gas";
import { useQuery } from "@tanstack/react-query";
import { History } from "./component";

export function HistoryDataWrapper() {
  const { data, isLoading } = useQuery({
    queryKey: ["gas", "history"],
    refetchInterval: 12 * 1000,
    refetchOnWindowFocus: true,
    queryFn: () => fetchGasHistory(),
  });

  if (isLoading) return <div className="skeleton rounded-xl w-full max-w-[1200px] aspect-[1.91/1]"></div>

  if (!data) return null;

  return <History data={data.data} lastUpdate={data.lastUpdate} />
}
