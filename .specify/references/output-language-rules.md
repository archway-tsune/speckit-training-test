# 出力言語制御ルール

`.specify/memory/constitution.md` の **Governance** セクションからドキュメント言語指定（例: `ドキュメントは日本語で記述する`）を読み取る。言語が指定されている場合、ALL generated output — section headings, phase names, task descriptions, body text — MUST be written in that language. Translate English template headings accordingly.

**言語変換除外対象**（英語のまま維持）: Format tokens (`[P]`, `[US1]`, `T001`), code references, and file paths.

## コマンド固有ルール

- **constitution**: Governance セクションに documentation language directive を含めることを確認する（例: `すべての生成ドキュメント（仕様書・計画書・タスク・チェックリスト等）は見出し・本文ともに日本語で記述する`）。ユーザーが言語を指定しない場合はプレースホルダーを挿入する
- **plan**: constitution ロード時に documentation language directives と TDD mandates の両方を確認する
