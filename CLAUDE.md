# ec-site-arch Development Guidelines

Auto-generated from all feature plans. Last updated: 2026-02-15

## Active Technologies
- TypeScript 5 + React 18 + Next.js 14 (App Router), Vitest 1.6, Playwright 1.45, React Testing Library 16 (004-consolidate-sample-tests)
- N/A（ナビゲーション定義の変更のみ） (005-nav-control)
- YAML (GitHub Actions), PowerShell 5.1+, Bash (GitHub Actions runner) + GitHub Actions (`actions/checkout@v4`, `actions/setup-node@v4`), GitHub CLI (`gh`) (006-release-automation)
- TypeScript 5 + React 18 + Next.js 14 (App Router) + Next.js App Router, Tailwind CSS 3 (007-separate-sample-production)
- N/A（インメモリストアは `@/infrastructure/` に配置済み、変更なし） (007-separate-sample-production)
- TypeScript 5 (strict mode) + Next.js 14 (App Router), React 18, Zod, Tailwind CSS 3 (008-quality-guard)
- インメモリストア（`globalThis` + `Map<string, T>`） (008-quality-guard)
- N/A（Markdown テンプレート修正のみ） (009-green-test-mandatory)
- N/A（Markdown テンプレート修正、YAML、Bash スクリプトのみ） + N/A（コード依存なし） (010-tdd-task-generation)
- N/A（Markdown テンプレート修正、YAML、コマンド定義のみ） + N/A（コード依存なし） (011-tdd-red-test-policy)
- N/A（Markdown テンプレート修正、YAML、コマンド定義のみ） + N/A（コード依存なし） (012-tdd-test-execution-enforcement)
- TypeScript 5 + React 18 + Next.js 14 (App Router) + Zod, Tailwind CSS 3, Playwright 1.45 (per-worker parallel E2E) (014-optimize-sample-iteration)
- N/A（Markdown ファイルの編集のみ） (015-speckit-output-language)
- N/A（Markdown ファイルの編集のみ） + N/A（コード依存なし） (016-promote-red-scaffolding)
- TypeScript 5 + React 18 + Next.js 14 (App Router) + React, Next.js, Tailwind CSS 3 (017-promote-productcard-template)
- N/A（UI コンポーネントのみ） (017-promote-productcard-template)
- TypeScript 5 (strict mode) + Next.js 14 (App Router) + React 18, Zod, Tailwind CSS 3 (019-tdd-red-test-continuity)
- N/A（本機能はプロセス改善であり、ストレージ変更なし） (019-tdd-red-test-continuity)
- TypeScript 5 (strict mode) + React 18 + Next.js 14 (App Router) + Vitest 1.6, React Testing Library 16, @testing-library/jest-dom (021-add-coverage-tests)
- N/A（テスト追加のみ） (021-add-coverage-tests)
- N/A（Markdown ファイル編集のみ） + N/A（コード依存なし） (022-command-modularize)
- TypeScript 5 (strict mode) + Next.js 14 (App Router) + N/A（既存コードのリネームのみ） (026-fix-global-store-collision)
- N/A（インメモリストアの設計変更なし） (026-fix-global-store-collision)
- TypeScript 5 (strict mode) + Next.js 14 (App Router), React 18, Vitest 1.6 (027-refactor-code-quality)
- インメモリストア（`createStore<T>()` via `@/infrastructure/store`）— HMR 対応共通化済み (027-refactor-code-quality)
- N/A（Markdown テンプレート・ルールファイルの編集のみ） + N/A（コード依存なし） (028-tdd-template-hardening)


## Project Structure

```text
src/
  app/                        # 本番ページ・API Routes（@/domains/ 経由）
    (samples)/sample/         # サンプルページ・API Routes（/sample/* URL）
  contracts/                  # 本番インターフェース（自由に変更可）
  domains/                    # ドメインスタブ（NotImplementedError）
  foundation/                 # 共通基盤（認証・エラー・バリデーション）※共有
    errors/domain-errors.ts   # 共通ドメインエラー（NotFoundError, NotImplementedError）
    errors/handler.ts         # handleError() — 全 API ルート統一エラーハンドリング
  infrastructure/             # 本番リポジトリ実装（自由に変更可）
    id.ts                     # generateId() — UUID 生成共通ユーティリティ
    store.ts                  # createStore<T>() — HMR 対応インメモリストア
    auth/session.ts           # createGuestSession() — ゲストセッションファクトリ
  samples/contracts/          # サンプルインターフェース（凍結・読取専用）
  samples/infrastructure/     # サンプルリポジトリ実装（凍結・読取専用）
  samples/domains/            # サンプルドメイン実装
  samples/tests/              # サンプルテスト（unit/integration/e2e）
  templates/                  # UIテンプレート ※共有
tests/
```

## Commands

```bash
# Development
pnpm dev                          # Start Next.js dev server
pnpm build                        # Build for production
pnpm typecheck                    # TypeScript type check
pnpm lint                         # ESLint with --cache

# Sample Tests
pnpm test:unit:samples            # Unit tests (vitest, 69 tests)
pnpm test:integration:samples     # Integration tests (vitest, 25 tests)
pnpm test:e2e:samples             # E2E tests (playwright, 25 tests, 5 workers parallel)

# Production Tests
pnpm test:unit                    # Unit tests for production code
pnpm test:integration             # Integration tests for production code
pnpm test:e2e                     # E2E tests for production code
pnpm test:coverage                # Coverage report

# Speckit Workflow
/speckit.specify                  # Create feature specification
/speckit.clarify                  # Clarify spec ambiguities
/speckit.plan                     # Generate implementation plan
/speckit.tasks                    # Generate task breakdown
/speckit.implement                # Execute implementation tasks
/speckit.scaffold <domain>        # Generate new domain boilerplate
/speckit.checklist                # Generate quality checklist
/speckit.analyze                  # Cross-artifact consistency check
```

## Code Style

General: Follow standard conventions

## Recent Changes
- 028-tdd-template-hardening: Added N/A（Markdown テンプレート・ルールファイルの編集のみ） + N/A（コード依存なし）
- 027-refactor-code-quality: API エラーハンドリング統一(handleError)、ドメインエラー一元化(domain-errors.ts)、インフラユーティリティ共通化(id.ts/store.ts)、logger統一、空catch修正、createGuestSession導入



<!-- MANUAL ADDITIONS START -->
<!-- MANUAL ADDITIONS END -->
