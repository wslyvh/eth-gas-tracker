import { MetadataRoute } from "next";
import { SITE_URL } from "./utils/site";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const pages = [
    {
      url: SITE_URL,
      lastModified: new Date(),
      changeFrequency: "always",
      priority: 1,
    },
    {
      url: `${SITE_URL}/gas`,
      lastModified: "2024-08-16T10:00:00.000Z",
      changeFrequency: "weekly",
      priority: 0.9,
    },
    {
      url: `${SITE_URL}/docs`,
      lastModified: "2024-08-16T10:00:00.000Z",
      changeFrequency: "weekly",
      priority: 0.6,
    },
  ] as MetadataRoute.Sitemap;

  return pages;
}
