"use client";

import React, { useState } from "react";
import { ContactRequest } from "@/lib/contact-requests";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Modal } from "@/components/ui/modal";
import {
  MessageSquare,
  Plus,
  Clock,
  CheckCircle2,
  AlertCircle,
  ExternalLink,
  Trash2,
  Phone,
  Tag,
  Calendar,
  Send,
} from "lucide-react";

interface CustomerInquiriesClientProps {
  initialRequests: ContactRequest[];
  userEmail: string;
  userName: string;
}

const STATUS_CONFIG: Record<
  ContactRequest["status"],
  { label: string; bg: string; text: string; border: string; icon: React.ElementType }
> = {
  NEW: {
    label: "قيد المراجعة الفنية",
    bg: "bg-amber-400/10",
    text: "text-amber-300",
    border: "border-amber-400/30",
    icon: Clock,
  },
  CONTACTED: {
    label: "تم التواصل الأولي",
    bg: "bg-blue-950/40",
    text: "text-blue-300",
    border: "border-blue-500/30",
    icon: Clock,
  },
  IN_PROGRESS: {
    label: "جاري المتابعة والترتيب",
    bg: "bg-blue-950/40",
    text: "text-blue-300",
    border: "border-blue-500/30",
    icon: Clock,
  },
  RESOLVED: {
    label: "تم الرد وتلبية الطلب",
    bg: "bg-emerald-950/40",
    text: "text-emerald-300",
    border: "border-emerald-500/30",
    icon: CheckCircle2,
  },
  ARCHIVED: {
    label: "مؤرشف ومغلق",
    bg: "bg-white/5",
    text: "text-slate-400",
    border: "border-white/10",
    icon: CheckCircle2,
  },
};

