const assert = require("assert");

console.log("🧪 Starting Amir Store Store Automation & Security Automated Test Suite...\n");

// Require compiled or direct functions
const {
  calculateOrderFraudScore,
  evaluateVipGiftAllocation,
  calculateDeliverySla,
  generateWhatsAppDispatchUrl,
  processOrderAutomation,
} = require("../src/lib/automation/order-automation.ts");

const {
  evaluateStockThreshold,
} = require("../src/lib/automation/inventory-automation.ts");

let passed = 0;
let failed = 0;

function runTest(name, fn) {
  try {
    fn();
    console.log(`  ✅ PASS: ${name}`);
    passed++;
  } catch (err) {
    console.error(`  ❌ FAIL: ${name}: ${err.message}`);
    failed++;
  }
}

// 1. Valid Egyptian Order
const validOrder = {
  id: "AMR-TEST-100",
  customerName: "كريم عبد العزيز",
  phone: "01012345678",
  governorate: "القاهرة",
  address: "التجمع الخامس، شارع التسعين الشمالي، فيلا 12",
  paymentMethod: "COD",
  status: "NEW",
  items: [
    {
      id: "p1",
      name: "عطر أمير العود الملكي",
      price: 1450,
      quantity: 1,
    },
  ],
  subtotal: 1450,
  shippingCost: 0,
  total: 1450,
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
};

runTest("Fraud Engine: Valid Egyptian mobile gives low risk score (0)", () => {
  const score = calculateOrderFraudScore(validOrder);
  assert.strictEqual(score, 0);
});

runTest("Fraud Engine: Invalid international / malformed phone is penalized with +40", () => {
  const badPhoneOrder = { ...validOrder, phone: "1234567" };
  const score = calculateOrderFraudScore(badPhoneOrder);
  assert.ok(score >= 40);
});

runTest("Fraud Engine: Incomplete address is penalized with +25", () => {
  const shortAddrOrder = { ...validOrder, address: "شارع" };
  const score = calculateOrderFraudScore(shortAddrOrder);
  assert.ok(score >= 25);
});

runTest("VIP Gift Rules: Order >= 1000 EGP with Oud receives complimentary Oud sample", () => {
  const gift = evaluateVipGiftAllocation(validOrder);
  assert.ok(gift && gift.includes("دهن عود"));
});

runTest("VIP Gift Rules: Order below 1000 EGP receives no free VIP gift", () => {
  const smallOrder = { ...validOrder, subtotal: 800, total: 850 };
  const gift = evaluateVipGiftAllocation(smallOrder);
  assert.strictEqual(gift, undefined);
});

runTest("Delivery SLA: Priority Governorates (Cairo/Giza/Sharkia) receive 24h SLA", () => {
  const slaCairo = calculateDeliverySla("القاهرة");
  assert.strictEqual(slaCairo.days, 1);
  const slaSharkia = calculateDeliverySla("الشرقية");
  assert.strictEqual(slaSharkia.days, 1);
});

runTest("Delivery SLA: Other governorates (Aswan/Alex) receive 48-72h SLA", () => {
  const slaAswan = calculateDeliverySla("أسوان");
  assert.strictEqual(slaAswan.days, 2);
});

runTest("WhatsApp Dispatch: Generates valid encoded URL targeting official 201220086002", () => {
  const url = generateWhatsAppDispatchUrl(validOrder, "عينة ملكية 2 مل");
  assert.ok(url.startsWith("https://wa.me/201220086002?text="));
  assert.ok(url.includes(encodeURIComponent("AMR-TEST-100")));
  assert.ok(url.includes(encodeURIComponent("عطر أمير العود الملكي")));
});

runTest("End-to-End Automation Pipeline: Valid order is auto-approved with zero flags", () => {
  const result = processOrderAutomation(validOrder);
  assert.strictEqual(result.orderId, "AMR-TEST-100");
  assert.strictEqual(result.isFlagged, false);
  assert.strictEqual(result.autoApproved, true);
  assert.ok(result.assignedVipGift);
});

runTest("Inventory Automation: Stock threshold triggers LOW and OUT_OF_STOCK properly", () => {
  const outOfStock = evaluateStockThreshold("p1", "عطر أمير العود", 0);
  assert.strictEqual(outOfStock.alertLevel, "OUT_OF_STOCK");
  assert.strictEqual(outOfStock.reorderRecommended, true);

  const lowStock = evaluateStockThreshold("p1", "عطر أمير العود", 3, 5);
  assert.strictEqual(lowStock.alertLevel, "LOW");
  assert.strictEqual(lowStock.reorderRecommended, true);

  const optimal = evaluateStockThreshold("p1", "عطر أمير العود", 20, 5);
  assert.strictEqual(optimal.alertLevel, "OPTIMAL");
  assert.strictEqual(optimal.reorderRecommended, false);
});

console.log(`\n================================================================`);
console.log(`📊 Automation Test Summary: ${passed} Passed, ${failed} Failed`);
console.log(`================================================================\n`);

if (failed > 0) {
  process.exit(1);
} else {
  process.exit(0);
}
