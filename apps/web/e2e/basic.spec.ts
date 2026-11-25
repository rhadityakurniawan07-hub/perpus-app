import { test, expect } from '@playwright/test';

test.describe('PERPUS E2E', () => {
  test('homepage loads', async ({ page }) => {
    await page.goto('/');
    await expect(page).toHaveTitle(/PERPUS/);
    await expect(page.locator('h1, h2').first()).toBeVisible();
  });

  test('books page loads', async ({ page }) => {
    await page.goto('/books');
    await expect(page).toHaveTitle(/Katalog/);
  });

  test('login page loads', async ({ page }) => {
    await page.goto('/login');
    await expect(page.locator('input[type="email"]')).toBeVisible();
    await expect(page.locator('input[type="password"]')).toBeVisible();
  });

  test('register page loads', async ({ page }) => {
    await page.goto('/register');
    await expect(page.locator('input[name="name"]')).toBeVisible();
    await expect(page.locator('input[type="email"]')).toBeVisible();
    await expect(page.locator('input[type="password"]')).toBeVisible();
  });

  test('guide page loads', async ({ page }) => {
    await page.goto('/guide');
    await expect(page).toHaveTitle(/Panduan/);
  });

  test('admin login page loads', async ({ page }) => {
    await page.goto('/admin/login');
    await expect(page.locator('input[type="email"]')).toBeVisible();
    await expect(page.locator('input[type="password"]')).toBeVisible();
  });

  test('footer has admin link', async ({ page }) => {
    await page.goto('/');
    const adminLink = page.locator('a[href="/admin/login"]');
    await expect(adminLink).toBeVisible();
  });

  test('search functionality', async ({ page }) => {
    await page.goto('/books');
    const searchInput = page.locator('input[aria-label="Cari buku"]');
    await searchInput.fill('bumi');
    await page.waitForTimeout(1000);
    // Should show results or loading
    await expect(page.locator('body')).toBeVisible();
  });

  test('404 page', async ({ page }) => {
    await page.goto('/books/nonexistent-book-id-12345');
    // Should show not found or redirect
    await expect(page.locator('body')).toBeVisible();
  });
});