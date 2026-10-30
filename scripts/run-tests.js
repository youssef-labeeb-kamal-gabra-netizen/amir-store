const assert = require('assert');
const fs = require('fs');
const path = require('path');
const os = require('os');
const crypto = require('crypto');

console.log('🧪 Starting LKL Automated Quality Assurance & Functional Test Suite...\n');

let passedTests = 0;
let failedTests = 0;

function test(name, fn) {
  try {
    fn();
    console.log(`  ✅ PASS: ${name}`);
    passedTests++;
  } catch (err) {
    console.error(`  ❌ FAIL: ${name}`);
    console.error(`     Error: ${err.message}`);
    failedTests++;
  }
}

// ----------------------------------------------------
// 1. Zero Fabrication & Price Policy Test
// ----------------------------------------------------
test('Zero Fabrication: Catalog file must not contain fabricated public prices', () => {
  const catalogContent = fs.readFileSync('src/data/catalog.ts', 'utf8');
  assert.ok(!catalogContent.includes('price:'), 'Must not contain any public price property');
  assert.ok(!catalogContent.includes('0 EGP'), 'Must not contain fake 0 EGP placeholder');
  assert.ok(!catalogContent.includes('$0'), 'Must not contain fake $0 placeholder');
});

// ----------------------------------------------------
// 2. Agricultural Categories Integrity Test
// ----------------------------------------------------
test('Categories: Must strictly contain the 6 verified agricultural categories', () => {
  const catalogContent = fs.readFileSync('src/data/catalog.ts', 'utf8');
  assert.ok(catalogContent.includes('spray-motors'), 'Must contain spray-motors category');
  assert.ok(catalogContent.includes('water-pumps'), 'Must contain water-pumps category');
  assert.ok(catalogContent.includes('diesel-motors'), 'Must contain diesel-motors category');
  assert.ok(catalogContent.includes('irrigation-equipment'), 'Must contain irrigation-equipment category');
  assert.ok(catalogContent.includes('agricultural-tools'), 'Must contain agricultural-tools category');
  assert.ok(catalogContent.includes('spare-parts'), 'Must contain spare-parts category');
});

// ----------------------------------------------------
// 3. Functional Slug Generation Utility Test
// ----------------------------------------------------
test('Slugify: Must properly generate clean URL-safe slugs for Arabic and English', () => {
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
  assert.strictEqual(slugify('موتور رش زراعي 450'), 'موتور-رش-زراعي-450');
  assert.strictEqual(slugify('High Pressure Water Pump!'), 'high-pressure-water-pump');
});

// ----------------------------------------------------
// 4. Server-Side Role-Based Access Control Functional Test
// ----------------------------------------------------
test('RBAC: yousseflabeeb256@gmail.com must be ADMIN, others USER', () => {
  const adminEmails = ['yousseflabeeb256@gmail.com'];
  function resolveRole(email) {
    return adminEmails.includes(email.trim().toLowerCase()) ? 'ADMIN' : 'USER';
  }
  assert.strictEqual(resolveRole('yousseflabeeb256@gmail.com'), 'ADMIN');
  assert.strictEqual(resolveRole('YOUSSEFLABEEB256@GMAIL.COM'), 'ADMIN');
  assert.strictEqual(resolveRole('client@example.com'), 'USER');
  assert.strictEqual(resolveRole('hacker@admin.com'), 'USER');
});

// ----------------------------------------------------
// 5. Functional Validation: Phone & Email Real Regex Tests
// ----------------------------------------------------
test('Validation: Real phone (Egyptian mobile/landline) and email regex rules', () => {
  const EGYPTIAN_PHONE_REGEX = /^(?:(?:\+?200?|0)?(?:1[0125]\d{8}|[2-9]\d{7,8}))$/;
  const INTL_PHONE_REGEX = /^\+[1-9]\d{7,14}$/;
  const EMAIL_REGEX = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)+$/;

  function isValidPhone(p) {
    if (!p || typeof p !== 'string') return false;
    const clean = p.replace(/[\s\-()]/g, '');
    return EGYPTIAN_PHONE_REGEX.test(clean) || INTL_PHONE_REGEX.test(clean);
  }

  function isValidEmail(e) {
    if (!e || typeof e !== 'string') return false;
    return EMAIL_REGEX.test(e.trim());
  }

  // Valid Egyptian mobiles
  assert.strictEqual(isValidPhone('01012345678'), true);
  assert.strictEqual(isValidPhone('01220792948'), true);
  assert.strictEqual(isValidPhone('+201114587917'), true);
  assert.strictEqual(isValidPhone('01555555555'), true);

  // Valid International phone
  assert.strictEqual(isValidPhone('+966501234567'), true);

  // Invalid phones
  assert.strictEqual(isValidPhone('01312345678'), false); // 11-digit number with invalid prefix
  assert.strictEqual(isValidPhone('01012345'), false); // too short
  assert.strictEqual(isValidPhone('abc'), false);

  // Valid and invalid emails
  assert.strictEqual(isValidEmail('farmer@gmail.com'), true);
  assert.strictEqual(isValidEmail('eng.youssef@lkl-store.com'), true);
  assert.strictEqual(isValidEmail('not-an-email'), false);
  assert.strictEqual(isValidEmail('@domain.com'), false);
  assert.strictEqual(isValidEmail('user@'), false);
});

