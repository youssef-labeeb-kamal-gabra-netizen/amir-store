-- Seed initial authentic business data for Ameer Store (أمير ستور)
INSERT INTO categories (id, name, slug, description, icon_name, sort_order, active)
VALUES
  ('cat-1', 'دهن العود والزيوت النقية', 'pure-oud-oils', 'أندر وأفخم أدهان العود الطبيعية الصافية من غابات كلمنتان وكمبوديا وتراد.', 'Sparkles', 1, true),
  ('cat-2', 'عطور شرقية ملكية', 'oriental-perfumes', 'عطور شرقية فاخرة تمزج بين أصالة العود والعنبر وسحر الورد الطائفي والزعفران.', 'Flame', 2, true),
  ('cat-3', 'عطور فرنسية حصرية', 'french-perfumes', 'توليفات فرنسية راقية وعصرية بنفحات الفانيليا، التوباكو، والجلود والأخشاب النادرة.', 'Heart', 3, true),
  ('cat-4', 'المسك والعنبر الفاخر', 'musk-and-amber', 'مسك النقاء والحرير الأبيض والعنبر الرمادي الملكي لنعومة وانتعاش يدوم طويلاً.', 'Wind', 4, true),
  ('cat-5', 'بخور ومعمول ودخون', 'bakhoor-and-incense', 'كسر عود طبيعي ودخون معطر بأجود الزيوت لتعطير المجالس والمنازل بأبهى الروائح.', 'Package', 5, true),
  ('cat-6', 'باقات وهدايا العطور', 'perfume-gift-sets', 'صناديق إهداء ملكية فاخرة مجهزة بأرقى العطور والمباخر لتليق بأحبائك وكبار الشخصيات.', 'Gift', 6, true)
ON CONFLICT (id) DO NOTHING;

INSERT INTO site_settings (key, value)
VALUES
  ('business_info', '{"name": "أمير ستور للعطور والعود الفاخر", "brand": "AMIR STORE", "slogan": "عطور فاخرة • ثبات وأناقة لا تُنسى", "location": "الزقازيق — الشرقية — مصر", "addressPhrase": "معرض أمير ستور للعطور الفاخرة، الزقازيق، محافظة الشرقية"}'::jsonb)
ON CONFLICT (key) DO NOTHING;
