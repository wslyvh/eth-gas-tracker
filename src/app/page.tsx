import {
  fetchGasAverages,
  fetchGasHistory,
  fetchLatestGas,
} from "@/services/gas";
import {
  HydrationBoundary,
  QueryClient,
  dehydrate,
} from "@tanstack/react-query";
import {
  SITE_NAME,
  SITE_URL,
  SITE_DESCRIPTION,
  SOCIAL_TWITTER,
} from "@/utils/site";
import { getFrameMetadata } from "frog/next";
import { InfoDataWrapper } from "@/components/info";
import { Suspense, lazy } from "react";
import { Skeleton } from "@/components/skeleton";

const HistoryDataWrapper = lazy(() =>
  import("@/components/history").then((mod) => ({
    default: mod.HistoryDataWrapper,
  }))
);
const TransactionCostsDataWrapper = lazy(() =>
  import("@/components/costs").then((mod) => ({
    default: mod.TransactionCostsDataWrapper,
  }))
);
const AveragesDataWrapper = lazy(() =>
  import("@/components/average").then((mod) => ({
    default: mod.AveragesDataWrapper,
  }))
);

export async function generateMetadata() {
  const url =
    process.env.NODE_ENV === "development" ? "http://localhost:3000" : SITE_URL;
  const frameTags = await getFrameMetadata(`${url}/api`);

  return {
    applicationName: SITE_NAME,
    title: SITE_NAME,
    metadataBase: new URL(SITE_URL),
    description: SITE_DESCRIPTION,
    openGraph: {
      type: "website",
      title: SITE_NAME,
      siteName: SITE_NAME,
      description: SITE_DESCRIPTION,
      url: SITE_URL,
      images: "/opengraph-image",
    },
    twitter: {
      card: "summary_large_image",
      site: SOCIAL_TWITTER,
      title: SITE_NAME,
      description: SITE_DESCRIPTION,
      images: "/opengraph-image",
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
      <InfoDataWrapper />

      <Suspense fallback={<Skeleton />}>
        <HistoryDataWrapper />
      </Suspense>

      <Suspense fallback={<Skeleton />}>
        <TransactionCostsDataWrapper />
      </Suspense>

      <Suspense fallback={<Skeleton />}>
        <AveragesDataWrapper />
      </Suspense>
    </HydrationBoundary>
  );
}
