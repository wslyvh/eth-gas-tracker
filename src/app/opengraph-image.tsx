import { SITE_NAME, SITE_URL } from "./utils/site";
import { fetchLatestGas } from "@/services/gas";
import { LatestImageResponse } from "./components/images/latest";
import { ImageResponse } from "next/og";

// Route segment config
export const runtime = "edge";

// Image metadata
export const alt = SITE_NAME;
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function Image() {
  const url = process.env.NODE_ENV === 'development' ? "http://localhost:3000" : SITE_URL;
  const data = await fetchLatestGas(url);

  if (!data) return null;

  return new ImageResponse(
    LatestImageResponse(data),
  )
}
