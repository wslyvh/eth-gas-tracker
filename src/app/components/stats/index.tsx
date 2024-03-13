"use client";

import { useQuery } from "@tanstack/react-query";
import { BlobStats } from "./component";
import { fetchBlobStats } from "@/services/blobs";

export function BlobStatsDataWrapper() {
  const { data, isLoading } = useQuery({
    queryKey: ["blobs", "stats"],
    refetchInterval: 3600 * 1000,
    queryFn: () => fetchBlobStats(),
  });

  if (isLoading) return <div className="skeleton rounded-xl w-full max-w-[1200px] aspect-[1.91/1]"></div>

  if (!data || !data.data) return null;

  return <BlobStats data={data.data} lastUpdate={data.lastUpdate}/>
}
