#!/usr/bin/env bash
set -euo pipefail
ARCH="$(uname -m)"
[[ "$ARCH" == "x86_64" ]] || { echo "This package is for x86_64; found $ARCH." >&2; exit 2; }
HERE="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
exec "$HERE/launch-hack-minecraft.sh" "$@"
