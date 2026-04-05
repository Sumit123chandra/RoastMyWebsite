// src/app/sitemap.ts
// Next.js automatically serves this at /sitemap.xml
import { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
  const base = "https://roast-my-website-murex.vercel.app/"; // update with your actual domain

  return [
    {
      url: base,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 1.0,
    },
    {
      url: `${base}/results`,
      lastModified: new Date(),
      changeFrequency: "never",
      priority: 0.5,
    },
  ];
}
