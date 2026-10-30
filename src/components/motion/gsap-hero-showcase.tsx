"use client";

import React, { useRef } from "react";
import Image from "next/image";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { Award, ShieldCheck, Sparkles, Clock } from "lucide-react";

export function GsapHeroShowcase() {
  const containerRef = useRef<HTMLDivElement>(null);
  const flaconWrapperRef = useRef<HTMLDivElement>(null);
  const flaconRef = useRef<HTMLDivElement>(null);
  const auraRef = useRef<HTMLDivElement>(null);
  const auraSecondaryRef = useRef<HTMLDivElement>(null);
  const badge1Ref = useRef<HTMLDivElement>(null);
  const badge2Ref = useRef<HTMLDivElement>(null);
  const badge3Ref = useRef<HTMLDivElement>(null);
  const particlesRef = useRef<HTMLDivElement>(null);

  // GSAP Animations
  useGSAP(
    () => {
      // 1. Initial Cinematic Reveal
      const tl = gsap.timeline({ defaults: { ease: "power3.out" } });

      tl.fromTo(
        [auraRef.current, auraSecondaryRef.current],
        { scale: 0.5, opacity: 0 },
        { scale: 1, opacity: 0.5, duration: 1.6, stagger: 0.2 }
      )
        .fromTo(
          flaconRef.current,
          { scale: 0.8, opacity: 0, y: 40, filter: "blur(8px)" },
          { scale: 1, opacity: 1, y: 0, filter: "blur(0px)", duration: 1.4 },
          "-=1.1"
        )
        .fromTo(
          [badge1Ref.current, badge2Ref.current, badge3Ref.current],
          { scale: 0.7, opacity: 0, y: 20 },
          { scale: 1, opacity: 1, y: 0, duration: 0.8, stagger: 0.15 },
          "-=0.7"
        );

      // 2. Continuous Organic 3D Floating
      gsap.to(flaconRef.current, {
        y: -14,
        rotationZ: 0.8,
        duration: 4,
        repeat: -1,
        yoyo: true,
        ease: "sine.inOut",
      });

      // 3. Breathing Gold Aura
      gsap.to(auraRef.current, {
        scale: 1.25,
        opacity: 0.7,
        duration: 3.5,
        repeat: -1,
        yoyo: true,
        ease: "sine.inOut",
      });

      gsap.to(auraSecondaryRef.current, {
        scale: 1.4,
        opacity: 0.4,
        duration: 5,
        repeat: -1,
        yoyo: true,
        ease: "sine.inOut",
        delay: 0.5,
      });

      // 4. Twinkling Golden Particle Lights
      if (particlesRef.current) {
        const particles = particlesRef.current.children;
        gsap.to(particles, {
          opacity: 0.9,
          scale: 1.3,
          duration: 2.2,
          stagger: {
            each: 0.3,
            repeat: -1,
            yoyo: true,
          },
          ease: "power1.inOut",
        });
      }
    },
    { scope: containerRef }
  );

  // Interactive 3D Flacon Mouse Tilt
  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!flaconWrapperRef.current) return;
    const rect = flaconWrapperRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left - rect.width / 2;
    const y = e.clientY - rect.top - rect.height / 2;

    const rotX = -(y / (rect.height / 2)) * 14;
    const rotY = (x / (rect.width / 2)) * 14;

    gsap.to(flaconRef.current, {
      rotateX: rotX,
      rotateY: rotY,
      duration: 0.4,
      ease: "power2.out",
      transformPerspective: 900,
    });
  };

  const handleMouseLeave = () => {
    gsap.to(flaconRef.current, {
      rotateX: 0,
      rotateY: 0,
      duration: 0.8,
      ease: "power2.out",
    });
  };

  return (
    <div
      ref={containerRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className="relative rounded-3xl bg-white/[0.03] border border-amber-400/20 p-6 sm:p-8 backdrop-blur-2xl shadow-[0_8px_32px_0_rgba(0,0,0,0.5)] text-center space-y-6 overflow-hidden select-none"
    >
      {/* 1. Deep Breathing Radial Gold Aura */}
      <div
        ref={auraRef}
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-80 h-80 rounded-full bg-gradient-to-tr from-amber-500/35 via-yellow-400/25 to-amber-600/15 blur-3xl pointer-events-none"
      />
      <div
        ref={auraSecondaryRef}
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 rounded-full bg-amber-400/10 blur-3xl pointer-events-none"
      />

      {/* 2. Shimmering Golden Particle Light Effects */}
      <div ref={particlesRef} className="absolute inset-0 pointer-events-none overflow-hidden">
        <span className="absolute top-12 start-8 text-amber-300 opacity-40">✦</span>
        <span className="absolute top-20 end-12 text-yellow-200 opacity-30 text-xs">✨</span>
        <span className="absolute bottom-24 start-14 text-amber-400 opacity-50 text-sm">✦</span>
        <span className="absolute bottom-16 end-16 text-yellow-300 opacity-40">✨</span>
        <span className="absolute top-1/3 end-6 text-amber-200 opacity-30 text-xs">✦</span>
        <span className="absolute bottom-1/3 start-6 text-amber-400 opacity-40 text-xs">✨</span>
      </div>

      {/* 3. Interactive 3D Flacon Showcase */}
      <div ref={flaconWrapperRef} className="relative py-3 flex flex-col items-center justify-center">
        {/* Crown & Royal Monogram Header */}
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-400/10 border border-amber-400/30 text-amber-300 text-xs font-bold mb-3 shadow-[0_0_15px_rgba(212,175,55,0.2)]">
          <Sparkles className="h-3.5 w-3.5 text-amber-400 animate-pulse" />
          <span className="font-serif tracking-widest text-[11px] uppercase">Haute Parfumerie Royale</span>
        </div>

        {/* 3D Floating Flacon Medallion */}
        <div
          ref={flaconRef}
          style={{ transformStyle: "preserve-3d" }}
          className="relative h-60 w-60 sm:h-72 sm:w-72 rounded-3xl p-3 bg-gradient-to-b from-amber-300/30 via-amber-500/15 to-transparent shadow-[0_15px_50px_rgba(212,175,55,0.35)] border border-amber-400/40 cursor-grab active:cursor-grabbing"
        >
          {/* Inner Pedestal & Flacon Image */}
          <div className="relative h-full w-full rounded-2xl overflow-hidden bg-gradient-to-b from-[#13161F]/90 via-[#0D0F14]/95 to-[#08090C] border border-white/10 flex items-center justify-center p-3">
            {/* Ambient Backlight inside Flacon Base */}
            <div className="absolute inset-0 bg-radial from-amber-400/20 via-transparent to-transparent pointer-events-none" />

            <div className="relative h-full w-full">
              <Image
                src="/images/products/ameer-oud-parfum.svg"
                alt="عطر أمير العود الملكي الفاخر"
                fill
                className="object-contain drop-shadow-[0_10px_25px_rgba(212,175,55,0.4)]"
                priority
              />
            </div>

            {/* Glass Reflection Highlight */}
            <div className="absolute inset-x-0 top-0 h-1/3 bg-gradient-to-b from-white/15 to-transparent pointer-events-none rounded-t-2xl" />
          </div>

          {/* Pedestal Shadow */}
          <div className="absolute -bottom-4 left-1/2 -translate-x-1/2 w-48 h-4 rounded-full bg-black/60 blur-md pointer-events-none" />
        </div>

        {/* Brand Caption */}
        <div className="mt-5 space-y-1.5">
          <h3 className="text-xl sm:text-2xl font-black text-white tracking-wide font-arabic">
            أمير ستور • <span className="liquid-gold-text">الفخامة الملكية</span>
          </h3>
          <p className="text-xs text-amber-200/80 font-medium">
            مستخلصات عطرية طبيعية معتمدة مع ضمان ثبات 72 ساعة
          </p>
        </div>
      </div>

      {/* 4. Luxury Floating Trust Badges */}
      <div className="grid grid-cols-3 gap-2.5 pt-2">
        <div
          ref={badge1Ref}
          className="flex flex-col items-center justify-center p-2.5 sm:p-3 rounded-2xl bg-white/[0.04] border border-amber-400/20 text-center backdrop-blur-md hover:border-amber-400/40 transition-colors"
        >
          <div className="p-1.5 rounded-xl bg-amber-400/15 text-amber-300 mb-1.5">
            <Award className="h-4 w-4" />
          </div>
          <h5 className="text-[11px] font-bold text-white">زيوت نقية 100%</h5>
          <p className="text-[9px] text-amber-200/60 mt-0.5">بدون إضافات كيميائية</p>
        </div>

        <div
          ref={badge2Ref}
          className="flex flex-col items-center justify-center p-2.5 sm:p-3 rounded-2xl bg-white/[0.04] border border-amber-400/20 text-center backdrop-blur-md hover:border-amber-400/40 transition-colors"
        >
          <div className="p-1.5 rounded-xl bg-amber-400/15 text-amber-300 mb-1.5">
            <Clock className="h-4 w-4" />
          </div>
          <h5 className="text-[11px] font-bold text-white">ثبات 72 ساعة</h5>
          <p className="text-[9px] text-amber-200/60 mt-0.5">Extrait de Parfum</p>
        </div>

        <div
          ref={badge3Ref}
          className="flex flex-col items-center justify-center p-2.5 sm:p-3 rounded-2xl bg-white/[0.04] border border-amber-400/20 text-center backdrop-blur-md hover:border-amber-400/40 transition-colors"
        >
          <div className="p-1.5 rounded-xl bg-amber-400/15 text-amber-300 mb-1.5">
            <ShieldCheck className="h-4 w-4" />
          </div>
          <h5 className="text-[11px] font-bold text-white">معاينة قبل الدفع</h5>
          <p className="text-[9px] text-amber-200/60 mt-0.5">افحص قبل الاستلام</p>
        </div>
      </div>
    </div>
  );
}
