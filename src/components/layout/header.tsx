"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { BrandLogo } from "@/components/common/brand-logo";
import { SideNavDrawer } from "@/components/layout/side-nav-drawer";
import {
  User,
  ShieldCheck,
  LogOut,
  MessageCircle,
  MapPin,
  Sparkles,
} from "lucide-react";
import { env } from "@/lib/env";

interface HeaderProps {
  user?: {
    name?: string | null;
    email?: string | null;
    role?: "USER" | "ADMIN";
  } | null;
  settings?: {
    phone?: string;
    secondaryPhone?: string;
    whatsapp?: string;
    googleMapsUrl?: string;
    addressPhrase?: string;
  };
}

const quickNavLinks = [
  { href: "/", label: "الرئيسية" },
  { href: "/products", label: "الكتالوج" },
  { href: "/about", label: "عن الشركة" },
  { href: "/contact", label: "تواصل معنا" },
];

export function Header({ user, settings }: HeaderProps) {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const pathname = usePathname();

  const phone1 = settings?.phone || env.business.phone || "01220792948";
  const phone2 = settings?.secondaryPhone || env.business.secondaryPhone || "01114587917";
  const rawWhatsApp = settings?.whatsapp || env.business.whatsapp || "01220792948";
  const cleanWhatsApp = rawWhatsApp.replace(/[^0-9]/g, "");
  const whatsappUrl = `https://wa.me/${cleanWhatsApp.startsWith("0") ? `2${cleanWhatsApp}` : cleanWhatsApp}?text=${encodeURIComponent(
    "السلام عليكم، أود الاستفسار عن الآلات والمعدات الزراعية وقطع الغيار لدى شركة لبيب كمال لبيب."
  )}`;
  const mapsUrl = settings?.googleMapsUrl || env.business.googleMapsUrl || "https://maps.app.goo.gl/87VQjF6s9bEyF9yz7";

  return (
    <>
      <header className="sticky top-0 z-40 w-full border-b border-brand-neutral-200 bg-white/95 backdrop-blur-md shadow-xs">
        {/* Top micro-bar for verified contact info, history & location */}
        <div className="hidden lg:block border-b border-emerald-900/60 bg-[#022c22] text-white text-xs py-2 px-4 sm:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto flex items-center justify-between">
            <div className="flex items-center gap-5">
              <span className="flex items-center gap-1.5 text-emerald-100/90">
                <Sparkles className="h-3.5 w-3.5 text-brand-gold-400" />
                <span>تأسسنا كمحل سنة 2005 • جذور راسخة وخبرة تتجاوز 20 عاماً</span>
              </span>
              <span className="text-emerald-800">|</span>
              <a
                href={mapsUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1 text-emerald-100/90 hover:text-brand-gold-300 transition-colors"
                title="عرض الموقع على خرائط جوجل"
              >
                <MapPin className="h-3.5 w-3.5 text-brand-gold-400" />
                <span>الشرقية — طريق مصر الزراعي (الجديدة، مركز منيا القمح)</span>
              </a>
            </div>

            <div className="flex items-center gap-4 text-xs font-semibold">
              <span className="text-emerald-300/80">اتصال مباشر:</span>
              <a
                href={`tel:${phone1}`}
                className="text-white hover:text-brand-gold-400 transition-colors"
                dir="ltr"
              >
                {phone1}
              </a>
              <span className="text-emerald-800">•</span>
              <a
                href={`tel:${phone2}`}
                className="text-white hover:text-brand-gold-400 transition-colors"
                dir="ltr"
              >
                {phone2}
              </a>
              <span className="text-emerald-800">|</span>
              <a
                href={whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1 text-[#25D366] hover:text-emerald-300 font-bold transition-colors"
              >
                <MessageCircle className="h-3.5 w-3.5" />
                <span>واتساب فوري</span>
              </a>
            </div>
          </div>
        </div>

        {/* Main navigation bar */}
        <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
          <div className="flex h-16 sm:h-20 items-center justify-between gap-2 sm:gap-4">
            {/* Start side: Hamburger 3-Bars Drawer Button + Official Brand Logo */}
            <div className="flex items-center gap-2 sm:gap-4 min-w-0">
              {/* The Prominent 3-Bars Hamburger Button */}
              <button
                type="button"
                onClick={() => setDrawerOpen(true)}
                className="inline-flex items-center gap-1.5 sm:gap-2.5 px-2.5 sm:px-3.5 py-2 sm:py-2.5 rounded-2xl bg-brand-neutral-100/80 border border-brand-neutral-200 text-brand-neutral-900 hover:bg-brand-green-50 hover:border-brand-green-300 hover:text-brand-green-900 active:scale-95 transition-all shadow-2xs group cursor-pointer focus:outline-none focus:ring-2 focus:ring-brand-green-600 shrink-0"
                aria-label="فتح القائمة الجانبية والأقسام"
                title="القائمة والأقسام"
              >
                <div className="flex flex-col gap-1 w-4 sm:w-5 justify-center items-center py-0.5">
                  <span className="block h-0.5 w-4 sm:w-5 bg-brand-neutral-800 rounded-full group-hover:bg-brand-green-700 transition-all" />
                  <span className="block h-0.5 w-4 sm:w-5 bg-brand-neutral-800 rounded-full group-hover:bg-brand-green-700 transition-all" />
                  <span className="block h-0.5 w-4 sm:w-5 bg-brand-neutral-800 rounded-full group-hover:bg-brand-green-700 transition-all" />
                </div>
                <span className="font-extrabold text-[11px] sm:text-sm text-brand-neutral-900 group-hover:text-brand-green-900">
                  القائمة
                </span>
              </button>

              {/* Logo & Brand Identity */}
              <Link
                href="/"
                className="flex items-center group focus:outline-none focus:ring-2 focus:ring-brand-green-600 rounded-xl p-0.5 min-w-0"
              >
                <BrandLogo size="md" />
              </Link>
            </div>

            {/* Middle: Clean Desktop Quick Navigation */}
            <nav className="hidden lg:flex items-center gap-1" aria-label="شريط التنقل السريع">
              {quickNavLinks.map((link) => {
                const isActive =
                  pathname === link.href || (link.href !== "/" && pathname.startsWith(link.href));
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    className={cn(
                      "rounded-xl px-3.5 py-2 text-sm font-bold transition-all active:scale-95",
                      isActive
                        ? "bg-brand-green-50 text-brand-green-800 shadow-2xs"
                        : "text-brand-neutral-700 hover:bg-brand-neutral-100 hover:text-brand-neutral-900"
                    )}
                  >
                    {link.label}
                  </Link>
                );
              })}
            </nav>

            {/* End side: Direct WhatsApp Messaging & User Account */}
            <div className="flex items-center gap-1.5 sm:gap-3 shrink-0">
              {/* Direct WhatsApp Messaging Button */}
              <a
                href={whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="hidden sm:inline-flex items-center gap-1.5 rounded-xl bg-[#25D366] hover:bg-[#20ba59] active:bg-[#1da851] px-3 sm:px-4 py-2 sm:py-2.5 text-xs sm:text-sm font-bold text-white shadow-2xs transition-all hover:scale-105 active:scale-95"
                title="مراسلة فورية عبر واتساب"
              >
                <MessageCircle className="h-4 w-4" />
                <span>مراسلة واتساب</span>
              </a>

              {user ? (
                <div className="flex items-center gap-2">
                  {user.role === "ADMIN" && (
                    <Link
                      href="/admin"
                      className="inline-flex items-center gap-1.5 rounded-xl bg-purple-900 px-3 py-2 text-xs font-bold text-white hover:bg-purple-950 transition-colors shadow-sm"
                    >
                      <ShieldCheck className="h-4 w-4 text-brand-gold-400" />
                      <span className="hidden md:inline">لوحة الإدارة</span>
                    </Link>
                  )}

                  <Link
                    href="/account"
                    className="inline-flex items-center gap-2 rounded-xl border border-brand-neutral-300 bg-brand-neutral-50 px-2.5 sm:px-3 py-1.5 text-xs text-brand-neutral-900 hover:bg-brand-neutral-100 transition-colors"
                    title={user.email || ""}
                  >
                    <div className="h-7 w-7 rounded-full bg-brand-green-700 text-white flex items-center justify-center font-bold text-xs shrink-0">
                      {(user.name || user.email || "U").charAt(0).toUpperCase()}
                    </div>
                    <span className="hidden md:inline font-bold text-brand-neutral-900 text-xs max-w-[120px] truncate">
                      {user.email}
                    </span>
                  </Link>

                  <form action="/api/auth/logout" method="POST" className="hidden sm:block">
                    <button
                      type="submit"
                      title="تسجيل الخروج"
                      className="p-2 text-brand-neutral-400 hover:text-red-600 hover:bg-red-50 rounded-xl transition-colors cursor-pointer"
                    >
                      <LogOut className="h-4 w-4" />
                    </button>
                  </form>
                </div>
              ) : (
                <Link
                  href="/login"
                  className="inline-flex items-center gap-1.5 rounded-xl border border-brand-neutral-300 px-3 py-2 text-xs font-bold text-brand-neutral-800 hover:bg-brand-neutral-50 transition-colors"
                >
                  <User className="h-3.5 w-3.5 text-brand-neutral-600" />
                  <span className="hidden sm:inline">تسجيل الدخول</span>
                  <span className="sm:hidden">دخول</span>
                </Link>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Slide-out Sidebar Drawer with 3-Bars Trigger */}
      <SideNavDrawer
        isOpen={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        user={user}
      />
    </>
  );
}
