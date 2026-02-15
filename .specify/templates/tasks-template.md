---

description: "Task list template for feature implementation"
---

# Tasks: [FEATURE NAME]

**Input**: Design documents from `/specs/[###-feature-name]/`
**Prerequisites**: plan.md (required), spec.md (required for user stories), research.md, data-model.md, contracts/

**Tests**: MANDATORY — constitution（原則 VI）は TDD 必須。各ユーザーストーリーは Red → Green → Refactor → 検証 の 4 ステップで実装する。

**Organization**: Tasks are grouped by user story to enable independent implementation and testing of each story.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (e.g., US1, US2, US3)
- Include exact file paths in descriptions

## Path Conventions

- **Single project**: `src/`, `tests/` at repository root
- **Web app**: `backend/src/`, `frontend/src/`
- **Mobile**: `api/src/`, `ios/src/` or `android/src/`
- Paths shown below assume single project - adjust based on plan.md structure

<!--
  ============================================================================
  IMPORTANT: The tasks below are SAMPLE TASKS for illustration purposes only.

  The /speckit.tasks command MUST:
  1. REPLACE sample tasks with actual tasks based on:
     - User stories from spec.md (with their priorities P1, P2, P3...)
     - Feature requirements from plan.md
     - Entities from data-model.md
     - Endpoints from contracts/
  2. MAINTAIN the phase structure (Phase 1, Phase 2, Phase 3+, Final Phase)
     defined in this template. Sample tasks are replaced, but the phase
     headings and their order are preserved.
  3. ORGANIZE tasks by user story so each story can be:
     - Implemented independently
     - Tested independently
     - Delivered as an MVP increment

  Replace sample task content, but DO NOT remove or skip phase sections.
  ============================================================================
-->

## TDD Phase Rules（全ストーリー共通）

**【REQUIRED】Read `.specify/references/implementation-rules.md`** — Red/Green/Refactor/検証/ストーリー完了ゲートの全ルールに従う。

各ユーザーストーリーは Red → Green → Refactor → 検証 の 4 フェーズを順に実行する。ルール本体は implementation-rules.md に一元化されている。

---

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Project initialization and basic structure

- [ ] T001 Create project structure per implementation plan
- [ ] T002 Initialize [language] project with [framework] dependencies
- [ ] T003 [P] Configure linting and formatting tools

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Core infrastructure that MUST be complete before ANY user story can be implemented

**⚠️ CRITICAL**: No user story work can begin until this phase is complete

### 2a: 基盤インフラ

Examples of foundational tasks (adjust based on your project):

- [ ] T004 Setup database schema and migrations framework
- [ ] T005 [P] Implement authentication/authorization framework
- [ ] T006 [P] Setup API routing and middleware structure
- [ ] T007 Create base models/entities that all stories depend on
- [ ] T008 Configure error handling and logging infrastructure
- [ ] T009 Setup environment configuration management

**Checkpoint**: Phase 2a 完了 — contracts・インフラ基盤が確定

### 2b: ドメインスキャフォールド（全ストーリー分一括生成）

Phase 2a 完了後・Red テスト前に、**全ユーザーストーリー分**のスタブを一括生成する。contracts 確定後が最適なタイミング。

手順は `implementation-rules.md`「Phase 2b: 基盤スキャフォールディング」に従う:

- [ ] T0XX 設計成果物（contracts/spec）を分析し、全ストーリー分のユースケース関数・UI コンポーネント・API Route を特定する
- [ ] T0XX [P] ドメインスタブ生成: `usecase-stub.template.ts` を Read → 全ユースケース関数のスタブを `src/domains/{domain}/api/index.ts` に一括生成する（既存スタブは保持、不足分のみ追加）
- [ ] T0XX [P] UI コンポーネントスタブ生成: `ui-stub.template.tsx` を Read → 全 UI コンポーネントのスタブを `src/domains/{domain}/ui/index.tsx` に一括生成する
- [ ] T0XX [P] API Route スタブ生成: `api-route-stub.template.ts` を Read → 全 API Route のスタブを `src/app/api/{domain}/` に一括生成する（handleError() 経由エラー変換パターン）

**Checkpoint**: Phase 2b 完了 — 全ドメインスタブ・API Route スタブが存在し、Red テストが import/アクセスする全ファイルが利用可能

---

## Phase 3: User Story 1 - [Title] (Priority: P1) 🎯 MVP

**Goal**: [Brief description of what this story delivers]

**Independent Test**: [How to verify this story works on its own]

### Red: テスト作成 (MANDATORY)

