const assert = require('assert');
const fs = require('fs');
const path = require('path');

const BASE_URL = 'http://localhost:3001';

console.log('🔥 [CHALLENGER 1] Running Adversarial Attack & Stress Test Suite against ' + BASE_URL);

const results = {
  passed: 0,
  failed: 0,
  tests: []
};

async function runTest(category, name, fn) {
  try {
    const outcome = await fn();
    results.passed++;
    results.tests.push({ category, name, passed: true, details: outcome });
    console.log(`  ✅ [PASS] [${category}] ${name}`);
    if (outcome) console.log(`     -> ${outcome}`);
  } catch (err) {
    results.failed++;
    results.tests.push({ category, name, passed: false, error: err.message });
    console.log(`  ❌ [FAIL] [${category}] ${name}`);
    console.log(`     -> Error: ${err.message}`);
  }
}

async function postOrder(payload, headers = {}) {
  const res = await fetch(`${BASE_URL}/api/orders`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      ...headers
    },
    body: JSON.stringify(payload)
  });
  const data = await res.json().catch(() => ({}));
  return { status: res.status, ok: res.ok, data };
}

// Generate unique mock IP so rate limiting tests don't pollute other tests
let ipCounter = 100;
function nextIp() {
  ipCounter++;
  return `192.168.10.${ipCounter}`;
}