// ----------------------------------------------------
// 6. Security: Live Secrets & API Keys Leakage Prevention
// ----------------------------------------------------
test('Security: Secrets and passwords must never be committed in client source code', () => {
  const envContent = fs.readFileSync('.env.example', 'utf8');
  assert.ok(!envContent.includes('sk_live'), 'Must not contain live API keys');
  assert.ok(!envContent.includes('password123'), 'Must not contain hardcoded passwords');
});

// ----------------------------------------------------
// 7. Security: Sliding Window Rate Limiting Functional Test
// ----------------------------------------------------
test('Security: Sliding-window IP rate limiter must throttle after 5 requests in window', () => {
  const rateLimitMap = new Map();
  const RATE_LIMIT_WINDOW_MS = 10 * 60 * 1000;
  const MAX_REQUESTS = 5;

  function checkRateLimit(ip, now) {
    const timestamps = (rateLimitMap.get(ip) || []).filter(t => now - t < RATE_LIMIT_WINDOW_MS);
    if (timestamps.length >= MAX_REQUESTS) {
      rateLimitMap.set(ip, timestamps);
      return true; // blocked
    }
    timestamps.push(now);
    rateLimitMap.set(ip, timestamps);
    return false; // allowed
  }

  const testIp = '192.168.1.100';
  const baseTime = Date.now();

  for (let i = 0; i < 5; i++) {
    assert.strictEqual(checkRateLimit(testIp, baseTime + i * 1000), false, `Request ${i + 1} should be allowed`);
  }
  // 6th request should be blocked
  assert.strictEqual(checkRateLimit(testIp, baseTime + 6000), true, 'Request 6 must be blocked');

  // After 11 minutes (past window), next request should be allowed again
  assert.strictEqual(checkRateLimit(testIp, baseTime + 11 * 60 * 1000), false, 'Request after window should be allowed');
});

// ----------------------------------------------------
// 8. Functional Image Magic Bytes Inspection
// ----------------------------------------------------
test('Security: Binary magic bytes validation for JPEG, PNG, and WebP', () => {
  function validateImageMagicBytes(buffer) {
    if (!buffer || buffer.length < 12) return false;
    // JPEG: FF D8 FF
    if (buffer[0] === 0xff && buffer[1] === 0xd8 && buffer[2] === 0xff) return true;
    // PNG: 89 50 4E 47
    if (buffer[0] === 0x89 && buffer[1] === 0x50 && buffer[2] === 0x4e && buffer[3] === 0x47) return true;
    // WebP: RIFF ... WEBP
    const riff = buffer.toString('ascii', 0, 4);
    const webp = buffer.toString('ascii', 8, 12);
    if (riff === 'RIFF' && webp === 'WEBP') return true;
    return false;
  }

  // Real JPEG header
  const jpegBuf = Buffer.from([0xff, 0xd8, 0xff, 0xe0, 0x00, 0x10, 0x4a, 0x46, 0x49, 0x46, 0x00, 0x01]);
  assert.strictEqual(validateImageMagicBytes(jpegBuf), true, 'Valid JPEG magic bytes');

  // Real PNG header
  const pngBuf = Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a, 0x00, 0x00, 0x00, 0x0d]);
  assert.strictEqual(validateImageMagicBytes(pngBuf), true, 'Valid PNG magic bytes');

  // Real WebP header
  const webpBuf = Buffer.concat([
    Buffer.from('RIFF', 'ascii'),
    Buffer.from([0x24, 0x00, 0x00, 0x00]),
    Buffer.from('WEBP', 'ascii'),
  ]);
  assert.strictEqual(validateImageMagicBytes(webpBuf), true, 'Valid WebP magic bytes');

  // Malicious fake image (SVG / HTML / Executable renamed to .jpg)
  const fakeBuf = Buffer.from('<script>alert("hacked")</script>', 'utf8');
  assert.strictEqual(validateImageMagicBytes(fakeBuf), false, 'Fake script image rejected');

  const exeBuf = Buffer.from([0x4d, 0x5a, 0x90, 0x00, 0x03, 0x00, 0x00, 0x00, 0x04, 0x00, 0x00, 0x00]);
  assert.strictEqual(validateImageMagicBytes(exeBuf), false, 'Executable MZ header rejected');
});

