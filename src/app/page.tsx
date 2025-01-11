import { fetchLatestGas } from "@/services/gas";
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
import { Suspense, lazy } from "react";
import { Skeleton } from "@/components/skeleton";

const InfoDataWrapper = lazy(() =>
  import("@/components/info").then((mod) => ({
    default: mod.InfoDataWrapper,
  }))
);

const TransactionCostsDataWrapper = lazy(() =>
  import("@/components/costs").then((mod) => ({
    default: mod.TransactionCostsDataWrapper,
  }))
);

export async function generateMetadata() {
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
  };
}

export default async function Home() {
  const queryClient = new QueryClient();

  await queryClient.prefetchQuery({
    queryKey: ["gas", "latest"],
    queryFn: () => fetchLatestGas(),
  });

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <Suspense fallback={<Skeleton />}>
        <InfoDataWrapper />
      </Suspense>

      <Suspense fallback={<Skeleton />}>
        <TransactionCostsDataWrapper />
      </Suspense>
    </HydrationBoundary>
  );
}
