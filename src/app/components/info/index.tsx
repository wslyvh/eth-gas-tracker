"use client";

import { fetchLatestGas } from "@/services/gas";
import { useQuery } from "@tanstack/react-query";
import { Info } from "./component";

export function InfoDataWrapper() {
  const { data, isLoading } = useQuery({
    queryKey: ["gas", "latest"],
    refetchInterval: 12 * 1000,
    refetchOnWindowFocus: true,
    queryFn: () => fetchLatestGas(),
  });

  if (isLoading) return <div className="skeleton rounded-xl w-full max-w-[1200px]"></div>

  if (!data) return null;

  return <Info data={data} />
}
