-- Seed initial authentic business data for LKL
INSERT INTO categories (id, name, slug, description, icon_name, sort_order, active)
VALUES
  ('cat-1', 'محركات ومجموعات الرش', 'spray-motors', 'محركات رش زراعية عالية الكفاءة لمكافحة الآفات ورش المحاصيل.', 'SprayCan', 1, true),
  ('cat-2', 'طلمبات ومحركات المياه', 'water-pumps', 'طلمبات سحب ورفع مياه الري لمختلف الأعماق والمسافات.', 'Waves', 2, true),
  ('cat-3', 'محركات الديزل', 'diesel-motors', 'محركات ديزل زراعية شديدة التحمل لتشغيل الطلمبات والمولدات.', 'Cpu', 3, true),
  ('cat-4', 'معدات وشبكات الري', 'irrigation-equipment', 'مستلزمات شبكات الري الحديث والرش والتنقيط لترشيد استهلاك المياه.', 'Pipette', 4, true),
  ('cat-5', 'الأدوات والآلات الزراعية', 'agricultural-tools', 'آلات ومعدات خدمة الأرض وتجهيز التربة والحصاد للمشاريع والمزارع.', 'Tractor', 5, true),
  ('cat-6', 'قطع الغيار الأصلية', 'spare-parts', 'قطع غيار معتمدة لكافة المحركات والطلمبات لضمان استمرارية التشغيل.', 'Wrench', 6, true)
ON CONFLICT (id) DO NOTHING;

INSERT INTO site_settings (key, value)
VALUES
  ('business_info', '{"name": "شركة لبيب كمال للأدوات والآلات الزراعية", "brand": "LKL", "slogan": "الجودة • الثقة • الخدمة المتميزة", "location": "الزقازيق — الشرقية — مصر", "addressPhrase": "البداية، طريق مصر الزراعي"}'::jsonb)
ON CONFLICT (key) DO NOTHING;
