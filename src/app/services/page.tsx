import React from "react";
import Link from "next/link";
import { constructMetadata } from "@/lib/seo";
import { Button } from "@/components/ui/button";
import { FAQSection } from "@/components/common/faq-section";
import { Tractor, Wrench, Droplets, Cpu, Phone, CheckCircle2 } from "lucide-react";

export const metadata = constructMetadata({
  title: "الخدمات والدعم الفني | شركة لبيب كمال",
  description:
    "استكشف خدمات توريد المعدات الزراعية، استشارات حسابات طلمبات ومحركات الري، وتأمين قطع الغيار الأصلية مع الدعم الفني المباشر من شركة لبيب كمال.",
  canonicalUrl: "/services",
});

export default function ServicesPage() {
  const services = [
    {
      icon: <Tractor className="h-8 w-8 text-brand-green-700" />,
      title: "توريد الآلات والمعدات الزراعية",
      description:
        "نوفر للمزارع والمشروعات تشكيلة واسعة من محركات الرش، ومعدات خدمة الأرض والعزاقات، ومحركات الديزل عالية العزم التي تلائم مختلف المساحات والمحاصيل الحقلية والبستانية.",
      points: [
        "مطابقة لمعايير المتانة والتشغيل الميداني",
        "تنوع القدرات والموديلات لتناسب طبيعة كل أرض",
        "إرشادات تشغيل متكاملة لكل معدّة",
      ],
    },
    {
      icon: <Droplets className="h-8 w-8 text-brand-green-700" />,
      title: "استشارات طلمبات ومحركات الري",
      description:
        "حساب الضغوط وتدفقات المياه المطلوبة لشبكات الري بالغمر، أو الري بالرش والتنقيط، وتحديد القوة الحصانية والقطر الأنسب للطلمبة لتقليل استهلاك الوقود وتفادي هدر الطاقة.",
      points: [
        "دراسة أعماق الآبار ومصادر التغذية المائية",
        "موازنة الضغوط ومعدل التصرف (متر مكعب/ساعة)",
        "ترشيد استهلاك الوقود والطاقة التشغيلية",
      ],
    },
    {
      icon: <Wrench className="h-8 w-8 text-brand-green-700" />,
      title: "تأمين قطع الغيار الأصلية ومستلزمات الصيانة",
      description:
        "نوفر قطع الغيار الاستهلاكية ومجموعات الإصلاح (بساتم سيراميك، جلود ضغط، صمامات، رشاشات، فلاتر تنقية) لضمان استمرار عمل المعدات دون توقف في مواسم الري والرش الحرجة.",
      points: [
        "بساتم وجلود ضغط عالية الكفاءة لمواتير الرش",
        "فلاتر شبكية وفلاتر ديسك أصلية لمحطات الري",
        "أطقم صيانة سريعة سهلة التركيب",
      ],
    },
    {
      icon: <Cpu className="h-8 w-8 text-brand-green-700" />,
      title: "الدعم الفني المباشر والاستفسارات",
      description:
        "فريقنا الفني متواجد لمساعدتكم في تشخيص الأعطال الشائعة، وتقديم التوصيات الصحيحة للتشغيل الدوري وتغيير الزيوت وصيانة المحركات للحفاظ على كفاءتها لسنوات طويلة.",
      points: [
        "متابعة هاتفية واستشارات عبر واتساب",
        "خدمة مباشرة في مقرنا بالزقازيق",
        "نصائح إطالة العمر الافتراضي للمحركات",
      ],
    },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-16 space-y-16 text-start">
      {/* Page Header */}
      <div className="space-y-4 max-w-3xl">
        <span className="text-xs font-bold text-brand-green-700 tracking-wider uppercase">
          خدماتنا المتخصصة
        </span>
        <h1 className="text-3xl sm:text-4xl md:text-5xl font-black text-brand-neutral-900 tracking-tight leading-tight">
          خدمات متكاملة لدعم <br />
          <span className="text-brand-green-700">الإنتاج والميكنة الزراعية</span>
        </h1>
        <p className="text-base sm:text-lg text-brand-neutral-600 leading-relaxed">
          نحرص في شركة لبيب كمال لبيب على مرافقة عملائنا في كل مرحلة، بدءاً من اختيار المعدّة الملائمة وحتى توفير قطع الغيار والمشورة الفنية اللازمة لاستقرار واستدامة التشغيل.
        </p>
      </div>

      {/* Services Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {services.map((srv, idx) => (
          <div
            key={idx}
            className="rounded-2xl border border-brand-neutral-200 bg-white p-8 space-y-6 shadow-sm hover:shadow-md transition-shadow"
          >
            <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-brand-green-50">
              {srv.icon}
            </div>
            <div>
              <h3 className="text-xl font-bold text-brand-neutral-900 mb-2">{srv.title}</h3>
              <p className="text-sm text-brand-neutral-600 leading-relaxed">{srv.description}</p>
            </div>
            <ul className="space-y-2.5 pt-2 border-t border-brand-neutral-100 text-xs sm:text-sm text-brand-neutral-700">
              {srv.points.map((pt, pIdx) => (
                <li key={pIdx} className="flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-brand-green-700 shrink-0" />
                  <span>{pt}</span>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      {/* FAQ & Farmer Guidance */}
      <FAQSection />

      {/* Direct Contact CTA Box */}
      <div className="rounded-3xl bg-gradient-to-r from-[#022c22] to-[#064e3b] text-white p-8 sm:p-10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 shadow-md border border-emerald-800/40">
        <div>
          <h3 className="text-xl sm:text-2xl font-bold text-white">
            هل تحتاج إلى مساعدة فنية لاختيار معدتك؟
          </h3>
          <p className="text-sm text-emerald-100/90 mt-1 max-w-xl">
            تواصل معنا مباشرة عبر الهاتف أو تفضل بزيارتنا في مقر الشركة بالزقازيق (طريق مصر الزراعي).
          </p>
        </div>
        <Link href="/contact" className="shrink-0">
          <Button variant="secondary" size="lg" className="font-bold text-white bg-brand-gold-600 hover:bg-brand-gold-500 active:scale-95 transition-all">
            <Phone className="h-4 w-4 ms-2" />
            تواصل معنا الآن
          </Button>
        </Link>
      </div>
    </div>
  );
}
