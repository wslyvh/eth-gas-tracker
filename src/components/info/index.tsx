"use client";

import { fetchLatestGas } from "@/services/gas";
import { useQuery } from "@tanstack/react-query";
import { Info } from "./component";

interface Props {
  network?: string
}

export function InfoDataWrapper({ network }: Props) {
  const { data, isLoading } = useQuery({
    queryKey: ["gas", "latest", network],
    refetchInterval: 12 * 1000,
    refetchOnWindowFocus: true,
    queryFn: () => fetchLatestGas(network),
  });

  if (isLoading)
    return (
      <>
        <div className="grid grid-cols-1 grid-rows-4 sm:grid-cols-2 sm:grid-rows-2 lg:grid-rows-1 lg:grid-cols-4 w-full max-w-[1200px] gap-4">
          <div className="skeleton relative rounded-xl h-52"></div>
          <div className="skeleton relative rounded-xl h-52"></div>
          <div className="skeleton relative rounded-xl h-52"></div>
          <div className="skeleton relative rounded-xl h-52"></div>
        </div>
      </>
    );

  if (!data) return null;

  return <Info data={data} network={network} />;
}
