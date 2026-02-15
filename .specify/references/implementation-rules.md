# 実装ルール: ECサイトアーキテクチャ基盤

speckit.implement 実行時の実装ルール。constitution.md の運用詳細。

## アーキテクチャ保護ルール（全フェーズ共通）

**改変禁止**:
- `src/foundation/`, `src/templates/` — 改変・新規追加禁止
- `src/samples/contracts/`, `src/samples/infrastructure/` — 改変禁止（サンプル専用凍結レイヤー）
- ルート設定ファイル（`tsconfig.json`, `next.config.*`, `tailwind.config.*`, `playwright.config.*`, `vitest.config.*`, `postcss.config.*`, `eslint.config.*`）— 改変禁止
- `src/samples/`, `src/app/(samples)/` — 改変禁止

**変更許可**: `src/contracts/`、`src/infrastructure/`、`src/domains/`、`src/app/`（samples 除く）、`tests/`

## スキャフォールディング用テンプレート一覧

各ファイルの生成手順: **テンプレートを Read → 内容に従って生成**。記憶ベースでの生成は禁止。

| 種別 | テンプレートパス | 概要 |
|------|----------------|------|
| ユースケーススタブ | `.specify/references/scaffolding/usecase-stub.template.ts` | ドメインスタブ（NotImplementedError）、Context 型、エラーメッセージ定数パターン |
| UI コンポーネントスタブ | `.specify/references/scaffolding/ui-stub.template.tsx` | コンポーネント Props 定義、ページとの props 結合パターン、バレルエクスポート |
| ユースケース単体テスト | `.specify/references/scaffolding/unit-test.template.ts` | Given-When-Then 階層、モックリポジトリ（`vi.fn()`）、beforeEach データリセット構造 |
| UI コンポーネント単体テスト | （`ui-stub.template.tsx` の Props 構造を参照） | コンポーネント props の contracts 導出、render/screen パターン、必須 props 渡し |
| API 統合テスト | `.specify/references/scaffolding/integration-test.template.ts` | Schema.parse() 契約準拠検証、認可境界テスト |
| E2E テスト | `.specify/references/scaffolding/e2e-test.template.ts` | worker-aware setup、data-testid セレクタ、beforeEach データリセット API パターン |
| API Route スタブ | `.specify/references/scaffolding/api-route-stub.template.ts` | Route Handler パターン（GET/POST/PUT/DELETE）、handleError() 経由エラー変換 |

## 【REQUIRED】Phase 2b: 基盤スキャフォールディング（Phase 2a 完了後・Red テスト前に実行）

**スキャフォールド対象は本番ドメインのみ。サンプルは凍結済みのためスキャフォールド対象外。**

Phase 2a（contracts 拡張・インフラ実装等の基盤タスク）完了後、最初のユーザーストーリーの Red フェーズ開始前に、**全ユーザーストーリー分**のスタブを一括生成する。スタブの関数シグネチャ・型は確定済みの contracts に依存するため、contracts 拡張完了後が最適なタイミングである。

### 手順

Step 0 → Step 1 → Step 2 → Step 3 の順で実行する。

**0. 既存ファイル検証**（生成**前**の入力整合確認）

   以下の 3 点を検証し、不整合があれば修正してから次の Step に進む:

   **a) ルートパラメータ名の整合確認**:
   - `src/app/` 配下の既存動的ルート（`[paramName]`）を Glob で確認する
   - 新規ドメインのルートパラメータ名が既存パラメータ名と競合しないことを確認する
   - **競合時の優先ルール**: 既存パラメータ名を優先する（例: 既存が `[id]` なら新規も `[id]` を使用）

   **b) インポート先エクスポートの実在確認**:
   - テストやスタブでインポートする関数・型・定数が、インポート先ファイルに実際にエクスポートされていることを確認する
   - `@/contracts/{domain}` のスキーマ名、`@/domains/{domain}` のユースケース関数名を確認する

   **c) エラーメッセージの整合確認**:
   - テストでアサートするエラーメッセージが、既存エラークラス（`@/foundation/errors/`）のデフォルトメッセージまたは contracts 定義メッセージと一致することを確認する
   - 独自メッセージのハードコード禁止。ドメインスタブの `DOMAIN_ERROR_MESSAGES` 定数を使用する

**1. 設計成果物の分析**

   contracts/spec の全ユーザーストーリーを横断的に分析し、以下を特定する:
   - 各ドメインのユースケース関数一覧（関数名・入力スキーマ・出力型・認可ロール）
   - UI コンポーネント一覧（コンポーネント名・Props 型）
   - API Route 一覧（パス・HTTP メソッド・対応するユースケース関数）

