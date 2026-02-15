# タスク生成ルール: TDD・アーキテクチャ保護

## Constitution 読み込み

`.specify/memory/constitution.md` が存在する場合、TDD/testing mandates と documentation language directives を確認する。

## TDD 構造条件分岐

constitution が TDD を義務化している場合（Red → Green → Refactor → 検証）:
- 各ユーザーストーリーフェーズに Red-Green-Refactor-検証 sub-sections を適用する（tasks-template.md 準拠）
- テストは **MANDATORY**
- TDD 義務がない場合: テストは optional（明示的リクエスト時のみ）

## 仕様ベーステスト原則（Red フェーズ）

Red フェーズのテストは本来成功すべき正しい仕様（Given-When-Then）に基づいて記述する。テストが失敗する理由は実装コードが未実装（NotImplementedError 等）であるためであり、テストコード自体に失敗ロジックを埋め込んではならない。

**禁止パターン**: `expect(true).toBe(false)` 等の意図的失敗アサーション、テストコード内の意図的例外、`it.todo()`/`it.skip()` による代替、一時的失敗スタブ。

Green フェーズではテストコードを一切変更せず、実装コードのみを追加してテストを通す。

## テスト実行義務

- **Red**: テスト作成後にテストランナーをシェル実行し、新規テストが FAIL（未実装エラー）+ 既存テストが PASS であることを確認する（テストファイル作成のみでは不十分）
- **Green**: 実装後にテストランナーをシェル実行し、全テストが PASS することを確認する（チェックボックスを [X] にするだけでは不十分）

## ストーリー完了ゲート

検証フェーズ完了後、次ストーリー着手前に全テストパスを確認する（テスト失敗が残っている場合は次ストーリーに進まない）。

## アーキテクチャ保護

保護対象レイヤー（`src/foundation/`, `src/templates/`, `src/samples/contracts/`, `src/samples/infrastructure/`、ルート設定ファイル、`src/samples/`, `src/app/(samples)/`）への変更禁止。リファクタリングスコープ制限（当該ストーリーで変更したコードのみ）。変更許可範囲は `src/contracts/`, `src/infrastructure/`, `src/domains/`, `src/app/`（samples 除く）, `tests/` に限定。

### Refactor タスク検証（タスク生成時）

タスク生成時に Refactor フェーズのタスクが以下の制約に違反していないことを確認する:

- **新規ファイル作成禁止**: Refactor タスクにファイル新規作成（Create file、新規作成、コンポーネント抽出、ディレクトリ構造変更等）が含まれていないこと
- **保護ファイル改変禁止**: Refactor タスクのファイルパスが保護対象レイヤーに該当しないこと
- **スコープ制限**: Refactor タスクの対象が当該ストーリーの Green で変更したコードに限定されていること（同一ファイル内でも未変更の既存コードは対象外）

## ファイルパス整合性チェック

タスク生成時に以下の整合性を確認し、不整合がある場合はタスク内容を修正する:

- **既存動的ルートとの競合検出**: `src/app/` 配下の既存動的ルート（`[paramName]`）を確認し、新規ドメインのルートパラメータ名が競合しないことを確認する。競合時は既存パラメータ名を優先する
- **contracts スキーマ整合確認**: タスクで参照するスキーマ名（InputSchema, OutputSchema 等）が `src/contracts/{domain}/` に実際に定義されていることを確認する。存在しないスキーマ名をタスクに含めない
- **インポートパス実在確認**: タスクで指定するインポートパス（`@/contracts/`, `@/domains/`, `@/foundation/`）が実際に存在するファイルを指していることを確認する

## テストヘルパー利用制約

タスクでテストヘルパー関数の使用を指示する場合、以下を遵守する:

- **シグネチャ確認義務**: テストヘルパー関数を指示する前に、ヘルパーの実際の関数シグネチャ（引数の型・数・戻り値）を確認する。未確認のまま想定のシグネチャでタスクを生成しない
- **不正パラメータ禁止**: ヘルパー関数に存在しないパラメータや未定義のオプションを渡す指示をしない
- **ローカルヘルパーへのフォールバック**: 共有テストヘルパーが存在しないか、シグネチャが要件に合わない場合は、テストファイル内にローカルヘルパーを定義する指示に切り替える

## タスク生成後の事後検証

tasks.md 生成完了後、以下のチェックリストを実行し、全項目 PASS であることを確認する。違反が見つかった場合はタスクを修正してから出力する。

