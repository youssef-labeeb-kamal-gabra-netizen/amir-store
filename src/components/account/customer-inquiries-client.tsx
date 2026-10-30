"use client";

import React, { useState } from "react";
import { ContactRequest, ContactRequestStatus } from "@/lib/contact-requests";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Modal } from "@/components/ui/modal";
import {
  MessageSquare,
  Phone,
  Plus,
  Trash2,
  ExternalLink,
  CheckCircle2,
  Clock,
  Send,
  AlertCircle,
  Tag,
  Calendar,
} from "lucide-react";

interface CustomerInquiriesClientProps {
  initialRequests: ContactRequest[];
  userEmail: string;
  userName: string;
}

const STATUS_CONFIG: Record<
  ContactRequestStatus,
  { label: string; bg: string; text: string; border: string; icon: typeof Clock }
> = {
  NEW: {
    label: "جديد - قيد المراجعة",
    bg: "bg-amber-50",
    text: "text-amber-800",
    border: "border-amber-200",
    icon: Clock,
  },
  CONTACTED: {
    label: "تم التواصل معك",
    bg: "bg-blue-50",
    text: "text-blue-800",
    border: "border-blue-200",
    icon: Phone,
  },
  IN_PROGRESS: {
    label: "جاري المتابعة والتجهيز",
    bg: "bg-purple-50",
    text: "text-purple-800",
    border: "border-purple-200",
    icon: Clock,
  },
  RESOLVED: {
    label: "مكتمل ومحسوم",
    bg: "bg-emerald-50",
    text: "text-emerald-800",
    border: "border-emerald-200",
    icon: CheckCircle2,
  },
  ARCHIVED: {
    label: "مؤرشف",
    bg: "bg-stone-100",
    text: "text-stone-700",
    border: "border-stone-200",
    icon: Clock,
  },
};

