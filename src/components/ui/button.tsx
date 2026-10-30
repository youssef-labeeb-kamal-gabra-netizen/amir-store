import React from "react";
import { cn } from "@/lib/utils";
import { Loader2 } from "lucide-react";

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "outline" | "ghost" | "destructive";
  size?: "sm" | "md" | "lg";
  isLoading?: boolean;
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className,
      children,
      variant = "primary",
      size = "md",
      isLoading = false,
      disabled,
      type = "button",
      ...props
    },
    ref
  ) => {
    const baseStyles =
      "inline-flex items-center justify-center font-bold transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-400 focus-visible:ring-offset-2 focus-visible:ring-offset-[#08090C] disabled:pointer-events-none disabled:opacity-50 select-none rounded-full active:scale-[0.98] cursor-pointer";

    const variantStyles = {
      primary:
        "bg-gradient-to-r from-[#D4AF37] via-[#F5E296] to-[#D4AF37] text-black font-black hover:brightness-110 active:brightness-95 shadow-[0_0_22px_rgba(212,175,55,0.35)] border border-amber-300/40 hover:-translate-y-0.5 active:translate-y-0",
      secondary:
        "bg-[#13161F] text-amber-300 border border-amber-400/30 hover:border-amber-400 hover:bg-[#1A1F2C] hover:text-amber-200 shadow-sm hover:-translate-y-0.5 active:translate-y-0",
      outline:
        "border border-amber-400/40 bg-transparent text-amber-300 hover:bg-amber-400/10 hover:border-amber-400 active:bg-amber-400/20 shadow-2xs hover:shadow-xs",
      ghost:
        "text-slate-300 hover:text-white hover:bg-white/5 active:bg-white/10",
      destructive:
        "bg-red-500/20 text-red-300 border border-red-500/40 hover:bg-red-500/30 active:bg-red-500/40 shadow-sm",
    };

    const sizeStyles = {
      sm: "h-9 px-3.5 text-xs gap-1.5",
      md: "h-11 px-5 text-sm gap-2",
      lg: "h-12 px-7 text-base gap-2.5",
    };

    return (
      <button
        ref={ref}
        type={type}
        disabled={disabled || isLoading}
        className={cn(baseStyles, variantStyles[variant], sizeStyles[size], className)}
        {...props}
      >
        {isLoading && <Loader2 className="h-4 w-4 animate-spin text-current" />}
        {children}
      </button>
    );
  }
);

Button.displayName = "Button";
