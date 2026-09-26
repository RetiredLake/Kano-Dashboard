#!/usr/bin/env bash
set -euo pipefail
HERE="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
command -v python3 >/dev/null || { echo "Python 3 is required." >&2; exit 1; }
exec python3 "$HERE/native_server.py" "$@"
