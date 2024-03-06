import DataProvider from "./providers/DataProvider";
import PlausibleProvider from "next-plausible";
import { SITE_DOMAIN} from "./utils/site";
import { PropsWithChildren } from "react";
import "@/assets/globals.css";

export default function RootLayout(props: PropsWithChildren) {
  return (
    <html lang="en">
      <head>
        <PlausibleProvider domain={SITE_DOMAIN} />
      </head>
      <body className="hv-100 bg-neutral-100 w-screen h-screen h-full p-8 pt-4">
        <DataProvider>{props.children}</DataProvider>
      </body>
    </html>
  );
}
