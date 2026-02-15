# Getting Started - セットアップガイド

EC Site Architecture Templateを使って新規プロジェクトを開始する手順です。

---

## 前提条件

- Node.js 18以上
- pnpm
- Claude Code（speckitコマンド実行用）

---

## セットアップ手順

### Step 1: GitHubリポジトリをクローン

```bash
git clone <your-repo-url>
cd <your-repo>
```

### Step 2: speckit初期化

既存リポジトリのルートディレクトリで実行します：

```bash
specify init --here --ai claude
```

これにより以下が作成されます：
- `.claude/commands/` - speckitスキル定義
- `.specify/` - speckit設定とテンプレート

### Step 3: アーキテクチャコードの展開

リリースZIPをリポジトリのルートディレクトリ直下に解凍します：

```bash
unzip ec-site-arch.zip -d .
```

### Step 4: プロジェクト憲法の作成

Claude Codeで以下を実行：

```
/speckit.constitution
```

対話形式でプロジェクト情報を入力すると、以下を含む憲法が作成されます：
- 依存関係のインストール手順
- プロジェクト情報の更新方法
- アーキテクチャの使い方
- 品質基準とテストコマンド

入力例は `docs/examples/constitution-example.md` を参照してください。

---

## 開発ワークフロー

### 新機能の追加

```bash
# 1. 機能仕様を作成
/speckit.specify "決済機能を追加"

# 2. 実装計画を作成
/speckit.plan

# 3. タスクを生成
/speckit.tasks

# 4. 実装を開始
/speckit.implement
```

---

## アーキテクチャの依存構造

本テンプレートでは、本番コードとサンプル実装を完全に分離しています：

```
本番ページ:       src/app/(buyer)/, admin/        → @/domains/ をインポート（スタブ → 本番実装に置換）
本番API:          src/app/api/                     → @/domains/ をインポート（スタブ状態では 501 応答）
本番インフラ:     src/infrastructure/              → @/contracts/ をインポート（本番専用・自由に変更可）
本番契約:         src/contracts/                   → 本番専用インターフェース（自由に変更可）
サンプル画面:     src/app/(samples)/sample/        → @/samples/domains/ を直接インポート
サンプルインフラ: src/samples/infrastructure/      → @/samples/contracts/ をインポート（凍結・読取専用）
サンプル契約:     src/samples/contracts/           → サンプル専用インターフェース（凍結・読取専用）
サンプル:         src/samples/domains/             → @/samples/contracts/ をインポート（独立した参照コード）
```

> **アーキテクチャ保護ルール**: `src/foundation/`, `src/templates/` は共有基盤として改変禁止・新規追加禁止。`src/contracts/` は本番専用（自由に変更可）。`src/infrastructure/` は本番専用（自由に変更可）。`src/samples/contracts/`, `src/samples/infrastructure/` はサンプル専用（凍結・読取専用）。プロジェクトルート設定ファイル（`tsconfig.json`, `next.config.*` 等）は改変禁止。`src/samples/`, `src/app/(samples)/` は改変禁止。変更が許可される範囲: `src/domains/`（スタブ→本番実装への置換）、`src/contracts/`、`src/infrastructure/`、`src/app/` 配下（samples 除く）、`tests/`。

### src/domains/ - スタブ実装

`src/domains/` にはスタブ実装が配置されています。
API は `NotImplementedError` をスロー（本番 API Routes は 501 を返す）、UI は「ドメイン未実装」プレースホルダーを表示します。
`@/samples/` への依存はありません。本番実装で置き換えてください。

### src/contracts/ - 本番インターフェース

`src/contracts/` にはリポジトリインターフェース（ProductRepository, CartRepository, OrderRepository 等）と
DTO（Zodスキーマ）が定義されています。本番専用であり、`src/infrastructure/` と `src/domains/` がこの契約に依存します。自由に変更可能です。

### src/samples/contracts/ - サンプルインターフェース（凍結）

`src/samples/contracts/` にはサンプル専用のインターフェースが定義されています。`src/samples/domains/` と `src/samples/infrastructure/` がこの契約に依存します。凍結・読取専用です。

### src/samples/infrastructure/ - サンプルインフラ（凍結）

`src/samples/infrastructure/` にはサンプル専用のリポジトリ実装が配置されています。`src/samples/contracts/` に依存します。凍結・読取専用です。

### src/samples/ - 参照コード

`src/samples/domains/` に以下のサンプル実装があります：

