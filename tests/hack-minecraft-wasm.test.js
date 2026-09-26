import test from "node:test";
import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import { BLOCKS, createMcpiWebApi } from "../public/hack-minecraft/api.js";

const wasmPath = new URL("../public/hack-minecraft/world-core.wasm", import.meta.url);
const bytes = await readFile(wasmPath);
const { instance } = await WebAssembly.instantiate(bytes);
const core = instance.exports;

test("WebAssembly block store reads, updates, deletes, and counts cells", () => {
  core.mcpi_wasm_clear();
  assert.equal(core.mcpi_wasm_abi_version(), 1);
  assert.equal(core.mcpi_wasm_set_block(-3, 5, 17, BLOCKS.gold_block, 4), 0);
  assert.equal(core.mcpi_wasm_get_block(-3, 5, 17), BLOCKS.gold_block);
  assert.equal(core.mcpi_wasm_get_data(-3, 5, 17), 4);
  assert.equal(core.mcpi_wasm_block_count(), 1);
  assert.equal(core.mcpi_wasm_set_block(-3, 5, 17, 0, 0), 0);
  assert.equal(core.mcpi_wasm_get_block(-3, 5, 17), 0);
  assert.equal(core.mcpi_wasm_block_count(), 0);
});

test("MCPI web adapter uses WebAssembly storage and mirrors checkpoint restores", () => {
  core.mcpi_wasm_clear();
  const mc = createMcpiWebApi({ worldCore: core });
  assert.equal(mc.engine, "WebAssembly");
  mc.world.setBlock(1, 2, 3, BLOCKS.brick, 6);
  assert.deepEqual(mc.world.getBlockWithData(1, 2, 3), { id: BLOCKS.brick, data: 6 });
  mc.world.checkpoint.save();
  mc.world.setBlocks(0, 1, 0, 1, 1, 1, BLOCKS.stone);
  assert.equal(core.mcpi_wasm_block_count(), 5);
  mc.world.checkpoint.restore();
  assert.equal(mc.world.getBlock(1, 1, 1), 0);
  assert.equal(core.mcpi_wasm_get_block(1, 2, 3), BLOCKS.brick);
  assert.equal(mc.world.getWasmBlockCount(), 1);
});
