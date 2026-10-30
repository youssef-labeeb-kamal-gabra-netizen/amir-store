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
  ShoppingBag,
} from "lucide-react";
import { env } from "@/lib/env";
import { useCart } from "@/lib/cart-context";

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
  { href: "/products", label: "مجموعة العطور الملكية" },
  { href: "/#olfactory-pyramid", label: "الهرم العطري 3D" },
  { href: "/templates", label: "تجارب وقوالب الاستكشاف" },
  { href: "/about", label: "عن أمير ستور" },
  { href: "/contact", label: "تواصل معنا" },
];

export function Header({ user, settings }: HeaderProps) {
  const { totalCount, setIsCartOpen } = useCart();
  const [drawerOpen, setDrawerOpen] = useState(false);
  const pathname = usePathname();

  const phone1 = settings?.phone || env.business.phone || "01220086002";
  const phone2 = settings?.secondaryPhone || env.business.secondaryPhone || "01220086002";
  const rawWhatsApp = settings?.whatsapp || env.business.whatsapp || "01220086002";
  const cleanWhatsApp = rawWhatsApp.replace(/[^0-9]/g, "");
  const whatsappUrl = `https://wa.me/${cleanWhatsApp.startsWith("0") ? `2${cleanWhatsApp}` : cleanWhatsApp}?text=${encodeURIComponent(
    "السلام عليكم، أود الاستفسار عن تشكيلة العطور والعود المتاحة لدى متجر أمير ستور."
  )}`;

  return (
    <>
      <header className="sticky top-0 z-40 w-full border-b border-amber-400/20 bg-[#08090C]/85 backdrop-blur-2xl shadow-[0_4px_30px_rgba(0,0,0,0.6)]">
        {/* Top micro-bar for verified contact info, history & location */}
        <div className="hidden lg:block border-b border-amber-400/10 bg-[#0D0F14] text-slate-300 text-xs py-2 px-4 sm:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto flex items-center justify-between">
            <div className="flex items-center gap-5">
              <span className="flex items-center gap-1.5 text-amber-200/90">
                <Sparkles className="h-3.5 w-3.5 text-amber-400 animate-pulse" />
                <span>متجر أمير ستور • دار العطور والعود الفاخر • نقاء وثبات 72 ساعة</span>
              </span>
              <span className="text-amber-400/30">|</span>
              <span className="flex items-center gap-1 text-slate-300">
                <MapPin className="h-3.5 w-3.5 text-amber-400" />
                <span>شحن وتوصيل فوري لكافة المحافظات</span>
              </span>
            </div>

            <div className="flex items-center gap-4 text-xs font-semibold">
              <span className="text-amber-400/80">خدمة العملاء:</span>
              <a
                href={`tel:${phone1}`}
                className="text-white hover:text-amber-300 transition-colors font-mono"
                dir="ltr"
              >
                {phone1}
              </a>
              <span className="text-amber-400/30">•</span>
              <a
                href={`tel:${phone2}`}
                className="text-white hover:text-amber-300 transition-colors font-mono"
                dir="ltr"
              >
                {phone2}
              </a>
              <span className="text-amber-400/30">|</span>
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
                className="inline-flex items-center gap-1.5 sm:gap-2.5 px-2.5 sm:px-3.5 py-2 sm:py-2.5 rounded-2xl bg-white/[0.04] border border-amber-400/20 text-white hover:bg-amber-400/10 hover:border-amber-400/50 hover:text-amber-300 active:scale-95 transition-all shadow-sm group cursor-pointer focus:outline-none focus:ring-2 focus:ring-amber-400/50 shrink-0"
                aria-label="فتح القائمة الجانبية والأقسام"
                title="القائمة والأقسام"
              >
                <div className="flex flex-col gap-1 w-4 sm:w-5 justify-center items-center py-0.5">
                  <span className="block h-0.5 w-4 sm:w-5 bg-amber-300 rounded-full group-hover:bg-amber-400 transition-all" />
                  <span className="block h-0.5 w-4 sm:w-5 bg-amber-300 rounded-full group-hover:bg-amber-400 transition-all" />
                  <span className="block h-0.5 w-4 sm:w-5 bg-amber-300 rounded-full group-hover:bg-amber-400 transition-all" />
                </div>
                <span className="font-extrabold text-[11px] sm:text-sm text-white group-hover:text-amber-300">
                  القائمة
                </span>
              </button>

              {/* Logo & Brand Identity */}
              <Link
                href="/"
                className="flex items-center group focus:outline-none focus:ring-2 focus:ring-amber-400/50 rounded-xl p-0.5 min-w-0"
              >
                <BrandLogo size="md" />
              </Link>
            </div>

            {/* Middle: Clean Desktop Quick Navigation */}
            <nav className="hidden lg:flex items-center gap-1.5" aria-label="شريط التنقل السريع">
              {quickNavLinks.map((link) => {
                const isActive =
                  pathname === link.href || (link.href !== "/" && pathname.startsWith(link.href));
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    className={cn(
                      "rounded-xl px-4 py-2 text-sm font-bold transition-all active:scale-95",
                      isActive
                        ? "bg-gradient-to-r from-amber-400/20 to-amber-500/10 border border-amber-400/40 text-amber-300 shadow-[0_0_15px_rgba(212,175,55,0.2)]"
                        : "text-slate-300 hover:text-amber-300 hover:bg-white/[0.04]"
                    )}
                  >
                    {link.label}
                  </Link>
                );
              })}
            </nav>

            {/* End side: Cart Drawer, Direct WhatsApp Messaging & User Account */}
            <div className="flex items-center gap-1.5 sm:gap-3 shrink-0">
              {/* Cart Drawer Trigger Button with Glowing Gold Badge */}
              <button
                type="button"
                onClick={() => setIsCartOpen(true)}
                className="relative inline-flex items-center gap-1.5 sm:gap-2 px-3 sm:px-4 py-2 sm:py-2.5 rounded-xl border border-amber-400/30 bg-white/[0.04] hover:bg-amber-400/10 hover:border-amber-400/60 text-white font-bold text-xs sm:text-sm active:scale-95 transition-all shadow-[0_0_15px_rgba(212,175,55,0.15)] group cursor-pointer"
                title="سلة المشتريات"
                aria-label="فتح سلة المشتريات"
              >
                <div className="relative">
                  <ShoppingBag className="h-4 w-4 sm:h-5 sm:w-5 text-amber-400 group-hover:scale-110 transition-transform" />
                  {totalCount > 0 && (
                    <span className="absolute -top-2.5 -end-2.5 flex h-4 w-4 items-center justify-center rounded-full bg-gradient-to-r from-amber-400 to-amber-600 text-[10px] font-black text-black shadow-md animate-pulse">
                      {totalCount}
                    </span>
                  )}
                </div>
                <span className="hidden sm:inline text-white">السلة</span>
                {totalCount > 0 && (
                  <span className="hidden md:inline-block text-[11px] font-bold text-amber-300 bg-amber-400/20 px-1.5 py-0.5 rounded-md border border-amber-400/30">
                    ({totalCount})
                  </span>
                )}
              </button>

              {/* Direct WhatsApp Messaging Button */}
              <a
                href={whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="hidden sm:inline-flex items-center gap-1.5 rounded-xl bg-[#25D366] hover:bg-[#20ba59] active:bg-[#1da851] px-3 sm:px-4 py-2 sm:py-2.5 text-xs sm:text-sm font-bold text-white shadow-[0_0_15px_rgba(37,211,102,0.3)] transition-all hover:scale-105 active:scale-95 border border-white/20"
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
                      className="inline-flex items-center gap-1.5 rounded-xl bg-gradient-to-r from-amber-500 to-amber-700 px-3 py-2 text-xs font-black text-black hover:opacity-95 transition-opacity shadow-[0_0_15px_rgba(212,175,55,0.4)]"
                    >
                      <ShieldCheck className="h-4 w-4 text-black" />
                      <span className="hidden md:inline">لوحة الإدارة</span>
                    </Link>
                  )}

                  <Link
                    href="/account"
                    className="inline-flex items-center gap-2 rounded-xl border border-amber-400/25 bg-white/[0.04] px-2.5 sm:px-3 py-1.5 text-xs text-white hover:bg-white/[0.08] transition-colors"
                    title={user.email || ""}
                  >
                    <div className="h-7 w-7 rounded-full bg-gradient-to-tr from-amber-400 to-amber-600 text-black flex items-center justify-center font-black text-xs shrink-0 shadow-xs">
                      {(user.name || user.email || "U").charAt(0).toUpperCase()}
                    </div>
                    <span className="hidden md:inline font-bold text-white text-xs max-w-[120px] truncate">
                      {user.email}
                    </span>
                  </Link>

                  <form action="/api/auth/logout" method="POST" className="hidden sm:block">
                    <button
                      type="submit"
                      title="تسجيل الخروج"
                      className="p-2 text-slate-400 hover:text-red-400 hover:bg-red-950/30 rounded-xl transition-colors cursor-pointer"
                    >
                      <LogOut className="h-4 w-4" />
                    </button>
                  </form>
                </div>
              ) : (
                <Link
                  href="/login"
                  className="inline-flex items-center gap-1.5 rounded-xl border border-amber-400/30 bg-white/[0.04] px-3 py-2 text-xs font-bold text-white hover:bg-amber-400/10 hover:border-amber-400/60 hover:text-amber-300 transition-all"
                >
                  <User className="h-3.5 w-3.5 text-amber-400" />
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
