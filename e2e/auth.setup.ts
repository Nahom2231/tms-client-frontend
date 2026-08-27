import { test as setup, expect } from '@playwright/test';

declare const process: any;

setup('authenticate as admin', async ({ page }) => {
  await page.goto('/login');

  const identifier =
    process.env.TMS_ADMIN_EMAIL ?? process.env.TMS_ADMIN_USER ?? 'admin@tms.local';
  const password = process.env.TMS_ADMIN_PASS ?? 'AdminPass123!';

  await page.getByLabel(/email|username/i).fill(identifier);
  await page.getByLabel('Password').fill(password);
  await page.getByRole('button', { name: 'Sign In' }).click();

  await expect(page.getByRole('heading', { name: /command center/i })).toBeVisible();

  await page.context().storageState({ path: 'playwright/.auth/admin.json' });
});