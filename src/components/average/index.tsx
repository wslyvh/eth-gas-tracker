"use client";

import { fetchGasAverages } from "@/services/gas";
import { useQuery } from "@tanstack/react-query";
import { Averages } from "./component";

interface Props {
  network?: string
}

export function AveragesDataWrapper({ network }: Props) {
  const { data, isLoading } = useQuery({
    queryKey: ["gas", "average", network],
    refetchInterval: 3600 * 1000,
    queryFn: () => fetchGasAverages(network),
  });

  if (isLoading) return <div className="skeleton rounded-xl w-full max-w-[1200px] aspect-[1.91/1]"></div>

  if (!data) return null;

  return <Averages fees={data.data} lastUpdate={data.lastUpdate}/>
}
