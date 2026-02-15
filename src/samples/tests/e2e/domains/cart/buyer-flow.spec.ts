/** カートドメイン - 購入者導線E2Eテスト: カート操作（表示・空状態・数量変更・注文手続き）を検証 */
import { test, expect } from '@playwright/test';
import { loginAsBuyer, resetForWorker } from '../../../helpers/login-helper';

test.describe('購入者導線 - カート', () => {
  test.beforeEach(async ({ page, request }) => {
    const wi = test.info().parallelIndex;
    await resetForWorker(request, wi);
    await loginAsBuyer(page, wi);
  });

  test.describe('カート', () => {
    test('カートページが表示される', async ({ page }) => {
      await page.goto('/sample/cart');
      await expect(page.locator('h1')).toContainText('カート');
    });

    test('カートが空の場合は空状態を表示する', async ({ page }) => {
      await page.goto('/sample/cart');
      await expect(page.locator('text=カートは空です')).toBeVisible();
    });

    test('カート内商品の数量を変更できる', async ({ page }) => {
      await page.goto('/sample/catalog/550e8400-e29b-41d4-a716-446655440000');
      await page.getByRole('button', { name: /カートに追加/i }).click();
      await page.goto('/sample/cart');
      await page.locator('select').first().selectOption('3');
      await expect(page.locator('[data-testid="cart-subtotal"]')).toBeVisible();
    });

    test('注文手続きに進める', async ({ page }) => {
      await page.goto('/sample/catalog/550e8400-e29b-41d4-a716-446655440000');
      await page.getByRole('button', { name: /カートに追加/i }).click();
      await expect(page.locator('[data-testid="cart-count"]')).toBeVisible();
      await page.goto('/sample/cart');
      await expect(page.locator('[data-testid="cart-subtotal"]')).toBeVisible();
      await page.getByRole('button', { name: /注文手続きへ/i }).click();
      await expect(page).toHaveURL(/\/sample\/checkout/);
    });
  });
});
