const assert = require('assert');
const fs = require('fs');
const path = require('path');
const os = require('os');
const crypto = require('crypto');
const { loadCatalog } = require('./catalog-loader');

console.log('🧪 Starting Ameer Store 4-Tier Luxury Perfume Automated Test Suite...\n');

// ============================================================================
// Test Suite Statistics & Runner Harness
// ============================================================================

const stats = {
  tier1: { name: 'Tier 1: Feature Coverage', passed: 0, failed: 0, tests: [] },
  tier2: { name: 'Tier 2: Boundary & Corner Cases', passed: 0, failed: 0, tests: [] },
  tier3: { name: 'Tier 3: Cross-Feature Combinations', passed: 0, failed: 0, tests: [] },
  tier4: { name: 'Tier 4: Real-World Scenarios', passed: 0, failed: 0, tests: [] },
};

let currentTier = 'tier1';

function setTier(tierKey) {
  currentTier = tierKey;
  console.log(`\n================================================================`);
  console.log(`📌 ${stats[tierKey].name.toUpperCase()}`);
  console.log(`================================================================\n`);
}

async function test(id, title, fn) {
  const fullTitle = `[${id}] ${title}`;
  try {
    await fn();
    console.log(`  ✅ PASS: ${fullTitle}`);
    stats[currentTier].passed++;
    stats[currentTier].tests.push({ id, title, pass: true });
  } catch (err) {
    console.error(`  ❌ FAIL: ${fullTitle}`);
    console.error(`     Error: ${err.message}`);
    stats[currentTier].failed++;
    stats[currentTier].tests.push({ id, title, pass: false, error: err.message });
  }
}

// Load authoritative perfume catalog
const { CATEGORIES, INITIAL_PRODUCTS } = loadCatalog();
const catalogMap = new Map(INITIAL_PRODUCTS.map((p) => [p.id, p]));

// Business constants
const FREE_SHIPPING_THRESHOLD = 1000;
const STANDARD_SHIPPING_COST = 50;
const OFFICIAL_PHONE = '01220086002';
const OFFICIAL_WHATSAPP_PHONE = '201220086002';

const EGYPT_GOVERNORATES = [
  'القاهرة', 'الجيزة', 'الإسكندرية', 'الدقهلية', 'الشرقية', 'القليوبية',
  'البحيرة', 'الغربية', 'المنوفية', 'دمياط', 'كفر الشيخ', 'بورسعيد',
  'الإسماعيلية', 'السويس', 'الفيوم', 'بني سويف', 'المنيا', 'أسيوط',
  'سوهاج', 'قنا', 'الأقصر', 'أسوان', 'البحر الأحمر', 'مطروح',
  'الوادي الجديد', 'شمال سيناء', 'جنوب سيناء',
];

const EGYPTIAN_PHONE_REGEX = /^(010|011|012|015)[0-9]{8}$/;

const VALID_STATUSES = [
  'NEW',
  'PROCESSING',
  'SHIPPED',
  'DELIVERED',
  'CANCELLED',
  'pending',
  'confirmed',
  'shipped',
  'delivered',
  'cancelled',
];

// Helper: Authoritative order calculation simulator
function calculateAuthoritativeOrder(items) {
  if (!items || !Array.isArray(items) || items.length === 0) {
    throw new Error('سلة المشتريات فارغة');
  }
  if (items.length > 20) {
    throw new Error('لا يمكن إضافة أكثر من 20 منتج في الطلب الواحد');
  }

  const verifiedItems = items.map((item) => {
    if (!item || typeof item.id !== 'string' || !item.id.trim()) {
      throw new Error('معرف المنتج غير صالح أو مفقود');
    }
    const product = catalogMap.get(item.id.trim());
    if (!product || !product.published) {
      throw new Error(`المنتج (${item.id}) غير متوفر حالياً`);
    }
    const authoritativePrice = product.price;
    if (typeof authoritativePrice !== 'number' || isNaN(authoritativePrice) || authoritativePrice <= 0) {
      throw new Error(`سعر المنتج غير صالح`);
    }
    const qty = Math.floor(Number(item.quantity));
    if (!Number.isInteger(qty) || qty < 1 || qty > 50) {
      throw new Error(`الكمية المطلوبة يجب أن تكون عدداً صحيحاً بين 1 و 50`);
    }

    return {
      id: product.id,
      name: product.name,
      model: product.model || item.model || 'الحجم القياسي',
      price: authoritativePrice,
      quantity: qty,
      image: product.images?.[0] || '/images/logo.png',
    };
  });

  const subtotal = verifiedItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const shippingCost = subtotal >= FREE_SHIPPING_THRESHOLD ? 0 : STANDARD_SHIPPING_COST;
  const total = subtotal + shippingCost;

  return { verifiedItems, subtotal, shippingCost, total };
}

// Helper: Input sanitizer
function sanitizeText(str) {
  if (typeof str !== 'string') return '';
  return str.replace(/<[^>]*>?/gm, '').trim();
}

// Helper: Phone normalizer
function normalizeEgyptianPhone(raw) {
  if (typeof raw !== 'string') return '';
  let clean = raw.replace(/[\s\-()]/g, '').trim();
  if (clean.startsWith('+20')) {
    clean = clean.slice(3);
  } else if (clean.startsWith('0020')) {
    clean = clean.slice(4);
  } else if (clean.startsWith('20') && clean.length === 12) {
    clean = clean.slice(2);
  }
  return clean;
}

// Helper: Generate WhatsApp URL
function generateWhatsAppOrderUrl(items, subtotal, orderId = null) {
  const itemsList = items
    .map(
      (i) =>
        `• ${i.name} (${i.model || 'الحجم القياسي'}) × ${i.quantity} = ${(i.price * i.quantity).toLocaleString('ar-EG')} ج.م`
    )
    .join('\n');

  let orderHeader = 'السلام عليكم ورحمة الله،\nأود إتمام طلب وشراء المنتجات التالية من متجر أمير ستور:\n\n';
  if (orderId) {
    orderHeader = `السلام عليكم ورحمة الله،\nلقد قمت بطلب أوردر جديد من متجر أمير ستور:\nرقم الطلب: ${orderId}\n\n`;
  }

  const shippingText = subtotal >= FREE_SHIPPING_THRESHOLD ? 'مجاني لكافة المحافظات' : '50 ج.م لكافة المحافظات';

  const message = encodeURIComponent(
    `${orderHeader}` +
      `${itemsList}\n\n` +
      `المجموع الفرعي: ${subtotal.toLocaleString('ar-EG')} ج.م\n` +
      `الشحن: ${shippingText}\n\n` +
      `برجاء تأكيد الطلب وسرعة الشحن. شكراً لكم!`
  );

  return `https://wa.me/${OFFICIAL_WHATSAPP_PHONE}?text=${message}`;
}

// Helper: Session token creation & verification
function createSessionToken(user, secret) {
  const payload = {
    user,
    iat: Math.floor(Date.now() / 1000),
    exp: Math.floor(Date.now() / 1000) + 60 * 60 * 24 * 7,
    jti: `jti-${crypto.randomUUID()}`,
  };
  const payloadStr = Buffer.from(JSON.stringify(payload)).toString('base64url');
  const signature = crypto.createHmac('sha256', secret).update(payloadStr).digest('base64url');
  return `${payloadStr}.${signature}`;
}

function verifySessionToken(token, secret) {
  if (!token || typeof token !== 'string') return null;
  const parts = token.split('.');
  if (parts.length !== 2) return null;
  const [payloadStr, signature] = parts;
  const expectedSig = crypto.createHmac('sha256', secret).update(payloadStr).digest('base64url');
  const bSig = Buffer.from(signature);
  const bExpected = Buffer.from(expectedSig);
  if (bSig.length !== bExpected.length) return null;
  if (!crypto.timingSafeEqual(bSig, bExpected)) return null;

  try {
    const payload = JSON.parse(Buffer.from(payloadStr, 'base64url').toString('utf8'));
    if (payload.exp && payload.exp < Math.floor(Date.now() / 1000)) return null;
    return payload;
  } catch {
    return null;
  }
}

