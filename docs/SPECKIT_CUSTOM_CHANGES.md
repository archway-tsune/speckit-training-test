# Speckit カスタマイズ変更リファレンス

## 1. 概要

### 目的

`specify init` を新バージョンで再実行すると、`.claude/commands/` および `.github/agents/` 配下のコマンド定義ファイルがデフォルト状態にリセットされる。本ドキュメントは、プロジェクト固有のカスタマイズを再適用するためのリファレンスである。

**比較基準**: speckit v0.0.95（`spec-kit-template-claude-ps-v0.0.95.zip`）のデフォルト出力。全 DIFF は最新リリースのデフォルトと照合済み。

### アーキテクチャ

カスタムルール・参照データは `.specify/references/` 配下の外部ファイルに分離されている。コマンドファイルには外部参照ポインタ（`【REQUIRED】Read .specify/references/xxx.md`）のみを記載する。`.specify/references/` は `specify init` の影響を受けないため、init 後の復元はコマンドファイルへの参照ポインタ追加のみで完了する。

### 対象ディレクトリ

| ディレクトリ | 用途 | ファイル命名規則 |
|---|---|---|
| `.claude/commands/` | Claude Code 用コマンド定義 | `speckit.<command>.md` |
| `.github/agents/` | Copilot 用エージェント定義 | `speckit.<command>.agent.md` |

両ディレクトリのファイルはスクリプト参照パスのみ異なる（Claude: `powershell/*.ps1 -Json`、Copilot: `bash/*.sh --json`）。カスタム変更は同一であり、適用する際は必ず両方のファイルに同じ変更を反映すること。

---

## 2. 外部リファレンスファイル一覧

| ファイル | 用途 | 参照元コマンド | init 耐性 |
|---------|------|-------------|----------|
| `.specify/references/output-language-rules.md` | 出力言語制御（共通 + constitution/plan 固有ルール） | 全 9 コマンド | 影響なし |
| `.specify/references/task-generation-rules.md` | TDD・アーキテクチャ保護・フェーズ構成 | tasks | 影響なし |
| `.specify/references/implementation-rules.md` | 実装ルール（TDD フェーズゲート、スキャフォールディング等） | implement, tasks-template | 影響なし |
| `.specify/references/test-detection-patterns.md` | テスト検出パターン（8 言語対応） | implement | 影響なし |
| `.specify/references/project-setup-patterns.md` | プロジェクトセットアップ ignore パターン（13 言語 + 5 ツール） | implement | 影響なし |
| `.specify/references/scaffolding/*.template.ts(x)` | スキャフォールディングテンプレート（6 種別） | implement | 影響なし |

---

## 3. ファイル対照表

| # | コマンド | Claude Code パス | Copilot パス | 復元変更数 |
|---|---------|----------------|-------------|-----------|
| 1 | analyze | `.claude/commands/speckit.analyze.md` | `.github/agents/speckit.analyze.agent.md` | 1 |
| 2 | checklist | `.claude/commands/speckit.checklist.md` | `.github/agents/speckit.checklist.agent.md` | 1 |
| 3 | clarify | `.claude/commands/speckit.clarify.md` | `.github/agents/speckit.clarify.agent.md` | 1 |
| 4 | constitution | `.claude/commands/speckit.constitution.md` | `.github/agents/speckit.constitution.agent.md` | 2 |
| 5 | implement | `.claude/commands/speckit.implement.md` | `.github/agents/speckit.implement.agent.md` | 4 |
| 6 | plan | `.claude/commands/speckit.plan.md` | `.github/agents/speckit.plan.agent.md` | 2 |
| 7 | specify | `.claude/commands/speckit.specify.md` | `.github/agents/speckit.specify.agent.md` | 1 |
| 8 | tasks | `.claude/commands/speckit.tasks.md` | `.github/agents/speckit.tasks.agent.md` | 2 |
| 9 | taskstoissues | `.claude/commands/speckit.taskstoissues.md` | `.github/agents/speckit.taskstoissues.agent.md` | 1 |

