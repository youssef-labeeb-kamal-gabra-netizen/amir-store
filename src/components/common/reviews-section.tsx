"use client";

import React, { useState, useEffect } from "react";
import { CustomerReview } from "@/data/reviews";
import { Star, MessageSquarePlus, CheckCircle, ShieldCheck, X, Sparkles } from "lucide-react";

interface ReviewsSectionProps {
  initialReviews?: CustomerReview[];
}

export function ReviewsSection({ initialReviews = [] }: ReviewsSectionProps) {
  // Only display reviews that are strictly approved
  const [reviews, setReviews] = useState<CustomerReview[]>(() =>
    initialReviews.filter((r) => r.status === "APPROVED")
  );
  const [modalOpen, setModalOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [successMsg, setSuccessMsg] = useState("");
  const [errorMsg, setErrorMsg] = useState("");

  // Re-fetch approved reviews on mount to get latest updates
  useEffect(() => {
    fetch("/api/reviews")
      .then((res) => res.json())
      .then((data) => {
        if (data.ok && Array.isArray(data.reviews)) {
          setReviews(data.reviews.filter((r: CustomerReview) => r.status === "APPROVED"));
        }
      })
      .catch(() => {});
  }, []);

  // Form fields
  const [author, setAuthor] = useState("");
  const [location, setLocation] = useState("");
  const [role, setRole] = useState("");
  const [equipmentUsed, setEquipmentUsed] = useState("");
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setErrorMsg("");
    setSuccessMsg("");

    try {
      const res = await fetch("/api/reviews", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          author,
          location,
          role,
          equipmentUsed,
          rating,
          comment,
        }),
      });
      const data = await res.json();
      if (!res.ok || !data.ok) {
        throw new Error(data.message || "فشل إرسال التقييم");
      }

      setSuccessMsg(
        data.message ||
          "تم إرسال مراجعتكم بنجاح! شكراً لثقتكم الغالية، وسيتم عرضها بعد المراجعة والاعتماد من إدارة المتجر."
      );
      setTimeout(() => {
        setModalOpen(false);
        setSuccessMsg("");
        setAuthor("");
        setLocation("");
        setRole("");
        setEquipmentUsed("");
        setComment("");
        setRating(5);
      }, 2500);
    } catch (err: unknown) {
      setErrorMsg(err instanceof Error ? err.message : "حدث خطأ أثناء إرسال المراجعة");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <section className="text-start space-y-8 my-14">
      {/* Section Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-amber-400/20 pb-4">
        <div>
          <span className="text-xs font-bold text-amber-400 uppercase tracking-wider flex items-center gap-1.5 font-serif">
            <Sparkles className="h-3.5 w-3.5 text-amber-400" />
            <span>VIP TESTIMONIALS & REVIEWS</span>
          </span>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight mt-1 font-arabic">
            شهادات وتجارب عملائنا المميزين
          </h2>
          <p className="text-xs sm:text-sm text-slate-400 mt-0.5">
            تجارب حقيقية وموثقة مع أدهان العود والعطور الملكية من أمير ستور
          </p>
        </div>

        <button
          onClick={() => setModalOpen(true)}
          className="inline-flex items-center gap-2 rounded-full border border-amber-400/40 bg-white/[0.04] hover:bg-amber-400/15 text-amber-300 px-4 py-2 text-xs font-bold transition-all active:scale-95 cursor-pointer self-start sm:self-auto shadow-sm"
        >
          <MessageSquarePlus className="h-4 w-4 text-amber-400" />
          <span>أضف رأيك وتجربتك معنا</span>
        </button>
      </div>

      {/* Reviews Grid */}
      {reviews.length === 0 ? (
        <div className="rounded-3xl border border-amber-400/20 bg-white/[0.03] backdrop-blur-2xl p-8 sm:p-12 text-center space-y-4 shadow-[0_8px_32px_0_rgba(0,0,0,0.5)]">
          <div className="h-12 w-12 rounded-2xl bg-amber-400/10 text-amber-400 flex items-center justify-center mx-auto border border-amber-400/30">
            <ShieldCheck className="h-6 w-6" />
          </div>
          <div className="space-y-1">
            <h3 className="text-lg font-extrabold text-white font-arabic">
              تقييمات وآراء العملاء
            </h3>
            <p className="text-sm text-slate-400 max-w-lg mx-auto leading-relaxed">
              تخضع جميع التقييمات للمراجعة والتحقق المباشر من إدارة المتجر لضمان الأمانة والشفافية. نتشرف دائماً بمشاركتكم تجاربكم ورأيكم في عطورنا الفاخرة.
            </p>
          </div>
          <button
            onClick={() => setModalOpen(true)}
            className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-[#FDE68A] via-[#F59E0B] to-[#D97706] text-black px-6 py-2.5 text-xs font-black transition-all cursor-pointer shadow-md"
          >
            <MessageSquarePlus className="h-4 w-4" />
            <span>شاركنا تجربتك الآن</span>
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {reviews.map((rev) => (
            <div
              key={rev.id}
              className="rounded-3xl border border-amber-400/20 bg-white/[0.03] backdrop-blur-2xl p-6 sm:p-7 shadow-[0_8px_32px_0_rgba(0,0,0,0.5)] card-lift flex flex-col justify-between space-y-4 text-start"
            >
              <div className="space-y-3">
                {/* Rating & Verified badge */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className={`h-4 w-4 ${i < rev.rating ? "fill-amber-400 text-amber-400" : "text-slate-600"}`}
                      />
                    ))}
                  </div>
                  {rev.verified && (
                    <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-400 bg-emerald-950/60 px-2.5 py-0.5 rounded-full border border-emerald-500/30">
                      <CheckCircle className="h-3 w-3" />
                      عميل موثق
                    </span>
                  )}
                </div>

                {/* Review Text */}
                <p className="text-sm text-slate-300 leading-relaxed font-normal italic">
                  &ldquo;{rev.comment}&rdquo;
                </p>

                {rev.equipmentUsed && (
                  <div className="pt-2">
                    <span className="text-[11px] font-semibold text-amber-300 bg-amber-400/10 border border-amber-400/20 rounded-lg px-2.5 py-1 inline-block">
                      العطر: {rev.equipmentUsed}
                    </span>
                  </div>
                )}
              </div>

              {/* Author info */}
              <div className="pt-4 border-t border-white/10 flex items-center justify-between text-xs">
                <div className="flex items-center gap-2.5">
                  <div className="h-8 w-8 rounded-full bg-gradient-to-tr from-amber-400 to-amber-600 text-black flex items-center justify-center font-black text-xs shrink-0 shadow-xs">
                    {rev.author.charAt(0)}
                  </div>
                  <div>
                    <h4 className="font-bold text-white text-sm">{rev.author}</h4>
                    <p className="text-slate-400 text-[11px]">{rev.location} • {rev.role}</p>
                  </div>
                </div>
                <span className="text-[10px] text-amber-200/60 font-medium font-mono">{rev.date}</span>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal Dialog for Adding a Voluntary Review */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fade-in">
          <div className="bg-[#0D0F14] rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl border border-amber-400/30 relative max-h-[90vh] overflow-y-auto text-start text-white">
            <button
              onClick={() => setModalOpen(false)}
              className="absolute top-5 start-5 p-2 text-slate-400 hover:text-white rounded-full hover:bg-white/10 transition-colors"
              title="إغلاق"
            >
              <X className="h-5 w-5" />
            </button>

            <div className="mb-6 space-y-1">
              <span className="text-xs font-bold text-amber-400 uppercase">مراجعة اختيارية</span>
              <h3 className="text-xl font-bold text-white font-arabic">
                شاركنا رأيك وتجربتك مع أمير ستور
              </h3>
              <p className="text-xs text-slate-400">
                رأيك وتجربتك العطرية تسعدنا وتسهم في تطوير خدماتنا وتقديم الأفضل دائماً.
              </p>
            </div>

            {successMsg && (
              <div className="p-4 mb-4 rounded-xl bg-emerald-950/80 text-emerald-300 border border-emerald-500/40 text-sm font-semibold flex items-center gap-2">
                <CheckCircle className="h-5 w-5 shrink-0 text-emerald-400" />
                <span>{successMsg}</span>
              </div>
            )}

            {errorMsg && (
              <div className="p-3 mb-4 rounded-xl bg-red-950/80 text-red-300 border border-red-500/40 text-xs font-semibold">
                {errorMsg}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1">
                  الاسم الكريم *
                </label>
                <input
                  type="text"
                  required
                  placeholder="مثال: د. أحمد السعيد"
                  value={author}
                  onChange={(e) => setAuthor(e.target.value)}
                  className="w-full rounded-xl border border-amber-400/25 bg-white/[0.04] px-3.5 py-2.5 text-sm text-white focus:border-amber-400 focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1">
                    المركز / القرية / المحافظة
                  </label>
                  <input
                    type="text"
                    placeholder="مثال: الزقازيق، القاهرة، المنصورة..."
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    className="w-full rounded-xl border border-amber-400/25 bg-white/[0.04] px-3.5 py-2.5 text-sm text-white focus:border-amber-400 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1">
                    المهنة أو الاهتمام
                  </label>
                  <input
                    type="text"
                    placeholder="مثال: متذوق عطور، طبيب، مهندس..."
                    value={role}
                    onChange={(e) => setRole(e.target.value)}
                    className="w-full rounded-xl border border-amber-400/25 bg-white/[0.04] px-3.5 py-2.5 text-sm text-white focus:border-amber-400 focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1">
                  العطر أو دهن العود الذي جربته (اختياري)
                </label>
                <input
                  type="text"
                  placeholder="مثال: عطر أمير العود الملكي، دهن عود تراد، مسك أبيض..."
                  value={equipmentUsed}
                  onChange={(e) => setEquipmentUsed(e.target.value)}
                  className="w-full rounded-xl border border-amber-400/25 bg-white/[0.04] px-3.5 py-2.5 text-sm text-white focus:border-amber-400 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1">
                  تقييمك الإجمالي
                </label>
                <div className="flex items-center gap-2 pt-1">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      type="button"
                      key={star}
                      onClick={() => setRating(star)}
                      className="p-1 text-amber-400 hover:scale-110 transition-transform cursor-pointer"
                    >
                      <Star
                        className={`h-6 w-6 ${star <= rating ? "fill-amber-400 text-amber-400" : "text-slate-600"}`}
                      />
                    </button>
                  ))}
                  <span className="text-xs font-bold text-amber-300 me-2">
                    ({rating} من 5 نجوم)
                  </span>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1">
                  اكتب رأيك وتجربتك بكل أمانة *
                </label>
                <textarea
                  required
                  rows={4}
                  placeholder="اكتب عن ثبات العطر، فوحان الرائحة، جودة التغليف وسرعة التوصيل..."
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  className="w-full rounded-xl border border-amber-400/25 bg-white/[0.04] px-3.5 py-2.5 text-sm text-white focus:border-amber-400 focus:outline-none leading-relaxed resize-none"
                />
              </div>

              <div className="pt-2 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="px-4 py-2 rounded-full border border-white/20 text-xs font-bold text-slate-300 hover:bg-white/10 transition-colors"
                >
                  إلغاء
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="px-6 py-2 rounded-full bg-gradient-to-r from-[#FDE68A] via-[#F59E0B] to-[#D97706] text-black font-black text-xs hover:brightness-110 transition-all disabled:opacity-50"
                >
                  {submitting ? "جارٍ الحفظ..." : "إرسال التقييم"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </section>
  );
}