- [ ] **保護対象ファイルパス照合**: 全タスクのファイルパスが保護対象（`src/foundation/`、`src/templates/`、`src/samples/contracts/`、`src/samples/infrastructure/`、`src/samples/`、`src/app/(samples)/`、ルート設定ファイル（`next.config.mjs` 等））に該当しないこと
- [ ] **動的ルートパラメータ一致**: タスクに動的ルートパス（`[paramName]`）が含まれる場合、既存の `[id]` パラメータ名と一致すること
- [ ] **Green フェーズ制約準拠**: 全ストーリーの Green セクションにファイル新規作成タスクが含まれず、スタブ置換タスクのみであること
- [ ] **Refactor フェーズ制約準拠**: 全ストーリーの Refactor セクションに新規ファイル作成・保護ファイル改変・スコープ外の修正タスクが含まれないこと
- [ ] **Phase 2b 存在確認（ドメイン実装時）**: ドメイン実装を伴う機能の場合、Phase 2b セクションに具体的なスタブ生成タスク（ドメインスタブ・UI スタブ・API Route スタブ）が含まれること

## フェーズ構成

- **Phase 1**: Setup
- **Phase 2**: Foundational（ブロッキング前提条件）
  - **2a: 基盤インフラ**: contracts 拡張、データベーススキーマ、認証基盤、エラーハンドリング基盤等
  - **2b: ドメインスキャフォールド（全ストーリー分一括生成・条件付き必須）**: Phase 2a 完了後・Red テスト前に実行。contracts 確定後が最適なタイミング。手順は `implementation-rules.md`「Phase 2b」に準拠:
    - **必須生成条件（非交渉）**: ドメイン実装（`src/domains/` 配下の変更）を伴う機能では、Phase 2b のスキャフォールディングタスクを具体的なスタブ生成内容を伴って必ず生成すること。Phase 2b を省略した場合、Red テストが import エラーや 404 で失敗し、TDD ワークフロー全体が破綻する
    - **省略可能条件**: ドメイン実装を伴わない機能（ドキュメント変更のみ、設定ファイル修正のみ等）では Phase 2b は省略可能
    - 設計成果物（contracts/spec）を分析し、全ストーリー分のユースケース関数・UI コンポーネント・API Route を特定する
    - ドメインスタブ生成: `usecase-stub.template.ts` を Read → 全ユースケース関数のスタブを `src/domains/{domain}/api/index.ts` に一括生成する（既存スタブは保持、不足分のみ追加）
    - UI コンポーネントスタブ生成: `ui-stub.template.tsx` を Read → 全 UI コンポーネントのスタブを一括生成する
    - API Route スタブ生成: `api-route-stub.template.ts` を Read → 全 API Route のスタブを一括生成する（handleError() 経由エラー変換パターン）
    - **目的**: Red テストが import/アクセスする全ファイルが NotImplementedError スタブとして存在する状態を保証する
- **Phase 3+**: User Stories（優先度順）
  - TDD 義務あり: **Red → Green → Refactor → 検証** sub-sections
  - TDD 義務なし: Models → Services → Endpoints → Integration
  - 各フェーズは独立してテスト可能な増分とする
  - **Green フェーズ**: 下記「Green フェーズタスク制約」に従う
## Green フェーズタスク制約（非交渉）

Green フェーズのタスクは Phase 2b で生成済みのスタブファイルを本番ロジックに置換する作業のみで構成する。

- **ファイル新規作成禁止**: Green タスクにファイル新規作成（Create file、新規作成、ファイル追加等）を含めてはならない。全ファイルは Phase 2b で生成済みである
- **スタブ置換のみ**: 全 Green タスクは「NotImplementedError → 本番ロジック置換」の形式とする
- **ファイルパス制約**: Green タスクのファイルパスは Phase 2b で生成済みのスタブファイル（`src/domains/{domain}/api/index.ts`、`src/domains/{domain}/ui/index.tsx`、`src/app/api/{domain}/*/route.ts` 等）を指すこと
- **検証**: Green セクションのタスク一覧に上記禁止パターンが含まれていないことを確認する

## テンプレート準拠義務

生成する tasks.md のセクション構造は `.specify/templates/tasks-template.md` に厳密に準拠すること。

- **テンプレート外セクション生成禁止（非交渉）**: tasks-template.md に存在しないセクションを生成してはならない
- **禁止セクション例**: 推定工数、デイリーマイルストーン、タイムライン、リスク分析、技術的負債、パフォーマンス計画等
- **許容される追加**: tasks-template.md のセクション内での具体的タスク追加・説明の補足は許容する。ただしセクション見出し（`##` / `###`）の新設は禁止
- **検証**: 生成完了後、tasks.md の全セクション見出しが tasks-template.md に存在することを確認する

- **Final Phase**: Polish & Cross-Cutting Concerns
  - リファクタリングを含む場合でもアーキテクチャ保護ルールは適用される（`src/foundation/`, `src/templates/`, `src/samples/contracts/`, `src/samples/infrastructure/` 等の改変禁止）
  - 対象は当該機能で新規作成・変更したコードのみ。既存アーキテクチャコードのリファクタリングは禁止