**2. ドメインスタブ生成（全ストーリー分一括）**

   テンプレート一覧の「ユースケーススタブ」「UI コンポーネントスタブ」を Read → 全ユーザーストーリー分を一括で生成する:
   - **既存 `index.ts` / `index.tsx` がある場合**: 不足する関数・コンポーネントのみ追加する。既存のスタブは上書きしない
   - **既存ファイルがない場合**: テンプレートから新規生成する
   - スタブシグネチャは確定済み contracts に準拠した型付きシグネチャを使用する
   - 全スタブ関数は `NotImplementedError` を throw する

**3. API Route スタブ生成**

   テンプレート一覧の「API Route スタブ」を Read → 生成する:
   - Step 1 で特定した API Route 一覧に基づき、各エンドポイントの Route Handler を生成する
   - ドメインスタブ関数を呼び出し、`handleError()` 経由で NotImplementedError をエラーレスポンスに変換するパターンを使用する
   - 既存 API Route がある場合は上書きしない

**チェックポイント**: Phase 2b 完了後、全ドメインスタブと API Route スタブが存在し、Red テストが import/アクセスする全ファイルが NotImplementedError スタブとして利用可能であること

---

## 【REQUIRED】Red フェーズ スキャフォールディング（各ストーリー開始時に必ず実行）

**前提**: Phase 2b で全ドメインスタブ・API Route スタブが生成済みであること。スタブ生成は Phase 2b で完了しているため、Red フェーズではテスト設計・生成に集中する。

### 手順

各ストーリー開始時に Step 1 → Step 2 の順で実行する。

**1. テスト設計**（毎ストーリー実行）

   設計成果物（contracts/spec）から入出力仕様、依存コンポーネント、認可要件を分析し、モック設計・認可設定・アサーション条件を導出する。

**2. テストファイル生成（4 種別すべて必須）**（毎ストーリー実行）

   - 上記テンプレート一覧の「単体テスト」「統合テスト」「E2E テスト」を Read → 生成する
   - テスト内容は設計成果物/spec から Given-When-Then を導出する（サンプルのコピー＆修正は禁止）
   - 既存ドメイン実装・テストの構造パターンに準拠する

### 既存実装参照ポリシー

- **許可**: 構造パターン参照（ファイル配置、インポートパス、テスト階層、モックヘルパー、Given-When-Then 形式）
- **禁止**: コピー＆変数名置換。テストの依存構成・モック・アサーションは設計成果物から導出すること

## Red フェーズ（仕様ベーステスト）

テストは実装完了後の期待動作をアサートする。未実装スタブが NotImplementedError を投げるためテストが自然に FAIL する。Green フェーズで実装を追加すればテストコード無変更で PASS に転じる。

### 正誤対比（必読）

```ts
// ✅ 正しい RED テスト — 正しい仕様をアサートする
it("商品一覧を取得できること", async () => {
  vi.mocked(repository.findAll).mockResolvedValue(mockProducts);
  const result = await listProducts({}, context);
  expect(result).toHaveLength(3);           // ← 実装完了後の期待動作
  expect(result[0].name).toBe("商品A");
});
// RED: スタブが NotImplementedError を throw → テストランナーが ERROR で FAIL ✓
// GREEN: 実装追加 → テストコード無変更で PASS ✓
```

```ts
// ❌ 誤った RED テスト — 未実装状態をアサートしている
it("未実装のためエラーになること", async () => {
  await expect(listProducts({}, context))
    .rejects.toThrow(NotImplementedError);  // ← 未実装状態のテスト
});
// RED: PASS してしまう（RED にならない）
// GREEN: 実装追加 → NotImplementedError が消える → FAIL → テスト変更が必要 = 違反
```

```ts
// ❌ 誤った RED テスト — 意図的失敗アサーション
it("TODO: 後で実装する", async () => {
  expect(true).toBe(false);                 // ← テスト自体に失敗ロジック
});
// GREEN: 実装と無関係に FAIL し続ける → テスト変更が必要 = 違反
```

### 原則

テストコードには「実装完了後に成功する正しい仕様」のみを記述する。テストが RED で FAIL する理由は、テストコードの問題ではなく、スタブが NotImplementedError を throw するためである。

### 禁止パターン

以下をテストコード内で使用してはならない:

