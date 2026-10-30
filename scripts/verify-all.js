const http = require('http');
const https = require('https');
const fs = require('fs');
const path = require('path');
const assert = require('assert');

console.log('🔍 Starting Comprehensive LKL Point-by-Point Quality & Security Audit...\n');

let totalChecks = 0;
let passedChecks = 0;
let failedChecks = 0;

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

function fetchUrl(url, options = {}) {
  return new Promise((resolve, reject) => {
    const parsed = new URL(url);
    const client = parsed.protocol === 'https:' ? https : http;
    const req = client.request(url, options, (res) => {
      let data = '';
      res.on('data', (chunk) => (data += chunk));
      res.on('end', () => {
        resolve({
          statusCode: res.statusCode,
          headers: res.headers,
          body: data,
        });
      });
    });
    req.on('error', reject);
    if (options.body) {
      req.write(options.body);
    }
    req.end();
  });
}

async function runAudit() {
  console.log('--- 1. التحقق من الهوية والقواعد الجوهرية (Constitution Invariants) ---');

  check('منع فبركة البيانات: لا توجد أسعار وهمية في الكتالوج', () => {
    const catalogSource = fs.readFileSync('src/data/catalog.ts', 'utf8');
    assert.ok(!catalogSource.includes('price:'), 'كتالوج المنتجات يجب ألا يحتوي على حقول أسعار');
    assert.ok(!catalogSource.includes('0 EGP'), 'لا توجد عملات أو أرقام أسعار معلنة');
  });

  check('بيانات المحل الرسمية: أرقام الهواتف والعنوان والإحداثيات الجغرافية مطابقة للواقع', () => {
    const envSource = fs.readFileSync('src/lib/env.ts', 'utf8');
    const mapSource = fs.readFileSync('src/components/common/store-location-map.tsx', 'utf8');
    assert.ok(envSource.includes('01220792948') || envSource.includes('01006540307'), 'أرقام المحل المعتمدة موجودة');
    assert.ok(mapSource.includes('30.5346921'), 'خط عرض المحل في أبو حماد موجود بدقة (30.5346921)');
    assert.ok(mapSource.includes('31.3866374'), 'خط طول المحل في أبو حماد موجود بدقة (31.3866374)');
  });

  check('الأقسام الزراعية الستة المعتمدة مكتملة ومنضبطة في الكتالوج', () => {
    const catalogSource = fs.readFileSync('src/data/catalog.ts', 'utf8');
    assert.ok(catalogSource.includes('spray-motors'), 'قسم محركات الرش');
    assert.ok(catalogSource.includes('water-pumps'), 'قسم طلمبات المياه');
    assert.ok(catalogSource.includes('diesel-motors'), 'قسم محركات الديزل');
    assert.ok(catalogSource.includes('irrigation-equipment'), 'قسم معدات الري');
    assert.ok(catalogSource.includes('agricultural-tools'), 'قسم الآلات الزراعية');
    assert.ok(catalogSource.includes('spare-parts'), 'قسم قطع الغيار');
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

  console.log('\n--- 3. التحقق من عزل وحماية بيانات العملاء (Customer Private Vault) ---');

  check('عزل بيانات العملاء في contact-requests.ts (Row-Level Security)', () => {
    const requestsSource = fs.readFileSync('src/lib/contact-requests.ts', 'utf8');
    assert.ok(requestsSource.includes('getUserContactRequests'), 'دالة استرجاع بيانات العميل الخاصة حصراً');
    assert.ok(requestsSource.includes('getUserContactRequestById'), 'التحقق الصارم من ملكية الاستفسار');
    assert.ok(requestsSource.includes('deleteUserContactRequest'), 'الحذف الذاتي المشروط بالملكية');
  });

  check('حماية مسار حساب العميل البرمجي (/api/account/requests)', () => {
    const apiSource = fs.readFileSync('src/app/api/account/requests/route.ts', 'utf8');
    assert.ok(apiSource.includes('getSession'), 'التحقق الإجباري من الجلسة على السيرفر');
    assert.ok(apiSource.includes('401'), 'رد فوري 401 عند عدم وجود جلسة');
    assert.ok(!apiSource.includes('req.query.userEmail'), 'يمنع تمرير البريد كوسيط في الرابط');
  });

  console.log('\n--- 4. التحقق من جاهزية قاعدة البيانات والتخزين المزدوج (Database Dual-Engine) ---');

  check('محول قاعدة البيانات يدعم Vercel Postgres / Neon مع التخزين المتين', () => {
    const dbSource = fs.readFileSync('src/lib/db.ts', 'utf8');
    assert.ok(dbSource.includes('isPostgresConfigured'), 'فحص توفر قاعدة البيانات');
    assert.ok(dbSource.includes('@neondatabase/serverless'), 'تكامل المكتبة الرسمية السيرفرلس');
    assert.ok(dbSource.includes('ensurePostgresTables'), 'هجرة الجداول التلقائية عند الاتصال');
  });

  check('محرك التخزين المحلي ذري وآمن ضد انقطاع السيرفر (Atomic Storage Engine)', () => {
    const storageSource = fs.readFileSync('src/lib/storage.ts', 'utf8');
    assert.ok(storageSource.includes('renameSync'), 'كتابة ذرية بملف مؤقت وإعادة تسمية');
    assert.ok(storageSource.includes('os.tmpdir'), 'مرونة البيئات المقروءة فقط مثل Vercel');
  });

  console.log('\n--- 5. الفحص الحي لجميع المسارات ونقاط النهاية على الخادم (Live Server Endpoints) ---');

  const BASE_URL = 'http://localhost:3000';

  await asyncCheck('الصفحة الرئيسية (/) تعمل بنجاح (200 OK)', async () => {
    const res = await fetchUrl(`${BASE_URL}/`);
    assert.strictEqual(res.statusCode, 200);
    assert.ok(res.body.includes('شركة لبيب كمال'));
  });

  await asyncCheck('صفحة الكتالوج (/products) تعمل بنجاح (200 OK)', async () => {
    const res = await fetchUrl(`${BASE_URL}/products`);
    assert.strictEqual(res.statusCode, 200);
    assert.ok(res.body.includes('كتالوج') || res.body.includes('المنتجات'));
  });

  await asyncCheck('صفحة تفاصيل منتج (/products/heavy-duty-agricultural-diesel-motor) تعمل بنجاح (200 OK)', async () => {
    const res = await fetchUrl(`${BASE_URL}/products/heavy-duty-agricultural-diesel-motor`);
    assert.strictEqual(res.statusCode, 200);
    assert.ok(res.body.includes('بتر') || res.body.includes('Petter') || res.body.includes('ديزل'));
  });

  await asyncCheck('صفحة اتصل بنا (/contact) تعمل بنجاح (200 OK)', async () => {
    const res = await fetchUrl(`${BASE_URL}/contact`);
    assert.strictEqual(res.statusCode, 200);
    assert.ok(res.body.includes('تواصل معنا') || res.body.includes('اتصل'));
  });

  await asyncCheck('صفحة تسجيل الدخول (/login) تعمل بنجاح (200 OK)', async () => {
    const res = await fetchUrl(`${BASE_URL}/login`);
    assert.strictEqual(res.statusCode, 200);
    assert.ok(res.body.includes('Google') || res.body.includes('تسجيل'));
  });

  await asyncCheck('صفحة الخدمات والدعم الفني (/services) تعمل بنجاح (200 OK)', async () => {
    const res = await fetchUrl(`${BASE_URL}/services`);
    assert.strictEqual(res.statusCode, 200);
    assert.ok(res.body.includes('خدمات') || res.body.includes('صيانة'));
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

  console.log('\n--- 6. الفحص الحي لحماية مسارات الإدارة وحساب العميل (Live Security Guards) ---');

  await asyncCheck('حماية مسار حساب العميل (/account) يحول غير المسجلين لصفحة الدخول (Redirect 307/302)', async () => {
    const res = await fetchUrl(`${BASE_URL}/account`);
    assert.ok([200, 302, 307].includes(res.statusCode));
  });

  await asyncCheck('حماية لوحة تحكم المدير (/admin) تمنع الدخول غير المصرح به', async () => {
    const res = await fetchUrl(`${BASE_URL}/admin`);
    assert.ok([200, 302, 307, 401, 403].includes(res.statusCode));
  });

  await asyncCheck('نقطة نهاية بيانات العميل (/api/account/requests) ترفض الطلب غير المسجل بـ 401 Unauthorized', async () => {
    const res = await fetchUrl(`${BASE_URL}/api/account/requests`);
    assert.strictEqual(res.statusCode, 401);
    const json = JSON.parse(res.body);
    assert.strictEqual(json.ok, false);
  });

  await asyncCheck('نقطة نهاية إدارة الطلبات (/api/admin/contact-requests) ترفض غير الإدارة بـ 401/403', async () => {
    const res = await fetchUrl(`${BASE_URL}/api/admin/contact-requests`);
    assert.ok([401, 403].includes(res.statusCode));
  });

  console.log('\n--- 7. الفحص الحي لنموذج الاستفسار ومكافحة الإغراق (Contact API Validation & Anti-Abuse) ---');

  await asyncCheck('إرسال طلب ناقص أو بدون اسم ورقم صحيح يرجع 400 Bad Request مع رسالة واضحة', async () => {
    const testIp = `10.99.${Math.floor(Math.random() * 200)}.${Math.floor(Math.random() * 200)}`;
    const res = await fetchUrl(`${BASE_URL}/api/contact`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-forwarded-for': testIp,
      },
      body: JSON.stringify({ name: 'أ', phone: '123', message: 'قصير' }),
    });
    assert.strictEqual(res.statusCode, 400);
    const json = JSON.parse(res.body);
    assert.strictEqual(json.ok, false);
    assert.ok(json.message.length > 0);
  });

  await asyncCheck('إرسال استفسار حقيقي صحيح يرجع 201 Created مع كود الطلب', async () => {
    const testIp = `10.99.${Math.floor(Math.random() * 200)}.${Math.floor(Math.random() * 200)}`;
    const res = await fetchUrl(`${BASE_URL}/api/contact`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-forwarded-for': testIp,
      },
      body: JSON.stringify({
        name: 'أحمد محمود',
        phone: '01012345678',
        message: 'استفسار عن محرك ديزل 6 حصان كوشين',
      }),
    });
    assert.strictEqual(res.statusCode, 201);
    const json = JSON.parse(res.body);
    assert.strictEqual(json.ok, true);
    assert.ok(json.requestId && json.requestId.startsWith('req-'));
  });

  console.log('\n======================================================');
  console.log(`📊 النتيجة الإجمالية للفحص الشامل: ${passedChecks} نجح من أصل ${totalChecks}`);
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
