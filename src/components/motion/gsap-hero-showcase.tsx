"use client";

import React, { useRef } from "react";
import Image from "next/image";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { Award, ShieldCheck } from "lucide-react";

export function GsapHeroShowcase() {
  const containerRef = useRef<HTMLDivElement>(null);
  const logoRef = useRef<HTMLDivElement>(null);
  const auraRef = useRef<HTMLDivElement>(null);
  const badge1Ref = useRef<HTMLDivElement>(null);
  const badge2Ref = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      // 1. Initial Reveal Timeline
      const tl = gsap.timeline({ defaults: { ease: "power3.out" } });

      tl.fromTo(
        auraRef.current,
        { scale: 0.6, opacity: 0 },
        { scale: 1, opacity: 0.45, duration: 1.4 }
      )
        .fromTo(
          logoRef.current,
          { scale: 0.75, opacity: 0, y: 30 },
          { scale: 1, opacity: 1, y: 0, duration: 1.2 },
          "-=0.9"
        )
        .fromTo(
          [badge1Ref.current, badge2Ref.current],
          { scale: 0.8, opacity: 0, y: 15 },
          { scale: 1, opacity: 1, y: 0, duration: 0.8, stagger: 0.2 },
          "-=0.6"
        );

      // 2. Continuous Subtle Floating Animation
      gsap.to(logoRef.current, {
        y: -10,
        rotation: 0.8,
        duration: 3.8,
        repeat: -1,
        yoyo: true,
        ease: "sine.inOut",
      });

      // 3. Aura Breathing Glow
      gsap.to(auraRef.current, {
        scale: 1.18,
        opacity: 0.65,
        duration: 4.2,
        repeat: -1,
        yoyo: true,
        ease: "power1.inOut",
      });
    },
    { scope: containerRef }
  );

  return (
    <div
      ref={containerRef}
      className="relative rounded-3xl bg-gradient-to-b from-white/[0.12] to-white/[0.03] border border-amber-300/20 p-6 sm:p-8 backdrop-blur-2xl shadow-2xl text-center space-y-6 overflow-hidden"
    >
      {/* Golden Aura Glow */}
      <div
        ref={auraRef}
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-72 h-72 rounded-full bg-gradient-to-tr from-amber-400/30 via-yellow-300/20 to-emerald-500/20 blur-3xl pointer-events-none"
      />

      {/* Main Official Emblem Container */}
      <div className="relative py-4 flex flex-col items-center justify-center">
        <div
          ref={logoRef}
          className="relative h-56 w-56 sm:h-64 sm:w-64 rounded-full p-2 bg-gradient-to-b from-amber-200/40 via-amber-400/20 to-transparent shadow-[0_10px_40px_rgba(212,175,55,0.25)] border border-amber-300/40"
        >
          <div className="relative h-full w-full rounded-full overflow-hidden bg-[#0d150b]/80 flex items-center justify-center">
            <Image
              src="/images/logo.png"
              alt="شعار أمير ستور الرسمي - دار العطور والعود الفاخر"
              fill
              className="object-cover scale-105"
              priority
            />
          </div>
        </div>

        {/* Brand Caption */}
        <div className="mt-4 space-y-1">
          <span className="text-[11px] font-bold tracking-[0.25em] text-amber-300 uppercase font-serif">
            Haute Parfumerie & Pure Oud
          </span>
          <h3 className="text-xl sm:text-2xl font-black text-white tracking-wide">
            أمير ستور • الفخامة الملكية
          </h3>
          <p className="text-xs text-amber-100/70">
            مستخلصات عطرية طبيعية معتمدة مع ضمان ثبات 72 ساعة
          </p>
        </div>
      </div>

      {/* Floating Trust Badges */}
      <div className="grid grid-cols-2 gap-3 pt-2">
        <div
          ref={badge1Ref}
          className="flex items-center gap-2.5 p-3 rounded-2xl bg-white/5 border border-white/10 text-start backdrop-blur-md"
        >
          <div className="p-2 rounded-xl bg-amber-400/10 text-amber-300 shrink-0">
            <Award className="h-4 w-4" />
          </div>
          <div>
            <h5 className="text-xs font-bold text-white">زيوت نقية 100%</h5>
            <p className="text-[10px] text-amber-200/60">بدون إضافات كيميائية</p>
          </div>
        </div>

        <div
          ref={badge2Ref}
          className="flex items-center gap-2.5 p-3 rounded-2xl bg-white/5 border border-white/10 text-start backdrop-blur-md"
        >
          <div className="p-2 rounded-xl bg-emerald-400/10 text-emerald-300 shrink-0">
            <ShieldCheck className="h-4 w-4" />
          </div>
          <div>
            <h5 className="text-xs font-bold text-white">معاينة قبل الدفع</h5>
            <p className="text-[10px] text-emerald-200/60">تأكد بنفسك عند الاستلام</p>
          </div>
        </div>
      </div>
    </div>
  );
}
