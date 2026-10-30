import { env } from "@/lib/env";
import { readStorageFile, writeStorageFile } from "@/lib/storage";
import type { BusinessSettings } from "@/types/settings";

export type { BusinessSettings };

const STORAGE_FILE = "settings.json";

function getDefaultSettings(): BusinessSettings {
  return {
    phone: env.business.phone || "01220792948",
    secondaryPhone: env.business.secondaryPhone || "01114587917",
    whatsapp: env.business.whatsapp || "01220792948",
    googleMapsUrl: env.business.googleMapsUrl || "https://maps.app.goo.gl/87VQjF6s9bEyF9yz7",
    addressPhrase: env.business.addressPhrase || "طريق بنها - الزقازيق (طريق مصر الزراعي)، قرية الجديدة، مركز منيا القمح",
    workingHours: "يومياً من 8:00 صباحاً حتى 9:00 مساءً",
    slogan: env.business.slogan || "الجودة • الثقة • الخدمة المتميزة",
    facebook: "https://facebook.com/lkl.machinery",
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
