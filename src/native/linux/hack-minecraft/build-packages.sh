#!/usr/bin/env bash
set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
REPO_ROOT="$(cd "$SCRIPT_DIR/../../../.." && pwd)"
OUT_DIR="${1:-$REPO_ROOT/artifacts/linux/hack-minecraft}"
STAGE_DIR="$(mktemp -d)"
trap 'rm -rf "$STAGE_DIR"' EXIT

mkdir -p "$OUT_DIR"
for target in x86_64 arm64; do
  bundle="hack-minecraft-linux-$target-v1.0.0"
  stage="$STAGE_DIR/$bundle"
  mkdir -p "$stage/hack-minecraft"
  cp -R "$REPO_ROOT/public/hack-minecraft/." "$stage/hack-minecraft/"
  cp "$SCRIPT_DIR/native_server.py" "$SCRIPT_DIR/launch-hack-minecraft.sh" \
    "$SCRIPT_DIR/launch-linux-$target.sh" "$SCRIPT_DIR/README.md" "$stage/"
  chmod 0755 "$stage/native_server.py" "$stage/launch-hack-minecraft.sh" "$stage/launch-linux-$target.sh"
  archive="$OUT_DIR/hack-minecraft-linux-$target-v1.0.0.tar.gz"
  tar -C "$STAGE_DIR" -czf "$archive" "$bundle"
done

(
  cd "$OUT_DIR"
  sha256sum hack-minecraft-linux-x86_64-v1.0.0.tar.gz hack-minecraft-linux-arm64-v1.0.0.tar.gz > SHA256SUMS
)
printf 'Created Linux bundles in %s\n' "$OUT_DIR"
