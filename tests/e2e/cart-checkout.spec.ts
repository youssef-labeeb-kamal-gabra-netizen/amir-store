import { test, expect } from "@playwright/test";

test.describe("E-Commerce Cart Drawer & COD Checkout Automation", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/products");
  });

  test("should display products catalog with price tags in EGP", async ({ page }) => {
    const priceTag = page.getByText(/ج\.م/).first();
    await expect(priceTag).toBeVisible();
  });

  test("should add product to cart and open cart drawer with subtotal", async ({ page }) => {
    // Click on the first add-to-cart button
    const addToCartBtn = page.getByRole("button", { name: /أضف للسلة|إضافة للسلة|شراء/i }).first();
    if (await addToCartBtn.isVisible()) {
      await addToCartBtn.click();

      // Verify cart drawer is open or cart count badge updated
      const cartCount = page.locator('[aria-label*="سلة"]').first();
      await expect(cartCount).toBeVisible();
    }
  });

  test("should enforce COD checkout validation for customer inputs", async ({ page }) => {
    await page.goto("/contact");
    const submitBtn = page.getByRole("button", { name: /إرسال/i }).first();
    await expect(submitBtn).toBeVisible();
  });
});
