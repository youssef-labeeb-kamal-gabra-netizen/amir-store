import type { Metadata, Viewport } from "next";
import { Cairo, Amiri, Cinzel } from "next/font/google";
import "./globals.css";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { WhatsAppFloatingButton } from "@/components/common/whatsapp-button";
import { MobileActionBar } from "@/components/layout/mobile-action-bar";
import { constructMetadata } from "@/lib/seo";
import { getSession } from "@/lib/auth";
import { getCustomSettings } from "@/lib/settings-store";
import { CartProvider } from "@/lib/cart-context";
import { CartDrawer } from "@/components/cart/cart-drawer";

const cairo = Cairo({
  subsets: ["arabic", "latin"],
  variable: "--font-cairo",
  display: "swap",
  weight: ["400", "500", "600", "700", "800", "900"],
});

const amiri = Amiri({
  subsets: ["arabic", "latin"],
  variable: "--font-amiri",
  display: "swap",
  weight: ["400", "700"],
});

const cinzel = Cinzel({
  subsets: ["latin"],
  variable: "--font-cinzel",
  display: "swap",
  weight: ["400", "600", "700", "800", "900"],
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
    <html lang="ar" dir="rtl" className={`${cairo.variable} ${amiri.variable} ${cinzel.variable} overflow-x-clip`}>
      <body className="font-sans antialiased bg-brand-neutral-50 text-brand-neutral-900 flex flex-col min-h-screen overflow-x-clip">
        <CartProvider>
          <Header user={session} settings={settings} />
          <main className="flex-1 w-full pb-20 md:pb-0">{children}</main>
          <Footer settings={settings} />
          <WhatsAppFloatingButton settings={settings} />
          <MobileActionBar settings={settings} />
          <CartDrawer />
        </CartProvider>
      </body>
    </html>
  );
}
