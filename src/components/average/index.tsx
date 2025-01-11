"use client";

import { fetchGasAverages } from "@/services/gas";
import { useQuery } from "@tanstack/react-query";
import { Averages } from "./component";
import { Skeleton } from "../skeleton";

interface Props {
  network?: string;
}

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
