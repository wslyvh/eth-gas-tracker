import { AveragesDataWrapper } from "@/components/average"
import { TransactionCostsDataWrapper } from "@/components/costs"
import { HistoryDataWrapper } from "@/components/history"
import { InfoDataWrapper } from "@/components/info"
import { fetchGasAverages, fetchGasHistory, fetchLatestGas } from "@/services/gas"
import { SITE_NAME, SITE_URL, SOCIAL_TWITTER } from "@/utils/site"
import { dehydrate, HydrationBoundary, QueryClient } from "@tanstack/react-query"

interface Params {
  params: { network: string }
  searchParams: { [key: string]: string | string[] | undefined }
}

export async function generateMetadata({ params }: Params) {
  const networkTitle = params.network.charAt(0).toUpperCase() + params.network.slice(1)
  const description = `Monitor and track ${networkTitle} gas prices to reduce transaction fees, save money and take control of your blockchain experience`
  const title = `${networkTitle} Gas Tracker`

  return {
    applicationName: title,
    title: title,
    metadataBase: new URL(SITE_URL),
    description: description,
    openGraph: {
      type: "website",
      title: title,
      siteName: SITE_NAME,
      description: description,
      url: SITE_URL,
      images: `/network/${params.network}/opengraph-image`,
    },
    twitter: {
      card: "summary_large_image",
      site: SOCIAL_TWITTER,
      title: title,
      description: description,
      images: `/network/${params.network}/opengraph-image`,
    },
  }
}

export default async function Page({ params }: Params) {
  const queryClient = new QueryClient();

  await queryClient.prefetchQuery({
    queryKey: ["gas", "latest"],
    queryFn: () => fetchLatestGas(params.network),
  });

  await queryClient.prefetchQuery({
    queryKey: ["gas", "history"],
    queryFn: () => fetchGasHistory(params.network),
  });

  await queryClient.prefetchQuery({
    queryKey: ["gas", "average"],
    queryFn: () => fetchGasAverages(params.network),
  });


  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <InfoDataWrapper network={params.network} />
      <HistoryDataWrapper network={params.network} />
      <TransactionCostsDataWrapper network={params.network} />
      <AveragesDataWrapper network={params.network} />
    </HydrationBoundary>
  )
}
