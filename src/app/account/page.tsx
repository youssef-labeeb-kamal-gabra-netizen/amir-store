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
  title: "حسابي الخاص | شركة لبيب كمال للأدوات والآلات الزراعية",
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
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-8 text-start">
      {/* 1. Header & Quick Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-brand-neutral-200 pb-6">
        <div className="flex items-center gap-4">
          {session.image ? (
            <div className="relative h-16 w-16 rounded-full overflow-hidden border-2 border-brand-green-600 shadow-sm shrink-0">
              <Image
                src={session.image}
                alt={session.name}
                fill
                sizes="64px"
                className="object-cover"
              />
            </div>
          ) : (
            <div className="h-16 w-16 rounded-2xl bg-brand-green-700 text-white flex items-center justify-center font-black text-2xl shadow-sm shrink-0">
              {session.name.charAt(0) || "ع"}
            </div>
          )}

          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-brand-green-800 bg-brand-green-50 px-2.5 py-0.5 rounded-full border border-brand-green-200">
                منطقة العميل المؤمنة
              </span>
              <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                <Lock className="h-3 w-3" />
                مشفر
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-brand-neutral-900 tracking-tight mt-1">
              أهلاً بك، {session.name}
            </h1>
            <p className="text-xs sm:text-sm text-brand-neutral-500 font-mono mt-0.5">
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
                className="gap-2 bg-brand-neutral-900 hover:bg-black font-bold shadow-sm"
              >
                <ShieldCheck className="h-4 w-4 text-brand-gold-400" />
                لوحة تحكم المدير
              </Button>
            </Link>
          )}

          <form action="/api/auth/logout" method="POST">
            <Button
              type="submit"
              variant="outline"
              size="sm"
              className="gap-2 text-red-600 border-red-200 hover:bg-red-50 font-bold"
            >
              <LogOut className="h-4 w-4" />
              تسجيل الخروج
            </Button>
          </form>
        </div>
      </div>

      {/* 2. Security & Privacy Guarantee Banner */}
      <div className="rounded-2xl border border-brand-green-200 bg-gradient-to-r from-brand-green-50/80 via-emerald-50/50 to-white p-5 sm:p-6 shadow-sm">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-start gap-3.5">
            <div className="p-2.5 rounded-xl bg-brand-green-600 text-white shadow-sm shrink-0 mt-0.5 sm:mt-0">
              <ShieldCheck className="h-6 w-6" />
            </div>
            <div className="space-y-1">
              <h2 className="text-base font-bold text-brand-green-950 flex items-center gap-2">
                خزنة البيانات الشخصية وحماية الخصوصية (Data Isolation)
              </h2>
              <p className="text-xs sm:text-sm text-brand-green-800 leading-relaxed max-w-2xl">
                كل استفسار أو طلب تسجله في الموقع يرتبط بحسابك فقط، ومحمي بتشفير صارم من جهة الخادم
                (HMAC-SHA256). لا يمكن لأي عميل أو زائر آخر الاطلاع على طلباتك أو بيانات تواصلك.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-white border border-brand-green-200 text-xs font-semibold text-brand-neutral-700 shadow-2xs shrink-0 self-start sm:self-center">
            <Database className="h-4 w-4 text-brand-green-700" />
            <span>نظام التخزين:</span>
            <span className="font-bold text-brand-green-800">{dbInfo.provider}</span>
          </div>
        </div>
      </div>

      {/* 3. Customer Identity Details Card */}
      <div className="rounded-2xl border border-brand-neutral-200 bg-white p-6 shadow-sm space-y-4">
        <div className="flex items-center justify-between border-b border-brand-neutral-100 pb-3">
          <div className="flex items-center gap-2 text-sm font-bold text-brand-neutral-900">
            <UserCheck className="h-4 w-4 text-brand-green-700" />
            <span>بيانات المصادقة الرسمية</span>
          </div>
          <span className="text-xs font-mono text-brand-neutral-400">
            معرف الحساب: {session.id.slice(0, 16)}...
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-sm">
          <div className="bg-brand-neutral-50 p-3.5 rounded-xl border border-brand-neutral-100">
            <span className="text-xs text-brand-neutral-500 font-semibold block mb-1">الاسم بالكامل</span>
            <span className="text-base font-bold text-brand-neutral-900">{session.name}</span>
          </div>

          <div className="bg-brand-neutral-50 p-3.5 rounded-xl border border-brand-neutral-100">
            <span className="text-xs text-brand-neutral-500 font-semibold block mb-1">البريد الإلكتروني الموثق</span>
            <span className="text-sm font-bold text-brand-neutral-900 font-mono break-all">{session.email}</span>
          </div>

          <div className="bg-brand-neutral-50 p-3.5 rounded-xl border border-brand-neutral-100">
            <span className="text-xs text-brand-neutral-500 font-semibold block mb-1">نوع العضوية</span>
            <span
              className={`inline-flex items-center gap-1.5 rounded-full px-3 py-0.5 text-xs font-bold ${
                session.role === "ADMIN"
                  ? "bg-purple-100 text-purple-800 border border-purple-200"
                  : "bg-brand-green-100 text-brand-green-800 border border-brand-green-200"
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
      <div className="rounded-2xl border border-brand-neutral-200 bg-brand-neutral-50 p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="space-y-1">
          <h3 className="text-base font-bold text-brand-neutral-900 flex items-center gap-2">
            <PhoneCall className="h-4 w-4 text-brand-green-700" />
            هل تريد استشارة سريعة بخصوص الآلات أو قطع الغيار؟
          </h3>
          <p className="text-xs sm:text-sm text-brand-neutral-600">
            فريق المهندسين والفنيين في شركة لبيب كمال جاهز لمساعدتك في اختيار أنسب ماكينة لأرضك.
          </p>
        </div>
        <div className="flex items-center gap-3 shrink-0">
          <Link href="/products">
            <Button variant="outline" size="sm" className="bg-white font-bold text-xs gap-1.5">
              <FileText className="h-4 w-4" />
              تصفح الكتالوج
            </Button>
          </Link>
          <a
            href="https://wa.me/201006540307?text=%D9%85%D8%B1%D8%AD%D8%A8%D8%A7%D9%8B%D8%8C%20%D8%A3%D9%86%D8%A7%20%D9%85%D8%B3%D8%AC%D9%84%20%D9%81%D9%8A%20%D8%A7%D9%84%D9%85%D9%88%D9%82%D8%B9%20%D9%88%D8%A3%D8%B1%D9%8A%D8%AF%20%D8%A7%D8%B3%D8%AA%D8%B4%D8%A7%D8%B1%D8%A9%20%D9%81%D9%86%D9%8A%D8%A9."
            target="_blank"
            rel="noopener noreferrer"
          >
            <Button variant="primary" size="sm" className="bg-emerald-600 hover:bg-emerald-700 font-bold text-xs gap-1.5">
              تواصل واتساب مباشر
              <ArrowLeft className="h-4 w-4" />
            </Button>
          </a>
        </div>
      </div>
    </div>
  );
}
