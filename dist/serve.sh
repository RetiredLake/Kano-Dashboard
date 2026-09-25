#!/usr/bin/env sh

# Browsers block the generated data-file request when index.html is opened as
# file://. Serving this directory over loopback HTTP gives every browser a
# normal origin; HTTPS is not required for this non-threaded compatibility build.

set -eu

SCRIPT_DIR=$(CDPATH= cd -- "$(dirname -- "$0")" && pwd)
PORT=${1:-8123}

command -v python3 >/dev/null 2>&1 || {
    echo "Python 3 is required to run the local web server." >&2
    exit 2
}

printf 'Open http://127.0.0.1:%s/ in your browser.\n' "$PORT"
cd "$SCRIPT_DIR"
exec python3 -m http.server "$PORT" --bind 127.0.0.1
