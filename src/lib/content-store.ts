import { readStorageFile, writeStorageFile } from "@/lib/storage";

export interface ContentBlocks {
  heroTagline: string;
  heroHeading: string;
  heroDescription: string;
  aboutText: string;
  locationPhrase: string;
}

const STORAGE_FILE = "content.json";

const defaultContent: ContentBlocks = {
  heroTagline: "شريككم الأول في المعدات الزراعية وأنظمة الري",
  heroHeading: "شركة لبيب كمال للأدوات والآلات الزراعية",
  heroDescription: "نوفر أحدث محركات الرش، طلمبات ومحركات مياه الري، محركات الديزل، ومستلزمات شبكات الري الحديث مع توفير قطع الغيار الأصلية والدعم الفني المباشر في الزقازيق ومحافظات مصر.",
  aboutText: "تأسست شركة لبيب كمال في محافظة الشرقية لتكون المركز الرائد في توريد وصيانة الآلات الزراعية، ومحركات مياه الري والرش، وتوفير كافة مستلزمات الإنتاج الزراعي الحديث.",
  locationPhrase: "الزقازيق — محافظة الشرقية — مصر (البداية، طريق مصر الزراعي)",
};

export function getContentStore(): ContentBlocks {
  return readStorageFile<ContentBlocks>(STORAGE_FILE, defaultContent);
}

export function updateContentStore(updates: Partial<ContentBlocks>): ContentBlocks {
  const current = getContentStore();
  const updated = {
    ...current,
    ...updates,
  };
  writeStorageFile(STORAGE_FILE, updated);
  return updated;
}