> **注**: `speckit.scaffold` は削除済みのため対象外。

---

## 4. `specify init` 後の復元手順

各コマンドにつき変更内容は 1 回記載する。Claude Code 用・Copilot 用の両ファイルに同一の変更を適用すること。

### 共通変更: Output Language（全 9 コマンド）

`You **MUST** consider the user input before proceeding (if not empty).` の直後に以下 1 行を追加:

```diff
 You **MUST** consider the user input before proceeding (if not empty).

+**【REQUIRED】Read `.specify/references/output-language-rules.md`**

 ## Outline
```

---

### 4.1 speckit.analyze

**復元変更**: 共通変更（Output Language）のみ

---

### 4.2 speckit.checklist

**復元変更**: 共通変更（Output Language）のみ

---

### 4.3 speckit.clarify

**復元変更**: 共通変更（Output Language）のみ

---

### 4.4 speckit.constitution

#### アーキテクチャ概要

| 種別 | ファイル | init 耐性 |
|------|--------|----------|
| コマンドファイル | `speckit.constitution.md` / `speckit.constitution.agent.md` | 要再適用 |
| 出力言語ルール（constitution 固有ルール含む） | `.specify/references/output-language-rules.md` | 影響なし |

#### 復元変更

1. 共通変更（Output Language）
2. Step 3 の Governance セクション記述ルールに constitution 固有ルールへの参照を追加:

```diff
    - Ensure Governance section lists amendment procedure, versioning policy, and compliance review expectations.
+   - See `.specify/references/output-language-rules.md` — constitution コマンド固有ルール（Governance セクションの言語指定確認義務）に従うこと。
```

---

### 4.5 speckit.implement

#### アーキテクチャ概要

| 種別 | ファイル | init 耐性 |
|------|--------|----------|
| コマンドファイル | `speckit.implement.md` / `speckit.implement.agent.md` | 要再適用 |
| 実装ルール | `.specify/references/implementation-rules.md` | 影響なし |
| テスト検出パターン | `.specify/references/test-detection-patterns.md` | 影響なし |
| プロジェクトセットアップパターン | `.specify/references/project-setup-patterns.md` | 影響なし |
| スキャフォールディングテンプレート | `.specify/references/scaffolding/*.template.ts(x)` | 影響なし |

#### 復元変更

1. 共通変更（Output Language）
2. Step 3 のコンテキスト読み込みリスト直後に参照ポインタ 1 行と依存関係インストールサブセクションを追加（独立したステップではなく Step 3 の一部として配置し、最新テンプレートのステップ番号 1-9 を維持する）:

```diff
    - **IF EXISTS**: Read quickstart.md for integration scenarios

+   **【REQUIRED】Read `.specify/references/test-detection-patterns.md`** — テストコマンド検出ワークフロー（テックスタック判定、依存関係インストール、E2E 前提条件、テストコマンドテーブル）に従いコマンドを検出する
+
+   **依存関係インストール（Dependency Installation）**:
+   - DEPS_INSTALL_CMD をシェル実行する（exit code 0 を確認、失敗時はユーザーに確認）
+   - E2E_PREREQ_CMD が検出済みなら続けてシェル実行する
+   - node_modules/ 等が既存でも lock ファイル整合性のため実行する
+
 4. **Project Setup Verification**:
```

3. Step 4 のインラインパターンを外部参照に置換:

```diff
 4. **Project Setup Verification**:
-   - **REQUIRED**: Create/verify ignore files based on actual project setup:
-
-   **Detection & Creation Logic**:
-   ...（43 行の技術別 ignore パターン）...
+   **【REQUIRED】Read `.specify/references/project-setup-patterns.md`** — 技術別 ignore パターンの検出・生成ロジックに従い、ignore ファイルを作成/検証する
```

4. Step 6 実装ルールの外部参照化:

