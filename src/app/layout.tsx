import DataProvider from "./providers/DataProvider";
import { Analytics } from "@vercel/analytics/react";
import PlausibleProvider from "next-plausible";
import { SITE_DOMAIN } from "@/utils/site";
import { PropsWithChildren } from "react";
import { Navbar } from "@/components/navbar";
import Link from "next/link";
import "@/assets/globals.css";

export default function RootLayout(props: PropsWithChildren) {
  return (
    <html lang="en" className="bg-neutral-100">
      <head>
        <PlausibleProvider domain={SITE_DOMAIN} />
      </head>
      <Analytics />
      <body className="w-screen h-screen h-full p-2 sm:p-8 pt-4">
        <main className="flex flex-col container mx-auto items-center gap-4">
          <Navbar />

          <DataProvider>{props.children}</DataProvider>

          <div className="text-center mt-4 mb-2">
            <p className="prose max-w-4xl px-4 md:px-0">
              ETH Gas Tracker helps you discover how gas works, why it matters
              and help you set optimal gas fees to use the Ethereum network more
              efficiently. Get real-time gas prices, historical data, and
              average fees to time your transactions and save money. Ethereum
              Gas Tracker is the best way to track gas prices and provides an
              API for developers to integrate gas data into their applications.
              Learn more about <Link href="/gas">Ethereum Gas</Link>.
            </p>
          </div>

          <div className="flex text-xs gap-2 pb-4">
            <Link href="https://x.com/wslyvh">wslyvh</Link>
            <span>|</span>
            <Link href="https://github.com/wslyvh/eth-gas-tracker/">
              Github
            </Link>
          </div>
        </main>
      </body>
    </html>
  );
}
