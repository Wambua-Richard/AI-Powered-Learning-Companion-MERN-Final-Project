import { test } from '@playwright/test';
import { injectAxe, checkA11y } from 'axe-playwright';

test('Home page accessibility check', async ({ page }) => {
  await page.goto('/');
  await injectAxe(page);
  await checkA11y(page, null, {
    detailedReport: true,
    detailedReportOptions: { html: true }
  });
});