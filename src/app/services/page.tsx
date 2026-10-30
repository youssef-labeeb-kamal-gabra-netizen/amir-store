import React from "react";
import Link from "next/link";
import { constructMetadata } from "@/lib/seo";
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
      icon: <Gift className="h-8 w-8 text-amber-400" />,
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
      icon: <Sparkles className="h-8 w-8 text-amber-400" />,
      title: "الاستشارات العطرية وتحديد التوقيع الشخصي",
      description:
        "هل تبحث عن عطر يعبر عن شخصيتك أو تبحث عن نوتة معينة (توباكو، عنبر، فانيليا، عود)؟ خبراؤنا يقدمون لك المشورة لاختيار التركيبة والتركيز المثالي لمناسبتك.",
      points: [
        "تحديد العطور المناسبة لبيئة العمل والمناسبات الليلية",
        "شرح كامل لطبقات الهرم العطري والافتتاحية والقاعدة",
        "نصائح لزيادة الفوحان وثبات العطر لأقصى مدة (72 ساعة)",
      ],
    },
    {
      icon: <Heart className="h-8 w-8 text-amber-400" />,
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
      icon: <ShieldCheck className="h-8 w-8 text-amber-400" />,
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
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-16 space-y-16 text-start text-white">
      {/* Page Header */}
      <div className="space-y-4 max-w-3xl">
        <span className="text-xs font-bold text-amber-400 tracking-wider uppercase font-serif flex items-center gap-1.5">
          <Sparkles className="h-3.5 w-3.5 text-amber-400" />
          <span>VIP BESPOKE SERVICES</span>
        </span>
        <h1 className="text-3xl sm:text-4xl md:text-5xl font-black text-white tracking-tight leading-tight font-arabic">
          خدمات عطرية استثنائية <br />
          <span className="liquid-gold-text">تليق بذوقكم الرفيع</span>
        </h1>
        <p className="text-base sm:text-lg text-slate-300 leading-relaxed">
          نحرص في أمير ستور على تقديم تجربة تسوق استثنائية تتجاوز مجرد بيع العطور، من الاستشارة واختيار النوتة وحتى وصول الهدية مغلفة بأبهى حلة لأحبائكم.
        </p>
      </div>

      {/* Services Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8">
        {services.map((srv, idx) => (
          <div
            key={idx}
            className="rounded-3xl border border-amber-400/20 bg-white/[0.03] backdrop-blur-2xl p-8 space-y-6 shadow-[0_8px_32px_0_rgba(0,0,0,0.5)] card-lift"
          >
            <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-amber-400/10 border border-amber-400/30 text-amber-300">
              {srv.icon}
            </div>
            <div>
              <h3 className="text-xl font-bold text-white mb-2 font-arabic">{srv.title}</h3>
              <p className="text-sm text-slate-300 leading-relaxed">{srv.description}</p>
            </div>
            <ul className="space-y-2.5 pt-2 border-t border-white/10 text-xs sm:text-sm text-slate-300">
              {srv.points.map((pt, pIdx) => (
                <li key={pIdx} className="flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-amber-400 shrink-0" />
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
      <div className="rounded-3xl bg-gradient-to-r from-[#13161F] via-[#0D0F14] to-[#08090C] text-white p-8 sm:p-10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 shadow-[0_8px_32px_0_rgba(0,0,0,0.6)] border border-amber-400/30">
        <div>
          <h3 className="text-xl sm:text-2xl font-bold text-white font-arabic">
            هل ترغب في طلب باقة إهداء مخصصة أو استشارة عطرية؟
          </h3>
          <p className="text-sm text-slate-300 mt-1 max-w-xl">
            تواصل معنا مباشرة عبر واتساب وسيقوم مستشارنا العطري بتنسيق طلبك فوراً.
          </p>
        </div>
        <Link href="/contact" className="shrink-0">
          <button
            type="button"
            className="rounded-full font-black text-black bg-gradient-to-r from-[#FDE68A] via-[#F59E0B] to-[#D97706] hover:brightness-110 active:scale-95 transition-all py-3.5 px-6 text-sm flex items-center gap-2 cursor-pointer shadow-[0_0_20px_rgba(212,175,55,0.4)]"
          >
            <Phone className="h-4 w-4" />
            <span>تواصل مع مستشار العطور</span>
          </button>
        </Link>
      </div>
    </div>
  );
}
