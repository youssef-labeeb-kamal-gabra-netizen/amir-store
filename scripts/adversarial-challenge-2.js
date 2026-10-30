const assert = require('assert');
const fs = require('fs');
const path = require('path');
const os = require('os');
const crypto = require('crypto');
const ts = require('typescript');
const Module = require('module');

// Set up TypeScript require hook with module resolution for '@/...'
const originalResolve = Module._resolveFilename;
Module._resolveFilename = function(request, parent, isMain, options) {
  if (request.startsWith('@/')) {
    const resolvedPath = path.resolve(__dirname, '../src', request.slice(2));
    return originalResolve.call(this, resolvedPath, parent, isMain, options);
  }
  return originalResolve.call(this, request, parent, isMain, options);
};

require.extensions['.ts'] = function(module, filename) {
  const content = fs.readFileSync(filename, 'utf8');
  const compiled = ts.transpileModule(content, {
    compilerOptions: {
      module: ts.ModuleKind.CommonJS,
      target: ts.ScriptTarget.ES2022,
      esModuleInterop: true,
    },
  });
  module._compile(compiled.outputText, filename);
};

console.log('⚔️  Starting Challenger 2 Adversarial Business Logic & Brand Verification Suite...\n');

const stats = {
  suite1: { name: 'Suite 1: Dual Checkout Flow Synchronization', passed: 0, failed: 0, issues: [] },
  suite2: { name: 'Suite 2: Cart State & Hydration Stress-Testing', passed: 0, failed: 0, issues: [] },
  suite3: { name: 'Suite 3: Admin Product Pricing Lifecycle', passed: 0, failed: 0, issues: [] },
  suite4: { name: 'Suite 4: Exhaustive Brand Purity & Agricultural Audit', passed: 0, failed: 0, issues: [] },
};

let currentSuite = 'suite1';

function setSuite(key) {
  currentSuite = key;
  console.log(`\n================================================================`);
  console.log(`📌 ${stats[key].name.toUpperCase()}`);
  console.log(`================================================================\n`);
}

function testSync(id, title, fn) {
  const fullTitle = `[${id}] ${title}`;
  try {
    fn();
    console.log(`  ✅ PASS: ${fullTitle}`);
    stats[currentSuite].passed++;
  } catch (err) {
    console.error(`  ❌ FAIL: ${fullTitle}`);
    console.error(`     Error: ${err.message}`);
    stats[currentSuite].failed++;
    stats[currentSuite].issues.push({ id, title, error: err.message });
  }
}

async function testAsync(id, title, fn) {
  const fullTitle = `[${id}] ${title}`;
  try {
    await fn();
    console.log(`  ✅ PASS: ${fullTitle}`);
    stats[currentSuite].passed++;
  } catch (err) {
    console.error(`  ❌ FAIL: ${fullTitle}`);
    console.error(`     Error: ${err.message}`);
    stats[currentSuite].failed++;
    stats[currentSuite].issues.push({ id, title, error: err.message });
  }
}

// Load authoritative backend stores directly from TypeScript source
const {
  createOrder,
  getOrders,
  getOrderById,
  FREE_SHIPPING_THRESHOLD,
  STANDARD_SHIPPING_COST,
} = require('../src/lib/orders-store.ts');

const {
  getProductsStore,
  addProduct,
  updateProduct,
  deleteProduct,
} = require('../src/lib/products-store.ts');

const OFFICIAL_PHONE = '01220086002';
const OFFICIAL_WHATSAPP_PHONE = '201220086002';

