import type { MetadataRoute } from "next";
import { SITEMAP_PATHS } from "@/lib/seo/constants";
import { getAbsoluteUrl } from "@/lib/seo/site-url";

export default function sitemap(): MetadataRoute.Sitemap {
  return SITEMAP_PATHS.map((path) => ({
    url: getAbsoluteUrl(path),
    lastModified: new Date(),
    changeFrequency: "weekly",
    priority: path === "/" ? 1 : 0.8,
  }));
}