export function CustomerInquiriesClient({
  initialRequests,
  userName,
}: CustomerInquiriesClientProps) {
  const [requests, setRequests] = useState<ContactRequest[]>(initialRequests);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [phone, setPhone] = useState("");
  const [product, setProduct] = useState("");
  const [message, setMessage] = useState("");
  const [feedback, setFeedback] = useState<{ type: "success" | "error"; text: string } | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFeedback(null);
    setIsSubmitting(true);

    try {
      const res = await fetch("/api/account/requests", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ phone, product, message }),
      });

      const data = await res.json();

      if (!res.ok || !data.ok) {
        throw new Error(data.message || "فشل تسجيل الطلب");
      }

      setRequests((prev) => [data.data, ...prev]);
      setFeedback({ type: "success", text: "تم تسجيل استفسارك بنجاح في حسابك الخاص!" });
      setPhone("");
      setProduct("");
      setMessage("");
      setTimeout(() => {
        setIsModalOpen(false);
        setFeedback(null);
      }, 1500);
    } catch (err) {
      setFeedback({
        type: "error",
        text: err instanceof Error ? err.message : "حدث خطأ غير متوقع",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm("هل أنت متأكد من رغبتك في حذف هذا الاستفسار من حسابك؟")) return;

    setDeletingId(id);
    try {
      const res = await fetch(`/api/account/requests?id=${encodeURIComponent(id)}`, {
        method: "DELETE",
      });
      const data = await res.json();
      if (!res.ok || !data.ok) {
        alert(data.message || "تعذر حذف الاستفسار");
        return;
      }
      setRequests((prev) => prev.filter((r) => r.id !== id));
    } catch {
      alert("حدث خطأ أثناء محاولة الحذف.");
    } finally {
      setDeletingId(null);
    }
  };

  const formatDate = (isoString: string) => {
    try {
      const date = new Date(isoString);
      return date.toLocaleDateString("ar-EG", {
        year: "numeric",
        month: "long",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      });
    } catch {
      return isoString;
    }
  };

  const buildWhatsAppFollowUpUrl = (req: ContactRequest) => {
    const text = encodeURIComponent(
      `مرحباً شركة لبيب كمال، أود متابعة طلبي رقم (${req.id}) بخصوص ${req.product || "المعدات والآلات"}.`
    );
    return `https://wa.me/201006540307?text=${text}`;
  };

  return (
    <div className="space-y-6">
      {/* Header of Section */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 sm:p-6 rounded-2xl border border-brand-neutral-200 shadow-sm">
        <div>
          <div className="flex items-center gap-2">
            <MessageSquare className="h-5 w-5 text-brand-green-700" />
            <h2 className="text-xl font-black text-brand-neutral-900">
              سجل استفساراتي ومتابعة طلباتي
            </h2>
          </div>
          <p className="text-xs sm:text-sm text-brand-neutral-600 mt-1">
            هنا تظهر جميع استفساراتك وطلبات الأسعار الخاصة بك، معزولة بأمان تام ولا يراها سواك.
          </p>
        </div>

        <Button
          onClick={() => setIsModalOpen(true)}
          variant="primary"
          size="md"
          className="gap-2 shadow-sm font-bold shrink-0 self-start sm:self-center"
        >
          <Plus className="h-4 w-4" />
          إرسال استفسار جديد
        </Button>
      </div>

      {/* Requests List */}
      {requests.length === 0 ? (
        <div className="rounded-2xl border-2 border-dashed border-brand-neutral-200 bg-brand-neutral-50 p-8 sm:p-12 text-center space-y-4">
          <div className="inline-flex p-4 rounded-full bg-brand-green-100 text-brand-green-800">
            <MessageSquare className="h-8 w-8" />
          </div>
          <div className="max-w-md mx-auto space-y-1">
            <h3 className="text-lg font-bold text-brand-neutral-900">
              لا توجد استفسارات مسجلة حتى الآن
            </h3>
            <p className="text-sm text-brand-neutral-600">
              عندما تسأل عن أي ماكينة أو قطعة غيار، سيظهر طلبك وحالته هنا مباشرة لمتابعته مع الإدارة.
            </p>
          </div>
          <Button
            onClick={() => setIsModalOpen(true)}
            variant="outline"
            size="md"
            className="gap-2 bg-white font-bold"
          >
            <Plus className="h-4 w-4" />
            اكتب استفسارك الأول الآن
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4">
          {requests.map((req) => {
            const statusCfg = STATUS_CONFIG[req.status] || STATUS_CONFIG.NEW;
            const StatusIcon = statusCfg.icon;

            return (
              <div
                key={req.id}
                className="rounded-2xl border border-brand-neutral-200 bg-white p-5 sm:p-6 shadow-sm hover:border-brand-green-300 transition-all space-y-4"
              >
                {/* Top Bar: Reference ID & Status */}
                <div className="flex flex-wrap items-center justify-between gap-3 border-b border-brand-neutral-100 pb-3">
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-xs font-bold bg-brand-neutral-100 text-brand-neutral-700 px-2.5 py-1 rounded-md">
                      كود الطلب: #{req.id.slice(0, 12)}
                    </span>
                    <span className="text-xs text-brand-neutral-400 hidden sm:inline">•</span>
                    <div className="flex items-center gap-1 text-xs text-brand-neutral-500">
                      <Calendar className="h-3.5 w-3.5" />
                      <span>{formatDate(req.createdAt)}</span>
                    </div>
                  </div>

                  <span
                    className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold border ${statusCfg.bg} ${statusCfg.text} ${statusCfg.border}`}
                  >
                    <StatusIcon className="h-3.5 w-3.5" />
                    {statusCfg.label}
                  </span>
                </div>

                {/* Main Content */}
                <div className="space-y-2">
                  {req.product && (
                    <div className="flex items-center gap-2 text-sm font-bold text-brand-green-800">
                      <Tag className="h-4 w-4 text-brand-green-600" />
                      <span>المعدة المطلوبة: {req.product}</span>
                    </div>
                  )}
                  <p className="text-sm sm:text-base text-brand-neutral-800 whitespace-pre-line bg-brand-neutral-50 p-3.5 rounded-xl border border-brand-neutral-100">
                    {req.message}
                  </p>
                </div>

                {/* Footer Actions */}
                <div className="flex flex-wrap items-center justify-between gap-3 pt-2 text-xs">
                  <div className="flex items-center gap-2 text-brand-neutral-600">
                    <Phone className="h-3.5 w-3.5 text-brand-neutral-500" />
                    <span>رقم الاتصال:</span>
                    <span className="font-mono font-bold text-brand-neutral-900" dir="ltr">
                      {req.phone}
                    </span>
                  </div>

                  <div className="flex items-center gap-2 ms-auto">
                    <a
                      href={buildWhatsAppFollowUpUrl(req)}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 px-3 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg font-bold text-xs transition-colors shadow-sm"
                    >
                      <ExternalLink className="h-3.5 w-3.5" />
                      متابعة بالواتساب
                    </a>

                    <button
                      type="button"
                      onClick={() => handleDelete(req.id)}
                      disabled={deletingId === req.id}
                      className="inline-flex items-center gap-1 px-3 py-2 text-red-600 hover:bg-red-50 rounded-lg font-semibold text-xs transition-colors border border-transparent hover:border-red-200"
                      title="حذف الطلب من حسابك"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                      <span>حذف</span>
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Modal for New Inquiry */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => {
          if (!isSubmitting) setIsModalOpen(false);
        }}
        title="إرسال استفسار مباشر ومحمي"
      >
        <form onSubmit={handleSubmit} className="space-y-4 text-start">
          <p className="text-xs text-brand-neutral-600">
            أهلاً يا <span className="font-bold text-brand-neutral-900">{userName}</span>، استفسارك
            سيرتبط تلقائياً بحسابك الموثق لتتمكن من متابعته في أي وقت.
          </p>

          {feedback && (
            <div
              className={`p-3 rounded-xl text-xs sm:text-sm font-semibold flex items-center gap-2 ${
                feedback.type === "success"
                  ? "bg-emerald-50 text-emerald-800 border border-emerald-200"
                  : "bg-red-50 text-red-800 border border-red-200"
              }`}
            >
              {feedback.type === "success" ? (
                <CheckCircle2 className="h-4 w-4 shrink-0 text-emerald-600" />
              ) : (
                <AlertCircle className="h-4 w-4 shrink-0 text-red-600" />
              )}
              <span>{feedback.text}</span>
            </div>
          )}

          <div>
            <label className="block text-xs font-bold text-brand-neutral-800 mb-1">
              رقم هاتفك للتواصل (موبايل / واتساب) <span className="text-red-500">*</span>
            </label>
            <Input
              type="tel"
              required
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="مثال: 01012345678"
              className="text-start font-mono"
              dir="ltr"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-brand-neutral-800 mb-1">
              المعدة أو الصنف المطلوب (اختياري)
            </label>
            <Input
              type="text"
              value={product}
              onChange={(e) => setProduct(e.target.value)}
              placeholder="مثال: موتور رشاش، طلمبة مياه، قطع غيار بيتر..."
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-brand-neutral-800 mb-1">
              تفاصيل استفسارك أو طلبك <span className="text-red-500">*</span>
            </label>
            <textarea
              required
              rows={4}
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="اكتب استفسارك هنا بكل سهولة، وسيتواصل معك الفني المختص فوراً..."
              className="w-full rounded-xl border border-brand-neutral-300 p-3 text-sm text-brand-neutral-900 focus:border-brand-green-600 focus:outline-none focus:ring-2 focus:ring-brand-green-600/20"
            />
          </div>

          <div className="flex items-center justify-end gap-2 pt-3 border-t border-brand-neutral-100">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => setIsModalOpen(false)}
              disabled={isSubmitting}
            >
              إلغاء
            </Button>
            <Button
              type="submit"
              variant="primary"
              size="sm"
              disabled={isSubmitting}
              className="gap-2 font-bold"
            >
              <Send className="h-4 w-4" />
              {isSubmitting ? "جاري الحفظ..." : "إرسال وتثبيت في حسابي"}
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
