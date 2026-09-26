#!/usr/bin/env bash
set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
REPO_ROOT="$(cd "$SCRIPT_DIR/../.." && pwd)"
command -v em++ >/dev/null || { echo "Emscripten (em++) is required." >&2; exit 1; }

em++ -std=c++17 -O3 --no-entry -sSTANDALONE_WASM=1 \
  -sEXPORTED_FUNCTIONS='["_mcpi_wasm_abi_version","_mcpi_wasm_set_block","_mcpi_wasm_get_block","_mcpi_wasm_get_data","_mcpi_wasm_block_count","_mcpi_wasm_clear"]' \
  "$SCRIPT_DIR/world_core.cpp" \
  -o "$REPO_ROOT/public/hack-minecraft/world-core.wasm"

printf 'Built %s\n' "$REPO_ROOT/public/hack-minecraft/world-core.wasm"
