import { ImageResponse } from "next/og";
import { fetchBlobStats } from "@/services/blobs";
import { SITE_BLOB_NAME, SITE_URL } from "../utils/site";
import { BlobStatsImageResponse } from "../components/images/blobs";

// Route segment config
export const runtime = "edge";

// Image metadata
export const alt = SITE_BLOB_NAME;
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function Image() {
  const url = process.env.NODE_ENV === 'development' ? "http://localhost:3000" : SITE_URL;
  const data = await fetchBlobStats(url);

  if (!data) return null;

  return new ImageResponse(
    BlobStatsImageResponse(data.data),
  )
}
