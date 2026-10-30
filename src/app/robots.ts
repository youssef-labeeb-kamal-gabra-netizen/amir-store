import { MetadataRoute } from "next";
import { env } from "@/lib/env";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/admin", "/admin/", "/account", "/api/"],
      },
    ],
    sitemap: `${env.appUrl}/sitemap.xml`,
  };
}
