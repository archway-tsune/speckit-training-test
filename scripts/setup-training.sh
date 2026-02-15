#!/usr/bin/env bash
set -euo pipefail

REPO="archway/ec-site-arch"
TAG=$(gh release view --repo "$REPO" --json tagName -q .tagName)
ASSET="ec-site-arch-${TAG}.zip"
TMP_ZIP="/tmp/ec-site-arch.zip"

log() { echo "[setup] $*"; }

# PATH を先に通す（uv/specify が既にある場合でも確実に拾う）
export PATH="$HOME/.local/bin:$PATH"

# 必要コマンドの存在チェック（無ければ明確に落とす）
need_cmd() { command -v "$1" >/dev/null 2>&1 || { log "ERROR: '$1' not found"; exit 1; }; }

need_cmd curl
need_cmd gh
need_cmd unzip

# 1) uv + specify インストール（公式推奨）
log "Step 1/4: install uv & specify-cli"

if ! command -v uv >/dev/null 2>&1; then
  curl -LsSf https://astral.sh/uv/install.sh | sh
  export PATH="$HOME/.local/bin:$PATH"
fi

if ! command -v specify >/dev/null 2>&1; then
  echo y | uv tool install specify-cli --from "git+https://github.com/github/spec-kit.git"
  export PATH="$HOME/.local/bin:$PATH"
fi

# 2) specify init（骨格生成）
log "Step 2/4: specify init"
echo y | specify init --here --ai copilot

# 3) Release ZIP で意図的に上書き適用（A方式）
log "Step 3/4: apply base architecture (intentional overwrite)"
gh release download "$TAG" \
  --repo "$REPO" \
  --pattern "$ASSET" \
  --output "$TMP_ZIP" \
  --clobber

unzip -o "$TMP_ZIP" -d .
rm -f "$TMP_ZIP"

# 4) ベースラインコミット＆プッシュ
log "Step 4/4: commit & push baseline"
git config user.name  "${GITHUB_USER:-codespace}"
git config user.email "${GITHUB_USER:-codespace}@users.noreply.github.com"
git add -A
git commit -m "Setup: apply ec-site-arch $TAG baseline"
git push

log "Done"
