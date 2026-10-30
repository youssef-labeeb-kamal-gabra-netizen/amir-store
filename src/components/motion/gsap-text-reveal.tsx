"use client";

import React, { useRef } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";

interface GsapTextRevealProps {
  children: React.ReactNode;
  delay?: number;
  className?: string;
}

export function GsapTextReveal({
  children,
  delay = 0.1,
  className = "",
}: GsapTextRevealProps) {
  const textRef = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      if (!textRef.current) return;
      gsap.fromTo(
        textRef.current,
        {
          opacity: 0,
          y: 28,
          filter: "blur(6px)",
        },
        {
          opacity: 1,
          y: 0,
          filter: "blur(0px)",
          duration: 1.1,
          delay,
          ease: "power3.out",
          clearProps: "all",
        }
      );
    },
    { scope: textRef }
  );

  return (
    <div ref={textRef} className={className}>
      {children}
    </div>
  );
}
