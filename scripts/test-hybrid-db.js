const assert = require('assert');

// Simulate setting POSTGRES_URL to an unreachable database
process.env.POSTGRES_URL = 'postgres://fakeuser:fakepass@127.0.0.1:54329/fakedb?connect_timeout=1';

// We need to import our modules
async function run() {
  console.log('Testing hybrid database fallback behavior when POSTGRES_URL is invalid/unreachable...');
  
  // Test 1: Import db.ts
  const db = require('../src/lib/db');
  assert.strictEqual(db.isPostgresConfigured(), true, 'isPostgresConfigured should be true when POSTGRES_URL is set');

  // Test 2: ensurePostgresTables should return false and not crash
  const tablesEnsured = await db.ensurePostgresTables();
  assert.strictEqual(tablesEnsured, false, 'ensurePostgresTables should return false on connection failure');

  // Test 3: Products store fallback
  const productsStore = require('../src/lib/products-store');
  const products = await productsStore.getProductsStore();
  assert.ok(Array.isArray(products), 'getProductsStore should return an array');
  assert.ok(products.length > 0, 'getProductsStore should fallback to local INITIAL_PRODUCTS');

  // Test 4: Orders store fallback
  const ordersStore = require('../src/lib/orders-store');
  const orders = await ordersStore.getOrders();
  assert.ok(Array.isArray(orders), 'getOrders should return an array');

  // Test 5: Order creation fallback
  const newOrder = await ordersStore.createOrder({
    customerName: 'عميل اختبار السقوط التلقائي',
    phone: '01012345678',
    governorate: 'القاهرة',
    address: 'شارع المعز لدين الله الفاطمي',
    paymentMethod: 'COD',
    items: [{ id: products[0].id, quantity: 1 }],
  });
  assert.ok(newOrder, 'Order should be created via fallback');
  assert.match(newOrder.id, /^AMR-\d{6}$/, 'Order should have valid AMR- ID');
  assert.strictEqual(newOrder.status, 'NEW');

  // Test 6: Order status update fallback
  const updatedOrder = await ordersStore.updateOrderStatus(newOrder.id, 'PROCESSING');
  assert.ok(updatedOrder, 'Order status should be updated via fallback');
  assert.strictEqual(updatedOrder.status, 'PROCESSING');

  // Test 7: Product creation, update, toggle, delete fallback
  const newProd = await productsStore.addProduct({
    name: 'عطر تجريبي للاختبار',
    slug: 'test-perfume-unique',
    categoryId: 'pure-oud-oils',
    categoryName: 'دهن العود والزيوت النقية',
    price: 750,
    shortDescription: 'وصف قصير تجريبي',
    description: 'وصف كامل تجريبي',
    images: ['/images/logo.png'],
    specifications: [],
    featured: false,
    published: true,
  });
  assert.ok(newProd, 'Product should be created via fallback');
  assert.strictEqual(newProd.price, 750);

  const updatedProd = await productsStore.updateProduct(newProd.id, { price: 800 });
  assert.ok(updatedProd, 'Product should be updated via fallback');
  assert.strictEqual(updatedProd.price, 800);

  const toggledProd = await productsStore.toggleProductPublished(newProd.id);
  assert.ok(toggledProd, 'Product published should be toggled via fallback');
  assert.strictEqual(toggledProd.published, false);

  const deleted = await productsStore.deleteProduct(newProd.id);
  assert.strictEqual(deleted, true, 'Product should be deleted via fallback');

  console.log('✅ Hybrid database fallback tests passed!');
}

run().catch((err) => {
  console.error('❌ Test failed:', err);
  process.exit(1);
});
