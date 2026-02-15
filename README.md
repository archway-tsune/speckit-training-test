# Spec-Kit トレーニング環境

Spec-Kit を利用したスペック駆動開発トレーニング用テンプレートです。

## 前提条件

- GitHub アカウント
- トレーニング用チームへの所属（講師が事前に追加します。Copilot のシート割り当てを含みます）

## 受講手順

### 1. テンプレートからリポジトリ作成

「Use this template」→ 自分のリポジトリを作成（Private 推奨）

### 2. Codespace を作成

「Code」→「Create codespace on main」

- 自動セットアップが実行されます（数分かかります）
- ターミナルに `[setup] Done` と表示されたら完了です

### 3. Copilot のモデルを変更

Copilot Chat パネルを開き、入力欄下部のモデルピッカーから **Claude Sonnet 4** を選択してください。
一度選択すれば、以降は同じワークスペース内で自動的に記憶されます。

### 4. トレーニング開始

セットアップ完了後、Copilot Chat で以下の順に実行します:

```
/speckit.constitution
/speckit.specify
/speckit.plan
/speckit.tasks
/speckit.implement
```

## トラブルシューティング

セットアップが失敗した場合:

```bash
bash scripts/setup-training.sh
```

それでも解決しない場合は Codespace を削除して再作成してください。
