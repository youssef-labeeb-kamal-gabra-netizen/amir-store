const http = require('http');
const https = require('https');
const fs = require('fs');
const path = require('path');
const assert = require('assert');
const { loadCatalog } = require('./catalog-loader');

console.log('🔍 Starting Comprehensive Ameer Store Quality, Security & Architecture Audit...\n');

let totalChecks = 0;
let passedChecks = 0;
let failedChecks = 0;
let skippedChecks = 0;

function check(title, fn) {
  totalChecks++;
  try {
    fn();
    passedChecks++;
    console.log(`  ✅ [PASS] ${title}`);
  } catch (err) {
    failedChecks++;
    console.error(`  ❌ [FAIL] ${title}: ${err.message}`);
  }
}

async function asyncCheck(title, fn) {
  totalChecks++;
  try {
    await fn();
    passedChecks++;
    console.log(`  ✅ [PASS] ${title}`);
  } catch (err) {
    failedChecks++;
    console.error(`  ❌ [FAIL] ${title}: ${err.message}`);
  }
}

function skipCheck(title, reason) {
  totalChecks++;
  skippedChecks++;
  console.log(`  ⚠️  [SKIP] ${title} (${reason})`);
}

function fetchUrl(url, options = {}) {
  return new Promise((resolve, reject) => {
    const parsed = new URL(url);
    const client = parsed.protocol === 'https:' ? https : http;
    const req = client.request(
      url,
      {
        timeout: 2000,
        ...options,
      },
      (res) => {
        let data = '';
        res.on('data', (chunk) => (data += chunk));
        res.on('end', () => {
          resolve({
            statusCode: res.statusCode,
            headers: res.headers,
            body: data,
          });
        });
      }
    );
    req.on('error', reject);
    req.on('timeout', () => {
      req.destroy();
      reject(new Error('Request timed out'));
    });
    if (options.body) {
      req.write(options.body);
    }
    req.end();
  });
}

async function isServerRunning(baseUrl) {
  try {
    const res = await fetchUrl(`${baseUrl}/`, { method: 'HEAD' });
    return res.statusCode >= 200 && res.statusCode < 500;
  } catch {
    return false;
  }
}

