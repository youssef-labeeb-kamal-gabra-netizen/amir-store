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
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200"
      role="dialog"
      aria-modal="true"
      onClick={onClose}
    >
      <div
        className={cn(
          "relative w-full max-w-lg max-h-[90dvh] flex flex-col rounded-2xl sm:rounded-3xl bg-white p-5 sm:p-6 shadow-2xl transition-all text-start border border-brand-neutral-200 animate-in zoom-in-95 duration-200 overflow-hidden",
          className
        )}
        onClick={(e) => e.stopPropagation()}
      >
        <button
          type="button"
          onClick={onClose}
          className="absolute top-4 start-auto end-4 rounded-xl p-2 text-brand-neutral-400 hover:bg-brand-neutral-100 hover:text-brand-neutral-700 transition-colors focus:outline-none focus:ring-2 focus:ring-brand-green-600 z-10"
          aria-label="إغلاق النافذة"
        >
          <X className="h-5 w-5" />
        </button>

        <div className="shrink-0 pe-8">
          {title && <h2 className="text-lg sm:text-xl font-bold text-brand-neutral-900 mb-1">{title}</h2>}
          {description && <p className="text-xs sm:text-sm text-brand-neutral-500 mb-2">{description}</p>}
        </div>

        <div className="flex-1 overflow-y-auto overscroll-contain pe-1 mt-3">
          {children}
        </div>
      </div>
    </div>
  );
}
