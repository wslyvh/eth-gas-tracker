import { fetchGasHistory, fetchLatestGas } from "@/services/gas";
import {
  HydrationBoundary,
  QueryClient,
  dehydrate,
} from "@tanstack/react-query";
import { LatestDataWrapper } from "./components/latest/latest";
import { HistoryDataWrapper } from "./components/history";
import { SITE_NAME, SITE_URL, SITE_DESCRIPTION, SOCIAL_TWITTER } from "./utils/site";
import { getFrameMetadata } from "frog/next";

export async function generateMetadata() {
  const frameTags = await getFrameMetadata(
    `${process.env.VERCEL_URL || 'http://localhost:3000'}/api`,
  )
  
  return {
    applicationName: SITE_NAME,
    title: SITE_NAME,
    metadataBase: new URL(SITE_URL),
    description: SITE_DESCRIPTION,
    openGraph: {
      type: 'website',
      title: SITE_NAME,
      siteName: SITE_NAME,
      description: SITE_DESCRIPTION,
      url: SITE_URL,
      images: '/opengraph-image',
    },
    twitter: {
      card: 'summary_large_image',
      site: SOCIAL_TWITTER,
      title: SITE_NAME,
      description: SITE_DESCRIPTION,
      images: '/opengraph-image',
    },
    other: frameTags,
  };
}

export default async function Home() {
  const queryClient = new QueryClient();

  await queryClient.prefetchQuery({
    queryKey: ["gas", "latest"],
    queryFn: () => fetchLatestGas(),
  });

  await queryClient.prefetchQuery({
    queryKey: ["gas", "history"],
    queryFn: () => fetchGasHistory(),
  });

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <main className="flex flex-col items-center gap-4">
        <h1 className="text-3xl my-4">⛽ Ethereum Gas Tracker</h1>
        
        <LatestDataWrapper />

        <HistoryDataWrapper />
      </main>
    </HydrationBoundary>
  );
}
