import React from "react";
import { cn } from "@/lib/utils";

export function Skeleton({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      aria-hidden="true"
      className={cn("animate-pulse rounded-md bg-brand-neutral-200", className)}
      {...props}
    />
  );
}

export function ProductCardSkeleton() {
  return (
    <div className="rounded-xl border border-brand-neutral-200 bg-white p-4 shadow-sm space-y-3">
      <Skeleton className="h-48 w-full rounded-lg" />
      <Skeleton className="h-5 w-3/4" />
      <Skeleton className="h-4 w-1/2" />
      <div className="pt-2 flex justify-between items-center">
        <Skeleton className="h-8 w-24 rounded-md" />
        <Skeleton className="h-8 w-8 rounded-full" />
      </div>
    </div>
  );
}