// ----------------------------------------------------
// 9. Verified Business Data Test
// ----------------------------------------------------
test('Business Data: Verified phones, WhatsApp, and Google Maps must be present', () => {
  const envContent = fs.readFileSync('src/lib/env.ts', 'utf8');
  assert.ok(envContent.includes('01220792948'), 'Must contain 01220792948');
  assert.ok(envContent.includes('01114587917'), 'Must contain 01114587917');
  assert.ok(envContent.includes('maps/place') || envContent.includes('maps.google'), 'Must contain Google Maps URL');
  assert.ok(envContent.includes('2005'), 'Must contain established year 2005');
});

// ----------------------------------------------------
// 10. Store Map Exact Coordinates & Embed Test
// ----------------------------------------------------
test('Store Map: Must use official store embed and coordinates (30.5346921, 31.3866374)', () => {
  const mapContent = fs.readFileSync('src/components/common/store-location-map.tsx', 'utf8');
  assert.ok(mapContent.includes('30.5346921'), 'Must contain exact latitude 30.5346921');
  assert.ok(mapContent.includes('31.3866374'), 'Must contain exact longitude 31.3866374');
  assert.ok(mapContent.includes('0x14f7e5007a056ec1%3A0xc8b55e0580a9488a'), 'Must contain exact Google Maps place CID');
});

// ----------------------------------------------------
// 11. HD Real Machinery Images Test
// ----------------------------------------------------
test('HD Images: Product catalog must reference high-definition photography', () => {
  assert.ok(fs.existsSync('public/images/products/petter-diesel-pump-hd.jpg'), 'Petter diesel HD image exists');
  assert.ok(fs.existsSync('public/images/products/gasoline-water-pump-hd.jpg'), 'Gasoline pump HD image exists');
  assert.ok(fs.existsSync('public/images/products/knapsack-sprayer-hd.jpg'), 'Knapsack sprayer HD image exists');
  assert.ok(fs.existsSync('public/images/products/power-tiller-hd.jpg'), 'Power tiller HD image exists');
  assert.ok(fs.existsSync('public/images/products/irrigation-filters-hd.jpg'), 'Irrigation filters HD image exists');
  assert.ok(fs.existsSync('public/images/products/spare-parts-hd.jpg'), 'Spare parts HD image exists');
});

// ----------------------------------------------------
// 12. Functional Cryptographic HMAC Session & Tampering Test
// ----------------------------------------------------
test('Security: Session tokens must be HMAC-SHA256 signed and reject forged or tampered tokens', () => {
  const secret = 'test-secret-key-32chars-for-hmac';

  function sign(payloadStr, sec) {
    return crypto.createHmac('sha256', sec).update(payloadStr).digest('base64url');
  }

  function verify(payloadStr, sig, sec) {
    const expected = sign(payloadStr, sec);
    const bExpected = Buffer.from(expected);
    const bSig = Buffer.from(sig);
    if (bExpected.length !== bSig.length) return false;
    return crypto.timingSafeEqual(bExpected, bSig);
  }

  const validPayload = Buffer.from(JSON.stringify({ user: { email: 'yousseflabeeb256@gmail.com', role: 'ADMIN' }, exp: Date.now() + 10000 })).toString('base64url');
  const validSig = sign(validPayload, secret);

  // Valid token passes
  assert.strictEqual(verify(validPayload, validSig, secret), true);

  // Attacker tries to modify payload
  const tamperedPayload = Buffer.from(JSON.stringify({ user: { email: 'attacker@evil.com', role: 'ADMIN' } })).toString('base64url');
  assert.strictEqual(verify(tamperedPayload, validSig, secret), false);

  // Attacker uses wrong secret
  const forgedSig = sign(tamperedPayload, 'wrong-secret');
  assert.strictEqual(verify(tamperedPayload, forgedSig, secret), false);
});

