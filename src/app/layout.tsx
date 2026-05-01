import { Suspense, lazy } from "react";
import DataProvider from "./providers/DataProvider";
import { SITE_DOMAIN, SITE_URL } from "@/utils/site";
import { PropsWithChildren } from "react";
import { Navbar } from "@/components/navbar";
import Link from "next/link";
import "@/assets/globals.css";
import { Metadata } from "next";

const PlausibleAnalytics = lazy(() => import("next-plausible"));

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
};

export default function RootLayout(props: PropsWithChildren) {
  return (
    <html lang="en" className="bg-neutral-100">
      <head>
        <Suspense fallback={null}>
          <PlausibleAnalytics domain={SITE_DOMAIN} />
        </Suspense>
      </head>
      <body className="w-screen h-screen h-full p-2 sm:p-8 pt-4">
        <main className="flex flex-col container mx-auto items-center gap-4">
          <Navbar />
          <div className="alert rounded-xl w-full max-w-[1200px] bg-warning/15 border border-warning/40 text-warning-content px-4 py-3 sm:px-6">
            <span className="text-sm sm:text-base">
              <strong className="font-semibold">Notice:</strong> Ethereum Gas
              Tracker will be deprecated as our priorities have shifted to a new
              project.{" "}
              <Link
                href="https://www.paperweight.email/"
                target="_blank"
                rel="noreferrer"
                className="font-semibold underline"
              >
                Paperweight
              </Link>{" "}
              scans your inbox to map your digital footprint and help you take
              back control. If you are interested in taking over, please feel
              free to{" "}
              <Link
                href="https://t.me/wslyvh"
                target="_blank"
                rel="noreferrer"
                className="font-semibold underline"
              >
                reach out
              </Link>
              .
            </span>
          </div>

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
