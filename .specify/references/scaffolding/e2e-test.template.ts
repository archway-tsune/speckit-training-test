/**
 * E2E テストテンプレート
 *
 * 使い方:
 * 1. contracts/spec からユーザー導線の主要フローを導出する
 * 2. worker-aware setup パターンに従い、並列実行時のデータ分離を確保する
 * 3. ページ URL、data-testid 名、操作シーケンスは contracts から導出する
 *
 * ⚠️ 禁止パターン・セルフバリデーション → implementation-rules.md 参照
 */

import { test, expect } from "@playwright/test";

// TODO: contracts から導出 — ログインヘルパーのインポートパス
// import { resetForWorker, loginAsBuyer, loginAsAdmin } from "../helpers/login-helper";

test.describe("ドメイン名 — ユーザーフロー", () => {
  // ⚠️ 品質基準: コメントのみの空 beforeEach は禁止。
  // 以下の 3 ステップ（データリセット・テストデータ投入・認証処理）を必ず実装すること。
  // シードデータへの暗黙的依存は並列実行時にデータ競合を引き起こす。
  test.beforeEach(async ({ page, request }) => {
    // 【必須】Step 1: Worker-aware データリセット — 並列実行時のデータ分離
    const workerIndex = test.info().parallelIndex;
    // TODO: contracts から導出 — データリセット API 呼び出し
    // await request.post("/api/test/reset", { data: { workerIndex } });

    // 【必須】Step 2: テストデータ投入 — テストが必要とするデータを明示的に作成
    // TODO: contracts から導出 — テストデータ作成 API 呼び出し
    // await request.post("/api/test/seed", { data: { workerIndex, scenario: "..." } });

    // 【必須】Step 3: 認証処理 — テスト用ユーザーでログイン
    // TODO: contracts から導出 — ログインヘルパー
    // await loginAsBuyer(page, workerIndex);
  });

  test.describe("一覧表示", () => {
    test("一覧ページが表示されること", async ({ page }) => {
      // TODO: contracts から導出 — ページ URL
      // await page.goto("/domain-path");

      // TODO: contracts から導出 — data-testid 名と期待される表示
      // await expect(page.locator('[data-testid="item-list"]')).toBeVisible();
      // await expect(page.locator('[data-testid="item-card"]')).toHaveCount(expectedCount);
    });
  });

  test.describe("詳細表示", () => {
    test("アイテムをクリックすると詳細ページに遷移すること", async ({
      page,
    }) => {
      // TODO: contracts から導出 — 操作シーケンス
      // await page.goto("/domain-path");
      // await page.locator('[data-testid="item-card"]').first().click();

      // TODO: contracts から導出 — 遷移先 URL パターンと表示内容
      // await expect(page).toHaveURL(/\/domain-path\/\d+/);
      // await expect(page.locator('[data-testid="item-detail"]')).toBeVisible();
    });
  });

  test.describe("作成・更新操作", () => {
    test("フォーム入力と送信が正しく動作すること", async ({ page }) => {
      // TODO: contracts から導出 — フォームフィールドと入力値
      // await page.goto("/domain-path/new");
      // await page.getByLabel("フィールド名").fill("テスト値");
      // await page.getByRole("button", { name: "送信" }).click();

      // TODO: contracts から導出 — 成功時の期待動作
      // await expect(page.locator('[data-testid="success-message"]')).toBeVisible();
    });
  });

  // TODO: contracts から導出 — 追加のユーザーフロー
});

test.describe("ドメイン名 — 未認証アクセス", () => {
  test("未認証ユーザーがログインページにリダイレクトされること", async ({
    page,
  }) => {
    // TODO: contracts から導出 — 保護されたページの URL
    // await page.goto("/domain-path");
    // await expect(page).toHaveURL(/\/login/);
  });
});