```diff
 6. Execute implementation following the task plan:
+   - **【REQUIRED】Read `.specify/references/implementation-rules.md`** and follow ALL rules defined there (architecture protection, TDD phase gates, scaffolding procedures, story completion gates, refactor scope limits, test evidence reporting)
    - **Phase-by-phase execution**: Complete each phase before moving to the next
```

---

### 4.6 speckit.plan

#### アーキテクチャ概要

| 種別 | ファイル | init 耐性 |
|------|--------|----------|
| コマンドファイル | `speckit.plan.md` / `speckit.plan.agent.md` | 要再適用 |
| 出力言語ルール（plan 固有ルール含む） | `.specify/references/output-language-rules.md` | 影響なし |

#### 復元変更

1. 共通変更（Output Language）
2. Step 2 コンテキストロードに plan 固有ルール参照を追加:

```diff
-2. **Load context**: Read FEATURE_SPEC and `.specify/memory/constitution.md`. Load IMPL_PLAN template (already copied).
+2. **Load context**: Read FEATURE_SPEC and `.specify/memory/constitution.md`. Load IMPL_PLAN template (already copied). See `.specify/references/output-language-rules.md` — plan コマンド固有ルール（TDD mandates 確認）に従うこと。
```

---

### 4.7 speckit.specify

**復元変更**: 共通変更（Output Language）のみ

---

### 4.8 speckit.tasks

#### アーキテクチャ概要

| 種別 | ファイル | init 耐性 |
|------|--------|----------|
| コマンドファイル | `speckit.tasks.md` / `speckit.tasks.agent.md` | 要再適用 |
| タスク生成ルール | `.specify/references/task-generation-rules.md` | 影響なし |

#### 復元変更

1. 共通変更（Output Language）
2. Step 3 の TDD 構造を task-generation-rules reference pointer に置換:

```diff
    - If research.md exists: Extract decisions for setup tasks
+   - **【REQUIRED】Read `.specify/references/task-generation-rules.md`** for TDD structure, test policies, execution obligations, architecture protection, and phase structure rules
    - Generate tasks organized by user story (see Task Generation Rules below)
```

Task Generation Rules セクション（`Tests are OPTIONAL` 行を reference pointer に置換）:

```diff
 **CRITICAL**: Tasks MUST be organized by user story to enable independent implementation and testing.

-**Tests are OPTIONAL**: Only generate test tasks if explicitly requested in the feature specification or if user requests TDD approach.
+**【REQUIRED】Read `.specify/references/task-generation-rules.md`** — TDD 条件分岐、仕様ベーステスト原則、テスト実行義務、アーキテクチャ保護、フェーズ構成の全ルールに従うこと。
```

Phase Structure セクション（6 行のインライン定義を reference pointer に置換）:

```diff
 ### Phase Structure

-- **Phase 1**: Setup (project initialization)
-- **Phase 2**: Foundational (blocking prerequisites - MUST complete before user stories)
-- **Phase 3+**: User Stories in priority order (P1, P2, P3...)
-  - Within each story: Tests (if requested) → Models → Services → Endpoints → Integration
-  - Each phase should be a complete, independently testable increment
-- **Final Phase**: Polish & Cross-Cutting Concerns
+See `.specify/references/task-generation-rules.md` — フェーズ構成セクション参照。
```

---

### 4.9 speckit.taskstoissues

**復元変更**: 共通変更（Output Language）のみ

---

### 4.10 `.specify/templates/tasks-template.md`

> **注**: tasks-template.md は `.specify/templates/` 配下のため init で上書きされる。以下の変更を再適用すること。
> **比較基準**: speckit v0.0.95（最新リリース）のデフォルトテンプレート

#### 変更 1: Tests ヘッダーを OPTIONAL → MANDATORY に変更

```diff
-**Tests**: The examples below include test tasks. Tests are OPTIONAL - only include them if explicitly requested in the feature specification.
+**Tests**: MANDATORY — constitution（原則 VI）は TDD 必須。各ユーザーストーリーは Red → Green → Refactor → 検証 の 4 ステップで実装する。
```

