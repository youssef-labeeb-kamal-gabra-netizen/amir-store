import { test, expect } from "@playwright/test";

test.describe("Visual Contrast & Arabic RTL Accessibility Automation", () => {
  const routes = ["/", "/products", "/about", "/services", "/contact", "/policy", "/login"];

  for (const route of routes) {
    test(`route ${route} should enforce proper RTL and Obsidian Dark styling`, async ({ page }) => {
      await page.goto(route);

      // Verify HTML dir="rtl"
      const htmlDir = await page.locator("html").getAttribute("dir");
      expect(htmlDir).toBe("rtl");

      // Verify page background is deep obsidian noir (#08090C)
      const bodyBg = await page.locator("body").evaluate((el) => {
        return window.getComputedStyle(el).backgroundColor;
      });
      // rgb(8, 9, 12) is #08090C
      expect(bodyBg).toBe("rgb(8, 9, 12)");

      // Verify no horizontal overflow (scrollWidth should equal clientWidth)
      const isOverflowing = await page.evaluate(() => {
        return document.documentElement.scrollWidth > document.documentElement.clientWidth;
      });
      expect(isOverflowing).toBe(false);
    });
  }
});
