"use client";

import React, { useState, useMemo, useEffect } from "react";
import { Product, Category } from "@/types/product";
import { ProductCard } from "@/components/products/product-card";
import { EmptyState } from "@/components/ui/empty-state";
import { GsapReveal } from "@/components/motion/gsap-reveal";
import { Search, ArrowUpDown, Sparkles } from "lucide-react";

interface ProductCatalogViewProps {
  products: Product[];
  categories: Category[];
  initialCategorySlug?: string;
}

const POPULAR_NOTES = [
  "عود كمبودي",
  "زعفران كشميري",
  "عنبر أشهب",
  "ورد طائفي",
  "توباكو وفانيليا",
  "مسك أبيض",
  "بخور طبيعي",
];

export function ProductCatalogView({
  products,
  categories,
  initialCategorySlug = "",
}: ProductCatalogViewProps) {
  const [selectedCategory, setSelectedCategory] = useState(initialCategorySlug);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeNote, setActiveNote] = useState("");
  const [sortOption, setSortOption] = useState<
    "newest" | "price_asc" | "price_desc" | "name_asc" | "name_desc"
  >("newest");

  useEffect(() => {
    setSelectedCategory(initialCategorySlug || "");
  }, [initialCategorySlug]);

  const filteredProducts = useMemo(() => {
    let list = products.filter((p) => p.published);

    if (selectedCategory) {
      const cat = categories.find((c) => c.slug === selectedCategory || c.id === selectedCategory);
      if (cat) {
        list = list.filter((p) => p.categoryId === cat.id);
      }
    }

    if (activeNote) {
      const noteLower = activeNote.toLowerCase();
      list = list.filter(
        (p) =>
          p.name.toLowerCase().includes(noteLower) ||
          p.description.toLowerCase().includes(noteLower) ||
          p.shortDescription.toLowerCase().includes(noteLower) ||
          p.specifications.some((s) => s.value.toLowerCase().includes(noteLower))
      );
    }

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      list = list.filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          p.description.toLowerCase().includes(q) ||
          p.shortDescription.toLowerCase().includes(q) ||
          (p.model && p.model.toLowerCase().includes(q)) ||
          p.specifications.some((s) => s.value.toLowerCase().includes(q))
      );
    }

    if (sortOption === "price_asc") {
      list.sort((a, b) => (a.price || 0) - (b.price || 0));
    } else if (sortOption === "price_desc") {
      list.sort((a, b) => (b.price || 0) - (a.price || 0));
    } else if (sortOption === "name_asc") {
      list.sort((a, b) => a.name.localeCompare(b.name, "ar"));
    } else if (sortOption === "name_desc") {
      list.sort((a, b) => b.name.localeCompare(a.name, "ar"));
    } else {
      list.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    }

    return list;
  }, [products, categories, selectedCategory, activeNote, searchQuery, sortOption]);

  const activeCategory = categories.find((c) => c.slug === selectedCategory || c.id === selectedCategory);

  return (
    <div className="space-y-8 text-start">
      {/* Title & Description Header */}
      <div className="space-y-3 border-b border-brand-neutral-200 pb-6">
        <span className="text-xs font-bold text-amber-700 tracking-wider uppercase font-serif">
          HAUTE PARFUMERIE & PURE OUD
        </span>
        <h1 className="text-2xl sm:text-4xl font-extrabold text-brand-green-950 tracking-tight font-arabic">
          {activeCategory ? activeCategory.name : "مجموعة العطور والعود الفاخر"}
        </h1>
        <p className="text-sm sm:text-base text-brand-neutral-500 max-w-3xl leading-relaxed">
          {activeCategory
            ? activeCategory.description
            : "تصفح أندر أدهان العود الطبيعية، العطور الشرقية والفرنسية الملكية، والمسك والبخور الفاخر لدى متجر أمير ستور. نضمن لك ثباتاً استثنائياً ونقاءً أصلياً 100% مع إمكانية المعاينة قبل الدفع."}
        </p>
      </div>

      {/* Category Badges Filter Bar */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 pt-1 scrollbar-none -mx-4 px-4 sm:mx-0 sm:px-0">
        <button
          type="button"
          onClick={() => {
            setSelectedCategory("");
            setActiveNote("");
          }}
          className={`rounded-full px-5 py-2.5 text-xs sm:text-sm font-bold whitespace-nowrap transition-all active:scale-95 cursor-pointer btn-touch flex items-center gap-1.5 shrink-0 ${
            !selectedCategory
              ? "bg-brand-green-800 text-white shadow-md ring-2 ring-amber-400/40"
              : "bg-white border border-brand-neutral-200 text-brand-neutral-700 hover:border-brand-green-800 hover:bg-brand-green-50/40"
          }`}
        >
          <span>✨</span>
          <span>كافة المعروضات ({products.filter((p) => p.published).length})</span>
        </button>
        {categories.map((cat) => {
          const isSelected = selectedCategory === cat.slug || selectedCategory === cat.id;
          const count = products.filter((p) => p.categoryId === cat.id && p.published).length;

          const icon =
            cat.slug === "pure-oud-oils" ? "🪵" :
            cat.slug === "oriental-perfumes" ? "👑" :
            cat.slug === "french-perfumes" ? "🌹" :
            cat.slug === "musk-and-amber" ? "🌸" :
            cat.slug === "bakhoor-and-incense" ? "💨" : "🎁";

          return (
            <button
              key={cat.id}
              type="button"
              onClick={() => setSelectedCategory(cat.slug)}
              className={`rounded-full px-5 py-2.5 text-xs sm:text-sm font-bold whitespace-nowrap transition-all active:scale-95 cursor-pointer btn-touch flex items-center gap-1.5 shrink-0 ${
                isSelected
                  ? "bg-brand-green-800 text-white shadow-md ring-2 ring-amber-400/40"
                  : "bg-white border border-brand-neutral-200 text-brand-neutral-700 hover:border-brand-green-800 hover:bg-brand-green-50/40"
              }`}
            >
              <span>{icon}</span>
              <span>{cat.name} ({count})</span>
            </button>
          );
        })}
      </div>

      {/* Scent Notes Quick Pills Bar */}
      <div className="flex items-center gap-1.5 flex-wrap text-xs pt-1">
        <span className="text-brand-neutral-400 font-bold flex items-center gap-1 me-1 text-[11px]">
          <Sparkles className="h-3 w-3 text-amber-500" />
          <span>أبرز النوتات:</span>
        </span>
        {POPULAR_NOTES.map((note) => (
          <button
            key={note}
            type="button"
            onClick={() => setActiveNote(activeNote === note ? "" : note)}
            className={`px-3 py-1 rounded-full text-[11px] font-bold border transition-all cursor-pointer ${
              activeNote === note
                ? "bg-amber-100 border-amber-400 text-amber-900 shadow-2xs"
                : "bg-white/80 border-brand-neutral-200 text-brand-neutral-600 hover:border-amber-300"
            }`}
          >
            {note}
            {activeNote === note && " ✕"}
          </button>
        ))}
      </div>

      {/* Search & Sort Controls Bar */}
      <div className="flex flex-col sm:flex-row gap-3 items-stretch sm:items-center justify-between">
        <div className="relative flex-1 max-w-lg">
          <Search className="absolute start-3.5 top-3.5 h-4 w-4 text-brand-neutral-400" />
          <input
            type="text"
            placeholder="ابحث باسم العطر، نوتات الرائحة، أو الحجم..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full rounded-full border border-brand-neutral-200 bg-white ps-10 pe-10 py-3 text-sm text-brand-neutral-900 placeholder:text-brand-neutral-400 focus:outline-none focus:border-brand-green-800 focus:ring-4 focus:ring-brand-green-500/10 shadow-xs transition-all"
          />
          {searchQuery && (
            <button
              type="button"
              onClick={() => setSearchQuery("")}
              className="absolute end-3.5 top-3 h-5 w-5 rounded-full bg-brand-neutral-200 hover:bg-brand-neutral-300 text-brand-neutral-700 flex items-center justify-center text-xs font-bold transition-colors cursor-pointer"
              title="مسح البحث"
              aria-label="مسح البحث"
            >
              ✕
            </button>
          )}
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <ArrowUpDown className="h-4 w-4 text-brand-neutral-500 shrink-0" />
          <select
            value={sortOption}
            onChange={(e) =>
              setSortOption(
                e.target.value as "newest" | "price_asc" | "price_desc" | "name_asc" | "name_desc"
              )
            }
            className="w-full sm:w-auto rounded-xl border border-brand-neutral-300 bg-white px-3 py-2.5 text-xs sm:text-sm font-semibold text-brand-neutral-800 focus:outline-none focus:ring-2 focus:ring-brand-green-600 shadow-sm cursor-pointer"
          >
            <option value="newest">الترتيب: الأحدث أولاً</option>
            <option value="price_asc">السعر: من الأقل للأعلى</option>
            <option value="price_desc">السعر: من الأعلى للأقل</option>
            <option value="name_asc">الترتيب: الاسم أ - ي</option>
            <option value="name_desc">الترتيب: الاسم ي - أ</option>
          </select>
        </div>
      </div>

      {/* Results Count Banner */}
      <div className="text-xs text-brand-neutral-500">
        يتم عرض <strong>{filteredProducts.length}</strong> من إجمالي العطور المتوفرة
      </div>

      {/* Grid of Products or Empty State */}
      {filteredProducts.length > 0 ? (
        <GsapReveal>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 pt-2">
            {filteredProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </GsapReveal>
      ) : (
        <EmptyState
          title="لم نتمكن من العثور على عطور مطابقة"
          description="لا توجد نتائج تطابق معايير البحث أو النوتة العطرية المحددة. يمكنك تصفح كافة العطور أو مراسلتنا عبر واتساب لطلب تركيبة عطرية خاصة."
          actionLabel="عرض كافة العطور"
          onAction={() => {
            setSelectedCategory("");
            setSearchQuery("");
            setActiveNote("");
          }}
        />
      )}
    </div>
  );
}