- `expect(...).rejects.toThrow(NotImplementedError)` — 未実装状態のテスト
- `expect(true).toBe(false)` — 意図的失敗アサーション
- `throw new Error('Not implemented yet')` — テストコード内の意図的例外
- `it.todo()` / `it.skip()` — Red 状態の代替
- 一時的に失敗するスタブの作成（Green フェーズで差し替え前提）

### 失敗確認基準

テスト失敗の原因が NotImplementedError 等の**未実装エラー**であること。以下はテストコード自体の不備であり NG:
- インポートエラー（モジュール未解決）
- 型エラー（TypeScript コンパイルエラー）
- 未定義参照（存在しない関数・変数の参照）

## Red フェーズ セルフバリデーション（テスト生成後・テストランナー実行前 — 生成**後**の出力品質確認）

テストファイル生成後、テストランナーを実行する**前**に以下のチェックを全て実施する。1 件でも不合格があればテストを修正してから再チェックする。

> Step 0 は「生成元（既存ファイル）の整合を事前に確認」、このセルフバリデーションは「生成結果（テストコード）の品質を事後に確認」。チェック対象が異なる。

### 禁止パターンチェック

生成した全テストファイルに以下のパターンが**含まれていないこと**を確認する:

| ID | 禁止パターン | 理由 |
|----|-------------|------|
| FP-001 | `rejects.toThrow(NotImplementedError)` または `.toThrow(/NotImplementedError/i)` | Red で PASS し Green で FAIL → テスト変更が必要になる |
| FP-002 | `expect(true).toBe(false)` / `expect(false).toBe(true)` | 実装と無関係に FAIL し続ける → テスト変更が必要になる |
| FP-003 | `it.todo(` / `it.skip(` / `test.todo(` / `test.skip(` | Red 状態の代替として禁止 |
| FP-004 | テストコード内の `throw new Error('Not implemented` | テストコードに意図的例外は禁止 |
| FP-005 | `if (result.xxx) { expect(` / `if (result.xxx !== undefined) { expect(` | 条件付きアサーション — 条件が偽の場合テストが何も検証せずパスする |

### テストデータ制御原則

- **beforeEach でのデータリセット + セットアップは必須**: 各テスト（describe ブロック）は `beforeEach` でデータストアのリセットとテストデータのセットアップを行うこと。シードデータへの暗黙的依存は禁止
- **条件付きアサーション禁止**: テスト内で `if` 文の中に `expect` を置くパターンは禁止。条件が偽の場合にアサーションが実行されず、テストが何も検証せずにパスする「ノーオペレーションテスト」になる

```ts
// ❌ 禁止: 条件付きアサーション（ノーオペレーションテスト）
it("商品一覧を返すこと", async () => {
  const result = await listProducts({}, context);
  if (result.items) {
    expect(result.items).toHaveLength(3); // items が undefined → この行が実行されない → テストパス
  }
});

// ✅ 正しい: 無条件アサーション
it("商品一覧を返すこと", async () => {
  const result = await listProducts({}, context);
  expect(result.items).toBeDefined();     // items が undefined → FAIL（正しい検出）
  expect(result.items).toHaveLength(3);
});
```

### contracts import 検証

- 全テストファイル（単体・統合・E2E）に `@/contracts/` または `@/domains/` からの import が**少なくとも 1 つ**存在すること
- 統合テストには `@/contracts/{domain}` からのスキーマ import（InputSchema / OutputSchema 等）が存在すること

### エラーメッセージ整合確認

- テストでアサートするエラーメッセージが、既存エラークラス（`@/foundation/errors/`）のデフォルトメッセージと一致することを確認する
- 独自のエラーメッセージをテスト内にハードコードしない。ドメインスタブに `DOMAIN_ERROR_MESSAGES` 定数として定義し、テストからはその定数を import して参照する
- 既存エラークラスのデフォルトメッセージ一覧（参照用）: `NotFoundError`, `ForbiddenError`, `ValidationError` 等の `message` プロパティを確認する

### テストヘルパーシグネチャ検証

- テストヘルパー関数（TestDataManager 等）を使用している場合、呼び出し時の引数がヘルパーの実際の関数シグネチャと一致すること
- 存在しないメソッドや未定義のパラメータを使用していないこと

### テンプレート準拠検証

生成した各テスト・スタブが対応するテンプレートの必須構造要素を含むことを、以下のチェックリストで確認する:

**ユースケース単体テスト**（テンプレート: `unit-test.template.ts`）:
- [ ] `describe` 階層が Given-When-Then 構造に従っている
- [ ] モックリポジトリパターン（`vi.fn()`）を使用している
- [ ] `@/contracts/{domain}` または `@/domains/{domain}` からの型 import がある
- [ ] `beforeEach` にデータリセットとテストデータセットアップの構造がある

