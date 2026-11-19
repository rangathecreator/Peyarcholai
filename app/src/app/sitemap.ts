import type { MetadataRoute } from "next";
import { getAllTamilNames } from "@/lib/repository";

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = "https://peyar.donorconnect.in";
  const now = new Date();

  const staticRoutes: MetadataRoute.Sitemap = [
    { url: `${baseUrl}/`, lastModified: now, changeFrequency: "daily", priority: 1.0 },
    { url: `${baseUrl}/why-peyarcholai`, lastModified: now, changeFrequency: "weekly", priority: 0.9 },
    { url: `${baseUrl}/docs`, lastModified: now, changeFrequency: "weekly", priority: 0.8 },
    { url: `${baseUrl}/guide`, lastModified: now, changeFrequency: "weekly", priority: 0.7 },
  ];

  // Top 500 classical/verified Tamil names for fast sitemap generation
  const topNames = getAllTamilNames()
    .slice(0, 500)
    .map((n) => ({
      url: `${baseUrl}/name/${n.slug}`,
      lastModified: now,
      changeFrequency: "monthly" as const,
      priority: 0.7,
    }));

  return [...staticRoutes, ...topNames];
}