#### 変更 2: HTML コメントの構造化（フェーズ維持を明示）

```diff
 <!--
   ============================================================================
   IMPORTANT: The tasks below are SAMPLE TASKS for illustration purposes only.

-  The /speckit.tasks command MUST replace these with actual tasks based on:
-  - User stories from spec.md (with their priorities P1, P2, P3...)
-  - Feature requirements from plan.md
-  - Entities from data-model.md
-  - Endpoints from contracts/
-
-  Tasks MUST be organized by user story so each story can be:
-  - Implemented independently
-  - Tested independently
-  - Delivered as an MVP increment
-
-  DO NOT keep these sample tasks in the generated tasks.md file.
+  The /speckit.tasks command MUST:
+  1. REPLACE sample tasks with actual tasks based on:
+     - User stories from spec.md (with their priorities P1, P2, P3...)
+     - Feature requirements from plan.md
+     - Entities from data-model.md
+     - Endpoints from contracts/
+  2. MAINTAIN the phase structure (Phase 1, Phase 2, Phase 3+, Final Phase)
+     defined in this template. Sample tasks are replaced, but the phase
+     headings and their order are preserved.
+  3. ORGANIZE tasks by user story so each story can be:
+     - Implemented independently
+     - Tested independently
+     - Delivered as an MVP increment
+
+  Replace sample task content, but DO NOT remove or skip phase sections.
   ============================================================================
 -->
```

#### 変更 3: TDD Phase Rules セクションを新規追加

デフォルトには存在しないセクション。HTML コメント直後、Phase 1 の前に追加する:

```diff
 -->

+## TDD Phase Rules（全ストーリー共通）
+
+**【REQUIRED】Read `.specify/references/implementation-rules.md`** — Red/Green/Refactor/検証/ストーリー完了ゲートの全ルールに従う。
+
+各ユーザーストーリーは Red → Green → Refactor → 検証 の 4 フェーズを順に実行する。ルール本体は implementation-rules.md に一元化されている。
+
+---
+
 ## Phase 1: Setup (Shared Infrastructure)
```

#### 変更 4: Phase 2 に 2a/2b サブセクション構造を追加

```diff
 **⚠️ CRITICAL**: No user story work can begin until this phase is complete

+### 2a: 基盤インフラ
+
 Examples of foundational tasks (adjust based on your project):
 ...（T004-T009 はそのまま維持）...

-**Checkpoint**: Foundation ready - user story implementation can now begin in parallel
+**Checkpoint**: Phase 2a 完了 — contracts・インフラ基盤が確定
+
+### 2b: ドメインスキャフォールド（全ストーリー分一括生成）
+
+Phase 2a 完了後・Red テスト前に、**全ユーザーストーリー分**のスタブを一括生成する。contracts 確定後が最適なタイミング。
+
+手順は `implementation-rules.md`「Phase 2b: 基盤スキャフォールディング」に従う:
+
+- [ ] T0XX 設計成果物（contracts/spec）を分析し、全ストーリー分のユースケース関数・UI コンポーネント・API Route を特定する
+- [ ] T0XX [P] ドメインスタブ生成: `usecase-stub.template.ts` を Read → 全ユースケース関数のスタブを `src/domains/{domain}/api/index.ts` に一括生成する（既存スタブは保持、不足分のみ追加）
+- [ ] T0XX [P] UI コンポーネントスタブ生成: `ui-stub.template.tsx` を Read → 全 UI コンポーネントのスタブを `src/domains/{domain}/ui/index.tsx` に一括生成する
+- [ ] T0XX [P] API Route スタブ生成: `api-route-stub.template.ts` を Read → 全 API Route のスタブを `src/app/api/{domain}/` に一括生成する（handleError() 経由エラー変換パターン）
+
+**Checkpoint**: Phase 2b 完了 — 全ドメインスタブ・API Route スタブが存在し、Red テストが import/アクセスする全ファイルが利用可能
```

