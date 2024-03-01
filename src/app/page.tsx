import { fetchLatestGas } from "@/services/gas";
import {
  HydrationBoundary,
  QueryClient,
  dehydrate,
} from "@tanstack/react-query";
import { Latest } from "./components/latest";

export default async function Home() {
  const queryClient = new QueryClient();

  await queryClient.prefetchQuery({
    queryKey: ["gas"],
    queryFn: fetchLatestGas,
  });

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <main className='flex h-screen justify-center items-center'>
        <Latest />
      </main>
    </HydrationBoundary>
  );
}
