"use client";

import { fetchLatestGas } from "@/services/gas";
import { useQuery } from "@tanstack/react-query";
import { TransactionCosts } from "./component";
import { Skeleton } from "../skeleton";

interface Props {
  network?: string;
}

export function TransactionCostsDataWrapper({ network }: Props) {
  const { data, isLoading } = useQuery({
    queryKey: ["gas", "latest", network],
    refetchInterval: 12 * 1000,
    refetchOnWindowFocus: true,
    queryFn: () => fetchLatestGas(network),
  });

  if (isLoading) return <Skeleton />;

  if (!data) return null;

  return <TransactionCosts data={data} />;
}
