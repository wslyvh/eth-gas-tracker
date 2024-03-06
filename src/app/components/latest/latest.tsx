"use client";

import { fetchLatestGas } from "@/services/gas";
import { useQuery } from "@tanstack/react-query";
import { Latest } from "./component";

export function LatestDataWrapper() {
  const { data, isLoading } = useQuery({
    queryKey: ["gas", "latest"],
    refetchInterval: 12 * 1000,
    refetchOnWindowFocus: true,
    queryFn: () => fetchLatestGas(),
  });

  if (isLoading) return <div className="skeleton rounded-xl w-full max-w-[1200px] aspect-[1.91/1]"></div>

  if (!data) return null;

  return <Latest data={data} />
}