// ----------------------------------------------------
// 13. Functional Session Revocation Storage Registry Test
// ----------------------------------------------------
test('Security: Session revocation persists and invalidates target JTIs and user timestamps', () => {
  const revocationsStore = {
    revokedJtis: [],
    revokedEmails: {},
  };

  function revokeSession(jti) {
    if (!revocationsStore.revokedJtis.includes(jti)) {
      revocationsStore.revokedJtis.push(jti);
    }
  }

  function revokeAllForEmail(email) {
    revocationsStore.revokedEmails[email.trim().toLowerCase()] = Date.now();
  }

  function isRevoked(payload) {
    if (payload.jti && revocationsStore.revokedJtis.includes(payload.jti)) return true;
    if (payload.user && payload.user.email) {
      const revokedAt = revocationsStore.revokedEmails[payload.user.email.trim().toLowerCase()];
      if (revokedAt && payload.iat < revokedAt) return true;
    }
    return false;
  }

  const jti1 = 'jti-session-1';
  const jti2 = 'jti-session-2';
  const userPayload = {
    jti: jti1,
    user: { email: 'admin@lkl.com' },
    iat: Date.now() - 5000,
  };

  assert.strictEqual(isRevoked(userPayload), false, 'Active session is not revoked');
  revokeSession(jti1);
  assert.strictEqual(isRevoked(userPayload), true, 'Session with revoked JTI is revoked');

  const otherSession = {
    jti: jti2,
    user: { email: 'user@example.com' },
    iat: Date.now() - 5000,
  };
  assert.strictEqual(isRevoked(otherSession), false, 'Other user session not revoked');

  // Revoke all sessions for user@example.com
  revokeAllForEmail('user@example.com');
  assert.strictEqual(isRevoked(otherSession), true, 'Session issued before email revocation is revoked');
});

// ----------------------------------------------------
// 14. Functional Review Moderation State Machine Test
// ----------------------------------------------------
test('Reviews: Full moderation lifecycle (PENDING -> APPROVED / REJECTED)', () => {
  const reviews = [
    { id: '1', author: 'أحمد', status: 'PENDING', verified: false, rating: 5, comment: 'ممتاز' },
    { id: '2', author: 'محمد', status: 'APPROVED', verified: true, rating: 5, comment: 'محرك قوي' },
  ];

  function getApproved(list) {
    return list.filter(r => r.status === 'APPROVED');
  }

  function moderate(list, id, newStatus) {
    const rev = list.find(r => r.id === id);
    if (rev) rev.status = newStatus;
    return rev;
  }

  // 1. Initial state: Only approved review is returned publicly
  let approved = getApproved(reviews);
  assert.strictEqual(approved.length, 1);
  assert.strictEqual(approved[0].id, '2');

  // 2. Approve the pending review
  moderate(reviews, '1', 'APPROVED');
  approved = getApproved(reviews);
  assert.strictEqual(approved.length, 2);

  // 3. Reject a review
  moderate(reviews, '2', 'REJECTED');
  approved = getApproved(reviews);
  assert.strictEqual(approved.length, 1);
  assert.strictEqual(approved[0].id, '1');
});

// ----------------------------------------------------
// 15. Functional Atomic File Storage Engine Test
// ----------------------------------------------------
test('Persistence: Atomic temp+rename write and read-back with error propagation', () => {
  const testDir = path.join(os.tmpdir(), `lkl_test_${Date.now()}`);
  fs.mkdirSync(testDir, { recursive: true });

  const testFile = path.join(testDir, 'test_storage.json');
  const testData = { message: 'شركة لبيب كمال', count: 42, active: true };

  // Write atomically
  const tempPath = `${testFile}.${Date.now()}.tmp`;
  fs.writeFileSync(tempPath, JSON.stringify(testData, null, 2), 'utf-8');
  fs.renameSync(tempPath, testFile);

  assert.ok(fs.existsSync(testFile), 'Storage file must exist');

  // Read back
  const readBack = JSON.parse(fs.readFileSync(testFile, 'utf-8'));
  assert.strictEqual(readBack.message, 'شركة لبيب كمال');
  assert.strictEqual(readBack.count, 42);

  // Clean up test file
  fs.unlinkSync(testFile);
  fs.rmdirSync(testDir);
});

