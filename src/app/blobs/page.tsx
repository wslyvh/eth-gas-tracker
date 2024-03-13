import {
  HydrationBoundary,
  QueryClient,
  dehydrate,
} from "@tanstack/react-query";
import { SITE_BLOB_DESCRIPTION, SITE_BLOB_NAME, SITE_URL, SOCIAL_TWITTER } from "../utils/site";
import { fetchBlobHistory, fetchBlobStats } from "@/services/blobs";
import { BlobStatsDataWrapper } from "../components/stats";
import { BlobHistoryDataWrapper } from "../components/blobs";
import Link from "next/link";

export async function generateMetadata() {
  // const url = process.env.NODE_ENV === 'development' ? "http://localhost:3000" : SITE_URL;
  // const frameTags = await getFrameMetadata(`${url}/api`)

  return {
    applicationName: SITE_BLOB_NAME,
    title: SITE_BLOB_NAME,
    metadataBase: new URL(SITE_URL),
    description: SITE_BLOB_DESCRIPTION,
    openGraph: {
      type: 'website',
      title: SITE_BLOB_NAME,
      siteName: SITE_BLOB_NAME,
      description: SITE_BLOB_DESCRIPTION,
      url: SITE_URL,
      images: '/blobs/opengraph-image',
    },
    twitter: {
      card: 'summary_large_image',
      site: SOCIAL_TWITTER,
      title: SITE_BLOB_NAME,
      description: SITE_BLOB_DESCRIPTION,
      images: '/blobs/opengraph-image',
    },
    // other: frameTags,
  };
}

export default async function Home() {
  const queryClient = new QueryClient();

  await queryClient.prefetchQuery({
    queryKey: ["blobs", "info"],
    queryFn: () => fetchBlobStats(),
  });

  await queryClient.prefetchQuery({
    queryKey: ["blobs", "history"],
    queryFn: () => fetchBlobHistory(),
  });

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <main className="flex flex-col items-center gap-4">
        <h1 className="text-3xl my-4">Ethereum Blob Tracker .oO</h1>
        <div className="w-full max-w-[1200px] text-right">
          <Link href="/">Gas Tracker &raquo;</Link>
        </div>
        
        <BlobStatsDataWrapper />

        <BlobHistoryDataWrapper />

        <div className='text-xs pb-4'>
          <Link href='https://github.com/wslyvh/eth-gas-tracker/'>Github</Link>
        </div>
      </main>
    </HydrationBoundary>
  );
}
