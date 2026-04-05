// src/app/robots.ts
// Next.js automatically serves this at /robots.txt
import { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  const base = "https://roast-my-website-murex.vercel.app/"; // update with your actual domain

  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/api/"], // don't index API routes
      },
    ],
    sitemap: `${base}/sitemap.xml`,
  };
}
