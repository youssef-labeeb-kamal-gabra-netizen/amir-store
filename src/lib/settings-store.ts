import { env } from "@/lib/env";
import { readStorageFile, writeStorageFile } from "@/lib/storage";
import type { BusinessSettings } from "@/types/settings";

export type { BusinessSettings };

const STORAGE_FILE = "settings.json";

function getDefaultSettings(): BusinessSettings {
  return {
    phone: env.business.phone || "01220086002",
    secondaryPhone: env.business.secondaryPhone || "01220086002",
    whatsapp: env.business.whatsapp || "01220086002",
    googleMapsUrl: env.business.googleMapsUrl || "https://maps.google.com/?q=30.58768,31.50200",
    addressPhrase: env.business.addressPhrase || "الزقازيق، محافظة الشرقية، جمهورية مصر العربية",
    workingHours: "يومياً من 10:00 صباحاً حتى 11:00 مساءً",
    slogan: env.business.slogan || "فخامة تدوم • أصالة العود • عبير لا يُنسى",
    facebook: "https://facebook.com/ameerstore.perfumes",
    youtube: "",
  };
}

export function getCustomSettings(): BusinessSettings {
  return readStorageFile<BusinessSettings>(STORAGE_FILE, getDefaultSettings());
}

export function updateCustomSettings(updates: Partial<BusinessSettings>): BusinessSettings {
  const current = getCustomSettings();
  const merged: BusinessSettings = {
    ...current,
    ...updates,
  };
  writeStorageFile(STORAGE_FILE, merged);
  return merged;
}
