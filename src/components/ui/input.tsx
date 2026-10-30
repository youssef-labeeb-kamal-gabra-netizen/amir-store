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
          <label htmlFor={inputId} className="block text-sm font-medium text-brand-neutral-800">
            {label}
            {props.required && <span className="text-red-500 ms-1">*</span>}
          </label>
        )}
        <input
          id={inputId}
          type={type}
          ref={ref}
          className={cn(
            "flex h-11 w-full rounded-lg border border-brand-neutral-300 bg-white px-3.5 py-2 text-sm text-brand-neutral-900 transition-colors placeholder:text-brand-neutral-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-green-600 focus-visible:border-transparent disabled:cursor-not-allowed disabled:bg-brand-neutral-100 disabled:opacity-75",
            error && "border-red-500 focus-visible:ring-red-500",
            className
          )}
          {...props}
        />
        {error && <p className="text-xs text-red-600 mt-1">{error}</p>}
        {helperText && !error && <p className="text-xs text-brand-neutral-500 mt-1">{helperText}</p>}
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
          <label htmlFor={textareaId} className="block text-sm font-medium text-brand-neutral-800">
            {label}
            {props.required && <span className="text-red-500 ms-1">*</span>}
          </label>
        )}
        <textarea
          id={textareaId}
          ref={ref}
          className={cn(
            "flex min-h-[100px] w-full rounded-lg border border-brand-neutral-300 bg-white p-3 text-sm text-brand-neutral-900 transition-colors placeholder:text-brand-neutral-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-green-600 focus-visible:border-transparent disabled:cursor-not-allowed disabled:bg-brand-neutral-100 disabled:opacity-75",
            error && "border-red-500 focus-visible:ring-red-500",
            className
          )}
          {...props}
        />
        {error && <p className="text-xs text-red-600 mt-1">{error}</p>}
        {helperText && !error && <p className="text-xs text-brand-neutral-500 mt-1">{helperText}</p>}
      </div>
    );
  }
);
Textarea.displayName = "Textarea";
