"use client";

import { fetchLatestGas } from "@/services/gas";
import { useQuery } from "@tanstack/react-query";
import { TransactionCosts } from "./component";

interface Props {
  network?: string
}

export function TransactionCostsDataWrapper({ network }: Props) {
  const { data, isLoading } = useQuery({
    queryKey: ["gas", "latest", network],
    refetchInterval: 12 * 1000,
    refetchOnWindowFocus: true,
    queryFn: () => fetchLatestGas(network),
  });

  if (isLoading) return <div className="skeleton rounded-xl w-full max-w-[1200px] aspect-[1.91/1]"></div>

  if (!data) return null;

  return <TransactionCosts data={data} />
}