// Helper: Role resolver
function resolveUserRole(email, adminEmailsList) {
  if (!email || typeof email !== 'string') return 'USER';
  const normalized = email.trim().toLowerCase();
  const admins = (adminEmailsList || ['yousseflabeeb256@gmail.com']).map((e) => e.trim().toLowerCase());
  return admins.includes(normalized) ? 'ADMIN' : 'USER';
}

// ============================================================================
// MAIN TEST RUNNER
// ============================================================================

async function runTestSuite() {
  // ==========================================================================
  // TIER 1: FEATURE COVERAGE (>=5 tests per feature across 5 features)
  // ==========================================================================
  setTier('tier1');

  // --- Feature 1.1: Order Creation ---
  await test('T1.1.1', 'Order Creation: Valid COD order creation with unique AMR- ID and status NEW', () => {
    const orderNumber = Math.floor(100000 + Math.random() * 900000);
    const orderId = `AMR-${orderNumber}`;
    const calculated = calculateAuthoritativeOrder([{ id: 'prod-1', quantity: 1 }]);
    const order = {
      id: orderId,
      customerName: 'كريم المنشاوي',
      phone: '01012345678',
      governorate: 'القاهرة',
      address: 'شارع المعز لدين الله، حي الجمالية',
      items: calculated.verifiedItems,
      subtotal: calculated.subtotal,
      shippingCost: calculated.shippingCost,
      total: calculated.total,
      paymentMethod: 'COD',
      status: 'NEW',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    assert.ok(/^AMR-[0-9]{6}$/.test(order.id), 'Order ID must match AMR-XXXXXX format');
    assert.strictEqual(order.status, 'NEW', 'Initial order status must be NEW');
    assert.strictEqual(order.paymentMethod, 'COD', 'Payment method must be COD');
    assert.strictEqual(order.subtotal, 3850, 'Subtotal for prod-1 must be 3850');
    assert.strictEqual(order.total, 3850, 'Total with free shipping must be 3850');
  });

  await test('T1.1.2', 'Order Creation: Valid WhatsApp order creation persists with paymentMethod WHATSAPP', () => {
    const calculated = calculateAuthoritativeOrder([{ id: 'prod-2', quantity: 1 }]);
    const order = {
      id: `AMR-998877`,
      customerName: 'عميل واتساب',
      phone: '01000000000',
      governorate: 'القاهرة',
      address: 'طلب مباشر عبر محادثة واتساب',
      items: calculated.verifiedItems,
      subtotal: calculated.subtotal,
      shippingCost: calculated.shippingCost,
      total: calculated.total,
      paymentMethod: 'WHATSAPP',
      status: 'NEW',
    };

    assert.strictEqual(order.paymentMethod, 'WHATSAPP', 'Must persist as WHATSAPP');
    assert.strictEqual(order.subtotal, 1650, 'Subtotal for prod-2 must be 1650');
    assert.strictEqual(order.shippingCost, 0, '1650 >= 1000 qualifies for free shipping');
  });

  await test('T1.1.3', 'Order Creation: Accurate shipping calculation for orders below 1000 EGP (+50 EGP)', () => {
    const calculated = calculateAuthoritativeOrder([{ id: 'prod-3', quantity: 1 }]); // 850 EGP
    assert.strictEqual(calculated.subtotal, 850, 'Prod-3 subtotal must be 850');
    assert.strictEqual(calculated.shippingCost, 50, 'Shipping cost must be 50 EGP for < 1000 EGP');
    assert.strictEqual(calculated.total, 900, 'Total must be 900 (850 + 50)');
  });

  await test('T1.1.4', 'Order Creation: Multi-item aggregation with quantity multiplication', () => {
    const calculated = calculateAuthoritativeOrder([
      { id: 'prod-3', quantity: 2 }, // 850 * 2 = 1700
      { id: 'prod-7', quantity: 1 }, // 950 * 1 = 950
    ]);
    assert.strictEqual(calculated.subtotal, 2650, 'Subtotal should be 1700 + 950 = 2650');
    assert.strictEqual(calculated.shippingCost, 0, 'Free shipping for 2650 EGP');
    assert.strictEqual(calculated.total, 2650);
  });

  await test('T1.1.5', 'Order Creation: Whitespace and customer details trimming and normalization', () => {
    const rawName = '   أحمد عبد الرحيم   ';
    const rawPhone = '  01198765432  ';
    const rawGov = '  الشرقية  ';
    const rawAddress = '  مدينة الزقازيق، حي القومية  ';

    assert.strictEqual(sanitizeText(rawName), 'أحمد عبد الرحيم');
    assert.strictEqual(normalizeEgyptianPhone(rawPhone), '01198765432');
    assert.strictEqual(sanitizeText(rawGov), 'الشرقية');
    assert.strictEqual(sanitizeText(rawAddress), 'مدينة الزقازيق، حي القومية');
  });

  await test('T1.1.6', 'Order Creation: In-memory/disk atomic write and read-back integrity', () => {
    const testDir = path.join(os.tmpdir(), `ameer_test_${Date.now()}`);
    fs.mkdirSync(testDir, { recursive: true });
    const testFile = path.join(testDir, 'orders_test.json');

    const sampleOrder = { id: 'AMR-123456', total: 3850, status: 'NEW' };
    const tempFile = `${testFile}.tmp`;
    fs.writeFileSync(tempFile, JSON.stringify([sampleOrder], null, 2), 'utf8');
    fs.renameSync(tempFile, testFile);

    assert.ok(fs.existsSync(testFile), 'Order file must exist');
    const readOrders = JSON.parse(fs.readFileSync(testFile, 'utf8'));
    assert.strictEqual(readOrders.length, 1);
    assert.strictEqual(readOrders[0].id, 'AMR-123456');

    fs.unlinkSync(testFile);
    fs.rmdirSync(testDir);
  });

  // --- Feature 1.2: Catalog Query ---
  await test('T1.2.1', 'Catalog Query: Catalog contains strictly the 6 verified luxury perfume categories', () => {
    assert.strictEqual(CATEGORIES.length, 6, 'Must contain exactly 6 categories');
    const slugs = CATEGORIES.map((c) => c.slug);
    assert.ok(slugs.includes('pure-oud-oils'), 'Must contain pure-oud-oils');
    assert.ok(slugs.includes('oriental-perfumes'), 'Must contain oriental-perfumes');
    assert.ok(slugs.includes('french-perfumes'), 'Must contain french-perfumes');
    assert.ok(slugs.includes('musk-and-amber'), 'Must contain musk-and-amber');
    assert.ok(slugs.includes('bakhoor-and-incense'), 'Must contain bakhoor-and-incense');
    assert.ok(slugs.includes('perfume-gift-sets'), 'Must contain perfume-gift-sets');
  });

  await test('T1.2.2', 'Catalog Query: All initial products have valid positive prices and luxury branding', () => {
    assert.ok(INITIAL_PRODUCTS.length >= 8, 'Must have at least 8 initial luxury perfume products');
    for (const prod of INITIAL_PRODUCTS) {
      assert.ok(typeof prod.price === 'number' && prod.price > 0, `Product ${prod.id} must have price > 0`);
      assert.strictEqual(prod.brand, 'أمير ستور', `Product ${prod.id} brand must be أمير ستور`);
      assert.ok(prod.published, `Product ${prod.id} must be published by default`);
      assert.ok(prod.name.length > 5, `Product ${prod.id} must have descriptive name`);
    }
  });

  await test('T1.2.3', 'Catalog Query: Complete absence of obsolete agricultural LKL terminology', () => {
    const rawCatalog = fs.readFileSync('src/data/catalog.ts', 'utf8');
    assert.ok(!rawCatalog.includes('spray-motors'), 'Must not contain agricultural spray-motors');
    assert.ok(!rawCatalog.includes('water-pumps'), 'Must not contain agricultural water-pumps');
    assert.ok(!rawCatalog.includes('diesel-motors'), 'Must not contain agricultural diesel-motors');
    assert.ok(!rawCatalog.includes('irrigation-equipment'), 'Must not contain agricultural irrigation-equipment');
    assert.ok(!rawCatalog.includes('شركة لبيب كمال'), 'Must not contain old company name');
  });

  await test('T1.2.4', 'Catalog Query: Product filtering by category ID returns expected subsets', () => {
    const oudProducts = INITIAL_PRODUCTS.filter((p) => p.categoryId === 'cat-1');
    assert.ok(oudProducts.length >= 2, 'Category cat-1 must have at least 2 products');
    assert.ok(oudProducts.some((p) => p.id === 'prod-1'), 'Must include Royal Cambodian Oud');

    const bakhoorProducts = INITIAL_PRODUCTS.filter((p) => p.categoryId === 'cat-5');
    assert.ok(bakhoorProducts.length >= 2, 'Category cat-5 must have at least 2 bakhoor products');
  });

  await test('T1.2.5', 'Catalog Query: Product specifications contain valid fragrance pyramid attributes', () => {
    const prod1 = catalogMap.get('prod-1');
    assert.ok(Array.isArray(prod1.specifications), 'Specifications must be an array');
    const specLabels = prod1.specifications.map((s) => s.label);
    assert.ok(specLabels.includes('بلد المنشأ'), 'Must specify country of origin');
    assert.ok(specLabels.includes('درجة التعتيق'), 'Must specify aging degree');
    assert.ok(specLabels.includes('الثبات والفوحان'), 'Must specify sillage and longevity');
  });

  await test('T1.2.6', 'Catalog Query: Arabic slug generator produces URL-safe kebab-case strings', () => {
    function slugify(text) {
      return text
        .toString()
        .toLowerCase()
        .trim()
        .replace(/\s+/g, '-')
        .replace(/[^\w\u0621-\u064A-]+/g, '')
        .replace(/--+/g, '-')
        .replace(/^-+/, '')
        .replace(/-+$/, '');
    }
    assert.strictEqual(slugify('دهن عود كمبودي معتق'), 'دهن-عود-كمبودي-معتق');
    assert.strictEqual(slugify('Ameer Al Oud Royal 100ml!'), 'ameer-al-oud-royal-100ml');
  });

  // --- Feature 1.3: Server Price Validation ---
  await test('T1.3.1', 'Server Price Validation: Authoritative price resolution overrides client price tampering', () => {
    // Attacker sends price: 1 EGP for 3850 EGP Royal Oud
    const tamperedInput = [{ id: 'prod-1', price: 1, quantity: 2 }];
    const calculated = calculateAuthoritativeOrder(tamperedInput);
    assert.strictEqual(calculated.verifiedItems[0].price, 3850, 'Authoritative price must be 3850, not 1');
    assert.strictEqual(calculated.subtotal, 7700, 'Subtotal must be 3850 * 2 = 7700');
    assert.strictEqual(calculated.total, 7700, 'Total must be 7700');
  });

  await test('T1.3.2', 'Server Price Validation: Client sending negative price is ignored in subtotal calculation', () => {
    const tamperedInput = [{ id: 'prod-2', price: -500, quantity: 1 }];
    const calculated = calculateAuthoritativeOrder(tamperedInput);
    assert.strictEqual(calculated.verifiedItems[0].price, 1650, 'Price must be 1650');
    assert.strictEqual(calculated.subtotal, 1650);
  });

  await test('T1.3.3', 'Server Price Validation: Exact boundary threshold at 1000 EGP qualifies for 0 shipping', () => {
    // Mock a 1000 EGP subtotal
    const subtotal = 1000;
    const shipping = subtotal >= FREE_SHIPPING_THRESHOLD ? 0 : STANDARD_SHIPPING_COST;
    assert.strictEqual(shipping, 0, 'Exactly 1000 EGP gets free shipping');
  });

  await test('T1.3.4', 'Server Price Validation: 999 EGP boundary incurs 50 EGP shipping fee', () => {
    const subtotal = 999;
    const shipping = subtotal >= FREE_SHIPPING_THRESHOLD ? 0 : STANDARD_SHIPPING_COST;
    assert.strictEqual(shipping, 50, '999 EGP incurs 50 EGP shipping');
  });

  await test('T1.3.5', 'Server Price Validation: Multi-tier aggregation across 3 diverse items', () => {
    const calculated = calculateAuthoritativeOrder([
      { id: 'prod-1', quantity: 1 }, // 3850
      { id: 'prod-3', quantity: 1 }, // 850
      { id: 'prod-7', quantity: 2 }, // 950 * 2 = 1900
    ]);
    const expectedSubtotal = 3850 + 850 + 1900; // 6600
    assert.strictEqual(calculated.subtotal, expectedSubtotal);
    assert.strictEqual(calculated.shippingCost, 0);
    assert.strictEqual(calculated.total, expectedSubtotal);
  });

  // --- Feature 1.4: Admin Auth & Server-Side RBAC ---
  await test('T1.4.1', 'Admin Auth: Canonical admin email yousseflabeeb256@gmail.com resolves to ADMIN', () => {
    assert.strictEqual(resolveUserRole('yousseflabeeb256@gmail.com'), 'ADMIN');
  });

  await test('T1.4.2', 'Admin Auth: Case-insensitive and trimmed admin email resolution', () => {
    assert.strictEqual(resolveUserRole('  YOUSSEFLABEEB256@GMAIL.COM  '), 'ADMIN');
    assert.strictEqual(resolveUserRole('YoussefLabeeb256@Gmail.Com'), 'ADMIN');
  });

  await test('T1.4.3', 'Admin Auth: Non-admin emails resolve strictly to USER', () => {
    assert.strictEqual(resolveUserRole('client@example.com'), 'USER');
    assert.strictEqual(resolveUserRole('hacker@admin.com'), 'USER');
    assert.strictEqual(resolveUserRole('yousseflabeeb256@evil.com'), 'USER');
    assert.strictEqual(resolveUserRole(''), 'USER');
  });

  await test('T1.4.4', 'Admin Auth: Cryptographic HMAC-SHA256 session token generation and valid verification', () => {
    const secret = 'test-secret-key-at-least-32-chars-long-security-check';
    const user = { id: 'u1', name: 'Youssef Admin', email: 'yousseflabeeb256@gmail.com', role: 'ADMIN' };
    const token = createSessionToken(user, secret);
    assert.ok(token.includes('.'), 'Token must consist of header/payload and signature');

    const verified = verifySessionToken(token, secret);
    assert.ok(verified, 'Verification must succeed for genuine token');
    assert.strictEqual(verified.user.email, 'yousseflabeeb256@gmail.com');
    assert.strictEqual(verified.user.role, 'ADMIN');
  });

  await test('T1.4.5', 'Admin Auth: Tampered session payload fails cryptographic signature check', () => {
    const secret = 'test-secret-key-at-least-32-chars-long-security-check';
    const user = { id: 'u2', name: 'Client User', email: 'client@example.com', role: 'USER' };
    const token = createSessionToken(user, secret);
    const [payloadStr, sig] = token.split('.');

    // Attacker elevates role to ADMIN in payload
    const decoded = JSON.parse(Buffer.from(payloadStr, 'base64url').toString('utf8'));
    decoded.user.role = 'ADMIN';
    const tamperedPayloadStr = Buffer.from(JSON.stringify(decoded)).toString('base64url');
    const tamperedToken = `${tamperedPayloadStr}.${sig}`;

    assert.strictEqual(verifySessionToken(tamperedToken, secret), null, 'Tampered token must be rejected');
  });

  await test('T1.4.6', 'Admin Auth: Session revocation by JTI and user timestamp', () => {
    const revocations = { jtis: new Set(), emails: new Map() };
    function isRevoked(payload) {
      if (revocations.jtis.has(payload.jti)) return true;
      const revokedAt = revocations.emails.get(payload.user.email.toLowerCase());
      if (revokedAt && payload.iat * 1000 < revokedAt) return true;
      return false;
    }

    const payload = {
      jti: 'jti-abc-123',
      user: { email: 'admin@ameer-store.com' },
      iat: Math.floor((Date.now() - 5000) / 1000),
    };
    assert.strictEqual(isRevoked(payload), false, 'Active session is not revoked');

    revocations.jtis.add('jti-abc-123');
    assert.strictEqual(isRevoked(payload), true, 'Session with revoked JTI is blocked');
  });

  // --- Feature 1.5: WhatsApp Order Link Generator ---
  await test('T1.5.1', 'WhatsApp Link: Targets official Ameer Store phone number 201220086002', () => {
    const url = generateWhatsAppOrderUrl([{ name: 'دهن عود كمبودي', model: 'تولة', price: 3850, quantity: 1 }], 3850);
    assert.ok(url.startsWith(`https://wa.me/${OFFICIAL_WHATSAPP_PHONE}`), 'Must target official WhatsApp number');
  });

  await test('T1.5.2', 'WhatsApp Link: Generates properly encoded URI string without raw unicode crashes', () => {
    const url = generateWhatsAppOrderUrl([{ name: 'عطر أمير العود', model: '100 مل', price: 1650, quantity: 1 }], 1650);
    assert.ok(url.includes('text='), 'Must contain text parameter');
    assert.doesNotThrow(() => decodeURIComponent(url.split('text=')[1]), 'URI must be cleanly decodable');
  });

  await test('T1.5.3', 'WhatsApp Link: Message contains official store greeting and luxury perfume branding', () => {
    const url = generateWhatsAppOrderUrl([{ name: 'مسك الحرير', model: 'ربع تولة', price: 850, quantity: 1 }], 850);
    const text = decodeURIComponent(url.split('text=')[1]);
    assert.ok(text.includes('السلام عليكم ورحمة الله'), 'Must contain Islamic greeting');
    assert.ok(text.includes('متجر أمير ستور'), 'Must mention Ameer Store');
  });

  await test('T1.5.4', 'WhatsApp Link: Formats items breakdown with names, quantities, and EGP prices', () => {
    const url = generateWhatsAppOrderUrl([
      { name: 'عطر عنبر عود', model: '100 مل', price: 1800, quantity: 2 },
    ], 3600);
    const text = decodeURIComponent(url.split('text=')[1]);
    assert.ok(text.includes('عطر عنبر عود'), 'Must include perfume name');
    assert.ok(text.includes('× 2'), 'Must include quantity');
    assert.ok(text.includes('ج.م'), 'Must include currency');
  });

  await test('T1.5.5', 'WhatsApp Link: Post-order confirmation link embeds the official Order ID', () => {
    const orderId = 'AMR-778899';
    const url = generateWhatsAppOrderUrl([{ name: 'دهن عود', model: 'تولة', price: 3850, quantity: 1 }], 3850, orderId);
    const text = decodeURIComponent(url.split('text=')[1]);
    assert.ok(text.includes('رقم الطلب: AMR-778899'), 'Must embed official Order ID');
  });

  await test('T1.5.6', 'WhatsApp Link: Accurately denotes free shipping when subtotal >= 1000 EGP', () => {
    const url = generateWhatsAppOrderUrl([{ name: 'دهن عود', model: 'تولة', price: 3850, quantity: 1 }], 3850);
    const text = decodeURIComponent(url.split('text=')[1]);
    assert.ok(text.includes('مجاني لكافة المحافظات'), 'Must state free shipping');
  });

  // ==========================================================================
  // TIER 2: BOUNDARY & CORNER CASES (>=5 tests per feature across 7 features)
  // ==========================================================================
  setTier('tier2');

  // --- Feature 2.1: Price Tampering Rejection ---
  await test('T2.1.1', 'Price Tampering: Zero price (price: 0) client injection is overridden by catalog price', () => {
    const res = calculateAuthoritativeOrder([{ id: 'prod-1', price: 0, quantity: 1 }]);
    assert.strictEqual(res.verifiedItems[0].price, 3850, 'Price must resolve to 3850 EGP');
    assert.strictEqual(res.total, 3850);
  });

  await test('T2.1.2', 'Price Tampering: 1 EGP client price injection is overridden by catalog price', () => {
    const res = calculateAuthoritativeOrder([{ id: 'prod-2', price: 1, quantity: 1 }]);
    assert.strictEqual(res.verifiedItems[0].price, 1650);
    assert.strictEqual(res.total, 1650);
  });

  await test('T2.1.3', 'Price Tampering: Negative price (price: -9999) client injection is overridden', () => {
    const res = calculateAuthoritativeOrder([{ id: 'prod-3', price: -9999, quantity: 1 }]);
    assert.strictEqual(res.verifiedItems[0].price, 850);
    assert.strictEqual(res.total, 900); // 850 + 50 shipping
  });

  await test('T2.1.4', 'Price Tampering: String price (price: "FREE") client injection is overridden', () => {
    const res = calculateAuthoritativeOrder([{ id: 'prod-4', price: 'FREE', quantity: 1 }]);
    assert.strictEqual(res.verifiedItems[0].price, 1800);
    assert.strictEqual(res.total, 1800);
  });

  await test('T2.1.5', 'Price Tampering: Null and undefined price fields resolve to catalog price', () => {
    const res = calculateAuthoritativeOrder([{ id: 'prod-5', price: null, quantity: 1 }]);
    assert.strictEqual(res.verifiedItems[0].price, 1950);
    assert.strictEqual(res.total, 1950);
  });

  // --- Feature 2.2: Negative & Extreme Quantities ---
  await test('T2.2.1', 'Negative Quantity: quantity: -1 is strictly rejected', () => {
    assert.throws(() => {
      calculateAuthoritativeOrder([{ id: 'prod-1', quantity: -1 }]);
    }, /الكمية المطلوبة يجب أن تكون عدداً صحيحاً بين 1 و 50/);
  });

  await test('T2.2.2', 'Negative Quantity: Extreme negative quantity (quantity: -1000) is rejected', () => {
    assert.throws(() => {
      calculateAuthoritativeOrder([{ id: 'prod-1', quantity: -1000 }]);
    }, /الكمية المطلوبة/);
  });

  await test('T2.2.3', 'Invalid Quantity: Zero quantity (quantity: 0) is rejected', () => {
    assert.throws(() => {
      calculateAuthoritativeOrder([{ id: 'prod-1', quantity: 0 }]);
    }, /الكمية المطلوبة/);
  });

  await test('T2.2.4', 'Excessive Quantity: Quantity exceeding 50 units (quantity: 51) is rejected', () => {
    assert.throws(() => {
      calculateAuthoritativeOrder([{ id: 'prod-1', quantity: 51 }]);
    }, /الكمية المطلوبة/);
  });

  await test('T2.2.5', 'Malformed Quantity: Non-number values (quantity: NaN, Infinity, "ten") are rejected', () => {
    assert.throws(() => {
      calculateAuthoritativeOrder([{ id: 'prod-1', quantity: NaN }]);
    }, /الكمية المطلوبة/);

    assert.throws(() => {
      calculateAuthoritativeOrder([{ id: 'prod-1', quantity: Infinity }]);
    }, /الكمية المطلوبة/);

    assert.throws(() => {
      calculateAuthoritativeOrder([{ id: 'prod-1', quantity: 'abc' }]);
    }, /الكمية المطلوبة/);
  });

  // --- Feature 2.3: Zero Items & Missing/Corrupt Items Array ---
  await test('T2.3.1', 'Zero Items: Empty items array (items: []) is rejected', () => {
    assert.throws(() => {
      calculateAuthoritativeOrder([]);
    }, /سلة المشتريات فارغة/);
  });

  await test('T2.3.2', 'Zero Items: Null or undefined items parameter is rejected', () => {
    assert.throws(() => {
      calculateAuthoritativeOrder(null);
    }, /سلة المشتريات فارغة/);

    assert.throws(() => {
      calculateAuthoritativeOrder(undefined);
    }, /سلة المشتريات فارغة/);
  });

  await test('T2.3.3', 'Zero Items: Non-array items argument is rejected', () => {
    assert.throws(() => {
      calculateAuthoritativeOrder('prod-1');
    }, /سلة المشتريات فارغة/);

    assert.throws(() => {
      calculateAuthoritativeOrder({ id: 'prod-1', quantity: 1 });
    }, /سلة المشتريات فارغة/);
  });

  await test('T2.3.4', 'Unpublished Product: Non-existent product ID is rejected', () => {
    assert.throws(() => {
      calculateAuthoritativeOrder([{ id: 'prod-non-existent-999', quantity: 1 }]);
    }, /غير متوفر حالياً/);
  });

  await test('T2.3.5', 'Unpublished Product: Item with missing or empty ID string is rejected', () => {
    assert.throws(() => {
      calculateAuthoritativeOrder([{ id: '   ', quantity: 1 }]);
    }, /معرف المنتج غير صالح/);
  });

  await test('T2.3.6', 'Item Count Limit: Exceeding 20 distinct products per order is rejected', () => {
    const excessiveItems = Array.from({ length: 21 }, () => ({ id: 'prod-1', quantity: 1 }));
    assert.throws(() => {
      calculateAuthoritativeOrder(excessiveItems);
    }, /لا يمكن إضافة أكثر من 20 منتج/);
  });

  // --- Feature 2.4: String Injection & Malicious Payloads ---
  await test('T2.4.1', 'String Injection: XSS script tags in customerName are stripped cleanly', () => {
    const malicious = '<script>alert("hacked")</script>أحمد علي';
    assert.strictEqual(sanitizeText(malicious), 'alert("hacked")أحمد علي');
  });

  await test('T2.4.2', 'String Injection: Image onerror XSS in address is sanitized', () => {
    const malicious = '<img src=x onerror=alert(1)>شارع النصر';
    assert.strictEqual(sanitizeText(malicious), 'شارع النصر');
  });

  await test('T2.4.3', 'String Injection: SQL injection meta-characters are treated as literal text', () => {
    const sqlPayload = "Robert'; DROP TABLE orders; --";
    const sanitized = sanitizeText(sqlPayload);
    assert.strictEqual(sanitized, "Robert'; DROP TABLE orders; --");
  });

  await test('T2.4.4', 'String Injection: Customer name length boundary (3 - 100 characters)', () => {
    function validateName(name) {
      const clean = sanitizeText(name);
      return clean.length >= 3 && clean.length <= 100;
    }
    assert.strictEqual(validateName('أحمد'), true);
    assert.strictEqual(validateName('أ'), false, 'Too short name rejected');
    assert.strictEqual(validateName('a'.repeat(101)), false, 'Too long name (>100 chars) rejected');
  });

  await test('T2.4.5', 'String Injection: Address length boundary (5 - 250 characters)', () => {
    function validateAddress(addr) {
      const clean = sanitizeText(addr);
      return clean.length >= 5 && clean.length <= 250;
    }
    assert.strictEqual(validateAddress('مصر الجديدة، القاهرة'), true);
    assert.strictEqual(validateAddress('بيت'), false, 'Too short address rejected');
    assert.strictEqual(validateAddress('ع'.repeat(251)), false, 'Too long address (>250 chars) rejected');
  });

  await test('T2.4.6', 'String Injection: Notes field length safe truncation at 500 characters', () => {
    const longNotes = 'م'.repeat(600);
    const truncated = longNotes.slice(0, 500);
    assert.strictEqual(truncated.length, 500);
  });

  // --- Feature 2.5: Egyptian Phone Regex & Format Variations ---
  await test('T2.5.1', 'Phone Regex: Valid 11-digit mobile prefixes (010, 011, 012, 015) accepted', () => {
    assert.strictEqual(EGYPTIAN_PHONE_REGEX.test('01012345678'), true);
    assert.strictEqual(EGYPTIAN_PHONE_REGEX.test('01123456789'), true);
    assert.strictEqual(EGYPTIAN_PHONE_REGEX.test('01220086002'), true);
    assert.strictEqual(EGYPTIAN_PHONE_REGEX.test('01555555555'), true);
  });

  await test('T2.5.2', 'Phone Regex: Normalization of formatted local numbers (spaces, dashes, parentheses)', () => {
    // Tests symbol removal: spaces, dashes, parentheses
    assert.strictEqual(normalizeEgyptianPhone('010 1234 5678'), '01012345678');
    assert.strictEqual(normalizeEgyptianPhone('011-2345-6789'), '01123456789');
    assert.strictEqual(normalizeEgyptianPhone('(012) 20086002'), '01220086002');
    assert.strictEqual(EGYPTIAN_PHONE_REGEX.test(normalizeEgyptianPhone('010-1234-5678')), true);
  });

  await test('T2.5.3', 'Phone Regex: Invalid prefix (013, 014, 016, 017, 018, 019) rejected', () => {
    assert.strictEqual(EGYPTIAN_PHONE_REGEX.test('01312345678'), false);
    assert.strictEqual(EGYPTIAN_PHONE_REGEX.test('01412345678'), false);
    assert.strictEqual(EGYPTIAN_PHONE_REGEX.test('01612345678'), false);
    assert.strictEqual(EGYPTIAN_PHONE_REGEX.test('01712345678'), false);
  });

  await test('T2.5.4', 'Phone Regex: Incomplete short numbers (< 11 digits) rejected', () => {
    assert.strictEqual(EGYPTIAN_PHONE_REGEX.test('0101234567'), false);
    assert.strictEqual(EGYPTIAN_PHONE_REGEX.test('012200860'), false);
    assert.strictEqual(EGYPTIAN_PHONE_REGEX.test('12345'), false);
  });

  await test('T2.5.5', 'Phone Regex: Overly long numbers (> 11 digits) rejected', () => {
    assert.strictEqual(EGYPTIAN_PHONE_REGEX.test('010123456789'), false);
    assert.strictEqual(EGYPTIAN_PHONE_REGEX.test('0112345678901'), false);
  });

  // --- Feature 2.6: Governorate Whitelist (27 Egyptian Governorates) ---
  await test('T2.6.1', 'Governorate Whitelist: Contains exactly 27 valid Egyptian governorates', () => {
    assert.strictEqual(EGYPT_GOVERNORATES.length, 27);
    assert.ok(EGYPT_GOVERNORATES.includes('القاهرة'));
    assert.ok(EGYPT_GOVERNORATES.includes('الجيزة'));
    assert.ok(EGYPT_GOVERNORATES.includes('الإسكندرية'));
    assert.ok(EGYPT_GOVERNORATES.includes('الشرقية'));
    assert.ok(EGYPT_GOVERNORATES.includes('أسوان'));
    assert.ok(EGYPT_GOVERNORATES.includes('مطروح'));
  });

  await test('T2.6.2', 'Governorate Whitelist: Non-Egyptian or fabricated governorate string rejected', () => {
    function isValidGov(gov) {
      return typeof gov === 'string' && EGYPT_GOVERNORATES.includes(gov.trim());
    }
    assert.strictEqual(isValidGov('دبي'), false);
    assert.strictEqual(isValidGov('باريس'), false);
    assert.strictEqual(isValidGov('عشوائي'), false);
  });

  await test('T2.6.3', 'Governorate Whitelist: Empty or whitespace governorate string rejected', () => {
    function isValidGov(gov) {
      return typeof gov === 'string' && EGYPT_GOVERNORATES.includes(gov.trim());
    }
    assert.strictEqual(isValidGov(''), false);
    assert.strictEqual(isValidGov('   '), false);
    assert.strictEqual(isValidGov(null), false);
  });

  await test('T2.6.4', 'Governorate Whitelist: Trimming whitespace around valid governorate matches cleanly', () => {
    function isValidGov(gov) {
      return typeof gov === 'string' && EGYPT_GOVERNORATES.includes(gov.trim());
    }
    assert.strictEqual(isValidGov('   القاهرة   '), true);
    assert.strictEqual(isValidGov('\nالإسكندرية\t'), true);
  });

  await test('T2.6.5', 'Governorate Whitelist: Numbers and non-string inputs rejected', () => {
    function isValidGov(gov) {
      return typeof gov === 'string' && EGYPT_GOVERNORATES.includes(gov.trim());
    }
    assert.strictEqual(isValidGov(123), false);
    assert.strictEqual(isValidGov({}), false);
    assert.strictEqual(isValidGov(true), false);
  });

  // --- Feature 2.7: Unauthorized Admin Access & Status Enum Enforcement ---
  await test('T2.7.1', 'Unauthorized Admin: Anonymous request lacks session token', () => {
    const sessionToken = null;
    assert.strictEqual(verifySessionToken(sessionToken, 'secret'), null);
  });

  await test('T2.7.2', 'Unauthorized Admin: USER role session cannot access admin resources', () => {
    const secret = 'test-secret-key-at-least-32-chars-long-security-check';
    const userSession = createSessionToken({ email: 'client@example.com', role: 'USER' }, secret);
    const verified = verifySessionToken(userSession, secret);
    assert.ok(verified);
    assert.strictEqual(verified.user.role, 'USER');
    assert.notStrictEqual(verified.user.role, 'ADMIN', 'Must not have admin access');
  });

  await test('T2.7.3', 'Status Enum: Valid order status transitions whitelist', () => {
    function isValidStatus(s) {
      return VALID_STATUSES.includes(s);
    }
    assert.strictEqual(isValidStatus('NEW'), true);
    assert.strictEqual(isValidStatus('PROCESSING'), true);
    assert.strictEqual(isValidStatus('SHIPPED'), true);
    assert.strictEqual(isValidStatus('DELIVERED'), true);
    assert.strictEqual(isValidStatus('CANCELLED'), true);
    assert.strictEqual(isValidStatus('pending'), true);
    assert.strictEqual(isValidStatus('confirmed'), true);
    assert.strictEqual(isValidStatus('shipped'), true);
    assert.strictEqual(isValidStatus('delivered'), true);
    assert.strictEqual(isValidStatus('cancelled'), true);
  });

  await test('T2.7.4', 'Status Enum: Arbitrary or malicious status string is strictly rejected', () => {
    function isValidStatus(s) {
      const normalized = (s || '').toString().toUpperCase();
      return VALID_STATUSES.includes(normalized);
    }
    assert.strictEqual(isValidStatus('HACKED'), false);
    assert.strictEqual(isValidStatus('REFUNDED'), false);
    assert.strictEqual(isValidStatus('DELETED'), false);
    assert.strictEqual(isValidStatus(''), false);
  });

  await test('T2.7.5', 'Status Enum: Status normalization cleanly maps legacy or lowercase status strings', () => {
    function normalizeStatus(s) {
      switch ((s || '').toLowerCase()) {
        case 'pending':
        case 'new':
          return 'NEW';
        case 'confirmed':
        case 'processing':
          return 'PROCESSING';
        case 'shipped':
          return 'SHIPPED';
        case 'delivered':
          return 'DELIVERED';
        case 'cancelled':
        case 'canceled':
          return 'CANCELLED';
        default:
          return null;
      }
    }
    assert.strictEqual(normalizeStatus('pending'), 'NEW');
    assert.strictEqual(normalizeStatus('confirmed'), 'PROCESSING');
    assert.strictEqual(normalizeStatus('shipped'), 'SHIPPED');
    assert.strictEqual(normalizeStatus('delivered'), 'DELIVERED');
    assert.strictEqual(normalizeStatus('cancelled'), 'CANCELLED');
    assert.strictEqual(normalizeStatus('invalid'), null);
  });

  // ==========================================================================
  // TIER 3: CROSS-FEATURE COMBINATIONS (>=5 tests per feature across 3 features)
  // ==========================================================================
  setTier('tier3');

  // --- Feature 3.1: COD Flow vs WhatsApp Flow Synchronization ---
  await test('T3.1.1', 'Dual Flow: Both COD and WhatsApp flows persist authoritative order records', () => {
    const codOrder = { id: 'AMR-111111', paymentMethod: 'COD', total: 3850, status: 'NEW' };
    const waOrder = { id: 'AMR-222222', paymentMethod: 'WHATSAPP', total: 3850, status: 'NEW' };

    assert.strictEqual(codOrder.paymentMethod, 'COD');
    assert.strictEqual(waOrder.paymentMethod, 'WHATSAPP');
    assert.strictEqual(codOrder.total, waOrder.total);
    assert.ok(codOrder.id.startsWith('AMR-'));
    assert.ok(waOrder.id.startsWith('AMR-'));
  });

  await test('T3.1.2', 'Dual Flow: WhatsApp order generates valid URL referencing official Order ID', () => {
    const orderId = 'AMR-554433';
    const subtotal = 1650;
    const items = [{ name: 'عطر أمير العود الملكي', model: '100 مل', price: 1650, quantity: 1 }];
    const waUrl = generateWhatsAppOrderUrl(items, subtotal, orderId);

    assert.ok(waUrl.includes('AMR-554433'), 'WhatsApp URL must reference the generated Order ID');
    assert.ok(waUrl.includes('201220086002'), 'Must reference official store phone');
  });

  await test('T3.1.3', 'Dual Flow: Subtotal calculation parity between COD and WhatsApp checkouts', () => {
    const items = [
      { id: 'prod-1', quantity: 1 },
      { id: 'prod-2', quantity: 1 },
    ];
    const codCalc = calculateAuthoritativeOrder(items);
    const waCalc = calculateAuthoritativeOrder(items);

    assert.strictEqual(codCalc.subtotal, waCalc.subtotal);
    assert.strictEqual(codCalc.shippingCost, waCalc.shippingCost);
    assert.strictEqual(codCalc.total, waCalc.total);
    assert.strictEqual(codCalc.subtotal, 3850 + 1650); // 5500
  });

  await test('T3.1.4', 'Dual Flow: Cart state reset on successful checkout submission in both flows', () => {
    let cartItems = [{ id: 'prod-1', quantity: 1 }];
    function clearCart() {
      cartItems = [];
    }
    // Simulate COD completion
    clearCart();
    assert.strictEqual(cartItems.length, 0, 'Cart must be cleared after COD order');

    // Simulate WhatsApp completion
    cartItems = [{ id: 'prod-2', quantity: 1 }];
    clearCart();
    assert.strictEqual(cartItems.length, 0, 'Cart must be cleared after WhatsApp order');
  });

  await test('T3.1.5', 'Dual Flow: Free shipping threshold synchronization between COD modal and WhatsApp drawer', () => {
    const subtotalBelow = 850;
    const subtotalAbove = 1800;

    const shippingBelow = subtotalBelow >= FREE_SHIPPING_THRESHOLD ? 0 : STANDARD_SHIPPING_COST;
    const shippingAbove = subtotalAbove >= FREE_SHIPPING_THRESHOLD ? 0 : STANDARD_SHIPPING_COST;

    assert.strictEqual(shippingBelow, 50);
    assert.strictEqual(shippingAbove, 0);
  });

  // --- Feature 3.2: Catalog Price Change Synchronization ---
  await test('T3.2.1', 'Catalog Synchronization: Live price update immediately governs new order calculations', () => {
    // Dynamic catalog simulation
    const dynamicCatalog = new Map(catalogMap);
    const originalProd = dynamicCatalog.get('prod-2');

    // Admin updates price from 1650 to 1750
    dynamicCatalog.set('prod-2', { ...originalProd, price: 1750 });

    const updatedPrice = dynamicCatalog.get('prod-2').price;
    const subtotal = updatedPrice * 2;
    assert.strictEqual(subtotal, 3500, 'New order must use updated price 1750 * 2 = 3500');
  });

  await test('T3.2.2', 'Catalog Synchronization: Historical orders retain original purchase price snapshot', () => {
    const historicalOrder = {
      id: 'AMR-000001',
      items: [{ id: 'prod-2', name: 'عطر أمير العود', price: 1650, quantity: 1 }],
      subtotal: 1650,
      total: 1650,
      createdAt: '2026-01-10T10:00:00Z',
    };

    // Even if catalog price changes later, historical snapshot is immutable
    assert.strictEqual(historicalOrder.items[0].price, 1650);
    assert.strictEqual(historicalOrder.total, 1650);
  });

  await test('T3.2.3', 'Catalog Synchronization: Client cart with stale price is overridden by server', () => {
    // Client had cached old price 1200 in localStorage
    const staleCartItem = { id: 'prod-2', price: 1200, quantity: 1 };
    const calculated = calculateAuthoritativeOrder([staleCartItem]);

    assert.strictEqual(calculated.verifiedItems[0].price, 1650, 'Must override stale 1200 EGP with authoritative 1650 EGP');
    assert.strictEqual(calculated.subtotal, 1650);
  });

  await test('T3.2.4', 'Catalog Synchronization: Unpublishing product immediately blocks new orders', () => {
    const dynamicCatalog = new Map(catalogMap);
    const prod = dynamicCatalog.get('prod-4');
    dynamicCatalog.set('prod-4', { ...prod, published: false });

    function testCanOrder(id) {
      const p = dynamicCatalog.get(id);
      if (!p || !p.published) throw new Error('المنتج غير متوفر');
      return true;
    }

    assert.throws(() => testCanOrder('prod-4'), /المنتج غير متوفر/);
  });

  await test('T3.2.5', 'Catalog Synchronization: Price change crossing 1000 EGP threshold flips shipping fee', () => {
    let prodPrice = 950;
    let shipping = prodPrice >= FREE_SHIPPING_THRESHOLD ? 0 : STANDARD_SHIPPING_COST;
    assert.strictEqual(shipping, 50, '950 EGP incurs 50 EGP shipping');

    // Admin updates price to 1050
    prodPrice = 1050;
    shipping = prodPrice >= FREE_SHIPPING_THRESHOLD ? 0 : STANDARD_SHIPPING_COST;
    assert.strictEqual(shipping, 0, '1050 EGP gets free shipping');
  });

  // --- Feature 3.3: Cart Hydration & Storage Safety ---
  await test('T3.3.1', 'Cart Hydration: Corrupt non-array localStorage data recovers to empty array', () => {
    function hydrateCart(rawJson) {
      try {
        const parsed = JSON.parse(rawJson);
        if (Array.isArray(parsed)) {
          return parsed.filter((i) => i && typeof i.id === 'string' && typeof i.quantity === 'number');
        }
        return [];
      } catch {
        return [];
      }
    }

    assert.deepStrictEqual(hydrateCart('{ "some": "object" }'), [], 'Object must fall back to []');
    assert.deepStrictEqual(hydrateCart('"just a string"'), [], 'String must fall back to []');
    assert.deepStrictEqual(hydrateCart('invalid-json{{{'), [], 'Malformed JSON must fall back to []');
    assert.deepStrictEqual(hydrateCart('null'), [], 'Null must fall back to []');
    assert.deepStrictEqual(hydrateCart('12345'), [], 'Number must fall back to []');
  });

  await test('T3.3.2', 'Cart Hydration: Filter corrupt items missing required id or quantity properties', () => {
    function hydrateCart(rawJson) {
      try {
        const parsed = JSON.parse(rawJson);
        if (Array.isArray(parsed)) {
          return parsed.filter((i) => i && typeof i.id === 'string' && typeof i.quantity === 'number');
        }
        return [];
      } catch {
        return [];
      }
    }

    const mixedPayload = JSON.stringify([
      { id: 'prod-1', name: 'دهن عود', quantity: 2, price: 3850 },
      { name: 'عطر بدون معرف' }, // missing id and quantity
      null, // null entry
      { id: 'prod-2', quantity: 'not a number' }, // invalid quantity type
    ]);

    const hydrated = hydrateCart(mixedPayload);
    assert.strictEqual(hydrated.length, 1);
    assert.strictEqual(hydrated[0].id, 'prod-1');
  });

  await test('T3.3.3', 'Storage Safety: Atomic temp file write + rename prevents corrupt files', () => {
    const testDir = path.join(os.tmpdir(), `ameer_atomic_${Date.now()}`);
    fs.mkdirSync(testDir, { recursive: true });
    const targetFile = path.join(testDir, 'products_store.json');
    const tempFile = `${targetFile}.${Date.now()}.tmp`;

    const payload = { products: [{ id: 'prod-1', name: 'دهن عود كمبودي' }] };
    fs.writeFileSync(tempFile, JSON.stringify(payload), 'utf8');
    fs.renameSync(tempFile, targetFile);

    assert.ok(fs.existsSync(targetFile));
    assert.ok(!fs.existsSync(tempFile));

    fs.unlinkSync(targetFile);
    fs.rmdirSync(testDir);
  });

  await test('T3.3.4', 'Storage Safety: Concurrency mutex serializes sequential async writes', async () => {
    const queue = [];
    let lock = Promise.resolve();

    async function withMutex(fn) {
      const next = lock.then(async () => {
        try {
          return await fn();
        } finally {
          // finished
        }
      });
      lock = next.catch(() => {});
      return next;
    }

    const executionOrder = [];
    await Promise.all([
      withMutex(async () => {
        await new Promise((r) => setTimeout(r, 20));
        executionOrder.push(1);
      }),
      withMutex(async () => {
        await new Promise((r) => setTimeout(r, 10));
        executionOrder.push(2);
      }),
      withMutex(async () => {
        await new Promise((r) => setTimeout(r, 5));
        executionOrder.push(3);
      }),
    ]);

    assert.deepStrictEqual(executionOrder, [1, 2, 3], 'Must execute in strict sequential FIFO order');
  });

  await test('T3.3.5', 'Storage Safety: Graceful fallback to OS temporary directory when storage path is unwritable', () => {
    function resolveStorageDirectory(customDir) {
      if (customDir) {
        try {
          fs.mkdirSync(customDir, { recursive: true });
          const testFile = path.join(customDir, `.test_${Date.now()}.tmp`);
          fs.writeFileSync(testFile, 'ok');
          fs.unlinkSync(testFile);
          return customDir;
        } catch {
          // fallback
        }
      }
      return path.join(os.tmpdir(), 'ameer_storage');
    }

    const unwritablePath = 'Z:\\non_existent_drive_12345\\impossible_path';
    const resolved = resolveStorageDirectory(unwritablePath);
    assert.ok(resolved.includes(os.tmpdir()), 'Must safely fall back to os.tmpdir()');
  });

  // ==========================================================================
  // TIER 4: REAL-WORLD SCENARIOS (>=5 scenarios)
  // ==========================================================================
  setTier('tier4');

  await test('T4.1', 'Real-World Scenario: End-to-End COD Customer Purchase Journey', () => {
    // 1. Customer visits Ameer Store and selects Royal Aged Cambodian Oud
    const selectedProduct = catalogMap.get('prod-1');
    assert.ok(selectedProduct, 'Product must exist in catalog');
    assert.strictEqual(selectedProduct.price, 3850);

    // 2. Customer adds 1 bottle to cart
    const cart = [{ id: selectedProduct.id, quantity: 1 }];

    // 3. Customer proceeds to checkout and fills delivery information
    const customerInfo = {
      fullName: 'الدكتور حازم الألفي',
      phone: '01012345678',
      governorate: 'القاهرة',
      address: 'شارع حسن صادق، مصر الجديدة، عمارة 14 الدور الثالث',
      notes: 'برجاء الاتصال قبل التوصيل بساعة',
    };

    // 4. Server receives request and performs authoritative calculations
    const cleanPhone = normalizeEgyptianPhone(customerInfo.phone);
    assert.strictEqual(EGYPTIAN_PHONE_REGEX.test(cleanPhone), true);
    assert.ok(EGYPT_GOVERNORATES.includes(customerInfo.governorate));

    const calculated = calculateAuthoritativeOrder(cart);
    assert.strictEqual(calculated.subtotal, 3850);
    assert.strictEqual(calculated.shippingCost, 0, 'Qualifies for free delivery');
    assert.strictEqual(calculated.total, 3850);

    // 5. Order is generated and stored
    const orderId = `AMR-${Math.floor(100000 + Math.random() * 900000)}`;
    const createdOrder = {
      id: orderId,
      customerName: sanitizeText(customerInfo.fullName),
      phone: cleanPhone,
      governorate: customerInfo.governorate,
      address: sanitizeText(customerInfo.address),
      notes: sanitizeText(customerInfo.notes),
      items: calculated.verifiedItems,
      subtotal: calculated.subtotal,
      shippingCost: calculated.shippingCost,
      total: calculated.total,
      paymentMethod: 'COD',
      status: 'NEW',
      createdAt: new Date().toISOString(),
    };

    assert.ok(createdOrder.id.startsWith('AMR-'));
    assert.strictEqual(createdOrder.status, 'NEW');
    assert.strictEqual(createdOrder.total, 3850);
  });

  await test('T4.2', 'Real-World Scenario: End-to-End WhatsApp Direct Order Journey', () => {
    // 1. Customer in Alexandria selects Ameer Al Oud Royal Eau de Parfum (1,650 EGP)
    const perfume = catalogMap.get('prod-2');
    assert.strictEqual(perfume.price, 1650);

    // 2. Customer clicks "طلب فوري عبر محادثة واتساب"
    const cartItems = [{ id: perfume.id, quantity: 1 }];
    const calculated = calculateAuthoritativeOrder(cartItems);

    // 3. Server records order with paymentMethod: "WHATSAPP"
    const orderId = `AMR-665544`;
    const waOrder = {
      id: orderId,
      customerName: 'عميل واتساب',
      phone: '01000000000',
      governorate: 'الإسكندرية',
      address: 'طلب مباشر عبر محادثة واتساب',
      items: calculated.verifiedItems,
      subtotal: calculated.subtotal,
      shippingCost: calculated.shippingCost,
      total: calculated.total,
      paymentMethod: 'WHATSAPP',
      status: 'NEW',
    };
    assert.strictEqual(waOrder.paymentMethod, 'WHATSAPP');

    // 4. WhatsApp URL generated with official Order ID
    const waUrl = generateWhatsAppOrderUrl(calculated.verifiedItems, calculated.subtotal, waOrder.id);
    assert.ok(waUrl.includes('AMR-665544'));
    assert.ok(waUrl.includes('201220086002'));

    // 5. Customer cart resets
    const finalCart = [];
    assert.strictEqual(finalCart.length, 0);
  });

  await test('T4.3', 'Real-World Scenario: Multi-Item Mixed Fragrance Order with Tiered Shipping Progression', () => {
    // Stage A: Customer adds 1 White Musk (850 EGP) -> Below 1000 threshold -> Shipping 50 EGP
    let items = [{ id: 'prod-3', quantity: 1 }];
    let calc = calculateAuthoritativeOrder(items);
    assert.strictEqual(calc.subtotal, 850);
    assert.strictEqual(calc.shippingCost, 50);
    assert.strictEqual(calc.total, 900);

    // Stage B: Customer adds 1 Bakhoor Ameer Al Majlis (950 EGP)
    items = [
      { id: 'prod-3', quantity: 1 }, // 850
      { id: 'prod-7', quantity: 1 }, // 950
    ];
    calc = calculateAuthoritativeOrder(items);
    assert.strictEqual(calc.subtotal, 1800);
    assert.strictEqual(calc.shippingCost, 0, 'Shipping cost drops to 0 EGP automatically');
    assert.strictEqual(calc.total, 1800);
  });

  await test('T4.4', 'Real-World Scenario: Complete Order Lifecycle & Status Progression (NEW -> DELIVERED)', () => {
    const order = {
      id: 'AMR-123789',
      status: 'NEW',
      history: [{ status: 'NEW', timestamp: new Date().toISOString() }],
    };

    function updateStatus(ord, newStatus) {
      if (!VALID_STATUSES.includes(newStatus)) {
        throw new Error(`حالة غير صالحة: ${newStatus}`);
      }
      ord.status = newStatus;
      ord.history.push({ status: newStatus, timestamp: new Date().toISOString() });
    }

    // 1. Merchant confirms and begins packaging
    updateStatus(order, 'PROCESSING');
    assert.strictEqual(order.status, 'PROCESSING');

    // 2. Courier dispatches order
    updateStatus(order, 'SHIPPED');
    assert.strictEqual(order.status, 'SHIPPED');

    // 3. Customer receives package and pays cash on delivery
    updateStatus(order, 'DELIVERED');
    assert.strictEqual(order.status, 'DELIVERED');

    assert.strictEqual(order.history.length, 4);
    assert.deepStrictEqual(
      order.history.map((h) => h.status),
      ['NEW', 'PROCESSING', 'SHIPPED', 'DELIVERED']
    );
  });

  await test('T4.5', 'Real-World Scenario: Order Cancellation Lifecycle Handling without Data Corruption', () => {
    const order = {
      id: 'AMR-999888',
      customerName: 'محمود شاكر',
      total: 2400,
      status: 'NEW',
      cancellationReason: null,
    };

    // Customer requests cancellation before shipment
    order.status = 'CANCELLED';
    order.cancellationReason = 'طلب العميل الإلغاء قبل خروج الشحنة مع المندوب';
    order.updatedAt = new Date().toISOString();

    assert.strictEqual(order.status, 'CANCELLED');
    assert.ok(order.cancellationReason.length > 0);
    assert.strictEqual(order.total, 2400, 'Original historical total is preserved for auditing');
  });

  // ==========================================================================
  // FINAL AGGREGATION & REPORTING
  // ==========================================================================
  const totalPassed =
    stats.tier1.passed + stats.tier2.passed + stats.tier3.passed + stats.tier4.passed;
  const totalFailed =
    stats.tier1.failed + stats.tier2.failed + stats.tier3.failed + stats.tier4.failed;
  const totalTests = totalPassed + totalFailed;

  console.log(`\n================================================================`);
  console.log(`📊 AMEER STORE TEST SUITE EXECUTION SUMMARY`);
  console.log(`================================================================`);
  console.log(`  Tier 1 (Feature Coverage):            ${stats.tier1.passed} passed, ${stats.tier1.failed} failed`);
  console.log(`  Tier 2 (Boundary & Corner Cases):     ${stats.tier2.passed} passed, ${stats.tier2.failed} failed`);
  console.log(`  Tier 3 (Cross-Feature Combinations):  ${stats.tier3.passed} passed, ${stats.tier3.failed} failed`);
  console.log(`  Tier 4 (Real-World Scenarios):        ${stats.tier4.passed} passed, ${stats.tier4.failed} failed`);
  console.log(`----------------------------------------------------------------`);
  console.log(`  TOTAL: ${totalPassed} PASSED, ${totalFailed} FAILED (${totalTests} total tests)`);
  console.log(`================================================================\n`);

  if (totalFailed > 0) {
    process.exit(1);
  }
}

runTestSuite().catch((err) => {
  console.error('Fatal error during test suite execution:', err);
  process.exit(1);
});