**UI コンポーネント単体テスト**（テンプレート: `ui-stub.template.tsx`）:
- [ ] コンポーネント props が contracts から導出されている
- [ ] render/screen パターンを使用している
- [ ] 必須 props を渡してレンダリングしている（props なしレンダリングは禁止）

**API 統合テスト**（テンプレート: `integration-test.template.ts`）:
- [ ] `@/contracts/{domain}` からの InputSchema/OutputSchema import がある
- [ ] `Schema.parse()` による契約準拠検証がある
- [ ] 認可境界テスト（ロール別アクセス制御）がある
- [ ] `beforeEach` にデータリセットの構造がある

**E2E テスト**（テンプレート: `e2e-test.template.ts`）:
- [ ] worker-aware setup（`test.info().parallelIndex`）がある
- [ ] `data-testid` セレクタを使用している
- [ ] ページ遷移パターンに従っている
- [ ] `beforeEach` にデータリセット API 呼び出しの構造がある（コメントのみの空 beforeEach は禁止）

## Green フェーズ

1. Red フェーズのテスト仕様と設計ドキュメントから本番実装を記述する（NotImplementedError → 正しい実装に置換）
2. 実装完了後にテストを実行し全 PASS を確認する
3. **テストファイル変更禁止（非交渉）** — Red フェーズで作成したテストファイル（`tests/` 配下）は原則変更しない。変更対象は実装コード（`src/` 配下）のみ。テストが FAIL する場合は実装コードを修正する。ただし、テスト側の明らかな不備（インポートパスの誤り、モック設定の不整合等）が原因で FAIL する場合に限り、最小限の修正を許可する

テスト実行は「検証手段」であり「探索手段」ではない。設計ドキュメントから実装を導出すること。

## TDD フェーズ別テスト実行

### Red/Green フェーズ（高速フィードバック）

対象ドメインのテストのみ実行する（**E2E テストは実行しない** — E2E は検証フェーズおよびストーリー完了ゲートでのみ実行する。constitution「2 層テストゲート」参照）:
- **Red**: UNIT_TEST_RELATED_CMD（または UNIT_TEST_CMD）+ INTEGRATION_TEST_CMD をシェル実行
  - 新規テスト 4 種別が作成済みであること（ただし E2E テストの**実行**はこのフェーズでは行わない）
  - 新規テストが FAIL（未実装エラー）、既存テストが PASS であること
- **Green**: UNIT_TEST_RELATED_CMD（変更ファイル指定）+ INTEGRATION_TEST_CMD をシェル実行
  - 全テスト PASS、件数 > 0 であること
  - E2E テストはこのフェーズでは実行しない

### Refactor フェーズ（フルスイート 1 回）

UNIT_TEST_CMD（フルスイート）+ INTEGRATION_TEST_CMD をシェル実行し、samples リグレッションを含む全テスト PASS を確認する。

### Refactor スコープ制限（コード単位・非交渉）

- **対象**: 当該ストーリーの Green フェーズで新規作成・変更した**コード**のみ（ファイル単位ではなくコード単位）
- **許可**: 変数名・関数名改善、重複コードの関数抽出（同一ファイル内）、不要な import 削除、フォーマット整理
- **禁止**: 新規ファイル作成、コンポーネント抽出、ディレクトリ構造変更、当該ストーリー外の修正、既存コードの改変
- **Final Phase（横断的関心事）も同様**: アーキテクチャ保護ルールは全フェーズ共通。保護対象レイヤーの改変やアーキテクチャリファクタリングは最終フェーズでも禁止

## 検証フェーズ

- COVERAGE_CMD でカバレッジ 80% 以上を確認する
- E2E_TEST_CMD を実行する（初回は E2E_PREREQ_CMD を先行実行）
- 実行結果（パス件数・失敗件数・カバレッジ率）を証跡として報告する

## ストーリー完了ゲート

検証フェーズ完了後、次ストーリー着手前に全テストコマンド（UNIT_TEST_CMD フルスイート + INTEGRATION_TEST_CMD + E2E_TEST_CMD）をシェル実行する。テスト失敗が 1 件でも存在する場合は次ストーリーに進まない。結果を証跡として記録する。

## テスト証跡報告

- 各テストコマンドが TDD サイクル中に少なくとも 1 回実行されたことを確認する
- フェーズ別結果（Red/Green/Refactor のパス件数・失敗件数）、カバレッジ率、E2E 結果を報告する
