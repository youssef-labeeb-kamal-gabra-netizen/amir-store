"use client";

import React, { useRef } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";

interface GsapStaggerRevealProps {
  children: React.ReactNode;
  stagger?: number;
  duration?: number;
  y?: number;
  className?: string;
  delay?: number;
}

export function GsapStaggerReveal({
  children,
  stagger = 0.12,
  duration = 0.9,
  y = 30,
  className = "",
  delay = 0,
}: GsapStaggerRevealProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      if (!containerRef.current) return;
      const elements = containerRef.current.children;
      if (!elements || elements.length === 0) return;

      gsap.fromTo(
        elements,
        {
          opacity: 0,
          y,
          scale: 0.96,
        },
        {
          opacity: 1,
          y: 0,
          scale: 1,
          duration,
          delay,
          stagger,
          ease: "power3.out",
          clearProps: "all",
        }
      );
    },
    { scope: containerRef }
  );

  return (
    <div ref={containerRef} className={className}>
      {children}
    </div>
  );
}
