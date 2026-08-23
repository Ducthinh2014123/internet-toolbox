import type { MetadataRoute } from "next";
import { tools } from "@/lib/tools-registry";
import { categories } from "@/lib/categories";

const SITE_URL = "https://internet-toolbox.vercel.app";

export default function sitemap(): MetadataRoute.Sitemap {
  const staticRoutes: MetadataRoute.Sitemap = [
    { url: `${SITE_URL}/`, changeFrequency: "daily", priority: 1 },
    { url: `${SITE_URL}/tools`, changeFrequency: "daily", priority: 0.9 },
    { url: `${SITE_URL}/categories`, changeFrequency: "weekly", priority: 0.7 },
    { url: `${SITE_URL}/about`, changeFrequency: "monthly", priority: 0.3 },
  ];
  const categoryRoutes: MetadataRoute.Sitemap = categories.map((c) => ({
    url: `${SITE_URL}/categories/${c.slug}`,
    changeFrequency: "weekly",
    priority: 0.6,
  }));
  const toolRoutes: MetadataRoute.Sitemap = tools.map((t) => ({
    url: `${SITE_URL}/tools/${t.id}`,
    changeFrequency: "monthly",
    priority: 0.8,
  }));
  return [...staticRoutes, ...categoryRoutes, ...toolRoutes];
}
