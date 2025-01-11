"use client";

import { fetchGasAverages } from "@/services/gas";
import { useQuery } from "@tanstack/react-query";
import { Skeleton } from "../skeleton";
import dynamic from "next/dynamic";

interface Props {
  network?: string;
}

const Averages = dynamic(
  () =>
    import("./component").then((mod) => ({
      default: mod.Averages,
    })),
  { ssr: false }
);

export function AveragesDataWrapper({ network }: Props) {
  const { data, isLoading } = useQuery({
    queryKey: ["gas", "average", network],
    refetchInterval: 3600 * 1000,
    queryFn: () => fetchGasAverages(network),
  });

  if (isLoading) return <Skeleton />;

  if (!data) return null;

  return <Averages fees={data.data} lastUpdate={data.lastUpdate} />;
}
