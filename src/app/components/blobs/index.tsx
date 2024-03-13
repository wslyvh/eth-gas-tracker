"use client";

import { useQuery } from "@tanstack/react-query";
import { BlobHistory } from "./component";
import { fetchBlobHistory } from "@/services/blobs";

export function BlobHistoryDataWrapper() {
  const { data, isLoading } = useQuery({
    queryKey: ["blobs", "history"],
    refetchInterval: 12 * 1000,
    queryFn: () => fetchBlobHistory(),
  });

  if (isLoading) return <div className="skeleton rounded-xl w-full max-w-[1200px] aspect-[1.91/1]"></div>

  if (!data || !data.data) return null;

  return <BlobHistory data={data.data} lastUpdate={data.lastUpdate}/>
}
