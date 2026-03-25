import type { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    { url: "https://futurecareer.co", lastModified: new Date(), changeFrequency: "daily", priority: 1 },
    { url: "https://futurecareer.co/jobs", lastModified: new Date(), changeFrequency: "daily", priority: 0.9 },
    { url: "https://futurecareer.co/auth/login", lastModified: new Date(), changeFrequency: "monthly", priority: 0.5 },
    { url: "https://futurecareer.co/auth/register", lastModified: new Date(), changeFrequency: "monthly", priority: 0.5 },
  ];
}
