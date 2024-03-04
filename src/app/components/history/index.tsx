"use client";

import { fetchGasHistory } from "@/services/gas";
import { useQuery } from "@tanstack/react-query";
import { History } from "./component";

export function HistoryDataWrapper() {
  const { data, isLoading } = useQuery({
    queryKey: ["gas", "history"],
    refetchInterval: 12 * 1000,
    refetchOnWindowFocus: true,
    queryFn: fetchGasHistory,
  });

  if (isLoading) return <>Loading...</>;

  if (!data) return <>No data</>;

  return <History data={data} />
}
