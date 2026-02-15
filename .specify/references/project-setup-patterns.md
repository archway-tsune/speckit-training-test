# Project Setup Verification パターン

speckit.implement Step 4 で使用する ignore ファイルの検出・生成パターン。

## Detection & Creation Logic

- **Git repo 判定**: `git rev-parse --git-dir 2>/dev/null` が成功 → `.gitignore` を作成/検証
- **Docker**: `Dockerfile*` が存在 or plan.md に Docker 記載 → `.dockerignore` を作成/検証
- **ESLint (legacy)**: `.eslintrc*` が存在 → `.eslintignore` を作成/検証
- **ESLint (flat)**: `eslint.config.*` が存在 → config の `ignores` エントリに必要パターンを追加
- **Prettier**: `.prettierrc*` が存在 → `.prettierignore` を作成/検証
- **npm**: `.npmrc` or `package.json` が存在（パブリッシュ時） → `.npmignore` を作成/検証
- **Terraform**: `*.tf` が存在 → `.terraformignore` を作成/検証
- **Helm**: Helm charts が存在 → `.helmignore` を作成/検証

**既存ファイルがある場合**: 必須パターンが含まれていることを確認し、不足分のみ追加
**ファイルがない場合**: 検出された技術に応じた完全なパターンセットで新規作成

## Common Patterns by Technology

plan.md のテックスタックに基づき適用する:

- **Node.js/JavaScript/TypeScript**: `node_modules/`, `dist/`, `build/`, `*.log`, `.env*`
- **Python**: `__pycache__/`, `*.pyc`, `.venv/`, `venv/`, `dist/`, `*.egg-info/`
- **Java**: `target/`, `*.class`, `*.jar`, `.gradle/`, `build/`
- **C#/.NET**: `bin/`, `obj/`, `*.user`, `*.suo`, `packages/`
- **Go**: `*.exe`, `*.test`, `vendor/`, `*.out`
- **Ruby**: `.bundle/`, `log/`, `tmp/`, `*.gem`, `vendor/bundle/`
- **PHP**: `vendor/`, `*.log`, `*.cache`, `*.env`
- **Rust**: `target/`, `debug/`, `release/`, `*.rs.bk`, `*.rlib`, `*.prof*`, `.idea/`, `*.log`, `.env*`
- **Kotlin**: `build/`, `out/`, `.gradle/`, `.idea/`, `*.class`, `*.jar`, `*.iml`, `*.log`, `.env*`
- **C++**: `build/`, `bin/`, `obj/`, `out/`, `*.o`, `*.so`, `*.a`, `*.exe`, `*.dll`, `.idea/`, `*.log`, `.env*`
- **C**: `build/`, `bin/`, `obj/`, `out/`, `*.o`, `*.a`, `*.so`, `*.exe`, `Makefile`, `config.log`, `.idea/`, `*.log`, `.env*`
- **Swift**: `.build/`, `DerivedData/`, `*.swiftpm/`, `Packages/`
- **R**: `.Rproj.user/`, `.Rhistory`, `.RData`, `.Ruserdata`, `*.Rproj`, `packrat/`, `renv/`
- **Universal**: `.DS_Store`, `Thumbs.db`, `*.tmp`, `*.swp`, `.vscode/`, `.idea/`

## Tool-Specific Patterns

- **Docker**: `node_modules/`, `.git/`, `Dockerfile*`, `.dockerignore`, `*.log*`, `.env*`, `coverage/`
- **ESLint**: `node_modules/`, `dist/`, `build/`, `coverage/`, `*.min.js`
- **Prettier**: `node_modules/`, `dist/`, `build/`, `coverage/`, `package-lock.json`, `yarn.lock`, `pnpm-lock.yaml`
- **Terraform**: `.terraform/`, `*.tfstate*`, `*.tfvars`, `.terraform.lock.hcl`
- **Kubernetes/k8s**: `*.secret.yaml`, `secrets/`, `.kube/`, `kubeconfig*`, `*.key`, `*.crt`
