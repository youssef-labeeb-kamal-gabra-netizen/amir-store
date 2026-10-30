"use client";

import React, { useState } from "react";
import { Input, Textarea } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Toast } from "@/components/ui/toast";
import { Send, MessageCircle, CheckCircle2, RotateCcw, Sparkles } from "lucide-react";

export interface ContactFormProps {
  initialProductSlug?: string;
  whatsappNumber?: string;
}

interface SubmittedData {
  name: string;
  phone: string;
  product?: string;
  message: string;
  requestId: string;
}

export function ContactForm({ initialProductSlug, whatsappNumber = "01220086002" }: ContactFormProps) {
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [product, setProduct] = useState(initialProductSlug || "");
  const [message, setMessage] = useState("");

  const [isLoading, setIsLoading] = useState(false);
  const [status, setStatus] = useState<"idle" | "success" | "error">("idle");
  const [errorMessage, setErrorMessage] = useState("");
  const [submittedData, setSubmittedData] = useState<SubmittedData | null>(null);

  const cleanWhatsApp = whatsappNumber.replace(/[^0-9]/g, "");
  const formattedWhatsApp = cleanWhatsApp.startsWith("0") ? `2${cleanWhatsApp}` : cleanWhatsApp;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !phone.trim() || !message.trim()) {
      setStatus("error");
      setErrorMessage("يرجى ملء جميع الحقول الإلزامية (الاسم، رقم الهاتف، والرسالة).");
      return;
    }

    setIsLoading(true);
    setStatus("idle");
    setErrorMessage("");

    const payload = {
      name: name.trim(),
      phone: phone.trim(),
      email: email.trim() || undefined,
      product: product.trim() || undefined,
      message: message.trim(),
    };

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "حدث خطأ أثناء إرسال الطلب.");
      }

      setSubmittedData({
        ...payload,
        requestId: data.requestId || `REQ-${Date.now().toString(36)}`,
      });
      setStatus("success");
      setName("");
      setPhone("");
      setEmail("");
      setMessage("");
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "تعذر إرسال طلبك حالياً، يرجى المحاولة لاحقاً أو التواصل عبر واتساب.";
      setStatus("error");
      setErrorMessage(msg);
    } finally {
      setIsLoading(false);
    }
  };

  const handleReset = () => {
    setStatus("idle");
    setSubmittedData(null);
  };

  // WhatsApp Alert URL for store notification
  const whatsappAlertUrl = submittedData
    ? `https://wa.me/${formattedWhatsApp}?text=${encodeURIComponent(
        `السلام عليكم، قمت بإرسال طلب استفسار جديد عبر موقع أمير ستور:\n\n` +
          `• الاسم: ${submittedData.name}\n` +
          `• الهاتف: ${submittedData.phone}\n` +
          (submittedData.product ? `• العطر أو المنتج المطلوب: ${submittedData.product}\n` : "") +
          `• تفاصيل الاستفسار: ${submittedData.message}\n` +
          `• رقم المرجع: ${submittedData.requestId}`
      )}`
    : "";

  return (
    <div className="w-full text-start">
      {status === "success" && submittedData ? (
        <div className="space-y-6 animate-in fade-in zoom-in-95 duration-300">
          <div className="p-6 rounded-2xl bg-amber-400/10 border border-amber-400/30 space-y-3">
            <div className="flex items-center gap-2 text-amber-300 font-bold">
              <CheckCircle2 className="h-6 w-6 text-amber-400" />
              <span className="text-lg font-arabic">تم استلام طلبكم واستفساركم بنجاح!</span>
            </div>
            <p className="text-sm text-slate-300 leading-relaxed">
              شكراً لتواصلكم مع دار أمير ستور للعطور. سيقوم مستشارنا العطري بمراجعة تفاصيل استفساركم والتواصل معكم عبر الهاتف أو واتساب في أقرب وقت.
            </p>
            <div className="pt-2">
              <span className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-[#0D0F14] text-amber-300 font-mono text-xs font-bold border border-amber-400/30">
                <Sparkles className="h-3.5 w-3.5 text-amber-400" />
                <span>رقم المرجع:</span>
                <span>{submittedData.requestId.slice(0, 13)}</span>
              </span>
            </div>
          </div>

          {/* Direct WhatsApp Immediate Confirmation Action */}
          <div className="p-5 rounded-2xl bg-emerald-950/30 border border-emerald-500/40 space-y-3 shadow-md">
            <div className="flex items-center gap-2 text-white font-extrabold text-sm sm:text-base">
              <MessageCircle className="h-5 w-5 text-[#25D366] shrink-0" />
              <span>هل تود تنبيه المستشار العطري فوراً على هاتفه؟</span>
            </div>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
              تم حفظ طلبك في قاعدة بياناتنا. إذا كنت مستعجلاً، اضغط على الزر بالأسفل ليفتح تطبيق واتساب على هاتفك مع ملخص استفسارك جاهزاً للإرسال بضغطة واحدة:
            </p>
            <a
              href={whatsappAlertUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2.5 w-full rounded-xl bg-gradient-to-r from-emerald-600 to-emerald-500 hover:from-emerald-500 hover:to-emerald-600 text-white py-3.5 px-4 font-black text-sm sm:text-base shadow-md transition-all active:scale-95 cursor-pointer"
            >
              <MessageCircle className="h-5 w-5" />
              <span>تأكيد المراسلة عبر واتساب فوراً ({whatsappNumber})</span>
            </a>
          </div>

          <div className="pt-2 flex justify-end">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={handleReset}
              className="text-xs font-semibold"
            >
              <RotateCcw className="h-3.5 w-3.5 ms-1.5" />
              إرسال استفسار جديد
            </Button>
          </div>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-5 text-start">
          {status === "error" && (
            <Toast
              type="error"
              message={errorMessage}
              onClose={() => setStatus("idle")}
            />
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input
              label="الاسم بالكامل"
              required
              placeholder="مثال: م. أحمد عبد الله"
              value={name}
              onChange={(e) => setName(e.target.value)}
              disabled={isLoading}
            />
            <Input
              label="رقم الهاتف / واتساب"
              required
              type="tel"
              placeholder="مثال: 010xxxxxxxx"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              disabled={isLoading}
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input
              label="البريد الإلكتروني (اختياري)"
              type="email"
              placeholder="name@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={isLoading}
            />
            <Input
              label="العطر أو دهن العود المطلوب الاستفسار عنه"
              placeholder="مثال: عطر أمير العود الملكي / دهن عود تراد"
              value={product}
              onChange={(e) => setProduct(e.target.value)}
              disabled={isLoading}
            />
          </div>

          <Textarea
            label="تفاصيل الاستفسار أو الطلب الخاص"
            required
            placeholder="اكتب استفسارك، المناسبة، الحجم المطلوب، أو تفاصيل الإهداء والتوصيل..."
            rows={4}
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            disabled={isLoading}
          />

          <Button
            type="submit"
            variant="primary"
            size="lg"
            isLoading={isLoading}
            className="w-full sm:w-auto font-black px-8 py-3.5 rounded-xl shadow-lg"
          >
            <Send className="h-4 w-4 ms-2" />
            إرسال الطلب والاستفسار
          </Button>
        </form>
      )}
    </div>
  );
}
