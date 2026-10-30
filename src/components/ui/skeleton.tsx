import React from "react";
import { cn } from "@/lib/utils";

export function Skeleton({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      aria-hidden="true"
      className={cn("animate-pulse rounded-lg bg-[#1A1F2C]/80 border border-white/5", className)}
      {...props}
    />
  );
}

export function ProductCardSkeleton() {
  return (
    <div className="rounded-3xl border border-amber-400/20 bg-white/[0.03] p-5 shadow-[0_8px_32px_0_rgba(0,0,0,0.5)] space-y-4">
      <Skeleton className="h-56 w-full rounded-2xl" />
      <Skeleton className="h-5 w-3/4" />
      <Skeleton className="h-4 w-1/2" />
      <div className="pt-2 flex justify-between items-center">
        <Skeleton className="h-9 w-28 rounded-xl" />
        <Skeleton className="h-9 w-9 rounded-full" />
      </div>
    </div>
  );
}
