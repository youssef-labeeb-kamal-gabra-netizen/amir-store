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
  heroTagline: "وجهتكم الأولى للعطور الشرقية الفاخرة ودهن العود النادر",
  heroHeading: "أمير ستور — فخامة العطور ودهن العود الأصيل",
  heroDescription: "نقدم تشكيلة حصرية من أرقى العطور الفرنسية والشرقية، أدهان العود المعتقة، والمسك الخالص، مع شحن سريع ومعاينة قبل الدفع لكافة محافظات جمهورية مصر العربية.",
  aboutText: "انطلق أمير ستور في محافظة الشرقية ليكون الاسم الرائد في تقديم أرقى روائح العطور الشرقية والفرنسية ودهن العود الطبيعي، مجسداً الفخامة والأصالة في كل قطرة.",
  locationPhrase: "الزقازيق — محافظة الشرقية — مصر (مع خدمة التوصيل والمعاينة لجميع المحافظات)",
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
