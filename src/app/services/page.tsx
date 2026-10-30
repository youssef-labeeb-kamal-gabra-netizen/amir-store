import React from "react";
import Link from "next/link";
import { constructMetadata } from "@/lib/seo";
import { Button } from "@/components/ui/button";
import { FAQSection } from "@/components/common/faq-section";
import { Sparkles, Gift, Heart, ShieldCheck, Phone, CheckCircle2 } from "lucide-react";

export const metadata = constructMetadata({
  title: "خدماتنا العطرية الفاخرة | أمير ستور",
  description:
    "استكشف خدمات متجر أمير ستور في تصميم باقات الإهداء الملكية، استشارات اختيار النوتات العطرية، وتوريد العطور والعود للمناسبات والشركات.",
  canonicalUrl: "/services",
});

export default function ServicesPage() {
  const services = [
    {
      icon: <Gift className="h-8 w-8 text-brand-gold-600" />,
      title: "تصميم باقات وصناديق الإهداء الملكية",
      description:
        "نبتكر لك صناديق إهداء فاخرة مكسوة بالمخمل والجلد، منسقة بأفخم العطور وأدهان العود والمباخر، مع كارت إهداء مطبوع بعبارتك الخاصة لتقديمها في كافة المناسبات والأعراس.",
      points: [
        "تغليف ملكي راقٍ يحمل شعار أمير ستور المذهب",
        "حرية اختيار محتويات الصندوق (عطور، مسك، دهن عود)",
        "كارت إهداء مخصص مجاني مع كل صندوق",
      ],
    },
    {
      icon: <Sparkles className="h-8 w-8 text-brand-gold-600" />,
      title: "الاستشارات العطرية وتحديد التوقيع الشخصي",
      description:
        "هل تبحث عن عطر يعبر عن شخصيتك أو تبحث عن نوتة معينة (توباكو، عنبر، فانيليا، عود)؟ خبراؤنا يقدمون لك المشورة لاختيار التركيبة والتركيز المثالي لمناسبتك.",
      points: [
        "تحديد العطور المناسبة لبيئة العمل والمناسبات الليلية",
        "شرح كامل لطبقات الهرم العطري والافتتاحية والقاعدة",
        "نصائح لزيادة الفوحان وثبات العطر لأقصى مدة",
      ],
    },
    {
      icon: <Heart className="h-8 w-8 text-brand-gold-600" />,
      title: "تجهيز هدايا الشركات والمناسبات الخاصة",
      description:
        "نوفر توزيعات عطرية فاخرة وأطقم ميني عطور للمؤتمرات، مناسبات التخرج، والأعراس بأسعار خاصة وخيارات تخصيص للشعارات.",
      points: [
        "كميات مخصصة مع شحن وتوصيل فوري لكافة المحافظات",
        "تنسيق أنيق ومميز يترك انطباعاً لا ينسى لدى ضيوفكم",
        "أصالة تامة وثبات معتمد لجميع التوزيعات",
      ],
    },
    {
      icon: <ShieldCheck className="h-8 w-8 text-brand-gold-600" />,
      title: "ضمان النقاء والأصالة 100% والمعاينة",
      description:
        "نضع ثقتكم وراحتكم على رأس أولوياتنا؛ حيث نوفر خدمة المعاينة المباشرة للشحنة قبل سداد القيمة مع سياسة استبدال مرنة تضمن رضاكم التام.",
      points: [
        "أدهان عود طبيعية صافية غير مخلوطة",
        "فحص شامل لكل زجاجة عطر قبل التغليف والشحن",
        "دعم ومتابعة مستمرة بعد الاستلام لضمان رضاكم",
      ],
    },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-16 space-y-16 text-start">
      {/* Page Header */}
      <div className="space-y-4 max-w-3xl">
        <span className="text-xs font-bold text-brand-green-800 tracking-wider uppercase">
          خدمات أمير ستور VIP
        </span>
        <h1 className="text-3xl sm:text-4xl md:text-5xl font-black text-brand-green-950 tracking-tight leading-tight">
          خدمات عطرية استثنائية <br />
          <span className="text-brand-gold-600">تليق بذوقكم الرفيع</span>
        </h1>
        <p className="text-base sm:text-lg text-brand-neutral-500 leading-relaxed">
          نحرص في أمير ستور على تقديم تجربة تسوق استثنائية تتجاوز مجرد بيع العطور، من الاستشارة واختيار النوتة وحتى وصول الهدية مغلفة بأبهى حلة لأحبائكم.
        </p>
      </div>

      {/* Services Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {services.map((srv, idx) => (
          <div
            key={idx}
            className="rounded-3xl border border-brand-neutral-200 bg-white p-8 space-y-6 shadow-oud-sm hover:shadow-md transition-shadow"
          >
            <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-brand-green-50 text-brand-green-800">
              {srv.icon}
            </div>
            <div>
              <h3 className="text-xl font-bold text-brand-green-950 mb-2">{srv.title}</h3>
              <p className="text-sm text-brand-neutral-500 leading-relaxed">{srv.description}</p>
            </div>
            <ul className="space-y-2.5 pt-2 border-t border-brand-neutral-100 text-xs sm:text-sm text-brand-neutral-600">
              {srv.points.map((pt, pIdx) => (
                <li key={pIdx} className="flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-brand-gold-600 shrink-0" />
                  <span>{pt}</span>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      {/* FAQ */}
      <FAQSection />

      {/* Direct Contact CTA Box */}
      <div className="rounded-3xl bg-gradient-to-r from-[#2E3A24] via-[#242e1d] to-[#1a2215] text-white p-8 sm:p-10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 shadow-md border border-brand-green-900/40">
        <div>
          <h3 className="text-xl sm:text-2xl font-bold text-white">
            هل ترغب في طلب باقة إهداء مخصصة أو استشارة عطرية؟
          </h3>
          <p className="text-sm text-oud-surfaceLight mt-1 max-w-xl">
            تواصل معنا مباشرة عبر واتساب وسيقوم مستشارنا العطري بتنسيق طلبك فوراً.
          </p>
        </div>
        <Link href="/contact" className="shrink-0">
          <Button variant="secondary" size="lg" className="rounded-full font-bold text-brand-green-950 bg-brand-gold-400 hover:bg-brand-gold-500 active:scale-95 transition-all">
            <Phone className="h-4 w-4 ms-2" />
            تواصل مع مستشار العطور
          </Button>
        </Link>
      </div>
    </div>
  );
}