> implementation-rules.md「Red フェーズ」ルールに従う。4 種別（単体・UI・統合・E2E）を作成し、テストランナーで FAIL を確認する。

- [ ] T010 [P] [US1] ユースケース単体テスト作成 in tests/unit/test_[name].py
- [ ] T011 [P] [US1] UI コンポーネント単体テスト作成 in tests/unit/test_[name].tsx
- [ ] T012 [P] [US1] API 統合テスト作成 in tests/integration/test_[name].py
- [ ] T013 [P] [US1] E2E テスト作成 in tests/e2e/test_[name].py

### Green: 最小実装

> implementation-rules.md「Green フェーズ」ルールに従う。テストファイル変更禁止。実装コードのみ追加する。
> **ファイル新規作成禁止（非交渉）**: ファイル新規作成は Phase 2b で完了済み。Green ではスタブの NotImplementedError → 本番ロジック置換のみ行う。新規ファイル作成タスク（Create file 等）を Green に含めてはならない。

- [ ] T014 [P] [US1] ドメインスタブの NotImplementedError → 本番ロジックに置換 in src/domains/[domain]/api/index.ts
- [ ] T015 [P] [US1] UI コンポーネントスタブ → 本番 UI に置換 in src/domains/[domain]/ui/index.tsx
- [ ] T016 [US1] API Route スタブ → 本番ルートロジックに置換 in src/app/api/[domain]/route.ts
- [ ] T017 [US1] 全テスト実行・パス確認（Red テストが全てパスすることを検証）

### Refactor: 改善

> implementation-rules.md「Refactor スコープ制限」ルールに従う。Green で変更したコードのみ対象。

- [ ] T020 [US1] リファクタリングと全テストパス確認

### 検証: E2Eテスト実行 + カバレッジ確認

> implementation-rules.md「検証フェーズ」「ストーリー完了ゲート」ルールに従う。

- [ ] T021 [US1] E2E テスト実行（証跡付き）+ カバレッジ確認

**Checkpoint**: At this point, User Story 1 should be fully functional and testable independently

---

## Phase 4: User Story 2 - [Title] (Priority: P2)

**Goal**: [Brief description of what this story delivers]

**Independent Test**: [How to verify this story works on its own]

### Red: テスト作成 (MANDATORY)

> implementation-rules.md「Red フェーズ」ルールに従う。

- [ ] T022 [P] [US2] ユースケース単体テスト作成 in tests/unit/test_[name].py
- [ ] T023 [P] [US2] UI コンポーネント単体テスト作成 in tests/unit/test_[name].tsx
- [ ] T024 [P] [US2] API 統合テスト作成 in tests/integration/test_[name].py
- [ ] T025 [P] [US2] E2E テスト作成 in tests/e2e/test_[name].py

### Green: 最小実装

> implementation-rules.md「Green フェーズ」ルールに従う。
> **ファイル新規作成禁止（非交渉）**: ファイル新規作成は Phase 2b で完了済み。Green ではスタブの NotImplementedError → 本番ロジック置換のみ行う。新規ファイル作成タスク（Create file 等）を Green に含めてはならない。

- [ ] T026 [P] [US2] ドメインスタブの NotImplementedError → 本番ロジックに置換 in src/domains/[domain]/api/index.ts
- [ ] T027 [US2] UI コンポーネントスタブ → 本番 UI に置換 in src/domains/[domain]/ui/index.tsx
- [ ] T028 [US2] API Route スタブ → 本番ルートロジックに置換 in src/app/api/[domain]/route.ts
- [ ] T029 [US2] 全テスト実行・パス確認（Red テストが全てパスすることを検証）

### Refactor: 改善

> implementation-rules.md「Refactor スコープ制限」ルールに従う。

- [ ] T031 [US2] リファクタリングと全テストパス確認

### 検証: E2Eテスト実行 + カバレッジ確認

> implementation-rules.md「検証フェーズ」「ストーリー完了ゲート」ルールに従う。

- [ ] T032 [US2] E2E テスト実行（証跡付き）+ カバレッジ確認

**Checkpoint**: At this point, User Stories 1 AND 2 should both work independently

---

## Phase 5: User Story 3 - [Title] (Priority: P3)

**Goal**: [Brief description of what this story delivers]

**Independent Test**: [How to verify this story works on its own]

### Red: テスト作成 (MANDATORY)

> implementation-rules.md「Red フェーズ」ルールに従う。

- [ ] T033 [P] [US3] ユースケース単体テスト作成 in tests/unit/test_[name].py
- [ ] T034 [P] [US3] UI コンポーネント単体テスト作成 in tests/unit/test_[name].tsx
- [ ] T035 [P] [US3] API 統合テスト作成 in tests/integration/test_[name].py
- [ ] T036 [P] [US3] E2E テスト作成 in tests/e2e/test_[name].py

