import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

/**
 * Combines multiple class names and resolves conflicting Tailwind utilities.
 */
export function cn(...inputs: ClassValue[]): string {
  return twMerge(clsx(inputs));
}

/**
 * Formats a date into a localized Arabic string.
 */
export function formatDateArabic(date: string | Date): string {
  try {
    const d = typeof date === "string" ? new Date(date) : date;
    return new Intl.DateTimeFormat("ar-EG", {
      year: "numeric",
      month: "long",
      day: "numeric",
    }).format(d);
  } catch {
    return "";
  }
}

/**
 * Generates an SEO and URL-safe slug from Arabic/English text.
 */
export function slugify(text: string): string {
  return text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/\s+/g, "-")
    .replace(/[^\w\u0621-\u064A-]+/g, "")
    .replace(/--+/g, "-")
    .replace(/^-+/, "")
    .replace(/-+$/, "");
}
