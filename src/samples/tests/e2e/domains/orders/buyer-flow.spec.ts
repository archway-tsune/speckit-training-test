/** 注文ドメイン - 購入者導線E2Eテスト: 注文確定・履歴確認・一連の購入フローを検証 */
import { test, expect } from '@playwright/test';
import { loginAsBuyer, resetForWorker } from '../../../helpers/login-helper';

test.describe('購入者導線 - 注文', () => {
  test.beforeEach(async ({ page, request }) => {
    const wi = test.info().parallelIndex;
    await resetForWorker(request, wi);
    await loginAsBuyer(page, wi);
  });

  test.describe('注文', () => {
    test('注文を確定できる', async ({ page }) => {
      await page.goto('/sample/catalog');
      await expect(page.locator('h1')).toContainText('商品');
      await page.locator('[data-testid="product-card"]').first().click();
      await expect(page).toHaveURL(/\/sample\/catalog\/[a-f0-9-]+/);
      await page.getByRole('button', { name: /カートに追加/i }).click();
      await expect(page.locator('[data-testid="cart-count"]')).toBeVisible();
      await page.goto('/sample/cart');
      await expect(page.locator('h1')).toContainText('カート');
      await expect(page.locator('[data-testid="cart-subtotal"]')).toBeVisible({ timeout: 10000 });
      await page.getByRole('button', { name: /注文手続きへ/i }).click();
      await expect(page).toHaveURL(/\/sample\/checkout/);
      await page.getByRole('button', { name: /注文を確定/i }).click();
      await expect(page).toHaveURL(/\/sample\/orders\/[a-f0-9-]+/);
      await expect(page.locator('text=ご注文ありがとうございます')).toBeVisible();
    });

    test('注文履歴ページで注文を確認できる', async ({ page }) => {
      await page.goto('/sample/orders');
      await expect(page.locator('h1')).toContainText('注文');
    });

    test('注文詳細を確認できる', async ({ page }) => {
      await page.goto('/sample/catalog');
      await expect(page.locator('h1')).toContainText('商品');
      await page.locator('[data-testid="product-card"]').first().click();
      await expect(page).toHaveURL(/\/sample\/catalog\/[a-f0-9-]+/);
      await page.getByRole('button', { name: /カートに追加/i }).click();
      await expect(page.locator('[data-testid="cart-count"]')).toBeVisible();
      await page.goto('/sample/cart');
      await expect(page.locator('h1')).toContainText('カート');
      await expect(page.locator('[data-testid="cart-subtotal"]')).toBeVisible({ timeout: 10000 });
      await page.getByRole('button', { name: /注文手続きへ/i }).click();
      await expect(page).toHaveURL(/\/sample\/checkout/);
      await page.getByRole('button', { name: /注文を確定/i }).click();
      await expect(page).toHaveURL(/\/sample\/orders\/[a-f0-9-]+/);
      await page.goto('/sample/orders');
      await expect(page.locator('[data-testid="order-row"]').first()).toBeVisible();
      await page.locator('[data-testid="order-row"]').first().click();
      await expect(page.locator('h1')).toContainText('注文詳細');
      await expect(page.locator('[data-testid="order-status"]')).toBeVisible();
    });
  });

  test.describe('一連の購入フロー', () => {
    test('商品閲覧 → カート → 注文確定', async ({ page }) => {
      await page.goto('/sample/catalog');
      await expect(page.locator('h1')).toContainText('商品');
      await page.locator('[data-testid="product-card"]').first().click();
      await expect(page).toHaveURL(/\/sample\/catalog\/[a-f0-9-]+/);
      await expect(page.locator('h1')).toBeVisible();
      await page.getByRole('button', { name: /カートに追加/i }).click();
      await expect(page.locator('[data-testid="cart-count"]')).toBeVisible();
      await page.goto('/sample/cart');
      await expect(page.locator('h1')).toContainText('カート');
      await expect(page.locator('[data-testid="cart-subtotal"]')).toBeVisible({ timeout: 10000 });
      await page.getByRole('button', { name: /注文手続きへ/i }).click();
      await expect(page).toHaveURL(/\/sample\/checkout/);
      await page.getByRole('button', { name: /注文を確定/i }).click();
      await expect(page.locator('text=ご注文ありがとうございます')).toBeVisible();
    });
  });
});
