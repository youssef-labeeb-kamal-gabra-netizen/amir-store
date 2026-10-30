import { Metadata } from "next";
import { env } from "@/lib/env";

export function constructMetadata({
  title,
  description,
  image = "/images/og-lkl.png",
  canonicalUrl,
  noIndex = false,
}: {
  title?: string;
  description?: string;
  image?: string;
  canonicalUrl?: string;
  noIndex?: boolean;
} = {}): Metadata {
  const fullTitle = title
    ? `${title} | ${env.business.name}`
    : `${env.business.name} | ${env.business.slogan}`;

  const fullDescription =
    description ||
    "شركة لبيب كمال للأدوات والآلات الزراعية - الزقازيق، الشرقية. توريد أحدث المعدات الزراعية، شبكات ومحركات ومولدات الري، قطع الغيار وخدمات الدعم الفني المتميزة.";

  return {
    title: fullTitle,
    description: fullDescription,
    applicationName: env.business.name,
    metadataBase: new URL(env.appUrl),
    alternates: {
      canonical: canonicalUrl || "/",
    },
    openGraph: {
      title: fullTitle,
      description: fullDescription,
      url: canonicalUrl || env.appUrl,
      siteName: env.business.name,
      images: [
        {
          url: image,
          width: 1200,
          height: 630,
          alt: env.business.name,
        },
      ],
      locale: "ar_EG",
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title: fullTitle,
      description: fullDescription,
      images: [image],
    },
    robots: {
      index: !noIndex,
      follow: !noIndex,
      googleBot: {
        index: !noIndex,
        follow: !noIndex,
      },
    },
    icons: {
      icon: "/favicon.ico",
    },
  };
}