async function main() {
  console.log('\n--- 1. PRICE TAMPERING ATTACK HARNESS ---');
  
  // Base valid order payload
  const baseOrder = {
    customerName: 'أحمد محمود التميمي',
    phone: '01012345678',
    governorate: 'القاهرة',
    address: 'شارع المعز لدين الله، الجمالية',
    notes: 'برجاء الاتصال قبل التوصيل',
    paymentMethod: 'COD',
  };

  await runTest('PriceTampering', 'Tampered price: 0 EGP must be overridden by catalog price (prod-1: 3850 EGP)', async () => {
    const res = await postOrder({
      ...baseOrder,
      items: [{ id: 'prod-1', price: 0, quantity: 1 }]
    }, { 'x-forwarded-for': nextIp() });

    assert.strictEqual(res.status, 200, `Expected 200, got ${res.status}: ${JSON.stringify(res.data)}`);
    assert.strictEqual(res.data.order.items[0].price, 3850, 'Price must be 3850, not 0');
    assert.strictEqual(res.data.order.subtotal, 3850, 'Subtotal must be 3850');
    assert.strictEqual(res.data.order.total, 3850, 'Total must be 3850 (free shipping >= 1000)');
    return `Server resolved price to 3850 EGP and total 3850 EGP`;
  });

  await runTest('PriceTampering', 'Tampered price: 1 EGP must be overridden by catalog price', async () => {
    const res = await postOrder({
      ...baseOrder,
      items: [{ id: 'prod-1', price: 1, quantity: 1 }]
    }, { 'x-forwarded-for': nextIp() });

    assert.strictEqual(res.status, 200);
    assert.strictEqual(res.data.order.items[0].price, 3850);
    assert.strictEqual(res.data.order.subtotal, 3850);
    return `Client price 1 EGP ignored; subtotal is 3850 EGP`;
  });

  await runTest('PriceTampering', 'Tampered negative price: -1000 EGP must be overridden by catalog price', async () => {
    const res = await postOrder({
      ...baseOrder,
      items: [{ id: 'prod-1', price: -1000, quantity: 1 }]
    }, { 'x-forwarded-for': nextIp() });

    assert.strictEqual(res.status, 200);
    assert.strictEqual(res.data.order.items[0].price, 3850);
    assert.strictEqual(res.data.order.subtotal, 3850);
    return `Negative client price overridden; subtotal is 3850 EGP`;
  });

  await runTest('PriceTampering', 'Tampered micro price: 0.001 EGP must be overridden by catalog price', async () => {
    const res = await postOrder({
      ...baseOrder,
      items: [{ id: 'prod-1', price: 0.001, quantity: 1 }]
    }, { 'x-forwarded-for': nextIp() });

    assert.strictEqual(res.status, 200);
    assert.strictEqual(res.data.order.items[0].price, 3850);
    return `Micro price overridden; price is 3850 EGP`;
  });

  await runTest('PriceTampering', 'Tampered string price: "free" must be overridden by catalog price', async () => {
    const res = await postOrder({
      ...baseOrder,
      items: [{ id: 'prod-1', price: 'free', quantity: 1 }]
    }, { 'x-forwarded-for': nextIp() });

    assert.strictEqual(res.status, 200);
    assert.strictEqual(res.data.order.items[0].price, 3850);
    return `String price "free" ignored; price is 3850 EGP`;
  });

  await runTest('PriceTampering', 'Missing price field in item payload must be resolved from catalog', async () => {
    const res = await postOrder({
      ...baseOrder,
      items: [{ id: 'prod-1', quantity: 2 }]
    }, { 'x-forwarded-for': nextIp() });

    assert.strictEqual(res.status, 200);
    assert.strictEqual(res.data.order.items[0].price, 3850);
    assert.strictEqual(res.data.order.subtotal, 7700);
    return `Missing price resolved to 3850 EGP, subtotal 7700 EGP`;
  });

  console.log('\n--- 2. QUANTITY & ITEM FUZZING ---');

  await runTest('QuantityFuzzing', 'Negative quantity: -5 must be rejected with HTTP 400', async () => {
    const res = await postOrder({
      ...baseOrder,
      items: [{ id: 'prod-1', quantity: -5 }]
    }, { 'x-forwarded-for': nextIp() });

    assert.strictEqual(res.status, 400, `Expected 400, got ${res.status}`);
    return `Rejected with 400: ${res.data.message}`;
  });

  await runTest('QuantityFuzzing', 'Fractional quantity: 1.5 must be rejected with HTTP 400', async () => {
    const res = await postOrder({
      ...baseOrder,
      items: [{ id: 'prod-1', quantity: 1.5 }]
    }, { 'x-forwarded-for': nextIp() });

    assert.strictEqual(res.status, 400, `Expected 400 for fractional quantity 1.5, but got ${res.status} (order: ${JSON.stringify(res.data.order?.items)})`);
    return `Rejected with 400: ${res.data.message}`;
  });

  await runTest('QuantityFuzzing', 'Fractional quantity: 0.5 must be rejected with HTTP 400', async () => {
    const res = await postOrder({
      ...baseOrder,
      items: [{ id: 'prod-1', quantity: 0.5 }]
    }, { 'x-forwarded-for': nextIp() });

    assert.strictEqual(res.status, 400, `Expected 400, got ${res.status}`);
    return `Rejected with 400: ${res.data.message}`;
  });

  await runTest('QuantityFuzzing', 'Zero quantity: 0 must be rejected with HTTP 400', async () => {
    const res = await postOrder({
      ...baseOrder,
      items: [{ id: 'prod-1', quantity: 0 }]
    }, { 'x-forwarded-for': nextIp() });

    assert.strictEqual(res.status, 400, `Expected 400, got ${res.status}`);
    return `Rejected with 400: ${res.data.message}`;
  });

  await runTest('QuantityFuzzing', 'Huge quantity: 999999 must be rejected with HTTP 400 (exceeds limit 50)', async () => {
    const res = await postOrder({
      ...baseOrder,
      items: [{ id: 'prod-1', quantity: 999999 }]
    }, { 'x-forwarded-for': nextIp() });

    assert.strictEqual(res.status, 400, `Expected 400, got ${res.status}`);
    return `Rejected with 400: ${res.data.message}`;
  });

  await runTest('QuantityFuzzing', 'NaN quantity: "not-a-number" must be rejected with HTTP 400', async () => {
    const res = await postOrder({
      ...baseOrder,
      items: [{ id: 'prod-1', quantity: 'not-a-number' }]
    }, { 'x-forwarded-for': nextIp() });

    assert.strictEqual(res.status, 400, `Expected 400, got ${res.status}`);
    return `Rejected with 400: ${res.data.message}`;
  });

  await runTest('QuantityFuzzing', 'Null quantity: null must be rejected with HTTP 400', async () => {
    const res = await postOrder({
      ...baseOrder,
      items: [{ id: 'prod-1', quantity: null }]
    }, { 'x-forwarded-for': nextIp() });

    assert.strictEqual(res.status, 400, `Expected 400, got ${res.status}`);
    return `Rejected with 400: ${res.data.message}`;
  });

  await runTest('QuantityFuzzing', 'Non-existent product ID: "prod-fake-999" must be rejected with HTTP 400', async () => {
    const res = await postOrder({
      ...baseOrder,
      items: [{ id: 'prod-fake-999', quantity: 1 }]
    }, { 'x-forwarded-for': nextIp() });

    assert.strictEqual(res.status, 400, `Expected 400, got ${res.status}`);
    return `Rejected with 400: ${res.data.message}`;
  });

  await runTest('QuantityFuzzing', 'Item count limit: >20 distinct items must be rejected with HTTP 400', async () => {
    const manyItems = [];
    for (let i = 0; i < 25; i++) {
      manyItems.push({ id: 'prod-1', quantity: 1 });
    }
    const res = await postOrder({
      ...baseOrder,
      items: manyItems
    }, { 'x-forwarded-for': nextIp() });

    assert.strictEqual(res.status, 400, `Expected 400 for >20 items, got ${res.status}`);
    return `Rejected with 400: ${res.data.message}`;
  });

  console.log('\n--- 3. PAYLOAD INJECTION & LENGTH LIMITS ---');

  await runTest('PayloadInjection', 'XSS script tag in customerName must be stripped or rejected', async () => {
    const res = await postOrder({
      ...baseOrder,
      customerName: '<script>alert("XSS")</script>محمد أحمد',
      items: [{ id: 'prod-1', quantity: 1 }]
    }, { 'x-forwarded-for': nextIp() });

    assert.strictEqual(res.status, 200);
    assert.ok(!res.data.order.customerName.includes('<script>'), 'Script tag must be stripped');
    assert.strictEqual(res.data.order.customerName, 'محمد أحمد');
    return `Script tag cleanly stripped: result is "${res.data.order.customerName}"`;
  });

  await runTest('PayloadInjection', 'Pure XSS in customerName (<script>alert(1)</script>) must be rejected as too short', async () => {
    const res = await postOrder({
      ...baseOrder,
      customerName: '<script>alert(1)</script>',
      items: [{ id: 'prod-1', quantity: 1 }]
    }, { 'x-forwarded-for': nextIp() });

    assert.strictEqual(res.status, 400, `Expected 400 for empty stripped name, got ${res.status}`);
    return `Empty stripped name rejected with 400: ${res.data.message}`;
  });

  await runTest('PayloadInjection', 'XSS img tag in address must be stripped', async () => {
    const res = await postOrder({
      ...baseOrder,
      address: '<img src=x onerror=alert(1)>شارع النصر، المعادي، القاهرة',
      items: [{ id: 'prod-1', quantity: 1 }]
    }, { 'x-forwarded-for': nextIp() });

    assert.strictEqual(res.status, 200);
    assert.ok(!res.data.order.address.includes('<img'), 'Image tag must be stripped');
    return `Image tag stripped: result is "${res.data.order.address}"`;
  });

  await runTest('PayloadInjection', 'Extreme customerName length (>100 chars) must be rejected with HTTP 400', async () => {
    const longName = 'أحمد '.repeat(30); // ~150 chars
    const res = await postOrder({
      ...baseOrder,
      customerName: longName,
      items: [{ id: 'prod-1', quantity: 1 }]
    }, { 'x-forwarded-for': nextIp() });

    assert.strictEqual(res.status, 400, `Expected 400, got ${res.status}`);
    return `Name length >100 rejected with 400: ${res.data.message}`;
  });

  await runTest('PayloadInjection', 'Extreme address length (>250 chars) must be rejected with HTTP 400', async () => {
    const longAddress = 'شارع رقم 15، المجاورة الثانية، عمارة الأمل، '.repeat(10); // ~430 chars
    const res = await postOrder({
      ...baseOrder,
      address: longAddress,
      items: [{ id: 'prod-1', quantity: 1 }]
    }, { 'x-forwarded-for': nextIp() });

    assert.strictEqual(res.status, 400, `Expected 400, got ${res.status}`);
    return `Address length >250 rejected with 400: ${res.data.message}`;
  });

  await runTest('PayloadInjection', 'Extreme notes length (>500 chars) must be truncated to 500 chars', async () => {
    const longNotes = 'ملاحظات هامة جداً للتوصيل السريع '.repeat(30); // ~990 chars
    const res = await postOrder({
      ...baseOrder,
      notes: longNotes,
      items: [{ id: 'prod-1', quantity: 1 }]
    }, { 'x-forwarded-for': nextIp() });

    assert.strictEqual(res.status, 200);
    assert.ok(res.data.order.notes.length <= 500, `Notes length must be <= 500, got ${res.data.order.notes.length}`);
    return `Notes truncated to ${res.data.order.notes.length} chars`;
  });

  await runTest('PayloadInjection', 'Invalid Egyptian phone prefix: 01312345678 must be rejected with HTTP 400', async () => {
    const res = await postOrder({
      ...baseOrder,
      phone: '01312345678',
      items: [{ id: 'prod-1', quantity: 1 }]
    }, { 'x-forwarded-for': nextIp() });

    assert.strictEqual(res.status, 400, `Expected 400, got ${res.status}`);
    return `Invalid prefix 013 rejected with 400: ${res.data.message}`;
  });

  await runTest('PayloadInjection', 'Invalid Egyptian phone prefix: 01412345678 must be rejected with HTTP 400', async () => {
    const res = await postOrder({
      ...baseOrder,
      phone: '01412345678',
      items: [{ id: 'prod-1', quantity: 1 }]
    }, { 'x-forwarded-for': nextIp() });

    assert.strictEqual(res.status, 400, `Expected 400, got ${res.status}`);
    return `Invalid prefix 014 rejected with 400: ${res.data.message}`;
  });

  await runTest('PayloadInjection', 'Phone with letters: 0101234567a must be rejected with HTTP 400', async () => {
    const res = await postOrder({
      ...baseOrder,
      phone: '0101234567a',
      items: [{ id: 'prod-1', quantity: 1 }]
    }, { 'x-forwarded-for': nextIp() });

    assert.strictEqual(res.status, 400, `Expected 400, got ${res.status}`);
    return `Phone with letters rejected with 400: ${res.data.message}`;
  });

  await runTest('PayloadInjection', 'International notation Egyptian phone: +201012345678 must be accepted as valid', async () => {
    const res = await postOrder({
      ...baseOrder,
      phone: '+201012345678',
      items: [{ id: 'prod-1', quantity: 1 }]
    }, { 'x-forwarded-for': nextIp() });

    assert.strictEqual(res.status, 200, `Expected 200 for valid +201012345678, but got ${res.status}: ${JSON.stringify(res.data)}`);
    return `Accepted international format: phone normalized to ${res.data.order?.phone}`;
  });

  await runTest('PayloadInjection', 'Fake governorate: "Paris" must be rejected with HTTP 400', async () => {
    const res = await postOrder({
      ...baseOrder,
      governorate: 'Paris',
      items: [{ id: 'prod-1', quantity: 1 }]
    }, { 'x-forwarded-for': nextIp() });

    assert.strictEqual(res.status, 400, `Expected 400, got ${res.status}`);
    return `Fake governorate rejected with 400: ${res.data.message}`;
  });

  await runTest('PayloadInjection', 'Fake governorate: "Tokyo" must be rejected with HTTP 400', async () => {
    const res = await postOrder({
      ...baseOrder,
      governorate: 'Tokyo',
      items: [{ id: 'prod-1', quantity: 1 }]
    }, { 'x-forwarded-for': nextIp() });

    assert.strictEqual(res.status, 400, `Expected 400, got ${res.status}`);
    return `Fake governorate rejected with 400: ${res.data.message}`;
  });

  await runTest('PayloadInjection', 'XSS in governorate: "<script>alert(1)</script>" must be rejected with HTTP 400', async () => {
    const res = await postOrder({
      ...baseOrder,
      governorate: '<script>alert(1)</script>',
      items: [{ id: 'prod-1', quantity: 1 }]
    }, { 'x-forwarded-for': nextIp() });

    assert.strictEqual(res.status, 400, `Expected 400, got ${res.status}`);
    return `XSS governorate rejected with 400: ${res.data.message}`;
  });

  console.log('\n--- 4. RATE LIMITER STRESS TEST ---');

  await runTest('RateLimiter', 'Rapid consecutive requests from single IP must be throttled after limit (5 requests)', async () => {
    const fixedIp = '198.51.100.99';
    const statuses = [];
    for (let i = 0; i < 7; i++) {
      const res = await postOrder({
        ...baseOrder,
        items: [{ id: 'prod-1', quantity: 1 }]
      }, { 'x-forwarded-for': fixedIp });
      statuses.push(res.status);
    }

    const throttled = statuses.filter(s => s === 429);
    assert.ok(throttled.length >= 2, `Expected at least 2 requests throttled with 429, got statuses: ${statuses.join(', ')}`);
    return `Rapid requests throttled: sequence was [${statuses.join(', ')}]`;
  });

  console.log('\n--- 5. STORAGE MUTEX CONCURRENCY TEST ---');

  await runTest('StorageConcurrency', 'Simulate 20 concurrent order creations without file corruption or race conditions', async () => {
    const storageFile = path.join(process.cwd(), 'data', 'storage', 'orders.json');
    let initialCount = 0;
    if (fs.existsSync(storageFile)) {
      const content = fs.readFileSync(storageFile, 'utf8');
      if (content.trim()) {
        initialCount = JSON.parse(content).length;
      }
    }

    const CONCURRENT_COUNT = 20;
    const promises = [];

    for (let i = 0; i < CONCURRENT_COUNT; i++) {
      const ip = nextIp();
      const p = postOrder({
        ...baseOrder,
        customerName: `عميل متزامن رقم ${i + 1}`,
        notes: `طلب اختبار التزامن رقم ${i + 1}`,
        items: [{ id: 'prod-1', quantity: 1 }]
      }, { 'x-forwarded-for': ip });
      promises.push(p);
    }

    const responses = await Promise.all(promises);
    const successful = responses.filter(r => r.status === 200);
    assert.strictEqual(successful.length, CONCURRENT_COUNT, `Expected all ${CONCURRENT_COUNT} to succeed, but ${successful.length} succeeded. Failures: ${JSON.stringify(responses.filter(r => r.status !== 200))}`);

    // Verify disk storage integrity
    assert.ok(fs.existsSync(storageFile), 'Storage file must exist');
    const finalContent = fs.readFileSync(storageFile, 'utf8');
    const finalOrders = JSON.parse(finalContent); // Must parse without syntax error
    assert.ok(Array.isArray(finalOrders), 'Orders on disk must be an array');
    assert.strictEqual(finalOrders.length, initialCount + CONCURRENT_COUNT, `Expected ${initialCount + CONCURRENT_COUNT} orders on disk, found ${finalOrders.length}`);

    // Verify all IDs are unique (no collisions)
    const orderIds = finalOrders.map(o => o.id);
    const uniqueIds = new Set(orderIds);
    assert.strictEqual(uniqueIds.size, orderIds.length, 'Every order ID must be unique');

    return `All ${CONCURRENT_COUNT} concurrent orders written cleanly; storage JSON valid, unique IDs verified`;
  });

  console.log('\n======================================================');
  console.log(`📊 ADVERSARIAL SUITE SUMMARY: ${results.passed} PASSED, ${results.failed} FAILED (Total: ${results.tests.length})`);
  console.log('======================================================');

  if (results.failed > 0) {
    console.log('\n❌ FAILED TESTS BREAKDOWN:');
    results.tests.filter(t => !t.passed).forEach((t, idx) => {
      console.log(`  ${idx + 1}. [${t.category}] ${t.name}: ${t.error}`);
    });
  }

  process.exit(results.failed > 0 ? 1 : 0);
}

main().catch(err => {
  console.error('Fatal runner error:', err);
  process.exit(1);
});
