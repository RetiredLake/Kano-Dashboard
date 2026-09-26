import test from "node:test";
import assert from "node:assert/strict";
import { BLOCKS, createMcpiWebApi } from "../public/hack-minecraft/api.js";

test("world block calls read, write, and retain block data", () => {
  const mc = createMcpiWebApi();
  mc.world.setBlock(2, 3, -4, BLOCKS.gold_block, 7);
  assert.equal(mc.world.getBlock(2, 3, -4), BLOCKS.gold_block);
  assert.deepEqual(mc.world.getBlockWithData(2, 3, -4), { id: BLOCKS.gold_block, data: 7 });
  mc.world.setBlock(2, 3, -4, 0);
  assert.equal(mc.world.getBlock(2, 3, -4), 0);
});

test("setBlocks includes both corners and getBlocks returns values", () => {
  const mc = createMcpiWebApi();
  mc.world.setBlocks(1, 1, 1, 2, 2, 2, BLOCKS.brick);
  assert.equal(mc.world.getBlocks(1, 1, 1, 2, 2, 2).length, 8);
  assert.equal(mc.world.getBlock(2, 2, 2), BLOCKS.brick);
  assert.equal(mc.world.getHeight(1, 1), 2);
});

test("large regions and invalid coordinates fail without mutating the world", () => {
  const mc = createMcpiWebApi();
  assert.throws(() => mc.world.setBlocks(0, 0, 0, 100, 100, 100, 1), /web limit/);
  assert.throws(() => mc.world.setBlock(Number.NaN, 0, 0, 1), /finite/);
  assert.equal(mc.world.getBlock(0, 0, 0), 0);
});

test("player aliases, chat, and checkpoint restore are available", () => {
  const mc = createMcpiWebApi();
  mc.player.setTile(3, 2, -1);
  assert.deepEqual(mc.entity.getPos(0), { x: 3.5, y: 2, z: -0.5 });
  mc.world.setBlock(0, 1, 0, BLOCKS.stone);
  mc.world.checkpoint.save();
  mc.world.setBlock(0, 1, 0, BLOCKS.lava);
  mc.world.checkpoint.restore();
  assert.equal(mc.world.getBlock(0, 1, 0), BLOCKS.stone);
  mc.chat.post("hello");
  assert.deepEqual(mc.chat.getPosts(), [{ entityId: 0, message: "hello" }]);
});

test("RaspberryJuice-style command dispatch reads and writes the web world", () => {
  const mc = createMcpiWebApi();
  mc.dispatch("world.setBlock(0,1,0,41)");
  assert.equal(mc.dispatch("world.getBlock(0,1,0)"), "41");
  assert.equal(mc.dispatch("player.getPos()"), "0,1,0");
  assert.equal(mc.dispatch("unknown.command()"), "Fail");
});

test("entities, signs, time, and event queues are emulated", () => {
  const mc = createMcpiWebApi();
  const id = mc.world.spawnEntity(1, 2, 3, 32);
  assert.equal(mc.entity.getName(id), "Zombie");
  assert.equal(mc.world.getEntities(32).length, 1);
  mc.entity.setPos(id, 4.5, 5, -2.25);
  assert.deepEqual(mc.entity.getPos(id), { x: 4.5, y: 5, z: -2.25 });
  mc.world.setSign(0, 1, 0, 63, 0, "hello", "world");
  assert.deepEqual(mc.world.getSign(0, 1, 0), ["hello", "world"]);
  mc.world.setTime(6000);
  assert.equal(mc.world.getTime(), 6000);
  mc.events.emitBlockHit(0, 1, 0, 1, id);
  assert.equal(mc.entity.events.block.hits(id).length, 1);
  assert.equal(mc.entity.remove(id), true);
});

test("line dispatcher supports wrapped floating point arguments and Reborn toggles", () => {
  const mc = createMcpiWebApi();
  const id = mc.dispatch("world.spawnEntity(1,2,3,32)");
  assert.equal(mc.dispatch(`entity.setPos(${id},:4.5:,:6.25:,:-1.5:)`), "");
  assert.equal(mc.dispatch(`entity.getPos(${id})`), "4.5,6.25,-1.5");
  assert.equal(mc.dispatch(`entity.setDirection(${id},1,0,0)`), "");
  assert.equal(mc.dispatch(`entity.getDirection(${id})`), "1,0,0");
  assert.equal(mc.dispatch("reborn.disableCompatMode()"), "1.0.0-web");
  assert.equal(mc.compatibilityMode, false);
  mc.dispatch("reborn.enableCompatMode()");
  assert.equal(mc.compatibilityMode, true);
});
