"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  X,
  Sparkles,
  Heart,
  Award,
  Phone,
  MapPin,
  ShieldCheck,
  User,
  LogOut,
  ChevronLeft,
  Compass,
} from "lucide-react";
import { BrandLogo } from "@/components/common/brand-logo";
import { env } from "@/lib/env";
import { CATEGORIES } from "@/data/catalog";
import { cn } from "@/lib/utils";

interface SideNavDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  user?: {
    name?: string | null;
    email?: string | null;
    role?: "USER" | "ADMIN";
  } | null;
}

const mainNav = [
  { href: "/", label: "الرئيسية", icon: Compass },
  { href: "/products", label: "مجموعة العطور الفاخرة", icon: Sparkles },
  { href: "/about", label: "عن أمير ستور والتميز", icon: Award },
  { href: "/services", label: "خدمات الإهداء والتغليف الملكي", icon: Heart },
  { href: "/contact", label: "تواصل معنا وخدمة العملاء", icon: Phone },
];

export function SideNavDrawer({ isOpen, onClose, user }: SideNavDrawerProps) {
  const pathname = usePathname();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Close drawer on path change
  useEffect(() => {
    onClose();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname]);

  // Lock body scroll when drawer is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  // Handle escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [onClose]);

  if (!mounted || !isOpen) return null;

  const phone1 = env.business.phone || "01220086002";
  const rawWhatsApp = env.business.whatsapp || "01220086002";
  const cleanWhatsApp = rawWhatsApp.replace(/[^0-9]/g, "");
  const whatsappUrl = `https://wa.me/${cleanWhatsApp.startsWith("0") ? `2${cleanWhatsApp}` : cleanWhatsApp}?text=${encodeURIComponent(
    "السلام عليكم، أود الاستفسار عن تشكيلة العطور والعود الفاخر لدى متجر أمير ستور."
  )}`;

  return (
    <div className="fixed inset-0 z-50 flex animate-in fade-in duration-200">
      {/* Backdrop overlay */}
      <div
        className="fixed inset-0 bg-black/80 backdrop-blur-md transition-opacity duration-300"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Slide-out Drawer Panel (from right side in RTL) */}
      <aside
        className="relative w-full sm:w-[420px] max-w-[90vw] h-full bg-[#0D0F14] text-white shadow-2xl z-50 flex flex-col border-e border-amber-400/25 animate-in slide-in-from-right duration-300 text-start overflow-hidden"
        aria-label="القائمة الجانبية للتنقل"
      >
        {/* Drawer Header */}
        <div className="p-5 border-b border-amber-400/20 bg-[#08090C] flex items-center justify-between shrink-0">
          <BrandLogo size="sm" />
          <button
            type="button"
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
            aria-label="إغلاق القائمة"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        {/* Scrollable Drawer Content */}
        <div className="flex-1 overflow-y-auto p-5 space-y-6">
          {/* Fragrance Advisor Banner CTA */}
          <div className="p-4 rounded-2xl bg-gradient-to-br from-[#13161F] to-[#08090C] border border-amber-400/30 text-white shadow-lg relative overflow-hidden">
            <div className="relative z-10 space-y-2">
              <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-amber-400/20 text-amber-300 text-[11px] font-bold border border-amber-400/30">
                <Sparkles className="h-3 w-3 text-amber-400" />
                <span>مستشارك العطري الخاص</span>
              </span>
              <h4 className="text-base font-extrabold text-white">محتار تختار العطر المناسب لذوقك؟</h4>
              <p className="text-xs text-slate-300 leading-relaxed">
                تواصل مع خبرائنا لاختيار النوتة العطرية المناسبة لشخصيتك أو كهدية فاخرة تدوم طويلاً.
              </p>
              <a
                href={whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                onClick={onClose}
                className="mt-1 w-full py-2.5 px-3 rounded-xl bg-gradient-to-r from-amber-400 to-amber-600 hover:brightness-110 active:scale-95 text-black font-black text-xs flex items-center justify-center gap-1.5 transition-all shadow-md cursor-pointer"
              >
                <span>استشر خبير العطور عبر واتساب</span>
                <ChevronLeft className="h-4 w-4" />
              </a>
            </div>
          </div>

          {/* Main Navigation Links */}
          <div className="space-y-1.5">
            <h5 className="text-xs font-bold text-amber-400 uppercase tracking-wider px-2 font-serif">
              الصفحات الرئيسية
            </h5>
            <nav className="space-y-1">
              {mainNav.map((item) => {
                const Icon = item.icon;
                const isActive = pathname === item.href || (item.href !== "/" && pathname.startsWith(item.href));
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={cn(
                      "flex items-center justify-between p-3 rounded-xl text-sm font-bold transition-all active:scale-[0.98]",
                      isActive
                        ? "bg-amber-400/15 text-amber-300 border border-amber-400/30 font-extrabold shadow-sm"
                        : "text-slate-300 hover:bg-white/[0.05] hover:text-white"
                    )}
                  >
                    <div className="flex items-center gap-3">
                      <Icon className={cn("h-4 w-4", isActive ? "text-amber-400" : "text-slate-400")} />
                      <span>{item.label}</span>
                    </div>
                    <ChevronLeft className="h-4 w-4 text-slate-500" />
                  </Link>
                );
              })}
            </nav>
          </div>

          {/* Perfume Categories */}
          <div className="space-y-2">
            <div className="flex items-center justify-between px-2">
              <h5 className="text-xs font-bold text-amber-400 uppercase tracking-wider font-serif">
                أقسام العطور الملكية
              </h5>
              <Link href="/products" className="text-[11px] text-amber-300 hover:underline">
                الكل
              </Link>
            </div>
            <div className="grid grid-cols-1 gap-1">
              {CATEGORIES.map((cat) => {
                const icon =
                  cat.slug === "pure-oud-oils" ? "🪵" :
                  cat.slug === "oriental-perfumes" ? "👑" :
                  cat.slug === "french-perfumes" ? "🌹" :
                  cat.slug === "musk-and-amber" ? "🌸" :
                  cat.slug === "bakhoor-and-incense" ? "💨" : "🎁";

                return (
                  <Link
                    key={cat.id}
                    href={`/products?category=${cat.slug}`}
                    className="flex items-center justify-between p-2.5 rounded-xl hover:bg-white/[0.04] transition-colors group"
                  >
                    <div className="flex items-center gap-2.5">
                      <span className="text-base group-hover:scale-110 transition-transform">{icon}</span>
                      <span className="text-xs font-bold text-slate-300 group-hover:text-white">
                        {cat.name}
                      </span>
                    </div>
                    <ChevronLeft className="h-3.5 w-3.5 text-slate-600 group-hover:text-amber-400 transition-colors" />
                  </Link>
                );
              })}
            </div>
          </div>

          {/* User Account Section */}
          <div className="pt-4 border-t border-amber-400/20 space-y-2">
            <h5 className="text-xs font-bold text-amber-400 uppercase tracking-wider px-2 font-serif">
              الحساب والأمان
            </h5>
            {user ? (
              <div className="p-3 rounded-2xl bg-white/[0.04] border border-amber-400/20 space-y-3">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-full bg-gradient-to-tr from-amber-400 to-amber-600 text-black flex items-center justify-center font-black text-sm shrink-0">
                    {(user.name || user.email || "U").charAt(0).toUpperCase()}
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-xs font-bold text-white truncate">{user.name || "العميل الكريم"}</p>
                    <p className="text-[11px] text-slate-400 truncate">{user.email}</p>
                  </div>
                </div>

                <div className="flex items-center gap-2 pt-2 border-t border-white/10 text-xs">
                  {user.role === "ADMIN" && (
                    <Link
                      href="/admin"
                      className="flex-1 py-2 px-3 rounded-xl bg-gradient-to-r from-amber-500 to-amber-700 text-black font-black text-center shadow-xs"
                    >
                      لوحة الإدارة
                    </Link>
                  )}
                  <Link
                    href="/account"
                    className="flex-1 py-2 px-3 rounded-xl border border-amber-400/30 text-center font-bold text-white hover:bg-white/10"
                  >
                    سجل الطلبات
                  </Link>
                  <form action="/api/auth/logout" method="POST">
                    <button
                      type="submit"
                      title="تسجيل الخروج"
                      className="p-2 rounded-xl text-slate-400 hover:text-red-400 hover:bg-red-950/40"
                    >
                      <LogOut className="h-4 w-4" />
                    </button>
                  </form>
                </div>
              </div>
            ) : (
              <Link
                href="/login"
                className="flex items-center justify-center gap-2 w-full py-3 px-4 rounded-xl border border-amber-400/30 bg-white/[0.04] hover:bg-amber-400/10 text-amber-300 font-bold text-xs transition-colors"
              >
                <User className="h-4 w-4" />
                <span>تسجيل الدخول / إنشاء حساب</span>
              </Link>
            )}
          </div>

          {/* Quick Contact Info */}
          <div className="p-4 rounded-2xl bg-white/[0.02] border border-amber-400/15 space-y-2.5 text-xs text-slate-300">
            <div className="flex items-center gap-2 text-amber-300 font-bold">
              <ShieldCheck className="h-4 w-4 text-amber-400" />
              <span>معاينة قبل الدفع • ضمان ثبات 72 ساعة</span>
            </div>
            <div className="flex items-center gap-2">
              <Phone className="h-4 w-4 text-amber-400" />
              <span dir="ltr" className="font-mono">{phone1}</span>
            </div>
            <div className="flex items-center gap-2">
              <MapPin className="h-4 w-4 text-amber-400" />
              <span>شحن وتوصيل فوري لكافة محافظات مصر</span>
            </div>
          </div>
        </div>

        {/* Drawer Footer */}
        <div className="p-4 border-t border-amber-400/20 bg-[#08090C] text-center text-[11px] text-slate-500 shrink-0">
          متجر أمير ستور • دار العطور والعود الفاخر © {new Date().getFullYear()}
        </div>
      </aside>
    </div>
  );
}
