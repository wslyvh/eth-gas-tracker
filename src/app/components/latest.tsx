"use client"

import { fetchLatestGas } from "@/services/gas";
import { useQuery } from "@tanstack/react-query";

export function Latest() {
  const { data, isLoading } = useQuery(
    { queryKey: ["posts"],
    refetchInterval: 12 * 1000,
    refetchOnWindowFocus: true,
    queryFn: fetchLatestGas });

  if (isLoading) return <>Loading...</>;

  console.log('DATA', data)
  if (!data) return <>No data</>;

  return <>Latest: {data.blockNr}</>;
}