#### 変更 5: US Phase 構造を TDD 4 フェーズに全面変更

デフォルトの `### Tests for User Story N (OPTIONAL)` + `### Implementation for User Story N` 構造を、`### Red` + `### Green` + `### Refactor` + `### 検証` の 4 フェーズ構造に置換する。以下は US1 の例（US2・US3 も同様に変更）:

```diff
-### Tests for User Story 1 (OPTIONAL - only if tests requested) ⚠️
-
-> **NOTE: Write these tests FIRST, ensure they FAIL before implementation**
-
-- [ ] T010 [P] [US1] Contract test for [endpoint] in tests/contract/test_[name].py
-- [ ] T011 [P] [US1] Integration test for [user journey] in tests/integration/test_[name].py
-
-### Implementation for User Story 1
-
-- [ ] T012 [P] [US1] Create [Entity1] model in src/models/[entity1].py
-- [ ] T013 [P] [US1] Create [Entity2] model in src/models/[entity2].py
-- [ ] T014 [US1] Implement [Service] in src/services/[service].py (depends on T012, T013)
-- [ ] T015 [US1] Implement [endpoint/feature] in src/[location]/[file].py
-- [ ] T016 [US1] Add validation and error handling
-- [ ] T017 [US1] Add logging for user story 1 operations
+### Red: テスト作成 (MANDATORY)
+
+> implementation-rules.md「Red フェーズ」ルールに従う。4 種別（単体・UI・統合・E2E）を作成し、テストランナーで FAIL を確認する。
+
+- [ ] T010 [P] [US1] ユースケース単体テスト作成 in tests/unit/test_[name].py
+- [ ] T011 [P] [US1] UI コンポーネント単体テスト作成 in tests/unit/test_[name].tsx
+- [ ] T012 [P] [US1] API 統合テスト作成 in tests/integration/test_[name].py
+- [ ] T013 [P] [US1] E2E テスト作成 in tests/e2e/test_[name].py
+
+### Green: 最小実装
+
+> implementation-rules.md「Green フェーズ」ルールに従う。テストファイル変更禁止。実装コードのみ追加する。
+> **ファイル新規作成禁止（非交渉）**: ファイル新規作成は Phase 2b で完了済み。Green ではスタブの NotImplementedError → 本番ロジック置換のみ行う。新規ファイル作成タスク（Create file 等）を Green に含めてはならない。
+
+- [ ] T014 [P] [US1] ドメインスタブの NotImplementedError → 本番ロジックに置換 in src/domains/[domain]/api/index.ts
+- [ ] T015 [P] [US1] UI コンポーネントスタブ → 本番 UI に置換 in src/domains/[domain]/ui/index.tsx
+- [ ] T016 [US1] API Route スタブ → 本番ルートロジックに置換 in src/app/api/[domain]/route.ts
+- [ ] T017 [US1] 全テスト実行・パス確認（Red テストが全てパスすることを検証）
+
+### Refactor: 改善
+
+> implementation-rules.md「Refactor スコープ制限」ルールに従う。Green で変更したコードのみ対象。
+
+- [ ] T020 [US1] リファクタリングと全テストパス確認
+
+### 検証: E2Eテスト実行 + カバレッジ確認
+
+> implementation-rules.md「検証フェーズ」「ストーリー完了ゲート」ルールに従う。
+
+- [ ] T021 [US1] E2E テスト実行（証跡付き）+ カバレッジ確認
```

US2・US3 も同じパターンで変更する。

#### 変更 6: Phase 追加コメント + Phase N Polish タスク更新

```diff
-[Add more user story phases as needed, following the same pattern]
+[Add more user story phases as needed. 各フェーズは implementation-rules.md を参照し、Red → Green → Refactor → 検証 の順に実行する]
```

Phase N の Polish タスク:

