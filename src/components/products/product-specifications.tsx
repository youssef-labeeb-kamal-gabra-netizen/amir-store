import React from "react";
import { ProductSpecification } from "@/types/product";
import { ShieldCheck } from "lucide-react";

export interface ProductSpecificationsProps {
  specifications: ProductSpecification[];
}

export function ProductSpecifications({ specifications }: ProductSpecificationsProps) {
  const hasSpecs = specifications && specifications.length > 0;

  return (
    <div className="space-y-4 text-start">
      <div className="rounded-2xl border border-brand-neutral-200 overflow-hidden shadow-xs bg-white">
        <div className="bg-brand-neutral-50 px-4 sm:px-6 py-3.5 sm:py-4 border-b border-brand-neutral-200 flex flex-col sm:flex-row sm:items-center justify-between gap-1 sm:gap-4">
          <h3 className="text-sm sm:text-base font-extrabold text-brand-neutral-900">
            المواصفات العطرية والتركيبة
          </h3>
          <span className="text-[11px] sm:text-xs text-brand-neutral-500 font-medium">
            مواصفات أصلية وموثقة من أمير ستور
          </span>
        </div>

        {hasSpecs ? (
          <dl className="divide-y divide-brand-neutral-100">
            {specifications.map((spec, index) => (
              <div
                key={index}
                className={`px-4 sm:px-6 py-3 sm:py-3.5 sm:grid sm:grid-cols-3 sm:gap-4 ${
                  index % 2 === 0 ? "bg-white" : "bg-brand-neutral-50/40"
                }`}
              >
                <dt className="text-xs sm:text-sm font-bold text-brand-neutral-700">
                  {spec.label}
                </dt>
                <dd className="mt-0.5 sm:mt-0 text-xs sm:text-sm text-brand-neutral-800 sm:col-span-2 font-medium leading-relaxed">
                  {spec.value}
                </dd>
              </div>
            ))}
          </dl>
        ) : (
          <div className="p-6 text-brand-neutral-600 text-sm">
            المواصفات العطرية التفصيلية متوفرة عند الطلب المباشر من خبراء العطور في أمير ستور.
          </div>
        )}
      </div>

      {/* Advisory Note & Transparency Guarantee (Haute Parfumerie Quality) */}
      <div className="rounded-2xl border border-amber-200 bg-amber-50/60 p-4 sm:p-5 flex items-start gap-3.5">
        <ShieldCheck className="h-5 w-5 text-amber-700 shrink-0 mt-0.5" />
        <div className="space-y-1 text-xs sm:text-sm text-amber-950">
          <h4 className="font-extrabold">ضمان الأصالة والفخامة العطرية</h4>
          <p className="text-amber-900 leading-relaxed">
            التزاماً بأعلى معايير المصداقية والجودة الرفيعة، نضمن أن جميع عطورنا ودهون العود أصلية 100% ومستخلصة من أجود الزيوت والروائح الفاخرة ذات الثبات العالي والفوحان المميز. نتيح لعملائنا الكرام حق معاينة وفحص المنتج عند الاستلام قبل السداد للتأكد التام من الرضا.
          </p>
        </div>
      </div>
    </div>
  );
}
