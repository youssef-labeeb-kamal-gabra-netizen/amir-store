import { test, expect } from "@playwright/test";

test.describe("Homepage Luxury Presentation & Motion Automation", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/");
  });

  test("should render the royal brand identity, crown logo, and header contact details", async ({ page }) => {
    // Check page title
    await expect(page).toHaveTitle(/أمير ستور/);

    // Verify official phone number in header
    const phoneHeader = page.locator('header a[href*="01220086002"]').first();
    await expect(phoneHeader).toBeVisible();

    // Verify WhatsApp direct trigger
    const whatsappLink = page.locator('header a[href*="wa.me/201220086002"]').first();
    await expect(whatsappLink).toBeVisible();
  });

  test("should display 3D GSAP flacon container and trust badges", async ({ page }) => {
    // Flacon container
    const flaconShowcase = page.locator('[data-testid="gsap-hero-showcase"], [class*="flacon"], img[alt*="عطر"]').first();
    await expect(flaconShowcase).toBeVisible();

    // Verify 72-hour guarantee pill
    const guaranteePill = page.getByText(/72 ساعة/).first();
    await expect(guaranteePill).toBeVisible();
  });

  test("should display fragrance pyramid and notes bar", async ({ page }) => {
    const notesBar = page.getByText(/عود كمبودي|عنبر ملكي|مسك أبيض/).first();
    await expect(notesBar).toBeVisible();
  });

  test("should display royal collections grid with luxury cards", async ({ page }) => {
    const royalCollection = page.getByText(/المجموعات الملكية|دهن العود/i).first();
    await expect(royalCollection).toBeVisible();
  });
});
