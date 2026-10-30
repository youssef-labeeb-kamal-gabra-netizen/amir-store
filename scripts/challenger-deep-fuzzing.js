const assert = require('assert');
const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

const BASE_URL = 'http://localhost:3001';

console.log('🧪 [CHALLENGER 1] Deep Fuzzing & Security Boundary Suite against ' + BASE_URL);

const deepResults = {
  passed: 0,
  failed: 0,
  tests: []
};

async function runDeepTest(category, name, fn) {
  try {
    const outcome = await fn();
    deepResults.passed++;
    deepResults.tests.push({ category, name, passed: true, details: outcome });
    console.log(`  ✅ [PASS] [${category}] ${name}`);
    if (outcome) console.log(`     -> ${outcome}`);
  } catch (err) {
    deepResults.failed++;
    deepResults.tests.push({ category, name, passed: false, error: err.message });
    console.log(`  ❌ [FAIL] [${category}] ${name}`);
    console.log(`     -> Error: ${err.message}`);
  }
}

let ipCounter = 500;
function nextIp() {
  ipCounter++;
  return `10.20.30.${ipCounter % 250 + 1}`;
}

async function main() {
  console.log('\n--- 1. ADMIN AUTHORIZATION & RBAC ATTACK VECTORS ---');

  await runDeepTest('AdminAuth', 'GET /api/orders without session cookie must be rejected with HTTP 403', async () => {
    const res = await fetch(`${BASE_URL}/api/orders`, {
      headers: { 'x-forwarded-for': nextIp() }
    });
    const data = await res.json().catch(() => ({}));
    assert.strictEqual(res.status, 403, `Expected 403, got ${res.status}`);
    assert.strictEqual(data.ok, false);
    return `Anonymous access blocked with 403: ${data.message}`;
  });

  await runDeepTest('AdminAuth', 'GET /api/orders with forged session cookie must be rejected with HTTP 403', async () => {
    const forgedPayload = Buffer.from(JSON.stringify({
      user: { id: 'u-hacker', email: 'hacker@evil.com', role: 'ADMIN' },
      exp: Date.now() + 3600000
    })).toString('base64url');
    const fakeToken = `${forgedPayload}.fake-signature-1234567890abcdef`;

    const res = await fetch(`${BASE_URL}/api/orders`, {
      headers: {
        'Cookie': `lkl_session=${fakeToken}`,
        'x-forwarded-for': nextIp()
      }
    });
    const data = await res.json().catch(() => ({}));
    assert.strictEqual(res.status, 403, `Expected 403, got ${res.status}`);
    return `Forged token blocked with 403: ${data.message}`;
  });

  await runDeepTest('AdminAuth', 'PATCH /api/orders without session cookie must be rejected with HTTP 403', async () => {
    const res = await fetch(`${BASE_URL}/api/orders`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        'x-forwarded-for': nextIp()
      },
      body: JSON.stringify({ id: 'AMR-123456', status: 'SHIPPED' })
    });
    const data = await res.json().catch(() => ({}));
    assert.strictEqual(res.status, 403, `Expected 403, got ${res.status}`);
    return `Unauthorized status update blocked with 403`;
  });

  await runDeepTest('AdminAuth', 'POST /api/admin/products without session cookie must be rejected with HTTP 403', async () => {
    const res = await fetch(`${BASE_URL}/api/admin/products`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-forwarded-for': nextIp()
      },
      body: JSON.stringify({
        name: 'عطر وهمي خبيث',
        price: 10,
        categoryId: 'cat-1',
        shortDescription: 'وصف قصير',
        description: 'وصف تفصيلي',
        published: true,
        featured: false
      })
    });
    const data = await res.json().catch(() => ({}));
    assert.strictEqual(res.status, 403, `Expected 403, got ${res.status}`);
    return `Unauthorized admin product creation blocked with 403`;
  });

  console.log('\n--- 2. ADDITIONAL QUANTITY & TYPE COERCION FUZZING ---');

  const baseOrder = {
    customerName: 'أحمد محمود التميمي',
    phone: '01012345678',
    governorate: 'القاهرة',
    address: 'شارع المعز لدين الله، الجمالية',
    notes: 'طلب فحص الأنواع',
    paymentMethod: 'COD',
  };

  await runDeepTest('TypeCoercion', 'quantity: true (boolean) must be rejected with HTTP 400', async () => {
    const res = await fetch(`${BASE_URL}/api/orders`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-forwarded-for': nextIp()
      },
      body: JSON.stringify({
        ...baseOrder,
        items: [{ id: 'prod-1', quantity: true }]
      })
    });
    const data = await res.json().catch(() => ({}));
    assert.strictEqual(res.status, 400, `Expected 400 for boolean quantity, but got ${res.status}: ${JSON.stringify(data)}`);
    return `Boolean quantity rejected with 400`;
  });

  await runDeepTest('TypeCoercion', 'quantity: [1] (array) must be rejected with HTTP 400', async () => {
    const res = await fetch(`${BASE_URL}/api/orders`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-forwarded-for': nextIp()
      },
      body: JSON.stringify({
        ...baseOrder,
        items: [{ id: 'prod-1', quantity: [1] }]
      })
    });
    const data = await res.json().catch(() => ({}));
    assert.strictEqual(res.status, 400, `Expected 400 for array quantity, but got ${res.status}: ${JSON.stringify(data)}`);
    return `Array quantity rejected with 400`;
  });

  await runDeepTest('TypeCoercion', 'quantity: "" (empty string) must be rejected with HTTP 400', async () => {
    const res = await fetch(`${BASE_URL}/api/orders`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-forwarded-for': nextIp()
      },
      body: JSON.stringify({
        ...baseOrder,
        items: [{ id: 'prod-1', quantity: '' }]
      })
    });
    const data = await res.json().catch(() => ({}));
    assert.strictEqual(res.status, 400, `Expected 400 for empty string quantity, got ${res.status}`);
    return `Empty string quantity rejected with 400: ${data.message}`;
  });

  console.log('\n--- 3. WHATSAPP DUAL FLOW & DEFAULTS STRESS TEST ---');

  await runDeepTest('WhatsAppFlow', 'WhatsApp order with empty customer details succeeds using safe fallbacks', async () => {
    const res = await fetch(`${BASE_URL}/api/orders`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-forwarded-for': nextIp()
      },
      body: JSON.stringify({
        paymentMethod: 'WHATSAPP',
        items: [{ id: 'prod-1', quantity: 1 }]
      })
    });
    const data = await res.json().catch(() => ({}));
    assert.strictEqual(res.status, 200, `Expected 200 for WhatsApp empty fields, got ${res.status}: ${JSON.stringify(data)}`);
    assert.strictEqual(data.order.paymentMethod, 'WHATSAPP');
    assert.strictEqual(data.order.customerName, 'عميل واتساب');
    assert.strictEqual(data.order.phone, '01000000000');
    assert.strictEqual(data.order.governorate, 'القاهرة');
    return `WhatsApp flow gracefully defaulted missing fields and created order ${data.order.id}`;
  });

  console.log('\n--- 4. HTTP SECURITY HEADERS EMPIRICAL VERIFICATION ---');

  await runDeepTest('SecurityHeaders', 'Server responses include strict security headers', async () => {
    const res = await fetch(`${BASE_URL}/`, {
      headers: { 'x-forwarded-for': nextIp() }
    });
    const headers = res.headers;

    const xcto = headers.get('x-content-type-options');
    const xfo = headers.get('x-frame-options');
    const xxp = headers.get('x-xss-protection');

    assert.strictEqual(xcto, 'nosniff', `x-content-type-options must be nosniff, got ${xcto}`);
    assert.strictEqual(xfo, 'DENY', `x-frame-options must be DENY, got ${xfo}`);
    return `Headers verified: X-Content-Type-Options: ${xcto}, X-Frame-Options: ${xfo}`;
  });

  console.log('\n======================================================');
  console.log(`📊 DEEP FUZZING SUMMARY: ${deepResults.passed} PASSED, ${deepResults.failed} FAILED (Total: ${deepResults.tests.length})`);
  console.log('======================================================');

  if (deepResults.failed > 0) {
    console.log('\n❌ FAILED TESTS BREAKDOWN:');
    deepResults.tests.filter(t => !t.passed).forEach((t, idx) => {
      console.log(`  ${idx + 1}. [${t.category}] ${t.name}: ${t.error}`);
    });
  }

  process.exit(deepResults.failed > 0 ? 1 : 0);
}

main().catch(err => {
  console.error('Fatal runner error:', err);
  process.exit(1);
});