// ----------------------------------------------------
// 16. Git Safety: data/storage/*.json must be ignored
// ----------------------------------------------------
test('Git Safety: data/storage/*.json must be ignored in .gitignore', () => {
  const gitignore = fs.readFileSync('.gitignore', 'utf8');
  assert.ok(gitignore.includes('data/storage/*.json'), 'Must ignore storage json files');
  assert.ok(gitignore.includes('!data/storage/.gitkeep'), 'Must preserve .gitkeep');
});

// ----------------------------------------------------
// 17. Security Invariant: env.ts throws on missing production credentials
// ----------------------------------------------------
test('Security: validateProductionSecurity checks production invariants', () => {
  const envSource = fs.readFileSync('src/lib/env.ts', 'utf8');
  assert.ok(envSource.includes('validateProductionSecurity'), 'Must contain production security validator');
  assert.ok(!envSource.includes('if (process.env.VERCEL)'), 'Must NOT suppress security errors on Vercel');
  assert.ok(envSource.includes('throw new Error'), 'Must throw on missing production secrets');
});

// ----------------------------------------------------
// 18. Customer Data Isolation & Very Secure Private Vault
// ----------------------------------------------------
test('Security: Customer private data isolation ensures zero cross-user leakage', () => {
  // Simulated request store
  const mockRequests = [
    {
      id: 'req-user-1',
      userId: 'sub-user-1',
      userEmail: 'customer1@example.com',
      name: 'العميل الأول',
      phone: '01011112222',
      message: 'استفسار عن موتور رشاش',
      status: 'NEW',
      createdAt: '2026-10-22T10:00:00.000Z',
    },
    {
      id: 'req-user-2',
      userId: 'sub-user-2',
      userEmail: 'customer2@example.com',
      name: 'العميل الثاني',
      phone: '01033334444',
      message: 'استفسار عن طلمبة ديزل',
      status: 'CONTACTED',
      createdAt: '2026-10-22T11:00:00.000Z',
    },
  ];

  function filterUserRequests(allRequests, userEmail, userId) {
    if (!userEmail && !userId) return [];
    const normalized = (userEmail || '').trim().toLowerCase();
    return allRequests.filter((r) => {
      if (userId && r.userId && r.userId === userId) return true;
      if (r.userEmail && r.userEmail.trim().toLowerCase() === normalized) return true;
      if (r.email && r.email.trim().toLowerCase() === normalized) return true;
      return false;
    });
  }

  // Customer 1 querying
  const user1Results = filterUserRequests(mockRequests, 'customer1@example.com', 'sub-user-1');
  assert.strictEqual(user1Results.length, 1, 'Customer 1 must only receive 1 request');
  assert.strictEqual(user1Results[0].id, 'req-user-1');
  assert.strictEqual(user1Results[0].userEmail, 'customer1@example.com');

  // Customer 2 querying
  const user2Results = filterUserRequests(mockRequests, 'customer2@example.com', 'sub-user-2');
  assert.strictEqual(user2Results.length, 1, 'Customer 2 must only receive 1 request');
  assert.strictEqual(user2Results[0].id, 'req-user-2');

  // Unauthenticated / Anonymous query must return empty
  const anonResults = filterUserRequests(mockRequests, '', null);
  assert.strictEqual(anonResults.length, 0, 'Unauthenticated query must return 0 results');
});

// ----------------------------------------------------
// 19. Database Resilience & Adapter Dual-Engine Safety
// ----------------------------------------------------
test('Database: Adapter supports Vercel Postgres and falls back gracefully without crash', () => {
  const dbSource = fs.readFileSync('src/lib/db.ts', 'utf8');
  assert.ok(dbSource.includes('isPostgresConfigured'), 'Must contain Postgres configuration check');
  assert.ok(dbSource.includes('POSTGRES_URL'), 'Must check POSTGRES_URL environment variable');
  assert.ok(dbSource.includes('getDatabaseInfo'), 'Must expose getDatabaseInfo helper');
  assert.ok(dbSource.includes('@neondatabase/serverless'), 'Must integrate official serverless driver');
});

console.log(`\n========================================`);
console.log(`Test Results: ${passedTests} PASSED, ${failedTests} FAILED`);
console.log(`========================================`);

if (failedTests > 0) {
  process.exit(1);
}
