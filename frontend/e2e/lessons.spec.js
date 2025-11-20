import { test, expect } from "@playwright/test";

test("Lessons page loads and displays items", async ({ page }) => {
  await page.goto("/login");

  await page.fill('input[name="email"]', "teacher@example.com");
  await page.fill('input[name="password"]', "password123");
  await page.click("button:has-text('Login')");

  await page.goto("/lessons");

  await expect(page.locator("h1")).toContainText("Lessons");
});