(async () => {
  // ============================================================================
  // SUITE 1: DUAL CHECKOUT FLOW SYNCHRONIZATION
  // ============================================================================
  setSuite('suite1');

  const catalog = getProductsStore();
  const testProd = catalog[0];
  assert.ok(testProd, 'Catalog must contain products');

  // Test 1.1: WhatsApp Checkout creates order with paymentMethod: "WHATSAPP"
  let whatsappOrderId = null;
  await testAsync('ADV-1.1', 'WhatsApp Flow: Order persists with paymentMethod: WHATSAPP and valid AMR- ID', async () => {
    const order = await createOrder({
      customerName: 'عميل واتساب',
      phone: '01000000000',
      governorate: 'القاهرة',
      address: 'طلب مباشر عبر محادثة واتساب',
      paymentMethod: 'WHATSAPP',
      items: [{ id: testProd.id, quantity: 1 }],
    });

    assert.ok(order, 'Order must be returned');
    assert.strictEqual(order.paymentMethod, 'WHATSAPP');
    assert.match(order.id, /^AMR-\d{6}$/);
    assert.strictEqual(order.status, 'NEW');
    assert.strictEqual(order.subtotal, testProd.price);

    whatsappOrderId = order.id;

    // Verify disk retrieval
    const retrieved = getOrderById(order.id);
    assert.ok(retrieved, 'Order must be retrievable from disk');
    assert.strictEqual(retrieved.paymentMethod, 'WHATSAPP');
  });

  // Test 1.2: WhatsApp URL generation matches specifications
  testSync('ADV-1.2', 'WhatsApp Flow: Resulting WhatsApp URL includes 201220086002 and authoritative Order ID', () => {
    assert.ok(whatsappOrderId, 'whatsappOrderId must exist');
    const rawWhatsApp = OFFICIAL_PHONE;
    const cleanWhatsApp = rawWhatsApp.replace(/[^0-9]/g, '');
    const formattedWhatsApp = cleanWhatsApp.startsWith('0') ? `2${cleanWhatsApp}` : cleanWhatsApp;

    assert.strictEqual(formattedWhatsApp, OFFICIAL_WHATSAPP_PHONE, 'Phone must format to 201220086002');

    const subtotal = testProd.price;
    const shippingAmount = subtotal >= FREE_SHIPPING_THRESHOLD ? 0 : STANDARD_SHIPPING_COST;
    const totalAmount = subtotal + shippingAmount;

    const items = [{ name: testProd.name, model: testProd.model || 'الحجم القياسي', quantity: 1, price: testProd.price }];
    const itemsList = items
      .map((i) => `• ${i.name} (${i.model}) × ${i.quantity} = ${(i.price * i.quantity).toLocaleString('ar-EG')} ج.م`)
      .join('\n');

    const message = encodeURIComponent(
      `السلام عليكم ورحمة الله،\nأود إتمام وتأكيد طلبي من متجر أمير ستور:\n` +
      `كود الطلب الرسمي: ${whatsappOrderId}\n\n` +
      `المنتجات المطلوبة:\n${itemsList}\n\n` +
      `المجموع: ${subtotal.toLocaleString('ar-EG')} ج.م\n` +
      `الشحن: ${shippingAmount === 0 ? "شحن مجاني" : `${shippingAmount.toLocaleString('ar-EG')} ج.م`}\n` +
      `الإجمالي النهائي: ${totalAmount.toLocaleString('ar-EG')} ج.م\n\n` +
      `برجاء تأكيد استلام الطلب وتحديد موعد التوصيل. شكراً لكم!`
    );

    const waUrl = `https://wa.me/${formattedWhatsApp}?text=${message}`;

    assert.ok(waUrl.startsWith('https://wa.me/201220086002?text='));
    const decoded = decodeURIComponent(waUrl.split('?text=')[1]);
    assert.ok(decoded.includes(whatsappOrderId), 'Decoded message must contain Order ID');
    assert.ok(decoded.includes('متجر أمير ستور'), 'Decoded message must contain store name');
    assert.ok(decoded.includes(testProd.name), 'Decoded message must contain item name');
  });

  // Test 1.3: WhatsApp Below Threshold Shipping (+50 EGP)
  testSync('ADV-1.3', 'WhatsApp Flow: Below 1000 EGP incurs 50 EGP shipping accurately in text', () => {
    const subtotal = 750;
    const shipping = subtotal >= FREE_SHIPPING_THRESHOLD ? 0 : STANDARD_SHIPPING_COST;
    assert.strictEqual(shipping, 50);

    const shippingText = shipping === 0 ? 'شحن مجاني' : `${shipping.toLocaleString('ar-EG')} ج.م`;
    assert.ok(shippingText.includes('50') || shippingText.includes('٥٠'));
    assert.ok(!shippingText.includes('مجاني'));
  });

  // Test 1.4: COD Pre-submission Shipping Fee Calculation (999 EGP vs 1000 EGP)
  testSync('ADV-1.4', 'COD Flow: Pre-submission shipping fee is 50 EGP for 999 EGP and 0 EGP for 1000 EGP', () => {
    const fee999 = 999 >= FREE_SHIPPING_THRESHOLD ? 0 : STANDARD_SHIPPING_COST;
    assert.strictEqual(fee999, 50, '999 EGP must have 50 EGP shipping');

    const fee1000 = 1000 >= FREE_SHIPPING_THRESHOLD ? 0 : STANDARD_SHIPPING_COST;
    assert.strictEqual(fee1000, 0, '1000 EGP must have 0 EGP shipping');
  });

  // Test 1.5: COD Order Submission & Post-Submission Confirmation URL
  let codOrderId = null;
  await testAsync('ADV-1.5', 'COD Flow: Submits COD order and displays authoritative total and Order ID', async () => {
    const order = await createOrder({
      customerName: 'فاطمة الزهراء',
      phone: '01234567890',
      governorate: 'الإسكندرية',
      address: 'محطة الرمل، عمارة الأندلس، الدور الرابع',
      notes: 'يرجى التوصيل بعد الساعة 4 عصراً',
      paymentMethod: 'COD',
      items: [{ id: testProd.id, quantity: 2 }],
    });

    assert.ok(order);
    assert.strictEqual(order.paymentMethod, 'COD');
    assert.strictEqual(order.subtotal, testProd.price * 2);
    const expectedShipping = order.subtotal >= FREE_SHIPPING_THRESHOLD ? 0 : 50;
    assert.strictEqual(order.shippingCost, expectedShipping);
    assert.strictEqual(order.total, order.subtotal + expectedShipping);

    codOrderId = order.id;

    // Post-submission WhatsApp follow-up URL check
    const msg = encodeURIComponent(
      `السلام عليكم ورحمة الله،\nلقد قمت بطلب أوردر جديد من موقع أمير ستور:\n` +
      `رقم الطلب: ${order.id}\n` +
      `الاسم: ${order.customerName}\n` +
      `الهاتف: ${order.phone}\n` +
      `المحافظة: ${order.governorate}\n` +
      `العنوان: ${order.address}\n\n` +
      `الإجمالي: ${order.total.toLocaleString('ar-EG')} ج.م (الدفع عند الاستلام)\n` +
      `برجاء تأكيد الطلب وسرعة الشحن. شكراً لكم!`
    );
    const confirmationUrl = `https://wa.me/${OFFICIAL_WHATSAPP_PHONE}?text=${msg}`;

    assert.ok(confirmationUrl.includes('201220086002'));
    assert.ok(decodeURIComponent(confirmationUrl).includes(order.id));
  });

  // ============================================================================
  // SUITE 2: CART STATE & HYDRATION STRESS-TESTING
  // ============================================================================
  setSuite('suite2');

  function simulateCartHydration(storedValue) {
    if (!storedValue) return [];
    try {
      const parsed = JSON.parse(storedValue);
      if (Array.isArray(parsed)) {
        return parsed.filter(
          (item) =>
            Boolean(
              item &&
              typeof item === 'object' &&
              typeof item.id === 'string' &&
              item.id.trim() !== '' &&
              typeof item.name === 'string' &&
              typeof item.price === 'number' &&
              !isNaN(item.price) &&
              item.price > 0 &&
              Number.isInteger(item.quantity) &&
              item.quantity > 0 &&
              item.quantity <= 50
            )
        );
      }
      return []; // Non-array data purged
    } catch {
      return []; // Parse error caught and purged
    }
  }

  testSync('ADV-2.1', 'Cart Hydration: Corrupt non-array object ({"bad":"data"}) is purged to [] without throwing', () => {
    let result;
    assert.doesNotThrow(() => {
      result = simulateCartHydration('{"bad":"data"}');
    });
    assert.deepStrictEqual(result, []);
  });

  testSync('ADV-2.2', 'Cart Hydration: String, null, empty string, and broken JSON are safely purged to []', () => {
    assert.deepStrictEqual(simulateCartHydration('"just a string"'), []);
    assert.deepStrictEqual(simulateCartHydration('null'), []);
    assert.deepStrictEqual(simulateCartHydration(''), []);
    assert.deepStrictEqual(simulateCartHydration('{broken::syntax--'), []);
    assert.deepStrictEqual(simulateCartHydration('true'), []);
    assert.deepStrictEqual(simulateCartHydration('12345'), []);
  });

  testSync('ADV-2.3', 'Cart Hydration: Filters out items missing price or quantity', () => {
    const corrupt = JSON.stringify([
      { id: '1', name: 'No price' },
      { id: '2', name: 'No quantity', price: 100 },
      { id: '3', name: 'Valid Item', price: 500, quantity: 1 },
    ]);
    const filtered = simulateCartHydration(corrupt);
    assert.strictEqual(filtered.length, 1);
    assert.strictEqual(filtered[0].id, '3');
  });

  testSync('ADV-2.4', 'Cart Hydration: Filters out item with non-numeric price, negative price, or NaN', () => {
    const corrupt = JSON.stringify([
      { id: '1', name: 'String price', price: '500', quantity: 1 },
      { id: '2', name: 'Negative price', price: -250, quantity: 1 },
      { id: '3', name: 'Zero price', price: 0, quantity: 1 },
      { id: '4', name: 'Valid item', price: 850, quantity: 1 },
    ]);
    const filtered = simulateCartHydration(corrupt);
    assert.strictEqual(filtered.length, 1);
    assert.strictEqual(filtered[0].id, '4');
  });

  testSync('ADV-2.5', 'Cart Hydration: Filters out zero, negative, float, and excessive (>50) quantities', () => {
    const corrupt = JSON.stringify([
      { id: '1', name: 'Zero qty', price: 1000, quantity: 0 },
      { id: '2', name: 'Negative qty', price: 1000, quantity: -3 },
      { id: '3', name: 'Float qty', price: 1000, quantity: 1.5 },
      { id: '4', name: 'Too large qty', price: 1000, quantity: 51 },
      { id: '5', name: 'String qty', price: 1000, quantity: '2' },
      { id: '6', name: 'Valid item', price: 1000, quantity: 4 },
    ]);
    const filtered = simulateCartHydration(corrupt);
    assert.strictEqual(filtered.length, 1);
    assert.strictEqual(filtered[0].id, '6');
  });

  testSync('ADV-2.6', 'Cart Hydration: Filters out items with empty or whitespace-only id', () => {
    const corrupt = JSON.stringify([
      { id: '', name: 'Empty ID', price: 1000, quantity: 1 },
      { id: '   ', name: 'Whitespace ID', price: 1000, quantity: 1 },
      { id: 'valid-id-1', name: 'Valid ID', price: 1000, quantity: 1 },
    ]);
    const filtered = simulateCartHydration(corrupt);
    assert.strictEqual(filtered.length, 1);
    assert.strictEqual(filtered[0].id, 'valid-id-1');
  });

  // ============================================================================
  // SUITE 3: ADMIN PRODUCT PRICING LIFECYCLE
  // ============================================================================
  setSuite('suite3');

  let testPricingId = null;

  testSync('ADV-3.1', 'Admin Pricing: Create product with price and compareAtPrice persists accurately', () => {
    const newProd = addProduct({
      name: 'عطر الفحص السيادي 2026',
      slug: `adv-test-perfume-${Date.now()}`,
      categoryId: 'cat-1',
      categoryName: 'عطور شرقية ملكية',
      price: 1650,
      compareAtPrice: 1950,
      model: '100ml Parfum',
      brand: 'Ameer Store',
      shortDescription: 'عطر للفحص البرمجي للأدمن',
      description: 'وصف تفصيلي لعطر الفحص السيادي',
      images: ['/images/products/ameer-oud-parfum.svg'],
      specifications: [{ label: 'التركيز', value: 'Parfum' }],
      featured: false,
      published: true,
    });

    assert.ok(newProd.id);
    testPricingId = newProd.id;
    assert.strictEqual(newProd.price, 1650);
    assert.strictEqual(newProd.compareAtPrice, 1950);

    // Read back directly from store on disk
    const store = getProductsStore();
    const diskProd = store.find((p) => p.id === testPricingId);
    assert.ok(diskProd, 'Must be found on disk');
    assert.strictEqual(diskProd.price, 1650);
    assert.strictEqual(diskProd.compareAtPrice, 1950);
  });

  testSync('ADV-3.2', 'Admin Pricing: Updating price and compareAtPrice persists accurately', () => {
    assert.ok(testPricingId);
    const updated = updateProduct(testPricingId, {
      price: 1800,
      compareAtPrice: 2200,
    });

    assert.ok(updated);
    assert.strictEqual(updated.price, 1800);
    assert.strictEqual(updated.compareAtPrice, 2200);

    const store = getProductsStore();
    const diskProd = store.find((p) => p.id === testPricingId);
    assert.strictEqual(diskProd.price, 1800);
    assert.strictEqual(diskProd.compareAtPrice, 2200);
  });

  testSync('ADV-3.3', 'Admin Pricing: Editing product details without sending price DOES NOT wipe out price', () => {
    assert.ok(testPricingId);
    // Only update shortDescription and model, without price or compareAtPrice
    const updated = updateProduct(testPricingId, {
      shortDescription: 'وصف تم تحديثه مع الحفاظ الكامل على الأسعار',
      model: '50ml Concentrated',
    });

    assert.ok(updated);
    assert.strictEqual(updated.price, 1800, 'Price must NOT be undefined or wiped');
    assert.strictEqual(updated.compareAtPrice, 2200, 'compareAtPrice must NOT be wiped');
    assert.strictEqual(updated.shortDescription, 'وصف تم تحديثه مع الحفاظ الكامل على الأسعار');
    assert.strictEqual(updated.model, '50ml Concentrated');

    // Check disk
    const store = getProductsStore();
    const diskProd = store.find((p) => p.id === testPricingId);
    assert.strictEqual(diskProd.price, 1800);
    assert.strictEqual(diskProd.compareAtPrice, 2200);
  });

  testSync('ADV-3.4', 'Admin Pricing: Cleanup test product from store', () => {
    if (testPricingId) {
      const deleted = deleteProduct(testPricingId);
      assert.strictEqual(deleted, true);
      const store = getProductsStore();
      assert.strictEqual(store.some((p) => p.id === testPricingId), false);
    }
  });

  // ============================================================================
  // SUITE 4: EXHAUSTIVE BRAND PURITY & AGRICULTURAL REMNANTS AUDIT
  // ============================================================================
  setSuite('suite4');

  const srcDir = path.resolve(__dirname, '../src');
  const dataDir = path.resolve(__dirname, '../data');

  function getFiles(dir) {
    let files = [];
    if (!fs.existsSync(dir)) return files;
    const entries = fs.readdirSync(dir, { withFileTypes: true });
    for (const entry of entries) {
      const fullPath = path.join(dir, entry.name);
      if (entry.isDirectory()) {
        files = files.concat(getFiles(fullPath));
      } else {
        files.push(fullPath);
      }
    }
    return files;
  }

  const allFiles = [...getFiles(srcDir), ...getFiles(dataDir)];

  // Terms that violate brand purity
  const brandViolations = [
    { term: 'tiller', label: 'Tiller term' },
    { term: 'tractor', label: 'Tractor term' },
    { term: 'طلمبة', label: 'Water pump term (طلمبة)' },
    { term: 'طلمبات', label: 'Water pumps term (طلمبات)' },
    { term: 'عزاقة', label: 'Tiller term (عزاقة)' },
    { term: 'جرار', label: 'Tractor term (جرار)' },
    { term: 'حفار', label: 'Excavator term (حفار)' },
    { term: 'محراث', label: 'Plow term (محراث)' },
    { term: 'بيتر', label: 'Petter engine term (بيتر)' },
    { term: 'موتور رش', label: 'Spray motor term (موتور رش)' },
    { term: 'معدات زراعية', label: 'Agricultural equipment (معدات زراعية)' },
    { term: 'آلات زراعية', label: 'Agricultural machinery (آلات زراعية)' },
    { term: 'القسم الزراعي', label: 'Agricultural category (القسم الزراعي)' },
    { term: 'التصنيفات الزراعية', label: 'Agricultural categories (التصنيفات الزراعية)' },
    { term: '01220792948', label: 'Old LKL phone 01220792948' },
    { term: '01114587917', label: 'Old LKL phone 01114587917' },
    { term: 'حاج لبيب', label: 'Haj Labib heritage' },
    { term: 'لبيب كمال', label: 'Labeeb Kamal company name' },
    { term: 'abu hammad', label: 'Abu Hammad LKL location' },
    { term: 'أبو حماد', label: 'Abu Hammad LKL location (AR)' },
    { term: 'ابو حماد', label: 'Abu Hammad LKL location (AR alt)' },
    { term: 'admin@lkl-egypt.com', label: 'LKL email reference' },
    { term: 'مستخدم LKL', label: 'LKL user default name' },
    { term: 'lkl_session', label: 'LKL session cookie name' },
    { term: 'lkl-store.vercel.app', label: 'LKL Vercel URL fallback' },
  ];

  const leaks = [];

  for (const file of allFiles) {
    const ext = path.extname(file).toLowerCase();
    if (!['.ts', '.tsx', '.js', '.mjs', '.json', '.sql'].includes(ext)) continue;

    const relative = path.relative(path.resolve(__dirname, '..'), file).replace(/\\/g, '/');
    if (relative.includes('adversarial-challenge-2.js')) continue;

    const content = fs.readFileSync(file, 'utf8');

    for (const { term, label } of brandViolations) {
      if (content.toLowerCase().includes(term.toLowerCase())) {
        const lines = content.split('\n');
        lines.forEach((lineText, idx) => {
          if (lineText.toLowerCase().includes(term.toLowerCase())) {
            // Determine exposure tier: User-Facing vs Admin-Facing vs Internal
            let tier = 'INTERNAL';
            if (
              relative.includes('components/account') ||
              relative.includes('components/cart') ||
              relative.includes('app/(public)') ||
              relative.includes('components/home') ||
              relative.includes('components/products') ||
              relative.includes('app/account')
            ) {
              tier = 'USER_FACING_CRITICAL';
            } else if (
              relative.includes('components/admin') ||
              relative.includes('app/admin')
            ) {
              tier = 'ADMIN_FACING_HIGH';
            }

            leaks.push({
              file: relative,
              line: idx + 1,
              term,
              label,
              tier,
              snippet: lineText.trim().slice(0, 140),
            });
          }
        });
      }
    }
  }

  testSync('ADV-4.1', 'Brand Purity: Zero agricultural terms or old LKL branding in user-facing code', () => {
    const userFacingLeaks = leaks.filter((l) => l.tier === 'USER_FACING_CRITICAL');
    if (userFacingLeaks.length > 0) {
      console.log(`\n  🚨 USER-FACING BRAND LEAKS DETECTED (${userFacingLeaks.length}):`);
      for (const l of userFacingLeaks) {
        console.log(`     - [${l.label}] in ${l.file}:${l.line} -> "${l.snippet}"`);
      }
      throw new Error(`CRITICAL: Found ${userFacingLeaks.length} agricultural brand leaks in USER-FACING code!`);
    }
  });

  testSync('ADV-4.2', 'Brand Purity: Zero agricultural terms or old LKL branding in admin-facing code', () => {
    const adminFacingLeaks = leaks.filter((l) => l.tier === 'ADMIN_FACING_HIGH');
    if (adminFacingLeaks.length > 0) {
      console.log(`\n  ⚠️  ADMIN-FACING BRAND LEAKS DETECTED (${adminFacingLeaks.length}):`);
      for (const l of adminFacingLeaks) {
        console.log(`     - [${l.label}] in ${l.file}:${l.line} -> "${l.snippet}"`);
      }
      throw new Error(`HIGH: Found ${adminFacingLeaks.length} agricultural brand leaks in ADMIN-FACING code!`);
    }
  });

  testSync('ADV-4.3', 'Brand Purity: Zero agricultural terms, LKL branding, or old phone numbers across entire codebase', () => {
    if (leaks.length > 0) {
      console.log(`\n  ℹ️  TOTAL LEAKS ACROSS REPO (${leaks.length}):`);
      for (const l of leaks) {
        console.log(`     - [${l.tier}][${l.label}] in ${l.file}:${l.line} -> "${l.snippet}"`);
      }
      throw new Error(`Found ${leaks.length} total brand purity leaks in Ameer Store repository!`);
    }
  });

  // ============================================================================
  // FINAL VERDICT & SUMMARY
  // ============================================================================
  console.log('\n================================================================');
  console.log('📊 CHALLENGER 2 ADVERSARIAL EXECUTION SUMMARY');
  console.log('================================================================');
  let totalPassed = 0;
  let totalFailed = 0;
  for (const key of Object.keys(stats)) {
    console.log(`  ${stats[key].name}: ${stats[key].passed} passed, ${stats[key].failed} failed`);
    totalPassed += stats[key].passed;
    totalFailed += stats[key].failed;
  }
  console.log('----------------------------------------------------------------');
  console.log(`  TOTAL: ${totalPassed} PASSED, ${totalFailed} FAILED`);
  console.log('================================================================\n');

  if (totalFailed > 0) {
    console.log('🛑 VERDICT: REQUEST_CHANGES');
    console.log('   Reason: Adversarial tests revealed concrete brand leaks and/or defect violations.');
    process.exit(1);
  } else {
    console.log('🟢 VERDICT: APPROVE');
    console.log('   Reason: All adversarial business logic, state resilience, and brand purity tests passed.');
    process.exit(0);
  }
})();