export function CustomerInquiriesClient({
  initialRequests,
  userName,
}: CustomerInquiriesClientProps) {
  const [requests, setRequests] = useState<ContactRequest[]>(initialRequests);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  // Form inputs
  const [phone, setPhone] = useState("");
  const [product, setProduct] = useState("");
  const [message, setMessage] = useState("");
  const [feedback, setFeedback] = useState<{ type: "success" | "error"; text: string } | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!phone.trim() || !message.trim()) {
      setFeedback({ type: "error", text: "يرجى كتابة رقم الهاتف والرسالة." });
      return;
    }

    setIsSubmitting(true);
    setFeedback(null);

    try {
      const res = await fetch("/api/account/requests", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          phone: phone.trim(),
          product: product.trim() || undefined,
          message: message.trim(),
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.message || "تعذر إرسال الاستفسار، يرجى المحاولة ثانية.");
      }

      setRequests((prev) => [data.data, ...prev]);
      setFeedback({ type: "success", text: "تم تسجيل استفسارك بنجاح في حسابك." });

      setPhone("");
      setProduct("");
      setMessage("");

      setTimeout(() => {
        setIsModalOpen(false);
        setFeedback(null);
      }, 1500);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "حدث خطأ غير متوقع.";
      setFeedback({ type: "error", text: msg });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("هل أنت متأكد من رغبتك في حذف هذا الاستفسار من حسابك؟")) return;

    setDeletingId(id);
    try {
      const res = await fetch(`/api/account/requests?id=${id}`, {
        method: "DELETE",
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.message || "تعذر الحذف.");
      }

      setRequests((prev) => prev.filter((r) => r.id !== id));
    } catch (err: unknown) {
      alert(err instanceof Error ? err.message : "فشل حذف الاستفسار.");
    } finally {
      setDeletingId(null);
    }
  };

  const formatDate = (iso: string) => {
    try {
      return new Date(iso).toLocaleDateString("ar-EG", {
        year: "numeric",
        month: "long",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      });
    } catch {
      return iso;
    }
  };

  const buildWhatsAppFollowUpUrl = (req: ContactRequest) => {
    const text = `السلام عليكم ورحمة الله، أتابع معكم استفساري المسجل برقم: #${req.id.slice(0, 8)} بخصوص: ${
      req.product || "طلب عطر واستشارة خاصة"
    }`;
    return `https://wa.me/201220086002?text=${encodeURIComponent(text)}`;
  };

  return (
    <div className="space-y-6 text-white text-start">
      {/* Header of Section */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white/[0.03] backdrop-blur-2xl p-6 rounded-3xl border border-amber-400/20 shadow-[0_8px_32px_0_rgba(0,0,0,0.5)]">
        <div>
          <div className="flex items-center gap-2">
            <MessageSquare className="h-5 w-5 text-amber-400" />
            <h2 className="text-xl font-black text-white font-arabic">
              سجل استفساراتي ومتابعة طلباتي
            </h2>
          </div>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            هنا تظهر جميع استفساراتك وطلبات الأسعار الخاصة بك، معزولة بأمان تام ولا يراها سواك.
          </p>
        </div>

        <Button
          onClick={() => setIsModalOpen(true)}
          variant="primary"
          size="md"
          className="gap-2 shadow-md font-bold shrink-0 self-start sm:self-center"
        >
          <Plus className="h-4 w-4" />
          إرسال استفسار جديد
        </Button>
      </div>

      {/* Requests List */}
      {requests.length === 0 ? (
        <div className="rounded-3xl border-2 border-dashed border-amber-400/30 bg-white/[0.02] p-8 sm:p-12 text-center space-y-4">
          <div className="inline-flex p-4 rounded-full bg-amber-400/10 text-amber-400 border border-amber-400/20">
            <MessageSquare className="h-8 w-8" />
          </div>
          <div className="max-w-md mx-auto space-y-1">
            <h3 className="text-lg font-bold text-white font-arabic">
              لا توجد استفسارات مسجلة حتى الآن
            </h3>
            <p className="text-sm text-slate-400 leading-relaxed">
              عندما تسأل عن أي عطر أو تركيبة خاصة، سيظهر طلبك وحالته هنا مباشرة لمتابعته مع الإدارة.
            </p>
          </div>
          <Button
            onClick={() => setIsModalOpen(true)}
            variant="outline"
            size="md"
            className="gap-2 font-bold"
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
                className="rounded-3xl border border-amber-400/20 bg-white/[0.03] backdrop-blur-2xl p-6 shadow-[0_8px_32px_0_rgba(0,0,0,0.5)] hover:border-amber-400/40 transition-all space-y-4"
              >
                {/* Top Bar: Reference ID & Status */}
                <div className="flex flex-wrap items-center justify-between gap-3 border-b border-white/10 pb-3">
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-xs font-bold bg-[#0D0F14] text-amber-300 px-3 py-1 rounded-xl border border-amber-400/20">
                      كود الطلب: #{req.id.slice(0, 12)}
                    </span>
                    <span className="text-xs text-slate-500 hidden sm:inline">•</span>
                    <div className="flex items-center gap-1 text-xs text-slate-400">
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
                    <div className="flex items-center gap-2 text-sm font-bold text-amber-300">
                      <Tag className="h-4 w-4 text-amber-400" />
                      <span>العطر أو المنتج المطلوب: {req.product}</span>
                    </div>
                  )}
                  <p className="text-sm sm:text-base text-slate-200 whitespace-pre-line bg-[#0D0F14] p-4 rounded-2xl border border-white/5 leading-relaxed">
                    {req.message}
                  </p>
                </div>

                {/* Footer Actions */}
                <div className="flex flex-wrap items-center justify-between gap-3 pt-2 text-xs">
                  <div className="flex items-center gap-2 text-slate-400">
                    <Phone className="h-3.5 w-3.5 text-amber-400" />
                    <span>رقم الاتصال:</span>
                    <span className="font-mono font-bold text-white" dir="ltr">
                      {req.phone}
                    </span>
                  </div>

                  <div className="flex items-center gap-2 ms-auto">
                    <a
                      href={buildWhatsAppFollowUpUrl(req)}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-gradient-to-r from-emerald-600 to-emerald-500 hover:from-emerald-500 hover:to-emerald-600 text-white rounded-xl font-bold text-xs transition-colors shadow-sm"
                    >
                      <ExternalLink className="h-3.5 w-3.5" />
                      متابعة بالواتساب
                    </a>

                    <button
                      type="button"
                      onClick={() => handleDelete(req.id)}
                      disabled={deletingId === req.id}
                      className="inline-flex items-center gap-1 px-3 py-2 text-red-400 hover:bg-red-500/10 rounded-xl font-semibold text-xs transition-colors border border-transparent hover:border-red-500/30"
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
          <p className="text-xs text-slate-400">
            أهلاً يا <span className="font-bold text-amber-300">{userName}</span>، استفسارك
            سيرتبط تلقائياً بحسابك الموثق لتتمكن من متابعته في أي وقت.
          </p>

          {feedback && (
            <div
              className={`p-3.5 rounded-xl text-xs sm:text-sm font-semibold flex items-center gap-2 ${
                feedback.type === "success"
                  ? "bg-emerald-950/40 text-emerald-300 border border-emerald-500/30"
                  : "bg-red-950/40 text-red-300 border border-red-500/30"
              }`}
            >
              {feedback.type === "success" ? (
                <CheckCircle2 className="h-4 w-4 shrink-0 text-emerald-400" />
              ) : (
                <AlertCircle className="h-4 w-4 shrink-0 text-red-400" />
              )}
              <span>{feedback.text}</span>
            </div>
          )}

          <div>
            <label className="block text-xs font-bold text-amber-200/90 mb-1">
              رقم هاتفك للتواصل (موبايل / واتساب) <span className="text-amber-400">*</span>
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
            <label className="block text-xs font-bold text-amber-200/90 mb-1">
              العطر أو المنتج المطلوب (اختياري)
            </label>
            <Input
              type="text"
              value={product}
              onChange={(e) => setProduct(e.target.value)}
              placeholder="مثال: عطر أمير العود، دهن عود كمبودي معتق، مسك الختام..."
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-amber-200/90 mb-1">
              تفاصيل استفسارك أو طلبك <span className="text-amber-400">*</span>
            </label>
            <textarea
              required
              rows={4}
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="اكتب استفسارك هنا بكل سهولة، وسيتواصل معك خبير العطور المختص فوراً..."
              className="w-full rounded-xl border border-amber-400/30 bg-[#0D0F14] p-3.5 text-sm text-white placeholder:text-slate-500 focus:border-amber-400 focus:outline-none focus:ring-2 focus:ring-amber-400/20"
            />
          </div>

          <div className="flex items-center justify-end gap-2 pt-3 border-t border-white/10">
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
              className="gap-2 font-black"
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
