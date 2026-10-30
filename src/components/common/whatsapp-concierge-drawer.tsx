"use client";

import React, { useState } from "react";
import { MessageSquare, X, Send, Sparkles, Shield, Clock, PhoneCall } from "lucide-react";

const OFFICIAL_PHONE = "201220086002";

const CONSULTATION_PROMPTS = [
  "أهلاً بكم في أمير ستور، أود استشارة خبير العطور لاختيار العطر الأنسب لذوقي ومناسباتي الخاصة.",
  "السلام عليكم، أود الاستفسار عن توفر دهن العود المعتق وأنواع البخور الملكي المتوفرة لديكم.",
  "مرحباً، أود تفصيل صندوق هدايا ملكي مخصص يحتوي على 3 عطور من اختياركم الفاخر.",
  "أهلاً أمير ستور، أود الاستفسار عن مدة التوصيل وتأكيد شحن طلبي المباشر.",
];

export function WhatsAppConciergeDrawer() {
  const [isOpen, setIsOpen] = useState(false);
  const [customMessage, setCustomMessage] = useState("");

  const handleSend = (text: string) => {
    const finalMsg = text.trim() || CONSULTATION_PROMPTS[0];
    const encoded = encodeURIComponent(finalMsg);
    const url = `https://wa.me/${OFFICIAL_PHONE}?text=${encoded}`;
    window.open(url, "_blank", "noopener,noreferrer");
    setIsOpen(false);
  };

  return (
    <>
      {/* Floating Action Pill */}
      <button
        onClick={() => setIsOpen(true)}
        aria-label="فتح صالون الاستشارات العطرية عبر واتساب"
        className="fixed bottom-6 left-6 z-50 flex items-center gap-2.5 px-4 py-3 rounded-full bg-gradient-to-r from-emerald-600 via-emerald-700 to-teal-800 text-white shadow-2xl border border-gold/40 hover:scale-105 active:scale-95 transition-all duration-300 group"
      >
        <span className="relative flex h-3 w-3">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-gold-200 opacity-75"></span>
          <span className="relative inline-flex rounded-full h-3 w-3 bg-gold-400"></span>
        </span>
        <MessageSquare className="w-5 h-5 text-gold-200" />
        <span className="text-xs sm:text-sm font-semibold tracking-wide">
          استشارة خبير العطور <span className="text-gold-300">واتساب</span>
        </span>
      </button>

      {/* Drawer Overlay Backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm transition-opacity duration-300"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Slide-over Drawer (390px optimized) */}
      <div
        className={`fixed inset-y-0 left-0 z-50 w-full max-w-md bg-obsidian-950 border-r border-gold/30 shadow-2xl flex flex-col justify-between transform transition-transform duration-500 ease-sovereign ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        {/* Drawer Header */}
        <div className="p-6 border-b border-gold/20 flex items-center justify-between bg-obsidian-900/80">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-full p-0.5 bg-gradient-to-tr from-gold-600 via-gold-400 to-gold-200 shadow-md">
              <div className="w-full h-full rounded-full bg-obsidian-950 flex items-center justify-center text-xl">
                👑
              </div>
            </div>
            <div>
              <h3 className="font-serif font-bold text-lg text-white">أمير ستور · كونسيرج العطور</h3>
              <p className="text-xs text-gold-300 tracking-wider">صالون الاستشارات العطرية الملكي المباشر</p>
            </div>
          </div>
          <button
            onClick={() => setIsOpen(false)}
            aria-label="إغلاق الدرج"
            className="w-9 h-9 rounded-full bg-obsidian-900 border border-gold/20 flex items-center justify-center text-gray-400 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Drawer Body */}
        <div className="p-6 flex-1 overflow-y-auto space-y-6">
          {/* Status Badge */}
          <div className="p-4 rounded-2xl bg-emerald-950/40 border border-emerald-500/30 flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
              <span className="text-xs font-semibold text-emerald-200">الخبير العطري متاح للرد الفوري</span>
            </div>
            <div className="flex items-center gap-1 text-[11px] text-gray-400">
              <Clock className="w-3.5 h-3.5 text-gold-400" />
              <span>معدل الرد: 5 دقائق</span>
            </div>
          </div>

          {/* Perfumer Intro */}
          <div className="p-4 rounded-2xl bg-obsidian-900/60 border border-gold/15">
            <p className="text-xs text-gray-300 leading-relaxed">
              يسعدنا في <strong className="text-gold-300">أمير ستور</strong> تقديم خدمة الاستشارة الخاصة مجاناً. سواء كنت تبحث عن تركيبة عطرية تناسب حضورك، أو هدية تليق بأحبائك، خبراؤنا معك خطوة بخطوة.
            </p>
          </div>

          {/* Quick Consultation Chips */}
          <div>
            <h4 className="text-xs font-bold text-gold-200 uppercase tracking-widest mb-3 flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-gold-400" />
              استشارات شائعة (اضغط للإرسال الفوري):
            </h4>
            <div className="space-y-2.5">
              {CONSULTATION_PROMPTS.map((prompt, idx) => (
                <button
                  key={idx}
                  onClick={() => handleSend(prompt)}
                  className="w-full text-right p-3.5 rounded-xl bg-obsidian-900 hover:bg-gold/10 border border-gold/15 hover:border-gold/40 text-xs text-gray-200 hover:text-gold-200 transition-all duration-200 flex items-center justify-between group"
                >
                  <span className="line-clamp-2">{prompt}</span>
                  <Send className="w-4 h-4 text-gold-400 opacity-0 group-hover:opacity-100 transition-opacity shrink-0 mr-2" />
                </button>
              ))}
            </div>
          </div>

          {/* Custom Message Textarea */}
          <div>
            <label htmlFor="custom-msg" className="block text-xs font-bold text-gray-300 mb-2">
              أو اكتب استفسارك الخاص بالتفصيل:
            </label>
            <textarea
              id="custom-msg"
              rows={3}
              value={customMessage}
              onChange={(e) => setCustomMessage(e.target.value)}
              placeholder="اكتب استفسارك هنا (مثال: أبحث عن عطر عود ناعم للمناسبات الرسمية)..."
              className="w-full p-3.5 rounded-xl bg-obsidian-900 border border-gold/20 text-white text-xs placeholder:text-gray-500 focus:outline-none focus:border-gold-400 transition-colors"
            />
          </div>
        </div>

        {/* Drawer Footer */}
        <div className="p-6 border-t border-gold/20 bg-obsidian-900/80 space-y-3">
          <button
            onClick={() => handleSend(customMessage)}
            className="w-full py-3.5 px-6 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-700 hover:from-emerald-500 hover:to-teal-600 text-white font-bold text-sm shadow-gold-glow flex items-center justify-center gap-2 transition-all active:scale-95"
          >
            <PhoneCall className="w-4 h-4 text-gold-200" />
            <span>بدء المحادثة على واتساب (01220086002)</span>
          </button>
          <div className="flex items-center justify-center gap-1.5 text-[11px] text-gray-400">
            <Shield className="w-3.5 h-3.5 text-gold-400" />
            <span>محادثة مشفرة وآمنة عبر الرقم الرسمي المعتمد لأمير ستور</span>
          </div>
        </div>
      </div>
    </>
  );
}

export default WhatsAppConciergeDrawer;