### Green: 最小実装

> implementation-rules.md「Green フェーズ」ルールに従う。
> **ファイル新規作成禁止（非交渉）**: ファイル新規作成は Phase 2b で完了済み。Green ではスタブの NotImplementedError → 本番ロジック置換のみ行う。新規ファイル作成タスク（Create file 等）を Green に含めてはならない。

- [ ] T037 [P] [US3] ドメインスタブの NotImplementedError → 本番ロジックに置換 in src/domains/[domain]/api/index.ts
- [ ] T038 [US3] UI コンポーネントスタブ → 本番 UI に置換 in src/domains/[domain]/ui/index.tsx
- [ ] T039 [US3] 全テスト実行・パス確認（Red テストが全てパスすることを検証）

### Refactor: 改善

> implementation-rules.md「Refactor スコープ制限」ルールに従う。

- [ ] T041 [US3] リファクタリングと全テストパス確認

### 検証: E2Eテスト実行 + カバレッジ確認

> implementation-rules.md「検証フェーズ」「ストーリー完了ゲート」ルールに従う。

- [ ] T042 [US3] E2E テスト実行（証跡付き）+ カバレッジ確認

**Checkpoint**: All user stories should now be independently functional

---

[Add more user story phases as needed. 各フェーズは implementation-rules.md を参照し、Red → Green → Refactor → 検証 の順に実行する]

---

## Phase N: Polish & Cross-Cutting Concerns

**Purpose**: Improvements that affect multiple user stories

- [ ] TXXX [P] Documentation updates in docs/
- [ ] TXXX Code cleanup and refactoring
- [ ] TXXX Performance optimization across all stories
- [ ] TXXX [P] サンプルテストリグレッション確認（プロジェクトのサンプルテストコマンドをシェル実行しリグレッションがないことを確認する）
- [ ] TXXX Security hardening
- [ ] TXXX Run quickstart.md validation

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: No dependencies - can start immediately
- **Foundational (Phase 2)**: Depends on Setup completion - BLOCKS all user stories
- **User Stories (Phase 3+)**: All depend on Foundational phase completion. Can proceed in parallel or sequentially (P1 → P2 → P3)
- **Polish (Final Phase)**: Depends on all desired user stories being complete

### Within Each User Story

- **Red → Green → Refactor → 検証** の順序を厳守（implementation-rules.md 参照）
- Models before services, services before endpoints
- Story complete before moving to next priority

### Parallel Opportunities

- All tasks marked [P] can run in parallel (within same phase)
- Once Foundational completes, all user stories can start in parallel
- All Red phase tests for a user story marked [P] can run in parallel

---

## Parallel Example: User Story 1

```bash
# Red: Launch all tests for User Story 1 together (MANDATORY):
Task: "ユースケース単体テスト作成 in tests/unit/test_[name].py"
Task: "UI コンポーネント単体テスト作成 in tests/unit/test_[name].tsx"
Task: "API 統合テスト作成 in tests/integration/test_[name].py"
Task: "E2E テスト作成 in tests/e2e/test_[name].py"

# Green: Launch all models for User Story 1 together:
Task: "Create [Entity1] model in src/models/[entity1].py"
Task: "Create [Entity2] model in src/models/[entity2].py"
```

---

## Implementation Strategy

### MVP First (User Story 1 Only)

1. Complete Phase 1: Setup
2. Complete Phase 2: Foundational (CRITICAL - blocks all stories)
3. Complete Phase 3: User Story 1 (Red → Green → Refactor → 検証)
4. **STOP and VALIDATE**: Test User Story 1 independently
5. Deploy/demo if ready

### Incremental Delivery

1. Complete Setup + Foundational → Foundation ready
2. Add User Story 1 (Red → Green → Refactor → 検証) → Test independently → Deploy/Demo (MVP!)
3. Add User Story 2 (Red → Green → Refactor → 検証) → Test independently → Deploy/Demo
4. Add User Story 3 (Red → Green → Refactor → 検証) → Test independently → Deploy/Demo
5. Each story adds value without breaking previous stories

---

## Notes

- [P] tasks = different files, no dependencies
- [Story] label maps task to specific user story for traceability
- Each user story MUST follow implementation-rules.md（Red → Green → Refactor → 検証）
- Commit after each task or logical group
- Stop at any checkpoint to validate story independently
- Avoid: vague tasks, same file conflicts, cross-story dependencies that break independence
