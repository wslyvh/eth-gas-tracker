import { fetchGasAverages, fetchGasHistory, fetchLatestGas } from "@/services/gas";
import {
  HydrationBoundary,
  QueryClient,
  dehydrate,
} from "@tanstack/react-query";
import { LatestDataWrapper } from "./components/latest";
import { HistoryDataWrapper } from "./components/history";
import { SITE_NAME, SITE_URL, SITE_DESCRIPTION, SOCIAL_TWITTER } from "./utils/site";
import { TransactionCostsDataWrapper } from "./components/costs";
import { getFrameMetadata } from "frog/next";
import { AveragesDataWrapper } from "./components/average";
import Link from "next/link";

export async function generateMetadata() {
  const url = process.env.NODE_ENV === 'development' ? "http://localhost:3000" : SITE_URL;
  const frameTags = await getFrameMetadata(`${url}/api`)
  
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

  await queryClient.prefetchQuery({
    queryKey: ["gas", "average"],
    queryFn: () => fetchGasAverages(),
  });

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <main className="flex flex-col items-center gap-4">
        <h1 className="text-3xl my-4">⛽ Ethereum Gas Tracker</h1>
        
        <LatestDataWrapper />

        <TransactionCostsDataWrapper />

        <HistoryDataWrapper /> 

        <AveragesDataWrapper />

        <div className='text-xs pb-4'>
          <Link href='https://github.com/wslyvh/eth-gas-tracker/'>Github</Link>
        </div>
      </main>
    </HydrationBoundary>
  );
}
