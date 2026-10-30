import React from "react";
import { cn } from "@/lib/utils";
import { PackageOpen } from "lucide-react";
import { Button } from "./button";

export interface EmptyStateProps {
  title?: string;
  description: string;
  actionLabel?: string;
  onAction?: () => void;
  icon?: React.ReactNode;
  className?: string;
}

export function EmptyState({
  title = "لا توجد نتائج",
  description,
  actionLabel,
  onAction,
  icon = <PackageOpen className="h-10 w-10 text-amber-400 stroke-1" />,
  className,
}: EmptyStateProps) {
  return (
    <div
      className={cn(
        "flex min-h-[300px] flex-col items-center justify-center rounded-3xl border border-dashed border-amber-400/30 p-8 text-center bg-white/[0.02] backdrop-blur-md text-white",
        className
      )}
    >
      <div className="mb-4 rounded-full bg-amber-400/10 p-4 shadow-sm border border-amber-400/20">
        {icon}
      </div>
      <h3 className="text-lg font-bold text-white font-arabic mb-1">{title}</h3>
      <p className="text-sm text-slate-400 max-w-sm mb-6 leading-relaxed">{description}</p>
      {actionLabel && onAction && (
        <Button onClick={onAction} variant="outline" size="sm">
          {actionLabel}
        </Button>
      )}
    </div>
  );
}
