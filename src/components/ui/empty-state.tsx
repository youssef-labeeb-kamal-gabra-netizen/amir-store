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
  icon = <PackageOpen className="h-12 w-12 text-brand-neutral-400 stroke-1" />,
  className,
}: EmptyStateProps) {
  return (
    <div
      className={cn(
        "flex min-h-[300px] flex-col items-center justify-center rounded-2xl border border-dashed border-brand-neutral-300 p-8 text-center bg-brand-neutral-50/50",
        className
      )}
    >
      <div className="mb-4 rounded-full bg-white p-4 shadow-sm border border-brand-neutral-200">
        {icon}
      </div>
      <h3 className="text-lg font-bold text-brand-neutral-900 mb-1">{title}</h3>
      <p className="text-sm text-brand-neutral-500 max-w-sm mb-6">{description}</p>
      {actionLabel && onAction && (
        <Button onClick={onAction} variant="outline" size="sm">
          {actionLabel}
        </Button>
      )}
    </div>
  );
}