| ドメイン | 機能 |
|---------|------|
| Catalog | 商品一覧・詳細、検索・フィルタ |
| Cart | 商品追加・削除、数量変更 |
| Orders | 注文作成、注文履歴 |

サンプルは独立した参照コードです。`src/samples/contracts/` と `src/samples/infrastructure/` に依存しており、本番の `src/contracts/` や `src/infrastructure/` には依存しません。サンプル画面は `/sample/` URL配下（`src/app/(samples)/sample/`）でアクセスできます。

### 本番実装への移行

本番ページ（`src/app/(buyer)/`, `src/app/admin/`）と API Routes（`src/app/api/`）は既に配置済みです。
`src/domains/` のスタブを置き換えるだけでページと API が動作します。

#### Step 1: ドメイン API の置き換え

`src/domains/{domain}/api/index.ts` の NotImplementedError スタブをユースケース実装に置換します。

```typescript
// 置き換え前（スタブ）
export function getProducts(..._args: unknown[]): never {
  throw new NotImplementedError('catalog', 'getProducts');
}

// 置き換え後（本番実装）
export { getProducts, getProductById, createProduct, ... } from './usecases';
```

本番 API Routes（`src/app/api/catalog/products/route.ts` 等）は `@/domains/` をインポートしているため、
スタブ置換後は自動的に 501 応答から正常応答に変わります。

#### Step 2: ドメイン UI の置き換え

`src/domains/{domain}/ui/index.tsx` の「ドメイン未実装」プレースホルダーを実コンポーネントに置換します。

```typescript
// 置き換え前（プレースホルダー）
export function ProductList() {
  return <div>ドメイン未実装</div>;
}

// 置き換え後（本番実装）
export { ProductList } from './ProductList';
export { ProductDetail } from './ProductDetail';
```

本番ページ（`src/app/(buyer)/catalog/page.tsx` 等）は `@/domains/` の UI をインポートしているため、
スタブ置換後は自動的にプレースホルダーから実画面に変わります。

#### Step 3: ナビゲーションの有効化

レイアウトファイルの `navLinks` のコメントを解除して、ドメインのナビゲーションリンクを追加します。

- 購入者: `src/app/(buyer)/layout.tsx` の `navLinks`（例: `{ href: '/catalog', label: '商品一覧' }`）
- 管理者: `src/app/admin/layout.tsx` の `navLinks`（例: `{ href: '/admin/products', label: '商品管理' }`）

#### Step 4: テストの配置

本番テストは `tests/` 配下に配置します（サンプルテストの `src/samples/tests/` とは分離）。

```
tests/e2e/                  ← 本番 E2Eテスト（pnpm test:e2e で実行）
tests/e2e/smoke.spec.ts     ← 基盤スモークテスト（初期同梱・常時パス）
tests/unit/domains/         ← 本番 単体テスト（pnpm test:unit で実行）
tests/integration/domains/  ← 本番 統合テスト（pnpm test:integration で実行）
```

`tests/e2e/smoke.spec.ts` はホームページ・ログインの疎通確認テストで、ドメイン未実装でもCIが通るように初期同梱されています。ドメイン実装のE2Eテストは同ディレクトリに追加してください。テスト作成時は `src/samples/tests/e2e/domains/` のサンプルテストを参考にしてください。

#### Step 5: サンプルの削除（任意）

本番実装が完了したら、サンプルを安全に削除できます（`src/samples/` には `contracts/`, `infrastructure/`, `domains/`, `tests/` が含まれます）。

```bash
rm -rf src/samples/ src/app/\(samples\)/
```

---

## テスト

### テストコマンド

```bash
# 単体テスト
pnpm test:unit

# 統合テスト
pnpm test:integration

# E2Eテスト（基盤スモークテスト + ドメイン実装テスト）
pnpm test:e2e
```

`tests/e2e/smoke.spec.ts`（基盤スモークテスト）は初期同梱されており、ドメイン未実装でもパスします。ドメイン実装のE2Eテストは `tests/e2e/` 直下に追加してください。

> **E2E テスト前提条件**: E2E テスト（Playwright 等）の初回実行前にブラウザインストール等の前提条件が必要です。CI 定義（`.github/workflows/ci.yml`）に記載のセットアップコマンド（例: `playwright install --with-deps`）をローカルでも実行してください。

---

## 関連ドキュメント

- [SPECKIT_INTEGRATION.md](./SPECKIT_INTEGRATION.md) - speckit連携の詳細
- [constitution-example.md](./examples/constitution-example.md) - 憲法の入力例
- [spec-template.md](./examples/spec-template.md) - 機能仕様のテンプレート
