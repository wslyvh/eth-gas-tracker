"use client";

import { fetchGasHistory } from "@/services/gas";
import { useQuery } from "@tanstack/react-query";
import { History } from "./component";

interface Props {
  network?: string
}

export function HistoryDataWrapper({ network }: Props) {
  const { data, isLoading } = useQuery({
    queryKey: ["gas", "history", network],
    refetchInterval: 12 * 1000,
    refetchOnWindowFocus: true,
    queryFn: () => fetchGasHistory(network),
  });

  if (isLoading) return <div className="skeleton rounded-xl w-full max-w-[1200px] aspect-[1.91/1]"></div>

  if (!data) return null;

  return <History data={data.data} lastUpdate={data.lastUpdate} />
}
