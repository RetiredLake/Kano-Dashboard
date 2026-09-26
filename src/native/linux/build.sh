#!/usr/bin/env bash
set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
REPO_ROOT="$(cd "$SCRIPT_DIR/../../.." && pwd)"
OUT_DIR="${1:-$REPO_ROOT/artifacts/linux}"
BUILD_DIR="$(mktemp -d)"
trap 'rm -rf "$BUILD_DIR"' EXIT

mkdir -p "$BUILD_DIR/web/assets" "$OUT_DIR"
cp "$SCRIPT_DIR/launcher.js" "$BUILD_DIR/launcher.js"
cp "$REPO_ROOT/dist/index.html" "$REPO_ROOT/dist/dashboard.css" "$REPO_ROOT/dist/dashboard.js" "$BUILD_DIR/web/"
cp "$REPO_ROOT/dist/assets/dashboard-reference.png" "$BUILD_DIR/web/assets/"

cat > "$BUILD_DIR/package.json" <<'EOF'
{
  "name": "kano-dashboard-linux",
  "version": "1.0.0",
  "private": true,
  "bin": "launcher.js",
  "pkg": { "assets": ["web/**/*"] }
}
EOF

cd "$BUILD_DIR"
npm exec --offline --yes --package=pkg@5.8.1 -- pkg . --target node18-linux-x64 --output "$OUT_DIR/kano-dashboard-linux-x86_64"
npm exec --offline --yes --package=pkg@5.8.1 -- pkg . --target node18-linux-arm64 --output "$OUT_DIR/kano-dashboard-linux-arm64"
chmod 0755 "$OUT_DIR/kano-dashboard-linux-x86_64" "$OUT_DIR/kano-dashboard-linux-arm64"