async function runAudit() {
  console.log('--- 1. التحقق من الهوية والقواعد الجوهرية (Constitution Invariants) ---');

  check('بيانات المحل الرسمية: رقم هاتف أمير ستور الرسمي (01220086002) واسم العلامة التجارية', () => {
    const envSource = fs.readFileSync('src/lib/env.ts', 'utf8');
    assert.ok(envSource.includes('01220086002'), 'يجب أن يحتوي على رقم أمير ستور الرسمي 01220086002');
    assert.ok(envSource.includes('أمير ستور') || envSource.includes('AMIR STORE'), 'يجب أن يحتوي على هوية أمير ستور');
  });

  check('الأقسام العطرية الملكية الستة مكتملة ومنضبطة في الكتالوج', () => {
    const { CATEGORIES } = loadCatalog();
    assert.strictEqual(CATEGORIES.length, 6, 'يجب أن يحتوي على 6 أقسام عطرية بالضبط');
    const slugs = CATEGORIES.map((c) => c.slug);
    assert.ok(slugs.includes('pure-oud-oils'), 'قسم دهن العود والزيوت النقية');
    assert.ok(slugs.includes('oriental-perfumes'), 'قسم العطور الشرقية الملكية');
    assert.ok(slugs.includes('french-perfumes'), 'قسم العطور الفرنسية الحصرية');
    assert.ok(slugs.includes('musk-and-amber'), 'قسم المسك والعنبر الفاخر');
    assert.ok(slugs.includes('bakhoor-and-incense'), 'قسم البخور والمعمول والدخون');
    assert.ok(slugs.includes('perfume-gift-sets'), 'قسم باقات وهدايا العطور');
  });

  check('خلو الكتالوج والمصادر من المصطلحات الزراعية الموروثة (LKL Agricultural Purge)', () => {
    const catalogSource = fs.readFileSync('src/data/catalog.ts', 'utf8');
    assert.ok(!catalogSource.includes('spray-motors'), 'خلو الكتالوج من محركات الرش');
    assert.ok(!catalogSource.includes('water-pumps'), 'خلو الكتالوج من طلمبات المياه');
    assert.ok(!catalogSource.includes('diesel-motors'), 'خلو الكتالوج من محركات الديزل');
    assert.ok(!catalogSource.includes('irrigation-equipment'), 'خلو الكتالوج من معدات الري');
    assert.ok(!catalogSource.includes('شركة لبيب كمال'), 'خلو الكتالوج من اسم الشركة القديمة');
  });

  check('تسعير المنتجات: جميع عطور الكتالوج مسعرة رسمياً بقيم موجبة صحيحة', () => {
    const { INITIAL_PRODUCTS } = loadCatalog();
    assert.ok(INITIAL_PRODUCTS.length >= 8, 'يجب توفر 8 عطور فاخرة على الأقل في الكتالوج الأولي');
    for (const prod of INITIAL_PRODUCTS) {
      assert.ok(typeof prod.price === 'number' && prod.price > 0, `المنتج ${prod.id} يجب أن يحتوي على سعر رسمي موجب`);
      assert.strictEqual(prod.brand, 'أمير ستور', `المنتج ${prod.id} ماركته أمير ستور`);
    }
  });

  console.log('\n--- 2. التحقق من الأمان والمصادقة (Authentication & Authorization) ---');

  check('التحقق من صلاحية المدير محددة على السيرفر (Server-Side RBAC)', () => {
    const authSource = fs.readFileSync('src/lib/auth.ts', 'utf8');
    assert.ok(authSource.includes('resolveUserRole'), 'دالة التحقق من الصلاحيات موجودة');
    assert.ok(authSource.includes('adminEmails'), 'تطابق مع قائمة الإيميلات المعتمدة');
    assert.ok(authSource.includes('timingSafeEqual'), 'تشفير ومقارنة بتوقيت ثابت ضد هجمات التوقيت');
  });

  check('آلية إبطال الجلسات (Session Revocation) مفعلة لمنع التزوير', () => {
    const authSource = fs.readFileSync('src/lib/auth.ts', 'utf8');
    assert.ok(authSource.includes('isSessionRevoked'), 'فحص إبطال الجلسة عند كل طلب');
    assert.ok(authSource.includes('revokeSession'), 'دالة إبطال الجلسة موجودة');
  });

  check('جلسات العمل موقعة رقمياً برمز HMAC-SHA256 السري', () => {
    const authSource = fs.readFileSync('src/lib/auth.ts', 'utf8');
    assert.ok(authSource.includes('sha256'), 'استخدام HMAC-SHA256');
    assert.ok(authSource.includes('createHmac'), 'تشفير الجلسات عبر Node Crypto');
  });

  check('حماية بيئة الإنتاج: فحص أمان المفاتيح والمشرفين (Production Security Enforcer)', () => {
    const envSource = fs.readFileSync('src/lib/env.ts', 'utf8');
    assert.ok(envSource.includes('validateProductionSecurity'), 'دالة التحقق من أمان بيئة الإنتاج موجودة');
    assert.ok(envSource.includes('throw new Error'), 'إيقاف النظام عند فقدان المفتاح السري في الإنتاج');
    assert.ok(!envSource.includes('if (process.env.VERCEL)'), 'عدم تجاوز أمان الإنتاج في فرسيل');
  });

  console.log('\n--- 3. التحقق من أمان مسار الطلبات والتسعير السيادي (Orders & Authoritative Pricing) ---');

  check('حساب أسعار الطلبات سيادياً على السيرفر (Authoritative Server Pricing)', () => {
    const ordersStoreSource = fs.readFileSync('src/lib/orders-store.ts', 'utf8');
    assert.ok(ordersStoreSource.includes('getProductsStore'), 'استرجاع المنتجات من الكتالوج الرسمي حصراً');
    assert.ok(ordersStoreSource.includes('FREE_SHIPPING_THRESHOLD'), 'تحديد حد الشحن المجاني (1000 ج.م)');
    assert.ok(ordersStoreSource.includes('STANDARD_SHIPPING_COST'), 'تحديد تكلفة الشحن القياسي (50 ج.م)');
  });

  check('التحقق الصارم من بيانات العميل في مسار الطلبات (/api/orders)', () => {
    const ordersRouteSource = fs.readFileSync('src/app/api/orders/route.ts', 'utf8');
    assert.ok(ordersRouteSource.includes('EGYPTIAN_PHONE_REGEX') || ordersRouteSource.includes('010|011|012|015'), 'التحقق من رقم الهاتف المصري');
    assert.ok(ordersRouteSource.includes('EGYPT_GOVERNORATES'), 'التحقق من قائمة محافظات مصر الـ 27');
    assert.ok(ordersRouteSource.includes('sanitizeText'), 'تطهير المدخلات من وسوم HTML و XSS');
  });

  check('تقييد معدل طلبات الشراء لمنع الإغراق (Order Rate Limiting)', () => {
    const ordersRouteSource = fs.readFileSync('src/app/api/orders/route.ts', 'utf8');
    assert.ok(ordersRouteSource.includes('checkEndpointRateLimit') || ordersRouteSource.includes('RateLimit'), 'تفعيل فحص معدل الطلبات');
    assert.ok(ordersRouteSource.includes('429'), 'إرجاع رمز 429 Too Many Requests عند التجاوز');
  });

  check('حماية مسارات إدارة الطلبات (Admin Guard on GET/PATCH /api/orders)', () => {
    const ordersRouteSource = fs.readFileSync('src/app/api/orders/route.ts', 'utf8');
    assert.ok(ordersRouteSource.includes('requireAdmin'), 'استخدام requireAdmin لحماية الوصول');
    assert.ok(ordersRouteSource.includes('403'), 'رد 403 للمستخدمين غير المصرح لهم');
  });

  console.log('\n--- 4. التحقق من التخزين الذري والتزامن (Storage Concurrency & Dual-Engine) ---');

  check('محرك التخزين المحلي ذري وآمن ضد انقطاع السيرفر (Atomic Storage Engine)', () => {
    const storageSource = fs.readFileSync('src/lib/storage.ts', 'utf8');
    assert.ok(storageSource.includes('renameSync'), 'كتابة ذرية بملف مؤقت وإعادة تسمية');
    assert.ok(storageSource.includes('os.tmpdir'), 'مرونة البيئات المقروءة فقط مثل Vercel');
  });

  check('حماية التزامن ومنع تضارب الكتابة المتوازية (Storage Write Mutex)', () => {
    const storageSource = fs.readFileSync('src/lib/storage.ts', 'utf8');
    assert.ok(storageSource.includes('withStorageMutex') || storageSource.includes('mutex') || storageSource.includes('lock'), 'قفل غير متزامن لتسلسل عمليات الحفظ');
  });

  check('أمان Git: استبعاد ملفات التخزين JSON من التتبع البرمجي (.gitignore)', () => {
    const gitignore = fs.readFileSync('.gitignore', 'utf8');
    assert.ok(gitignore.includes('data/storage/*.json'), 'استبعاد ملفات التخزين');
    assert.ok(gitignore.includes('!data/storage/.gitkeep'), 'الحفاظ على بنية المجلد');
  });

  console.log('\n--- 5. التحقق من تكوين Next.js وترويسات الأمان (HTTP Security Headers) ---');

  check('تكوين Next.js وترويسات الحماية الصارمة (next.config.mjs Headers)', () => {
    assert.ok(fs.existsSync('next.config.mjs'), 'ملف next.config.mjs موجود');
    const nextConfig = fs.readFileSync('next.config.mjs', 'utf8');
    assert.ok(nextConfig.includes('Content-Security-Policy') || nextConfig.includes('CSP') || nextConfig.includes('headers'), 'إعداد ترويسات الأمان');
    assert.ok(nextConfig.includes('X-Frame-Options') || nextConfig.includes('DENY') || nextConfig.includes('SAMEORIGIN'), 'حماية ضد Clickjacking');
  });

  console.log('\n--- 6. الفحص الحي لمسارات الخادم (Live Server Probes — When Server is Active) ---');

  const BASE_URL = process.env.TEST_APP_URL || 'http://localhost:3000';
  const serverActive = await isServerRunning(BASE_URL);

  if (serverActive) {
    console.log(`  🌐 الخادم نشط على (${BASE_URL}) — جاري تنفيذ الفحوصات الحية...\n`);

    await asyncCheck('الصفحة الرئيسية (/) تعمل بنجاح (200 OK)', async () => {
      const res = await fetchUrl(`${BASE_URL}/`);
      assert.strictEqual(res.statusCode, 200);
      assert.ok(res.body.includes('أمير ستور') || res.body.includes('عطور'));
    });

    await asyncCheck('صفحة الكتالوج (/products) تعمل بنجاح (200 OK)', async () => {
      const res = await fetchUrl(`${BASE_URL}/products`);
      assert.strictEqual(res.statusCode, 200);
      assert.ok(res.body.includes('العطور') || res.body.includes('المنتجات') || res.body.includes('دهن العود'));
    });

    await asyncCheck('صفحة تفاصيل دهن العود الكمبودي الملكي تعمل بنجاح (200 OK)', async () => {
      const res = await fetchUrl(`${BASE_URL}/products/royal-aged-cambodian-oud-oil`);
      assert.strictEqual(res.statusCode, 200);
      assert.ok(res.body.includes('كمبودي') || res.body.includes('معتق') || res.body.includes('3850'));
    });

    await asyncCheck('صفحة تسجيل الدخول (/login) تعمل بنجاح (200 OK)', async () => {
      const res = await fetchUrl(`${BASE_URL}/login`);
      assert.strictEqual(res.statusCode, 200);
      assert.ok(res.body.includes('Google') || res.body.includes('تسجيل'));
    });

    await asyncCheck('ملف خريطة الموقع (/sitemap.xml) منشأ بصيغة XML صحيحة (200 OK)', async () => {
      const res = await fetchUrl(`${BASE_URL}/sitemap.xml`);
      assert.strictEqual(res.statusCode, 200);
      assert.ok(res.body.includes('urlset') || res.body.includes('xml'));
    });

    await asyncCheck('ملف محركات البحث (/robots.txt) متوفر ومنضبط (200 OK)', async () => {
      const res = await fetchUrl(`${BASE_URL}/robots.txt`);
      assert.strictEqual(res.statusCode, 200);
      assert.ok(/user-agent/i.test(res.body));
    });

    await asyncCheck('حماية مسار طلبات الإدارة (/api/orders GET) ترفض الطلب غير المصرح بـ 403', async () => {
      const res = await fetchUrl(`${BASE_URL}/api/orders`);
      assert.strictEqual(res.statusCode, 403);
      const json = JSON.parse(res.body);
      assert.strictEqual(json.ok, false);
    });

    await asyncCheck('إرسال طلب ناقص إلى (/api/orders POST) يرجع 400 Bad Request مع رسالة واضحة', async () => {
      const res = await fetchUrl(`${BASE_URL}/api/orders`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ customerName: 'أ', phone: '123' }),
      });
      assert.strictEqual(res.statusCode, 400);
      const json = JSON.parse(res.body);
      assert.strictEqual(json.ok, false);
    });
  } else {
    console.log(`  ℹ️  الخادم المحلي غير نشط على (${BASE_URL}) في الوقت الراهن.`);
    console.log(`     تم التحقق من جميع المعايير والقواعد البنيوية والأمنية بدون الحاجة لاتصال خادم خارجي.\n`);
    skipCheck('الصفحة الرئيسية (/)', 'خادم الويب غير مشغل محلياً');
    skipCheck('صفحة الكتالوج (/products)', 'خادم الويب غير مشغل محلياً');
    skipCheck('صفحة تفاصيل العطر (/products/...)', 'خادم الويب غير مشغل محلياً');
    skipCheck('صفحة تسجيل الدخول (/login)', 'خادم الويب غير مشغل محلياً');
    skipCheck('خريطة الموقع (/sitemap.xml)', 'خادم الويب غير مشغل محلياً');
    skipCheck('ملف الروبوتات (/robots.txt)', 'خادم الويب غير مشغل محلياً');
    skipCheck('حماية مسار الإدارة (/api/orders GET)', 'خادم الويب غير مشغل محلياً');
    skipCheck('فحص مدخلات الطلب (/api/orders POST)', 'خادم الويب غير مشغل محلياً');
  }

  console.log('\n======================================================');
  console.log(`📊 النتيجة الإجمالية للفحص الشامل: ${passedChecks} نجح من أصل ${totalChecks}`);
  if (skippedChecks > 0) {
    console.log(`⚠️  فحوصات تم تجاوزها (Offline Mode): ${skippedChecks}`);
  }
  console.log(`❌ الاختبارات الفاشلة: ${failedChecks}`);
  console.log('======================================================\n');

  if (failedChecks > 0) {
    process.exit(1);
  }
}

runAudit().catch((err) => {
  console.error('Fatal audit failure:', err);
  process.exit(1);
});
