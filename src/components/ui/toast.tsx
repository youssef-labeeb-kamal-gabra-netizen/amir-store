"use client";

import React from "react";
import { cn } from "@/lib/utils";
import { CheckCircle2, AlertCircle, Info, X } from "lucide-react";

export type ToastType = "success" | "error" | "info";

export interface ToastProps {
  type?: ToastType;
  message: string;
  onClose?: () => void;
  className?: string;
}

export function Toast({ type = "info", message, onClose, className }: ToastProps) {
  const icons = {
    success: <CheckCircle2 className="h-5 w-5 text-brand-green-600 shrink-0" />,
    error: <AlertCircle className="h-5 w-5 text-red-600 shrink-0" />,
    info: <Info className="h-5 w-5 text-blue-600 shrink-0" />,
  };

  const borders = {
    success: "border-brand-green-200 bg-brand-green-50 text-brand-green-900",
    error: "border-red-200 bg-red-50 text-red-900",
    info: "border-blue-200 bg-blue-50 text-blue-900",
  };

  return (
    <div
      role="status"
      className={cn(
        "flex items-center gap-3 rounded-xl border p-4 shadow-lg text-start transition-all",
        borders[type],
        className
      )}
    >
      {icons[type]}
      <p className="text-sm font-medium flex-1">{message}</p>
      {onClose && (
        <button
          onClick={onClose}
          className="rounded-md p-1 hover:bg-black/5 transition-colors focus:outline-none"
          aria-label="إغلاق التنبيه"
        >
          <X className="h-4 w-4" />
        </button>
      )}
    </div>
  );
}
