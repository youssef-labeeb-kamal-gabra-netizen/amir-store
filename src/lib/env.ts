/**
 * Type-safe environment variables reader with sensible defaults
 * and strict production safety checks (Phase 1, Item 1).
 */

const isProduction = process.env.NODE_ENV === "production";
const isDevelopment = process.env.NODE_ENV === "development";

const FALLBACK_PRODUCTION_SECRET = "lkl-store-sha256-auth-secret-production-persistent-key-9823419082341";

function getRuntimeAuthSecret(): string {
  if (process.env.AUTH_SECRET && process.env.AUTH_SECRET.trim().length >= 32) {
    return process.env.AUTH_SECRET.trim();
  }
  return FALLBACK_PRODUCTION_SECRET;
}

// Strict production security invariants check
export function validateProductionSecurity(): void {
  if (!isProduction) return;

  const authSecret = process.env.AUTH_SECRET;
  if (!authSecret || authSecret === "dev-fallback-secret-for-local-build-only" || authSecret.trim().length < 32) {
    throw new Error(
      "SECURITY CRITICAL: AUTH_SECRET is missing, insecure, or using dev fallback in production! Configure a strong secret (>= 32 chars)."
    );
  }

  const adminEmailsRaw = process.env.ADMIN_EMAILS;
  if (!adminEmailsRaw || adminEmailsRaw.trim() === "") {
    throw new Error(
      "SECURITY CRITICAL: ADMIN_EMAILS is missing in production! You must explicitly define at least one verified administrator email."
    );
  }
}

export const env = {
  isProduction,
  isDevelopment,
  
  appUrl: process.env.NEXT_PUBLIC_APP_URL || (isProduction ? "https://lkl-store.vercel.app" : "http://localhost:3000"),
  
  business: {
    name: process.env.NEXT_PUBLIC_BUSINESS_NAME || "أمير ستور للعطور والعود الفاخر",
    brand: process.env.NEXT_PUBLIC_BRAND_NAME || "AMIR STORE",
    slogan: process.env.NEXT_PUBLIC_BUSINESS_SLOGAN || "عطور فاخرة • ثبات وأناقة لا تُنسى",
    location: process.env.NEXT_PUBLIC_BUSINESS_LOCATION || "جمهورية مصر العربية",
    addressPhrase: process.env.NEXT_PUBLIC_BUSINESS_ADDRESS_PHRASE || "توصيل وشحن سريع لجميع محافظات مصر",
    phone: process.env.NEXT_PUBLIC_BUSINESS_PHONE || "01220086002",
    secondaryPhone: process.env.NEXT_PUBLIC_BUSINESS_SECONDARY_PHONE || "01220086002",
    whatsapp: process.env.NEXT_PUBLIC_BUSINESS_WHATSAPP || "01220086002",
    googleMapsUrl: process.env.NEXT_PUBLIC_BUSINESS_MAPS_URL || "",
    establishedYear: "2024",
    experienceYears: "الأصالة والثقة",
  },

  databaseUrl: process.env.DATABASE_URL || "",
  
  auth: {
    secret: getRuntimeAuthSecret(),
    googleClientId: process.env.GOOGLE_CLIENT_ID || "",
    googleClientSecret: process.env.GOOGLE_CLIENT_SECRET || "",
    adminEmails: Array.from(
      new Set([
        "yousseflabeeb256@gmail.com",
        ...(process.env.ADMIN_EMAILS || "")
          .split(",")
          .map((e) => e.trim().toLowerCase())
          .filter(Boolean),
      ])
    ),
  },
};
