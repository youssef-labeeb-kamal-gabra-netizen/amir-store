"use client";

import React from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Toast } from "@/components/ui/toast";
import { BrandLogo } from "@/components/common/brand-logo";
import { ShieldCheck } from "lucide-react";

export default function LoginPage() {
  const searchParams = useSearchParams();
  const errorParam = searchParams.get("error");
  const loggedOutParam = searchParams.get("logged_out");

  return (
    <div className="max-w-md mx-auto px-4 py-16 sm:py-24 text-center">
      {/* Brand & Title */}
      <div className="mb-8 flex flex-col items-center">
        <div className="mb-4">
          <BrandLogo size="lg" showText={false} />
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-brand-neutral-900 tracking-tight">
          تسجيل الدخول إلى LKL
        </h1>
        <p className="text-sm text-brand-neutral-600 mt-1.5 font-bold">
          شركة لبيب كمال لبيب للأدوات والآلات الزراعية
        </p>
      </div>

      {loggedOutParam && (
        <div className="mb-6">
          <Toast type="info" message="تم تسجيل الخروج بنجاح." />
        </div>
      )}

      {errorParam && (
        <div className="mb-6 space-y-2">
          <Toast
            type="error"
            message={`تعذر إتمام عملية تسجيل الدخول (${errorParam}). يرجى التأكد من حساب Google والمحاولة ثانية.`}
          />
        </div>
      )}

      {/* Main Single Official Google Login Card */}
      <div className="rounded-3xl border border-brand-neutral-200 bg-white p-8 sm:p-10 shadow-sm space-y-6 text-start">
        <a href="/api/auth/google" className="block">
          <Button
            variant="outline"
            size="lg"
            className="w-full justify-center gap-3 border-brand-neutral-300 hover:bg-brand-neutral-50 font-bold text-brand-neutral-900 h-13 text-base shadow-sm"
          >
            <svg className="h-6 w-6 shrink-0" viewBox="0 0 24 24">
              <path
                fill="#4285F4"
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
              />
              <path
                fill="#34A853"
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
              />
              <path
                fill="#FBBC05"
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
              />
              <path
                fill="#EA4335"
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
              />
            </svg>
            <span>تسجيل الدخول عبر Google</span>
          </Button>
        </a>

        <div className="pt-2 border-t border-brand-neutral-100 flex items-center justify-center gap-2 text-xs text-brand-neutral-500">
          <ShieldCheck className="h-4 w-4 text-brand-green-700" />
          <span>تسجيل دخول رسمي ومؤمن عبر خوادم Google الرسمية</span>
        </div>
      </div>

      <div className="mt-8">
        <Link href="/" className="text-xs font-semibold text-brand-neutral-500 hover:text-brand-green-800 transition-colors">
          ← العودة إلى الصفحة الرئيسية
        </Link>
      </div>
    </div>
  );
}