```diff
-- [ ] TXXX [P] Additional unit tests (if requested) in tests/unit/
+- [ ] TXXX [P] サンプルテストリグレッション確認（プロジェクトのサンプルテストコマンドをシェル実行しリグレッションがないことを確認する）
```

#### 変更 7: Dependencies・Parallel Example・Strategy・Notes を TDD ワークフローに統合

Dependencies セクション:

```diff
 ### Phase Dependencies

-- **User Stories (Phase 3+)**: All depend on Foundational phase completion
-  - User stories can then proceed in parallel (if staffed)
-  - Or sequentially in priority order (P1 → P2 → P3)
+- **User Stories (Phase 3+)**: All depend on Foundational phase completion. Can proceed in parallel or sequentially (P1 → P2 → P3)

-### User Story Dependencies
-
-- **User Story 1 (P1)**: Can start after Foundational (Phase 2) - No dependencies on other stories
-- **User Story 2 (P2)**: Can start after Foundational (Phase 2) - May integrate with US1 but should be independently testable
-- **User Story 3 (P3)**: Can start after Foundational (Phase 2) - May integrate with US1/US2 but should be independently testable
-
 ### Within Each User Story

-- Tests (if included) MUST be written and FAIL before implementation
-- Models before services
-- Services before endpoints
-- Core implementation before integration
+- **Red → Green → Refactor → 検証** の順序を厳守（implementation-rules.md 参照）
+- Models before services, services before endpoints
 - Story complete before moving to next priority

 ### Parallel Opportunities

-- All Setup tasks marked [P] can run in parallel
-- All Foundational tasks marked [P] can run in parallel (within Phase 2)
-- Once Foundational phase completes, all user stories can start in parallel (if team capacity allows)
-- All tests for a user story marked [P] can run in parallel
-- Models within a story marked [P] can run in parallel
-- Different user stories can be worked on in parallel by different team members
+- All tasks marked [P] can run in parallel (within same phase)
+- Once Foundational completes, all user stories can start in parallel
+- All Red phase tests for a user story marked [P] can run in parallel
```

Parallel Example:

```diff
-# Launch all tests for User Story 1 together (if tests requested):
-Task: "Contract test for [endpoint] in tests/contract/test_[name].py"
-Task: "Integration test for [user journey] in tests/integration/test_[name].py"
+# Red: Launch all tests for User Story 1 together (MANDATORY):
+Task: "ユースケース単体テスト作成 in tests/unit/test_[name].py"
+Task: "UI コンポーネント単体テスト作成 in tests/unit/test_[name].tsx"
+Task: "API 統合テスト作成 in tests/integration/test_[name].py"
+Task: "E2E テスト作成 in tests/e2e/test_[name].py"
+
+# Green: Launch all models for User Story 1 together:
```

Implementation Strategy（TDD フロー追記 + Parallel Team Strategy 削除）:

```diff
-3. Complete Phase 3: User Story 1
+3. Complete Phase 3: User Story 1 (Red → Green → Refactor → 検証)

-2. Add User Story 1 → Test independently → Deploy/Demo (MVP!)
-3. Add User Story 2 → Test independently → Deploy/Demo
-4. Add User Story 3 → Test independently → Deploy/Demo
+2. Add User Story 1 (Red → Green → Refactor → 検証) → Test independently → Deploy/Demo (MVP!)
+3. Add User Story 2 (Red → Green → Refactor → 検証) → Test independently → Deploy/Demo
+4. Add User Story 3 (Red → Green → Refactor → 検証) → Test independently → Deploy/Demo

-### Parallel Team Strategy
-
-With multiple developers:
-
-1. Team completes Setup + Foundational together
-2. Once Foundational is done:
-   - Developer A: User Story 1
-   - Developer B: User Story 2
-   - Developer C: User Story 3
-3. Stories complete and integrate independently
```

Notes セクション:

```diff
-- Each user story should be independently completable and testable
-- Verify tests fail before implementing
+- Each user story MUST follow implementation-rules.md（Red → Green → Refactor → 検証）
```
