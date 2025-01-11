"use client";

import { fetchGasHistory } from "@/services/gas";
import { useQuery } from "@tanstack/react-query";
import { Skeleton } from "../skeleton";
import dynamic from "next/dynamic";

interface Props {
  network?: string;
}

const History = dynamic(
  () =>
    import("./component").then((mod) => ({
      default: mod.History,
    })),
  { ssr: false }
);

export function HistoryDataWrapper({ network }: Props) {
  const { data, isLoading } = useQuery({
    queryKey: ["gas", "history", network],
    refetchInterval: 12 * 1000,
    refetchOnWindowFocus: true,
    queryFn: () => fetchGasHistory(network),
  });

  if (isLoading) return <Skeleton />;

  if (!data) return null;

  return <History data={data.data} lastUpdate={data.lastUpdate} />;
}
