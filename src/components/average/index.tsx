"use client";

import { fetchGasAverages } from "@/services/gas";
import { useQuery } from "@tanstack/react-query";
import { Averages } from "./component";

export function AveragesDataWrapper() {
  const { data, isLoading } = useQuery({
    queryKey: ["gas", "average"],
    refetchInterval: 3600 * 1000,
    queryFn: () => fetchGasAverages(),
  });

  if (isLoading) return <div className="skeleton rounded-xl w-full max-w-[1200px] aspect-[1.91/1]"></div>

  if (!data) return null;

  return <Averages fees={data.data} lastUpdate={data.lastUpdate}/>
}
