import type { Metadata, Viewport } from "next";
import { Cairo } from "next/font/google";
import "./globals.css";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { WhatsAppFloatingButton } from "@/components/common/whatsapp-button";
import { MobileActionBar } from "@/components/layout/mobile-action-bar";
import { constructMetadata } from "@/lib/seo";
import { getSession } from "@/lib/auth";
import { getCustomSettings } from "@/lib/settings-store";

const cairo = Cairo({
  subsets: ["arabic", "latin"],
  variable: "--font-cairo",
  display: "swap",
  weight: ["400", "500", "600", "700", "800", "900"],
});

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  themeColor: "#0c3b2e",
};

export const metadata: Metadata = constructMetadata();

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const session = await getSession();
  const settings = getCustomSettings();

  return (
    <html lang="ar" dir="rtl" className={`${cairo.variable} overflow-x-clip`}>
      <body className="font-sans antialiased bg-brand-neutral-50 text-brand-neutral-900 flex flex-col min-h-screen overflow-x-clip">
        <Header user={session} settings={settings} />
        <main className="flex-1 w-full pb-20 md:pb-0">{children}</main>
        <Footer settings={settings} />
        <WhatsAppFloatingButton settings={settings} />
        <MobileActionBar settings={settings} />
      </body>
    </html>
  );
}
