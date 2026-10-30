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
      "inline-flex items-center justify-center font-bold transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-oud-accent focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 select-none rounded-full active:scale-[0.98] cursor-pointer";

    const variantStyles = {
      primary:
        "bg-brand-green-800 text-white hover:bg-brand-green-900 active:bg-brand-green-950 shadow-sm hover:shadow-md hover:-translate-y-0.5 active:translate-y-0",
      secondary:
        "bg-oud-accent text-brand-neutral-900 hover:bg-oud-accent-hover active:bg-oud-accent shadow-sm hover:shadow hover:-translate-y-0.5 active:translate-y-0",
      outline:
        "border border-oud-border-dark bg-transparent text-brand-green-800 hover:bg-brand-green-800 hover:text-white active:bg-brand-green-900 shadow-2xs hover:shadow-xs",
      ghost:
        "text-brand-neutral-700 hover:bg-brand-neutral-100 active:bg-brand-neutral-200",
      destructive:
        "bg-red-600 text-white hover:bg-red-700 active:bg-red-800 shadow-sm",
    };

    const sizeStyles = {
      sm: "h-9 px-3 text-xs gap-1.5",
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
