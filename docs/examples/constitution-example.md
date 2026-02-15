# Constitution Example - ECサイトプロジェクト向け

`/speckit.constitution` 実行時の入力例です。

```
/speckit.constitution
# トレーニングECサイト憲章

## 技術スタック
- Next.js 14 (App Router) + TypeScript 5 (strict mode) + React 18
- Tailwind CSS 3, Zod（バリデーション）
- Vitest（単体・統合テスト）, Playwright（E2Eテスト）

## 核心原則

### テンプレート駆動開発
UI/API/テストはtemplates/のテンプレートを基に実装する。共通基盤はfoundation/を使用し、プロジェクト全体の一貫性と保守性を保つ。独自実装は禁止し、既存のテンプレートとパターンに従うことを義務とする。

### ドメイン分離
各ドメインはsrc/domains/[domain]/に独立して実装し、ドメイン間の依存はAPI経由のみとする。対象ドメイン: Catalog, Cart, Checkout, Orders, Admin。モジュール境界を明確にし、凝集性を高め結合度を下げることで、変更影響範囲を限定し保守性を向上させる。

### テスト駆動開発（TDD）必須（非交渉）
TDD（Red → Green → Refactor → 検証）を徹底する。

- Redフェーズで4種別のテスト（ユースケース単体・UI単体・API統合・E2E）を作成する
- 仕様ベーステスト原則: テストは本来成功すべき正しい仕様（Given-When-Then）で記述し、失敗理由は実装が未実装であるためとする
- 禁止パターン:
  - `expect(true).toBe(false)` 等の意図的失敗アサーション
  - `throw new Error('Not implemented yet')` 等のテストコード内の意図的例外
  - `it.todo()` / `it.skip()` による Red 状態の代替
  - 一時的に失敗する実装スタブの作成
- Greenフェーズでは設計ドキュメント（spec.md、contracts、data-model）から正しい実装を導出し、テストコードを一切変更せず実装コードのみで全テストを通す
- Refactorフェーズは当該ストーリーで変更したファイルのみ対象とし、大規模リファクタリングを禁止する

テスト実行義務（非交渉）:
- TDD各フェーズでテストランナーをシェル実行し結果を検証する。テストファイル作成だけではフェーズ完了としない
- フェーズ別検証基準:
  - Red: 新規テストがFAIL（未実装エラー）+ 既存テストがPASS
  - Green: 全テストがPASS + テスト件数 > 0
  - Refactor: 全テストがPASS
  - 検証: カバレッジ80%以上 + E2EテストPASS

実装ガードレール（非交渉）:
- 保護対象レイヤー（Foundation, Templates, Contracts, Infrastructure、ルート設定ファイル）への改変を禁止する。変更許可範囲はDomains, Appルート, Testsに限定する
- フェーズゲート（Red/Green/Refactor）ではユニット・統合テストのみ実行し、E2Eテストはストーリー完了ゲートでのみ実行する（2層テストゲート）
- ストーリー完了時に全テスト（ユニット・統合・E2E）のパスを確認し、失敗が残る場合は次のストーリーに進まない

### 共通UIコンポーネントの利用
ドメイン実装時は@/templates/ui/components/の共通コンポーネントを使用し、同等機能の独自実装を禁止する。

### 実装ワークフロー
スタブ置換で本番実装に切り替える。API（NotImplementedError → 本番API）およびUI（プレースホルダー → 本番コンポーネント）の段階的実装により、既存システムへの影響を最小化しながら機能を追加する。spec.mdを唯一の情報源とし、data-modelやcontractsの不備を理由とした要件スキップを禁止する。contractsに不足があれば拡張する。

## 認証・認可
- ロール: buyer（購入者）, admin（管理者）
- セッション方式（Cookie-based）、CSRF対策を基盤として提供
- 認可: RBAC、画面遷移レベル + 業務実行レベルの二重防御

## 品質基準
- TypeScript strictモード（エラー0件）、ESLint（エラー0件）
- テストカバレッジ80%以上（各ストーリー完了時にローカルで検証、CIを待たない）
- E2Eテスト: 主要導線カバー。実行結果の証跡（パス/失敗件数）を提示する義務あり。パス件数0件はエラー
- 外部リソース検証: シードデータの外部URLは実装時にHTTPリクエストで存在確認し、失敗したURLは代替に置換する。plan時点では「検証予定」扱い
- サンプルコード保護: contractsの新規フィールドは`.default()`または`.optional()`を付与。シードデータはベース（不変）と拡張（本番追加分）に分離
- パフォーマンス: 一覧ページ初回ロード3秒以内

## 命名規約
- ファイル名: kebab-case、コンポーネント: PascalCase、関数: camelCase、定数: UPPER_SNAKE_CASE、型: PascalCase

## テスト配置規約
- 本番単体テスト: tests/unit/domains/[domain]/
- 本番統合テスト: tests/integration/domains/[domain]/
- 本番E2Eテスト: tests/e2e/
- サンプルテスト: src/samples/tests/ 配下（本番テストを追加しない）

## 開発ワークフロー
ユーザーストーリー単位でフェーズ分割し独立した実装・テストを可能にする。src/contracts/を基盤とし、src/samples/を参考に実装する。実装完了後にnavLinksのコメントを解除し、段階的な機能公開を行う。

## 統制
すべてのプロジェクト憲章・仕様書・計画・タスク・実装に関するドキュメントは見出し・本文ともに日本語で記述する。憲章は他のすべての慣行に優先し、修正にはドキュメント化、承認、移行計画が必要である。すべてのPR・レビューは準拠を検証し、複雑性は正当化されなければならない。
```
