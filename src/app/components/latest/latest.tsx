"use client";

import { fetchLatestGas } from "@/services/gas";
import { useQuery } from "@tanstack/react-query";
import { Latest } from "./component";

export function LatestDataWrapper() {
  const { data, isLoading } = useQuery({
    queryKey: ["gas", "latest"],
    refetchInterval: 12 * 1000,
    refetchOnWindowFocus: true,
    queryFn: fetchLatestGas,
  });

  if (isLoading) return <>Loading...</>;

  if (!data) return <>No data</>;

  return <Latest data={data} />
}
