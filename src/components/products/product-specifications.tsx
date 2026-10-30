import React from "react";
import { ProductSpecification } from "@/types/product";
import { ShieldCheck, Sparkles } from "lucide-react";

export interface ProductSpecificationsProps {
  specifications: ProductSpecification[];
}

export function ProductSpecifications({ specifications }: ProductSpecificationsProps) {
  const hasSpecs = specifications && specifications.length > 0;

  return (
    <div className="space-y-4 text-start text-white">
      <div className="rounded-2xl border border-amber-400/25 overflow-hidden shadow-sm bg-white/[0.03] backdrop-blur-2xl">
        <div className="bg-[#0D0F14] px-4 sm:px-6 py-3.5 sm:py-4 border-b border-amber-400/20 flex flex-col sm:flex-row sm:items-center justify-between gap-1 sm:gap-4">
          <h3 className="text-sm sm:text-base font-extrabold text-white flex items-center gap-2 font-arabic">
            <Sparkles className="h-4 w-4 text-amber-400" />
            <span>المواصفات العطرية والتركيبة الهرمية</span>
          </h3>
          <span className="text-[11px] sm:text-xs text-amber-200/70 font-medium">
            مواصفات ملكية معتمدة وموثقة من أمير ستور
          </span>
        </div>

        {hasSpecs ? (
          <dl className="divide-y divide-white/10">
            {specifications.map((spec, index) => (
              <div
                key={index}
                className={`px-4 sm:px-6 py-3 sm:py-3.5 sm:grid sm:grid-cols-3 sm:gap-4 ${
                  index % 2 === 0 ? "bg-white/[0.01]" : "bg-white/[0.03]"
                }`}
              >
                <dt className="text-xs sm:text-sm font-bold text-amber-300">
                  {spec.label}
                </dt>
                <dd className="mt-0.5 sm:mt-0 text-xs sm:text-sm text-slate-300 sm:col-span-2 font-medium leading-relaxed">
                  {spec.value}
                </dd>
              </div>
            ))}
          </dl>
        ) : (
          <div className="p-6 text-slate-400 text-sm">
            المواصفات العطرية التفصيلية متوفرة عند الطلب المباشر من خبراء العطور في أمير ستور.
          </div>
        )}
      </div>

      {/* Advisory Note & Transparency Guarantee */}
      <div className="rounded-2xl border border-amber-400/30 bg-amber-400/10 p-4 sm:p-5 flex items-start gap-3.5 backdrop-blur-md">
        <ShieldCheck className="h-5 w-5 text-amber-400 shrink-0 mt-0.5" />
        <div className="space-y-1 text-xs sm:text-sm text-amber-100">
          <h4 className="font-extrabold text-white font-arabic">ضمان الأصالة والفخامة العطرية (72 ساعة ثبات)</h4>
          <p className="text-slate-300 leading-relaxed">
            التزاماً بأعلى معايير المصداقية والجودة الرفيعة، نضمن أن جميع عطورنا ودهون العود أصلية 100% ومستخلصة من أجود الزيوت الطبيعية ذات الثبات العالي لأكثر من 72 ساعة والفوحان المميز. نتيح لعملائنا الكرام حق معاينة وفحص المنتج وتجربة العينة عند الاستلام قبل السداد.
          </p>
        </div>
      </div>
    </div>
  );
}
