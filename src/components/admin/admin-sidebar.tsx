"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import {
  LayoutDashboard,
  Tractor,
  Layers,
  Inbox,
  Image,
  Users,
  FileText,
  Settings,
  ShieldAlert,
  Star,
  Home,
  LogOut,
  X,
} from "lucide-react";

const adminNav = [
  { href: "/admin", label: "نظرة عامة والتقارير", icon: LayoutDashboard },
  { href: "/admin/products", label: "إدارة المنتجات والمعدات", icon: Tractor },
  { href: "/admin/categories", label: "الأقسام والكتالوج", icon: Layers },
  { href: "/admin/contact-requests", label: "طلبات الاستفسار والعملاء", icon: Inbox },
  { href: "/admin/reviews", label: "مراجعة تقييمات العملاء", icon: Star },
  { href: "/admin/media", label: "وسائط وصور المعدات", icon: Image },
  { href: "/admin/users", label: "المستخدمين والصلاحيات", icon: Users },
  { href: "/admin/content", label: "إدارة محتوى النصوص", icon: FileText },
  { href: "/admin/settings", label: "بيانات الشركة والإعدادات", icon: Settings },
  { href: "/admin/audit", label: "سجل العمليات (Audit)", icon: ShieldAlert },
];

interface AdminSidebarProps {
  isOpen?: boolean;
  onClose?: () => void;
}

export function AdminSidebar({ isOpen = false, onClose }: AdminSidebarProps) {
  const pathname = usePathname();

  const sidebarContent = (
    <div className="flex flex-col h-full bg-white text-start">
      {/* Brand Top */}
      <div className="p-5 sm:p-6 border-b border-brand-neutral-200 flex items-center justify-between">
        <Link href="/admin" onClick={onClose} className="flex items-center gap-2.5">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-brand-green-700 text-white shadow-sm shrink-0">
            <Tractor className="h-5 w-5 text-brand-gold-300" />
          </div>
          <div>
            <span className="text-base font-black text-brand-neutral-900 leading-none">
              إدارة LKL
            </span>
            <p className="text-[10px] text-brand-gold-700 font-bold mt-0.5">لوحة التحكم المركزية</p>
          </div>
        </Link>
        {onClose && (
          <button
            type="button"
            onClick={onClose}
            className="lg:hidden p-2 rounded-xl text-brand-neutral-400 hover:text-brand-neutral-700 hover:bg-brand-neutral-100 transition-colors"
            aria-label="إغلاق القائمة"
          >
            <X className="h-5 w-5" />
          </button>
        )}
      </div>

      {/* Nav List */}
      <nav className="p-3 sm:p-4 space-y-1 flex-1 overflow-y-auto" aria-label="قائمة لوحة التحكم">
        {adminNav.map((item) => {
          const isActive =
            pathname === item.href || (item.href !== "/admin" && pathname.startsWith(item.href));
          const Icon = item.icon;
          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={onClose}
              className={cn(
                "flex items-center gap-3 rounded-xl px-3.5 py-2.5 text-xs sm:text-sm font-semibold transition-colors active:scale-95",
                isActive
                  ? "bg-brand-green-50 text-brand-green-900 font-bold border border-brand-green-200 shadow-2xs"
                  : "text-brand-neutral-600 hover:bg-brand-neutral-100 hover:text-brand-neutral-900"
              )}
            >
              <Icon className={cn("h-4 w-4 shrink-0", isActive ? "text-brand-green-700" : "text-brand-neutral-400")} />
              <span>{item.label}</span>
            </Link>
          );
        })}
      </nav>

      {/* Bottom Actions */}
      <div className="p-4 border-t border-brand-neutral-200 space-y-2">
        <Link
          href="/"
          onClick={onClose}
          className="flex items-center gap-2 rounded-xl px-3 py-2.5 text-xs font-semibold text-brand-neutral-700 hover:bg-brand-neutral-100 transition-colors cursor-pointer"
        >
          <Home className="h-4 w-4 text-brand-green-700" />
          <span>العودة للموقع العام</span>
        </Link>

        <form action="/api/auth/logout" method="POST">
          <button
            type="submit"
            className="flex w-full items-center gap-2 rounded-xl px-3 py-2.5 text-xs font-semibold text-red-600 hover:bg-red-50 transition-colors cursor-pointer"
          >
            <LogOut className="h-4 w-4" />
            <span>تسجيل الخروج</span>
          </button>
        </form>
      </div>
    </div>
  );

  return (
    <>
      {/* 1. Desktop Permanent Sidebar */}
      <aside className="hidden lg:flex w-64 border-e border-brand-neutral-200 bg-white flex-col h-full text-start shrink-0">
        {sidebarContent}
      </aside>

      {/* 2. Mobile/Tablet Slide-over Drawer */}
      {isOpen && (
        <div className="lg:hidden fixed inset-0 z-50 flex animate-in fade-in duration-200">
          {/* Backdrop */}
          <div
            className="fixed inset-0 bg-black/60 backdrop-blur-xs transition-opacity duration-300"
            onClick={onClose}
            aria-hidden="true"
          />
          {/* Drawer Panel */}
          <aside
            className="relative w-72 max-w-[85vw] h-full bg-white shadow-2xl z-50 flex flex-col transition-transform duration-300 ease-in-out border-e border-brand-neutral-200 animate-in slide-in-from-right duration-200"
            aria-label="قائمة لوحة التحكم الجانبية"
          >
            {sidebarContent}
          </aside>
        </div>
      )}
    </>
  );
}
