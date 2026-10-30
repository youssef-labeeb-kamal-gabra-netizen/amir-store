import React from "react";
import { redirect } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { getSession } from "@/lib/auth";
import { getUserContactRequests } from "@/lib/contact-requests";
import { getDatabaseInfo } from "@/lib/db";
import { constructMetadata } from "@/lib/seo";
import { Button } from "@/components/ui/button";
import { CustomerInquiriesClient } from "@/components/account/customer-inquiries-client";
import {
  ShieldCheck,
  LogOut,
  ArrowLeft,
  Lock,
  Database,
  UserCheck,
  FileText,
  PhoneCall,
} from "lucide-react";

export const metadata = constructMetadata({
  title: "حسابي الخاص | متجر أمير ستور للعطور والعود",
  description: "المساحة الخاصة للعميل لمتابعة الاستفسارات والطلبات وحماية البيانات الشخصية.",
  noIndex: true,
});

export default async function AccountPage() {
  const session = await getSession();

  if (!session) {
    redirect("/login");
  }

  // Strict server-side isolation: query only inquiries belonging to this customer
  const userRequests = getUserContactRequests(session.email, session.id);
  const dbInfo = getDatabaseInfo();

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-8 text-start text-white">
      {/* 1. Header & Quick Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/10 pb-6">
        <div className="flex items-center gap-4">
          {session.image ? (
            <div className="relative h-16 w-16 rounded-full overflow-hidden border-2 border-amber-400 shadow-[0_0_15px_rgba(212,175,55,0.3)] shrink-0">
              <Image
                src={session.image}
                alt={session.name}
                fill
                sizes="64px"
                className="object-cover"
              />
            </div>
          ) : (
            <div className="h-16 w-16 rounded-2xl bg-amber-400/10 border border-amber-400/30 text-amber-300 flex items-center justify-center font-black text-2xl shadow-sm shrink-0">
              {session.name.charAt(0) || "ع"}
            </div>
          )}

          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-amber-300 bg-amber-400/10 px-3 py-0.5 rounded-full border border-amber-400/30">
                منطقة العميل المؤمنة
              </span>
              <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-400 bg-emerald-950/40 px-2 py-0.5 rounded-full border border-emerald-500/30">
                <Lock className="h-3 w-3" />
                مشفر
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-white font-arabic tracking-tight mt-1">
              أهلاً بك، {session.name}
            </h1>
            <p className="text-xs sm:text-sm text-slate-400 font-mono mt-0.5">
              {session.email}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2.5 flex-wrap sm:flex-nowrap">
          {session.role === "ADMIN" && (
            <Link href="/admin">
              <Button
                variant="primary"
                size="sm"
                className="gap-2 font-bold shadow-md"
              >
                <ShieldCheck className="h-4 w-4" />
                لوحة تحكم المدير
              </Button>
            </Link>
          )}

          <form action="/api/auth/logout" method="POST">
            <Button
              type="submit"
              variant="outline"
              size="sm"
              className="gap-2 text-red-400 border-red-500/40 hover:bg-red-500/20 font-bold"
            >
              <LogOut className="h-4 w-4" />
              تسجيل الخروج
            </Button>
          </form>
        </div>
      </div>

      {/* 2. Security & Privacy Guarantee Banner */}
      <div className="rounded-3xl border border-amber-400/20 bg-white/[0.03] backdrop-blur-2xl p-6 sm:p-7 shadow-[0_8px_32px_0_rgba(0,0,0,0.5)]">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-start gap-3.5">
            <div className="p-3 rounded-2xl bg-amber-400/10 border border-amber-400/30 text-amber-300 shadow-sm shrink-0 mt-0.5 sm:mt-0">
              <ShieldCheck className="h-6 w-6" />
            </div>
            <div className="space-y-1">
              <h2 className="text-base font-bold text-white font-arabic flex items-center gap-2">
                خزنة البيانات الشخصية وحماية الخصوصية (Data Isolation)
              </h2>
              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed max-w-2xl">
                كل استفسار أو طلب تسجله في الموقع يرتبط بحسابك فقط، ومحمي بتشفير صارم من جهة الخادم
                (HMAC-SHA256). لا يمكن لأي عميل أو زائر آخر الاطلاع على طلباتك أو بيانات تواصلك.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-[#0D0F14] border border-amber-400/20 text-xs font-semibold text-slate-300 shrink-0 self-start sm:self-center">
            <Database className="h-4 w-4 text-amber-400" />
            <span>نظام التخزين:</span>
            <span className="font-bold text-amber-300">{dbInfo.provider}</span>
          </div>
        </div>
      </div>

      {/* 3. Customer Identity Details Card */}
      <div className="rounded-3xl border border-amber-400/20 bg-white/[0.03] backdrop-blur-2xl p-6 sm:p-7 shadow-[0_8px_32px_0_rgba(0,0,0,0.5)] space-y-5">
        <div className="flex items-center justify-between border-b border-white/10 pb-3">
          <div className="flex items-center gap-2 text-sm font-bold text-white font-arabic">
            <UserCheck className="h-4 w-4 text-amber-400" />
            <span>بيانات المصادقة الرسمية</span>
          </div>
          <span className="text-xs font-mono text-slate-400">
            معرف الحساب: {session.id.slice(0, 16)}...
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-sm">
          <div className="bg-[#0D0F14] p-4 rounded-2xl border border-amber-400/10">
            <span className="text-xs text-slate-400 font-semibold block mb-1">الاسم بالكامل</span>
            <span className="text-base font-bold text-white">{session.name}</span>
          </div>

          <div className="bg-[#0D0F14] p-4 rounded-2xl border border-amber-400/10">
            <span className="text-xs text-slate-400 font-semibold block mb-1">البريد الإلكتروني الموثق</span>
            <span className="text-sm font-bold text-white font-mono break-all">{session.email}</span>
          </div>

          <div className="bg-[#0D0F14] p-4 rounded-2xl border border-amber-400/10">
            <span className="text-xs text-slate-400 font-semibold block mb-1">نوع العضوية</span>
            <span
              className={`inline-flex items-center gap-1.5 rounded-full px-3 py-0.5 text-xs font-bold ${
                session.role === "ADMIN"
                  ? "bg-purple-950/60 text-purple-300 border border-purple-500/40"
                  : "bg-amber-400/10 text-amber-300 border border-amber-400/30"
              }`}
            >
              {session.role === "ADMIN" ? "مدير النظام (ADMIN)" : "عميل مسجل (USER)"}
            </span>
          </div>
        </div>
      </div>

      {/* 4. Customer Inquiries & Requests Section (Client Component) */}
      <CustomerInquiriesClient
        initialRequests={userRequests}
        userEmail={session.email}
        userName={session.name}
      />

      {/* 5. Customer Quick Assistance Banner */}
      <div className="rounded-3xl border border-amber-400/20 bg-[#0D0F14] p-6 sm:p-7 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="space-y-1">
          <h3 className="text-base font-bold text-white font-arabic flex items-center gap-2">
            <PhoneCall className="h-4 w-4 text-amber-400" />
            هل تريد استشارة سريعة بخصوص العطور أو الهدايا الخاصة؟
          </h3>
          <p className="text-xs sm:text-sm text-slate-400">
            فريق خبراء العطور في أمير ستور جاهز لمساعدتك في اختيار أنسب تركيبة عطرية تناسب ذوقك ومناسباتك.
          </p>
        </div>
        <div className="flex items-center gap-3 shrink-0">
          <Link href="/products">
            <Button variant="outline" size="sm" className="font-bold text-xs gap-1.5">
              <FileText className="h-4 w-4" />
              تصفح الكتالوج
            </Button>
          </Link>
          <a
            href={`https://wa.me/201220086002?text=${encodeURIComponent("مرحباً، أود استشارة خبير العطور لدى متجر أمير ستور.")}`}
            target="_blank"
            rel="noopener noreferrer"
          >
            <Button variant="primary" size="sm" className="font-bold text-xs gap-1.5">
              تواصل واتساب مباشر
              <ArrowLeft className="h-4 w-4" />
            </Button>
          </a>
        </div>
      </div>
    </div>
  );
}
