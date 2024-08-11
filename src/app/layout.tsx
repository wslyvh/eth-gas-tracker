import DataProvider from "./providers/DataProvider";
import PlausibleProvider from "next-plausible";
import { SITE_DOMAIN } from "./utils/site";
import { PropsWithChildren } from "react";
import "@/assets/globals.css";
import Link from "next/link";

export default function RootLayout(props: PropsWithChildren) {
  return (
    <html lang="en" className="bg-neutral-100">
      <head>
        <PlausibleProvider domain={SITE_DOMAIN} />
      </head>
      <body className="w-screen h-screen h-full p-8 pt-4">
        <main className="flex flex-col container mx-auto items-center gap-4">
          <Link href="/">
            <h1 className="text-3xl my-4">⛽ Ethereum Gas Tracker</h1>
          </Link>
          <div className="w-full max-w-[1200px] text-right">
            <Link href="/docs">API Docs &raquo;</Link>
          </div>

          <DataProvider>{props.children}</DataProvider>

          <div className="text-xs pb-4">
            <Link href="https://github.com/wslyvh/eth-gas-tracker/">
              Github
            </Link>
          </div>
        </main>
      </body>
    </html>
  );
}
