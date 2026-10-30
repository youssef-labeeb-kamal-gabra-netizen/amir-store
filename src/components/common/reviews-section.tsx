"use client";

import React, { useState, useEffect } from "react";
import { CustomerReview } from "@/data/reviews";
import { Star, MessageSquarePlus, CheckCircle, ShieldCheck, X } from "lucide-react";
import { Button } from "@/components/ui/button";

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
          "تم إرسال مراجعتكم بنجاح! شكراً لثقتكم الغالية، وسيتم عرضها بعد المراجعة والاعتماد من إدارة المحل."
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
      const msg = err instanceof Error ? err.message : "حدث خطأ غير متوقع، يرجى المحاولة لاحقاً";
      setErrorMsg(msg);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <section className="text-start space-y-8 my-14">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 rounded-full bg-brand-green-50 border border-brand-green-200 px-3.5 py-1 text-xs font-bold text-brand-green-800 mb-2">
            <ShieldCheck className="h-4 w-4 text-brand-green-700" />
            <span>شهادات حقيقية من قلب الغيط والمزرعة</span>
          </div>
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-brand-neutral-900 tracking-tight">
            آراء وتجارب أهلنا من المزارعين ومقاولي الري
          </h2>
          <p className="text-sm sm:text-base text-brand-neutral-600 mt-2 max-w-2xl leading-relaxed">
            ثقة عملائنا في الزقازيق ومحافظات مصر هي رأس مالنا الحقيقي منذ انطلاقنا، نفخر بخدمتكم وتوفير المعدات التي تعيش وتتحمل.
          </p>
        </div>

        <button
          onClick={() => setModalOpen(true)}
          className="inline-flex items-center justify-center gap-2 rounded-xl bg-brand-green-800 hover:bg-brand-green-700 active:bg-brand-green-900 active:scale-95 text-white px-5 py-3 text-sm font-bold shadow-xs transition-all shrink-0 cursor-pointer"
        >
          <MessageSquarePlus className="h-4 w-4" />
          <span>أضف رأيك وتجربتك معنا (اختياري)</span>
        </button>
      </div>

      {/* Reviews Grid */}
      {reviews.length === 0 ? (
        <div className="rounded-3xl border border-brand-neutral-200/90 bg-white p-8 sm:p-12 text-center space-y-4 shadow-xs">
          <div className="h-12 w-12 rounded-2xl bg-brand-green-50 text-brand-green-700 flex items-center justify-center mx-auto border border-brand-green-200">
            <ShieldCheck className="h-6 w-6" />
          </div>
          <div className="space-y-1">
            <h3 className="text-lg font-extrabold text-brand-neutral-900">
              تقييمات وآراء العملاء
            </h3>
            <p className="text-sm text-brand-neutral-600 max-w-lg mx-auto leading-relaxed">
              تخضع جميع التقييمات للمراجعة والتحقق المباشر من إدارة المحل لضمان الأمانة والشفافية. نتشرف دائماً بمشاركتكم تجاربكم ورأيكم في معداتنا وخدماتنا.
            </p>
          </div>
          <button
            onClick={() => setModalOpen(true)}
            className="inline-flex items-center gap-2 rounded-xl bg-brand-green-800 hover:bg-brand-green-700 active:bg-brand-green-900 text-white px-5 py-2.5 text-xs font-bold transition-all cursor-pointer"
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
              className="rounded-3xl border border-brand-neutral-200/80 bg-white p-6 sm:p-7 shadow-xs hover:shadow-md hover:border-brand-green-600/40 transition-all flex flex-col justify-between space-y-4"
            >
              <div className="space-y-3">
                {/* Rating & Verified badge */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1 text-amber-500">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className={`h-4 w-4 ${i < rev.rating ? "fill-amber-400 text-amber-400" : "text-brand-neutral-200"}`}
                      />
                    ))}
                  </div>
                  {rev.verified && (
                    <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-100">
                      <CheckCircle className="h-3 w-3" />
                      عميل موثق
                    </span>
                  )}
                </div>

                {/* Review Text */}
                <p className="text-sm text-brand-neutral-700 leading-relaxed font-normal italic">
                  &ldquo;{rev.comment}&rdquo;
                </p>

                {rev.equipmentUsed && (
                  <div className="pt-2">
                    <span className="text-[11px] font-semibold text-brand-neutral-500 bg-brand-neutral-100 rounded-lg px-2.5 py-1 inline-block">
                      المعدة: {rev.equipmentUsed}
                    </span>
                  </div>
                )}
              </div>

              {/* Author info */}
              <div className="pt-4 border-t border-brand-neutral-100 flex items-center justify-between text-xs">
                <div className="flex items-center gap-2.5">
                  <div className="h-8 w-8 rounded-full bg-brand-green-100 text-brand-green-800 flex items-center justify-center font-bold text-xs shrink-0">
                    {rev.author.charAt(0)}
                  </div>
                  <div>
                    <h4 className="font-bold text-brand-neutral-900 text-sm">{rev.author}</h4>
                    <p className="text-brand-neutral-500 text-[11px]">{rev.location} • {rev.role}</p>
                  </div>
                </div>
                <span className="text-[10px] text-brand-neutral-400 font-medium">{rev.date}</span>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal Dialog for Adding a Voluntary Review */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl border border-brand-neutral-200 relative max-h-[90vh] overflow-y-auto text-start">
            <button
              onClick={() => setModalOpen(false)}
              className="absolute top-5 start-5 p-2 text-brand-neutral-400 hover:text-brand-neutral-900 rounded-full hover:bg-brand-neutral-100 transition-colors"
              title="إغلاق"
            >
              <X className="h-5 w-5" />
            </button>

            <div className="mb-6 space-y-1">
              <span className="text-xs font-bold text-brand-green-700 uppercase">مراجعة اختيارية</span>
              <h3 className="text-xl font-bold text-brand-neutral-900">
                شاركنا رأيك وتجربتك مع شركة لبيب كمال
              </h3>
              <p className="text-xs text-brand-neutral-500">
                رأيك يساعد إخوانك من المزارعين في اختيار المعدة المناسبة ويسهم في تطوير خدماتنا.
              </p>
            </div>

            {successMsg && (
              <div className="p-4 mb-4 rounded-xl bg-emerald-50 text-emerald-800 border border-emerald-200 text-sm font-semibold flex items-center gap-2">
                <CheckCircle className="h-5 w-5 shrink-0 text-emerald-600" />
                <span>{successMsg}</span>
              </div>
            )}

            {errorMsg && (
              <div className="p-3 mb-4 rounded-xl bg-red-50 text-red-800 border border-red-200 text-xs font-semibold">
                {errorMsg}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-brand-neutral-800 mb-1">
                  الاسم الكريم *
                </label>
                <input
                  type="text"
                  required
                  placeholder="مثال: الحاج أحمد عبد العال"
                  value={author}
                  onChange={(e) => setAuthor(e.target.value)}
                  className="w-full rounded-xl border border-brand-neutral-300 px-3.5 py-2.5 text-sm focus:border-brand-green-600 focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-brand-neutral-800 mb-1">
                    المركز / القرية / المحافظة
                  </label>
                  <input
                    type="text"
                    placeholder="مثال: الزقازيق، منيا القمح، ديرب نجم..."
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    className="w-full rounded-xl border border-brand-neutral-300 px-3.5 py-2.5 text-sm focus:border-brand-green-600 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-brand-neutral-800 mb-1">
                    المهنة أو التخصص
                  </label>
                  <input
                    type="text"
                    placeholder="مثال: مزارع، فني ري، مقاول..."
                    value={role}
                    onChange={(e) => setRole(e.target.value)}
                    className="w-full rounded-xl border border-brand-neutral-300 px-3.5 py-2.5 text-sm focus:border-brand-green-600 focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-brand-neutral-800 mb-1">
                  المعدة التي اشتريتها أو قمت بصيانتها (اختياري)
                </label>
                <input
                  type="text"
                  placeholder="مثال: موتور رش 450، طلمبة مياه 3 بوصة، موتور ديزل..."
                  value={equipmentUsed}
                  onChange={(e) => setEquipmentUsed(e.target.value)}
                  className="w-full rounded-xl border border-brand-neutral-300 px-3.5 py-2.5 text-sm focus:border-brand-green-600 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-brand-neutral-800 mb-1">
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
                        className={`h-6 w-6 ${star <= rating ? "fill-amber-400" : "text-brand-neutral-300"}`}
                      />
                    </button>
                  ))}
                  <span className="text-xs font-bold text-brand-neutral-600 me-2">
                    ({rating} من 5 نجوم)
                  </span>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-brand-neutral-800 mb-1">
                  اكتب رأيك وتجربتك بكل أمانة *
                </label>
                <textarea
                  required
                  rows={4}
                  placeholder="اكتب عن كفاءة الموتور، توفر قطع الغيار، تعامل أولاد الحاج لبيب معك..."
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  className="w-full rounded-xl border border-brand-neutral-300 px-3.5 py-2.5 text-sm focus:border-brand-green-600 focus:outline-none leading-relaxed"
                />
              </div>

              <div className="pt-2 flex items-center justify-end gap-3">
                <Button
                  type="button"
                  variant="outline"
                  size="md"
                  onClick={() => setModalOpen(false)}
                >
                  إلغاء
                </Button>
                <Button
                  type="submit"
                  variant="primary"
                  size="md"
                  disabled={submitting}
                >
                  {submitting ? "جارٍ الحفظ..." : "إرسال التقييم"}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </section>
  );
}
