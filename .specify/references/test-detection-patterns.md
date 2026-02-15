# テストコマンド検出パターン: ECサイトアーキテクチャ基盤

本ファイルは speckit.implement コマンドの Step 4（テストコマンド検出）で AI エージェントが読み込む検出パターンを定義する。

## テックスタック判定パターン

プロジェクトルートのファイル存在確認で技術スタックを判定し、テスト実行コマンドを検出する:

- `package.json` → `scripts` セクションから test 関連スクリプトを検出。パッケージマネージャーは lock ファイルで判定（`pnpm-lock.yaml` → pnpm, `yarn.lock` → yarn, `package-lock.json` → npm）
- `pyproject.toml` / `setup.cfg` → pytest / tox コマンドを検出
- `Makefile` → test 関連ターゲットを検出
- `build.gradle` / `build.gradle.kts` → gradle test コマンドを検出
- `pom.xml` → mvn test コマンドを検出
- `Cargo.toml` → cargo test コマンドを検出
- `go.mod` → go test コマンドを検出
- `*.csproj` / `*.sln` → dotnet test コマンドを検出

## E2E 前提条件検出パターン

E2E_TEST_CMD が検出された場合のみ実行する:

- **優先**: CI ワークフロー定義（`.github/workflows/*.yml`）を読み込み、E2E_TEST_CMD のコマンド文字列を含む step と同一ジョブ内でそれより前に定義されたセットアップ step から、ブラウザ/ドライバーインストールコマンドを検出する
- **フォールバック**: CI 定義がない場合、devDependencies からフレームワークを特定しパターンマッチで推定する:
  - `@playwright/test` → `playwright install --with-deps`
  - `cypress` → `cypress install`
  - `selenium-webdriver` + `chromedriver` → `chromedriver --install`
- 検出結果を E2E_PREREQ_CMD としてテストコマンドテーブルに追加する
- E2E_PREREQ_CMD の実行済みフラグを「未実行」で初期化する
- E2E_PREREQ_CMD が検出できない場合でも E2E_TEST_CMD の実行は試みる（失敗時にユーザーへ前提条件の確認を促す）

## 依存関係インストール検出パターン

テスト・ビルド実行前に必要な依存関係インストールコマンドを検出する:

1. **優先**: CI ワークフロー（`.github/workflows/*.yml`）を読み込み、テスト実行 step より前の依存関係インストール step を検出する
   - `run:` に `install` を含む step（`pnpm install`, `npm install`, `pip install` 等）
   - 検出した `run:` 値を DEPS_INSTALL_CMD として記録
2. **フォールバック**: lock ファイルから推定（`pnpm-lock.yaml` → `pnpm install` 等）
3. DEPS_INSTALL_CMD をテストコマンドテーブルに追加（実行済みフラグ「未実行」で初期化）
4. DEPS_INSTALL_CMD が未実行の場合、最初のテスト実行前に自動実行する

## テストコマンド検出ワークフロー

plan.md のコンテキスト読み込み完了後、以下の手順でテスト実行コマンドを検出する:

1. plan.md の Technical Context から tech stack 情報を確認する
2. 上記「テックスタック判定パターン」「E2E 前提条件検出パターン」「依存関係インストール検出パターン」に従い、各コマンドを検出する
3. 検出結果をテストコマンドテーブルとして整理する:

   | 種別 | 変数名 | 必須/任意 |
   |------|--------|----------|
   | 依存関係インストール | DEPS_INSTALL_CMD | **必須** — 検出不可ならユーザーに確認 |
   | 単体テスト | UNIT_TEST_CMD | **必須** — 検出不可ならユーザーに確認 |
   | 単体テスト（関連のみ） | UNIT_TEST_RELATED_CMD | 任意 — UNIT_TEST_CMD に `--related` オプションを付与した形式。検出不可なら UNIT_TEST_CMD にフォールバック |
   | 統合テスト | INTEGRATION_TEST_CMD | 任意 — 検出不可ならスキップ |
   | E2E テスト | E2E_TEST_CMD | 任意 — 検出不可ならスキップ |
   | E2E 前提条件 | E2E_PREREQ_CMD | 任意 — 検出不可ならスキップ |
   | カバレッジ | COVERAGE_CMD | 任意 — 検出不可ならスキップ |

4. テストコマンドテーブルをユーザーに表示し、正しいことを確認する
5. **注意**: 特定のパッケージマネージャーやテストランナー名をハードコードしない。検出したコマンドをそのまま使用する
