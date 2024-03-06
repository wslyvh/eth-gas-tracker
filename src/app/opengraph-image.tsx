import { SITE_NAME } from "./utils/site";
import { fetchLatestGas } from "@/services/gas";
import { LatestImageResponse } from "./components/images/latest";

// Route segment config
export const runtime = "edge";

// Image metadata
export const alt = SITE_NAME;
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function Image() {
  const url = process.env.VERCEL_URL || "http://localhost:3000";
  const data = await fetchLatestGas(url);

  if (!data) return null;

  return LatestImageResponse(data);
}
