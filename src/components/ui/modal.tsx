"use client";

import React, { useEffect } from "react";
import { cn } from "@/lib/utils";
import { X } from "lucide-react";

export interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  description?: string;
  children: React.ReactNode;
  className?: string;
}

export function Modal({
  isOpen,
  onClose,
  title,
  description,
  children,
  className,
}: ModalProps) {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    if (isOpen) {
      document.body.style.overflow = "hidden";
      window.addEventListener("keydown", handleKeyDown);
    }
    return () => {
      document.body.style.overflow = "unset";
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/85 backdrop-blur-md animate-in fade-in duration-200"
      role="dialog"
      aria-modal="true"
      onClick={onClose}
    >
      <div
        className={cn(
          "relative w-full max-w-lg max-h-[90dvh] flex flex-col rounded-3xl bg-[#0D0F14] p-6 sm:p-7 shadow-[0_20px_60px_rgba(0,0,0,0.85)] transition-all text-start border border-amber-400/30 animate-in zoom-in-95 duration-200 overflow-hidden text-white",
          className
        )}
        onClick={(e) => e.stopPropagation()}
      >
        <button
          type="button"
          onClick={onClose}
          className="absolute top-4 start-auto end-4 rounded-xl p-2 text-slate-400 hover:bg-white/10 hover:text-white transition-colors focus:outline-none focus:ring-2 focus:ring-amber-400 z-10"
          aria-label="إغلاق النافذة"
        >
          <X className="h-5 w-5" />
        </button>

        <div className="shrink-0 pe-8">
          {title && <h2 className="text-lg sm:text-xl font-bold text-white font-arabic mb-1">{title}</h2>}
          {description && <p className="text-xs sm:text-sm text-slate-400 mb-2">{description}</p>}
        </div>

        <div className="flex-1 overflow-y-auto overscroll-contain pe-1 mt-3">
          {children}
        </div>
      </div>
    </div>
  );
}
