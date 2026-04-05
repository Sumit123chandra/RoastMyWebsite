import type { Metadata } from "next";
import "./globals.css";

const BASE_URL = "https://roast-my-website-murex.vercel.app/"; // update with your domain

export const metadata: Metadata = {
  metadataBase: new URL(BASE_URL),
  title: {
    default: "RoastMyWebsite — Free AI Website Audit",
    template: "%s | RoastMyWebsite",
  },
  description:
    "Get a brutally honest AI audit of any website in 30 seconds. SEO score, UX review, performance check, and actionable fixes — completely free.",
  keywords: [
    "website audit",
    "free seo audit",
    "website checker",
    "ai website review",
    "seo checker",
    "ux audit",
    "website performance",
    "website analyser",
  ],
  authors: [{ name: "CodeNest", url: "https://code-nest-taupe.vercel.app" }],
  creator: "CodeNest",
  openGraph: {
    type: "website",
    url: BASE_URL,
    title: "RoastMyWebsite — Free AI Website Audit",
    description:
      "Get a brutally honest AI audit of any website in 30 seconds. SEO, UX, performance and more — free.",
    siteName: "RoastMyWebsite",
  },
  twitter: {
    card: "summary_large_image",
    title: "RoastMyWebsite — Free AI Website Audit",
    description: "Brutally honest AI audit of any website in 30 seconds. Free.",
    creator: "@codenest",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true },
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Bebas+Neue&family=DM+Sans:wght@300;400;500;600&family=DM+Mono&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>{children}</body>
    </html>
  );
}
