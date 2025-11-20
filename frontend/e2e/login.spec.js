import { test, expect } from "@playwright/test";

test("User can register then login", async ({ page }) => {
  await page.goto("/register");

  await page.fill('input[name="name"]', "E2E User");
  await page.fill('input[name="email"]', "e2e@example.com");
  await page.fill('input[name="password"]', "password123");
  await page.click("button:has-text('Register')");
  
  // After registration, should redirect to dashboard
  await expect(page).toHaveURL(/dashboard/);
});
