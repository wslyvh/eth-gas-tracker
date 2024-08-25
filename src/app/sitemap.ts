import { MetadataRoute } from "next";
import { SITE_URL } from "@/utils/site";
import { GetPosts } from "@/services/content";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const posts = GetPosts()
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
      priority: 0.8,
    },
    {
      url: `${SITE_URL}/docs`,
      lastModified: "2024-08-16T10:00:00.000Z",
      changeFrequency: "weekly",
      priority: 0.6,
    },
    {
      url: `${SITE_URL}/resources`,
      lastModified: "2024-08-16T10:00:00.000Z",
      changeFrequency: "weekly",
      priority: 0.8,
    },
    ...posts.map((post) => ({
      url: `${SITE_URL}/resources/${post.slug}`,
      lastModified: "2024-08-24T10:00:00.000Z",
      changeFrequency: "monthly",
      priority: 0.5,
    })),
  ] as MetadataRoute.Sitemap;

  return pages;
}
