import React from "react";
import { cn } from "@/lib/utils";

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  helperText?: string;
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type = "text", label, error, helperText, id, ...props }, ref) => {
    const inputId = id || (label ? label.toLowerCase().replace(/\s+/g, "-") : undefined);

    return (
      <div className="w-full space-y-1.5 text-start">
        {label && (
          <label htmlFor={inputId} className="block text-sm font-medium text-amber-200/90">
            {label}
            {props.required && <span className="text-amber-400 ms-1">*</span>}
          </label>
        )}
        <input
          id={inputId}
          type={type}
          ref={ref}
          className={cn(
            "flex h-11 w-full rounded-xl border border-amber-400/30 bg-[#0D0F14] px-4 py-2 text-sm text-white transition-colors placeholder:text-slate-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-400 focus-visible:border-transparent disabled:cursor-not-allowed disabled:bg-[#13161F] disabled:text-slate-600 disabled:opacity-75 shadow-inner",
            error && "border-red-500 focus-visible:ring-red-500",
            className
          )}
          {...props}
        />
        {error && <p className="text-xs text-red-400 mt-1">{error}</p>}
        {helperText && !error && <p className="text-xs text-slate-400 mt-1">{helperText}</p>}
      </div>
    );
  }
);
Input.displayName = "Input";

export interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
  helperText?: string;
}

export const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className, label, error, helperText, id, ...props }, ref) => {
    const textareaId = id || (label ? label.toLowerCase().replace(/\s+/g, "-") : undefined);

    return (
      <div className="w-full space-y-1.5 text-start">
        {label && (
          <label htmlFor={textareaId} className="block text-sm font-medium text-amber-200/90">
            {label}
            {props.required && <span className="text-amber-400 ms-1">*</span>}
          </label>
        )}
        <textarea
          id={textareaId}
          ref={ref}
          className={cn(
            "flex min-h-[100px] w-full rounded-xl border border-amber-400/30 bg-[#0D0F14] p-3.5 text-sm text-white transition-colors placeholder:text-slate-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-400 focus-visible:border-transparent disabled:cursor-not-allowed disabled:bg-[#13161F] disabled:text-slate-600 disabled:opacity-75 shadow-inner",
            error && "border-red-500 focus-visible:ring-red-500",
            className
          )}
          {...props}
        />
        {error && <p className="text-xs text-red-400 mt-1">{error}</p>}
        {helperText && !error && <p className="text-xs text-slate-400 mt-1">{helperText}</p>}
      </div>
    );
  }
);
Textarea.displayName = "Textarea";
