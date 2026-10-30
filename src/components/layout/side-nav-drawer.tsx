"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  X,
  Tractor,
  SprayCan,
  Waves,
  Cpu,
  Pipette,
  Wrench,
  Phone,
  MessageCircle,
  MapPin,
  ExternalLink,
  ShieldCheck,
  User,
  LogOut,
  ChevronLeft,
  Sparkles,
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
  { href: "/products", label: "كتالوج الآلات والمعدات", icon: Tractor },
  { href: "/about", label: "عن الشركة (مسيرة 20 عاماً)", icon: Sparkles },
  { href: "/services", label: "خدمات الصيانة والدعم الفني", icon: Wrench },
  { href: "/contact", label: "تواصل معنا وموقعنا", icon: MapPin },
];

const categoryIcons: Record<string, React.ElementType> = {
  "cat-1": SprayCan,
  "cat-2": Waves,
  "cat-3": Cpu,
  "cat-4": Pipette,
  "cat-5": Tractor,
  "cat-6": Wrench,
};

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

  // Close on Escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    if (isOpen) {
      window.addEventListener("keydown", handleKeyDown);
    }
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  if (!mounted || !isOpen) return null;

  const phone1 = env.business.phone || "01220792948";
  const phone2 = env.business.secondaryPhone || "01114587917";
  const rawWhatsApp = env.business.whatsapp || "01220792948";
  const cleanWhatsApp = rawWhatsApp.replace(/[^0-9]/g, "");
  const whatsappUrl = `https://wa.me/${cleanWhatsApp.startsWith("0") ? `2${cleanWhatsApp}` : cleanWhatsApp}?text=${encodeURIComponent(
    "السلام عليكم، أود الاستفسار عن الآلات والمعدات الزراعية لدى شركة لبيب كمال لبيب."
  )}`;
  const mapsUrl = env.business.googleMapsUrl || "https://maps.app.goo.gl/87VQjF6s9bEyF9yz7";

  return (
    <div className="fixed inset-0 z-50 flex animate-in fade-in duration-200">
      {/* Backdrop overlay */}
      <div
        className="fixed inset-0 bg-brand-green-950/70 backdrop-blur-sm transition-opacity duration-300"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Slide-out Drawer Panel (from right side in RTL) */}
      <aside
        className="relative w-full sm:w-[420px] max-w-[90vw] h-full bg-white shadow-2xl z-50 flex flex-col border-e border-brand-neutral-200 animate-in slide-in-from-right duration-300 text-start overflow-hidden"
        aria-label="القائمة الجانبية للتنقل"
      >
        {/* Drawer Header */}
        <div className="p-5 border-b border-brand-neutral-200 bg-brand-neutral-50/90 flex items-center justify-between shrink-0">
          <BrandLogo size="sm" />
          <button
            type="button"
            onClick={onClose}
            className="p-2 rounded-xl text-brand-neutral-600 hover:text-brand-neutral-900 hover:bg-brand-neutral-200 transition-colors"
            aria-label="إغلاق القائمة"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        {/* Scrollable Drawer Content */}
        <div className="flex-1 overflow-y-auto p-5 space-y-6">
          {/* Equipment Advisor Banner CTA */}
          <div className="p-4 rounded-2xl bg-gradient-to-br from-[#022c22] to-[#064e3b] text-white shadow-md relative overflow-hidden">
            <div className="relative z-10 space-y-2">
              <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-950/60 text-emerald-200 text-[11px] font-bold border border-emerald-500/30">
                <Sparkles className="h-3 w-3 text-brand-gold-400" />
                <span>مستشارك الزراعي التفاعلي</span>
              </span>
              <h4 className="text-base font-extrabold text-white">محتار تختار أنهي معدة لأرضك؟</h4>
              <p className="text-xs text-emerald-100/80 leading-relaxed">
                حدد نوع المحصول ومساحة الأرض واحصل على ترشيح فوري للمعدة المناسبة.
              </p>
              <Link
                href="/#advisor"
                onClick={onClose}
                className="mt-1 w-full py-2.5 px-3 rounded-xl bg-brand-gold-600 hover:bg-brand-gold-500 active:bg-brand-gold-700 text-white font-bold text-xs flex items-center justify-center gap-1.5 transition-all active:scale-95 shadow-sm cursor-pointer"
              >
                <span>ابدأ المساعد التفاعلي الآن</span>
                <ChevronLeft className="h-4 w-4" />
              </Link>
            </div>
          </div>

          {/* Main Navigation Links */}
          <div className="space-y-1.5">
            <h5 className="text-xs font-bold text-brand-neutral-400 uppercase tracking-wider px-2">
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
                        ? "bg-brand-green-50 text-brand-green-800 font-extrabold shadow-2xs"
                        : "text-brand-neutral-700 hover:bg-brand-neutral-100 hover:text-brand-neutral-900"
                    )}
                  >
                    <div className="flex items-center gap-3">
                      <div className={cn("p-1.5 rounded-lg", isActive ? "bg-brand-green-100 text-brand-green-800" : "bg-brand-neutral-100 text-brand-neutral-500")}>
                        <Icon className="h-4 w-4" />
                      </div>
                      <span>{item.label}</span>
                    </div>
                    <ChevronLeft className="h-4 w-4 text-brand-neutral-400" />
                  </Link>
                );
              })}
            </nav>
          </div>

          {/* Product Categories Section */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between px-2">
              <h5 className="text-xs font-bold text-brand-neutral-400 uppercase tracking-wider">
                أقسام المعدات والآلات
              </h5>
              <Link
                href="/products"
                className="text-xs font-bold text-brand-green-800 hover:underline active:scale-95 transition-all"
              >
                عرض الكتالوج كامل
              </Link>
            </div>
            <div className="grid grid-cols-1 gap-1">
              {CATEGORIES.map((cat) => {
                const Icon = categoryIcons[cat.id] || Tractor;
                return (
                  <Link
                    key={cat.id}
                    href={`/products?category=${cat.slug}`}
                    className="flex items-center justify-between p-2.5 rounded-xl hover:bg-brand-neutral-100 text-brand-neutral-800 active:scale-[0.98] transition-all text-xs font-semibold cursor-pointer"
                  >
                    <div className="flex items-center gap-2.5">
                      <div className="p-1 rounded-lg bg-brand-green-50 text-brand-green-800">
                        <Icon className="h-3.5 w-3.5" />
                      </div>
                      <span>{cat.name}</span>
                    </div>
                    <ChevronLeft className="h-3.5 w-3.5 text-brand-neutral-400" />
                  </Link>
                );
              })}
            </div>
          </div>

          {/* Quick Contact & Map Actions */}
          <div className="space-y-2 pt-2 border-t border-brand-neutral-200">
            <h5 className="text-xs font-bold text-brand-neutral-400 uppercase tracking-wider px-2">
              الاتصال السريع والتواجد
            </h5>

            <div className="grid grid-cols-2 gap-2">
              <a
                href={`tel:${phone1}`}
                className="flex items-center justify-center gap-1.5 p-2.5 rounded-xl bg-brand-neutral-100 hover:bg-brand-neutral-200 text-brand-neutral-900 text-xs font-bold active:scale-95 transition-all shadow-2xs"
                dir="ltr"
              >
                <Phone className="h-3.5 w-3.5 text-brand-green-700" />
                <span>{phone1}</span>
              </a>
              <a
                href={`tel:${phone2}`}
                className="flex items-center justify-center gap-1.5 p-2.5 rounded-xl bg-brand-neutral-100 hover:bg-brand-neutral-200 text-brand-neutral-900 text-xs font-bold active:scale-95 transition-all shadow-2xs"
                dir="ltr"
              >
                <Phone className="h-3.5 w-3.5 text-brand-green-700" />
                <span>{phone2}</span>
              </a>
            </div>

            <a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-2 w-full p-3 rounded-xl bg-[#25D366] hover:bg-[#20ba59] active:bg-[#1da851] text-white text-xs font-bold active:scale-95 transition-all shadow-2xs"
            >
              <MessageCircle className="h-4 w-4" />
              <span>محادثة واتساب فورية مباشرة</span>
            </a>

            <a
              href={mapsUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-between p-3 rounded-xl border border-brand-neutral-200 bg-white hover:bg-brand-neutral-50 text-brand-neutral-800 text-xs font-bold active:scale-95 transition-all shadow-2xs"
            >
              <div className="flex items-center gap-2">
                <MapPin className="h-4 w-4 text-brand-gold-600" />
                <div className="text-start">
                  <p className="font-bold text-brand-neutral-900">موقعنا على الخريطة</p>
                  <p className="text-[11px] text-brand-neutral-500">الشرقية، منيا القمح، طريق مصر الزراعي</p>
                </div>
              </div>
              <ExternalLink className="h-4 w-4 text-brand-neutral-400" />
            </a>
          </div>
        </div>

        {/* Drawer Footer: User Profile / Admin / Login */}
        <div className="p-4 border-t border-brand-neutral-200 bg-brand-neutral-50 shrink-0">
          {user ? (
            <div className="flex items-center justify-between gap-3">
              <div className="flex items-center gap-2.5 min-w-0">
                <div className="h-9 w-9 rounded-full bg-brand-green-700 text-white flex items-center justify-center font-bold text-xs shrink-0">
                  {(user.name || user.email || "U").charAt(0).toUpperCase()}
                </div>
                <div className="min-w-0">
                  <p className="text-xs font-bold text-brand-neutral-900 truncate">
                    {user.email}
                  </p>
                  <p className="text-[11px] text-brand-green-700 font-semibold">
                    {user.role === "ADMIN" ? "مدير النظام (Admin)" : "عميل مسجل"}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-1.5 shrink-0">
                {user.role === "ADMIN" && (
                  <Link
                    href="/admin"
                    className="p-2 rounded-xl bg-purple-900 hover:bg-purple-950 text-white transition-colors"
                    title="لوحة الإدارة"
                  >
                    <ShieldCheck className="h-4 w-4 text-brand-gold-400" />
                  </Link>
                )}
                <form action="/api/auth/logout" method="POST">
                  <button
                    type="submit"
                    className="p-2 rounded-xl text-brand-neutral-500 hover:text-red-600 hover:bg-red-50 transition-colors"
                    title="تسجيل الخروج"
                  >
                    <LogOut className="h-4 w-4" />
                  </button>
                </form>
              </div>
            </div>
          ) : (
            <Link
              href="/login"
              className="flex items-center justify-center gap-2 w-full p-2.5 rounded-xl border border-brand-neutral-300 bg-white hover:bg-brand-neutral-50 text-xs font-bold text-brand-neutral-800 transition-colors"
            >
              <User className="h-4 w-4 text-brand-neutral-600" />
              <span>تسجيل الدخول عبر Google</span>
            </Link>
          )}
        </div>
      </aside>
    </div>
  );
}
