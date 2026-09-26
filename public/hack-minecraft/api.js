/*
 * Hack Minecraft web edition: browser-side MCPI/RaspberryJuice compatibility API.
 * The web sandbox intentionally keeps its world in memory; it cannot expose
 * the original TCP/4711 socket from a browser page.
 */

export const BLOCKS = Object.freeze({
  air: 0,
  stone: 1,
  grass: 2,
  dirt: 3,
  cobblestone: 4,
  planks: 5,
  sapling: 6,
  bedrock: 7,
  water: 9,
  sand: 12,
  gravel: 13,
  gold_ore: 14,
  iron_ore: 15,
  coal_ore: 16,
  wood: 17,
  leaves: 18,
  glass: 20,
  lapis_ore: 21,
  sandstone: 24,
  wool: 35,
  gold_block: 41,
  iron_block: 42,
  brick: 45,
  tnt: 46,
  bookshelf: 47,
  moss_stone: 48,
  obsidian: 49,
  diamond_ore: 56,
  diamond_block: 57,
  snow: 78,
  clay: 82,
  emerald_ore: 129,
  emerald_block: 133,
  quartz_block: 155,
  redstone_block: 152,
  lava: 11,
});

const BLOCK_NAMES = Object.freeze(Object.fromEntries(Object.entries(BLOCKS).map(([name, id]) => [id, name])));
const MAX_REGION_BLOCKS = 32768;
const keyOf = (x, y, z) => `${Math.trunc(x)},${Math.trunc(y)},${Math.trunc(z)}`;
const point = (x, y, z) => ({ x: Number(x), y: Number(y), z: Number(z) });
const validPoint = (x, y, z) => [x, y, z].every(Number.isFinite);

export function createMcpiWebApi({ onChange = () => {}, onChat = () => {}, worldCore = null } = {}) {
  const blocks = new Map();
  const savedBlocks = new Map();
  const savedSigns = new Map();
  const blockHits = [];
  const chatPosts = [];
  const projectileHits = [];
  const signs = new Map();
  const entities = new Map();
  const settings = { autojump: 0, nametags_visible: 1, world_immutable: 0 };
  const playerPosition = point(0, 1, 0);
  const camera = { mode: "normal", position: point(0, 3, 8), entityId: 0 };
  const entityTypes = { 10: "Chicken", 11: "Cow", 12: "Pig", 13: "Sheep", 32: "Zombie", 33: "Creeper", 34: "Skeleton", 35: "Spider" };
  let nextEntityId = 1;
  let worldTime = 0;
  let compatibilityMode = true;
  let nullResponses = false;
  let changeVersion = 0;

  entities.set(0, {
    id: 0, type: 0, name: "Player", position: playerPosition, direction: point(0, 0, 1),
    rotation: 0, pitch: 0, velocity: point(0, 0, 0), selectedItem: { id: 0, count: 0, data: 0 },
  });

  function emitChange() {
    changeVersion += 1;
    onChange(changeVersion);
  }

  function coordinates(x, y, z) {
    const p = point(x, y, z);
    if (!validPoint(p.x, p.y, p.z)) throw new TypeError("Coordinates must be finite numbers");
    return { x: Math.trunc(p.x), y: Math.trunc(p.y), z: Math.trunc(p.z) };
  }

  function setBlock(x, y, z, blockId, data = 0) {
    const p = coordinates(x, y, z);
    const id = Math.trunc(Number(blockId));
    const metadata = Math.trunc(Number(data));
    if (!Number.isFinite(id) || id < 0 || id > 255) throw new RangeError("Block ID must be between 0 and 255");
    if (!Number.isFinite(metadata)) throw new TypeError("Block data must be a finite number");
    if (worldCore && worldCore.mcpi_wasm_set_block(p.x, p.y, p.z, id, metadata) !== 0) {
      throw new RangeError("WebAssembly block storage is full");
    }
    const key = keyOf(p.x, p.y, p.z);
    if (id === 0) blocks.delete(key);
    else blocks.set(key, { ...p, id, data: metadata });
    emitChange();
    return true;
  }

  function getBlock(x, y, z) {
    const p = coordinates(x, y, z);
    return worldCore ? worldCore.mcpi_wasm_get_block(p.x, p.y, p.z) : (blocks.get(keyOf(p.x, p.y, p.z))?.id ?? 0);
  }

  function getBlockWithData(x, y, z) {
    const p = coordinates(x, y, z);
    if (worldCore) {
      const id = worldCore.mcpi_wasm_get_block(p.x, p.y, p.z);
      return { id, data: id ? worldCore.mcpi_wasm_get_data(p.x, p.y, p.z) : 0 };
    }
    const found = blocks.get(keyOf(p.x, p.y, p.z));
    return found ? { id: found.id, data: found.data } : { id: 0, data: 0 };
  }

  function getBounds(x0, y0, z0, x1, y1, z1) {
    const a = coordinates(x0, y0, z0);
    const b = coordinates(x1, y1, z1);
    const bounds = {
      minX: Math.min(a.x, b.x), maxX: Math.max(a.x, b.x),
      minY: Math.min(a.y, b.y), maxY: Math.max(a.y, b.y),
      minZ: Math.min(a.z, b.z), maxZ: Math.max(a.z, b.z),
    };
    const volume = (bounds.maxX - bounds.minX + 1) * (bounds.maxY - bounds.minY + 1) * (bounds.maxZ - bounds.minZ + 1);
    if (!Number.isSafeInteger(volume) || volume > MAX_REGION_BLOCKS) {
      throw new RangeError(`Region exceeds the ${MAX_REGION_BLOCKS.toLocaleString()} block web limit`);
    }
    return bounds;
  }

  function setBlocks(x0, y0, z0, x1, y1, z1, blockId, data = 0) {
    const bounds = getBounds(x0, y0, z0, x1, y1, z1);
    const id = Math.trunc(Number(blockId));
    const metadata = Math.trunc(Number(data));
    if (!Number.isFinite(id) || id < 0 || id > 255) throw new RangeError("Block ID must be between 0 and 255");
    if (!Number.isFinite(metadata)) throw new TypeError("Block data must be a finite number");
    for (let x = bounds.minX; x <= bounds.maxX; x += 1) {
      for (let y = bounds.minY; y <= bounds.maxY; y += 1) {
        for (let z = bounds.minZ; z <= bounds.maxZ; z += 1) {
          const key = keyOf(x, y, z);
          if (worldCore && worldCore.mcpi_wasm_set_block(x, y, z, id, metadata) !== 0) {
            throw new RangeError("WebAssembly block storage is full");
          }
          if (id === 0) blocks.delete(key);
          else blocks.set(key, { x, y, z, id, data: metadata });
        }
      }
    }
    emitChange();
    return true;
  }

  function getBlocks(x0, y0, z0, x1, y1, z1) {
    const bounds = getBounds(x0, y0, z0, x1, y1, z1);
    const result = [];
    for (let y = bounds.minY; y <= bounds.maxY; y += 1) {
      for (let z = bounds.minZ; z <= bounds.maxZ; z += 1) {
        for (let x = bounds.minX; x <= bounds.maxX; x += 1) result.push(getBlockWithData(x, y, z));
      }
    }
    return result;
  }

  function snapshotBlocks() {
    return [...blocks.values()].map((block) => ({ ...block }));
  }

  function setPlayerPosition(x, y, z) {
    const p = point(Number(x), Number(y), Number(z));
    if (!validPoint(p.x, p.y, p.z)) throw new TypeError("Player coordinates must be finite numbers");
    Object.assign(playerPosition, p);
    emitChange();
  }

  function getEntity(id) { return entities.get(Math.trunc(Number(id))) ?? null; }

  function createEntity(x, y, z, typeId, name) {
    const position = point(Number(x), Number(y), Number(z));
    if (!validPoint(position.x, position.y, position.z)) throw new TypeError("Entity coordinates must be finite numbers");
    const id = nextEntityId++;
    entities.set(id, {
      id, type: Math.trunc(Number(typeId)), name: name || entityTypes[typeId] || `Entity ${typeId}`,
      position, direction: point(0, 0, 1), rotation: 0, pitch: 0, velocity: point(0, 0, 0),
      selectedItem: { id: 0, count: 0, data: 0 },
    });
    emitChange();
    return id;
  }

  function removeEntity(id) {
    const numericId = Math.trunc(Number(id));
    if (numericId === 0) return false;
    const removed = entities.delete(numericId);
    if (removed) emitChange();
    return removed;
  }

  function entityMatches(entity, typeId) { return Number(typeId) === -1 || entity.type === Number(typeId); }

  function entitySummary(entity) {
    return { id: entity.id, typeId: entity.type, name: entity.name, position: { ...entity.position } };
  }

  function findEntities(typeId = -1) {
    return [...entities.values()].filter((item) => item.id !== 0 && entityMatches(item, typeId));
  }

  function findNearbyEntities(sourceId, distance = Infinity, typeId = -1) {
    const source = getEntity(sourceId);
    if (!source) return [];
    const limit = Number(distance);
    return findEntities(typeId).filter((item) => {
      const dx = item.position.x - source.position.x;
      const dy = item.position.y - source.position.y;
      const dz = item.position.z - source.position.z;
      return dx * dx + dy * dy + dz * dz <= limit * limit;
    });
  }

  function setEntityDirection(id, x, y, z) {
    const target = getEntity(id);
    const direction = point(Number(x), Number(y), Number(z));
    if (!target || !validPoint(direction.x, direction.y, direction.z)) return false;
    const length = Math.hypot(direction.x, direction.y, direction.z);
    if (length === 0) return false;
    target.direction = point(direction.x / length, direction.y / length, direction.z / length);
    target.rotation = (Math.atan2(-target.direction.x, target.direction.z) * 180 / Math.PI + 360) % 360;
    target.pitch = -Math.asin(target.direction.y) * 180 / Math.PI;
    emitChange();
    return true;
  }

  function getSign(x, y, z) {
    const p = coordinates(x, y, z);
    return signs.get(keyOf(p.x, p.y, p.z))?.slice() ?? [];
  }

  function setSign(x, y, z, blockId, data = 0, ...lines) {
    setBlock(x, y, z, blockId, data);
    const p = coordinates(x, y, z);
    signs.set(keyOf(p.x, p.y, p.z), lines.slice(0, 4).map((line) => String(line)));
  }

  function postChat(message) {
    const text = String(message);
    chatPosts.push({ entityId: 0, message: text });
    onChat(text);
  }

  const world = {
    setBlock,
    getBlock,
    getBlockWithData,
    setBlocks,
    getBlocks,
    getHeight(x, z) {
      const px = Math.trunc(Number(x));
      const pz = Math.trunc(Number(z));
      let height = 0;
      for (const block of blocks.values()) if (block.x === px && block.z === pz && block.id !== 0) height = Math.max(height, block.y);
      return height;
    },
    getPlayerIds: () => [0],
    getPlayerId: () => 0,
    getEntities(typeId = -1) { return findEntities(typeId).map(entitySummary); },
    getEntityTypes: () => Object.entries(entityTypes).map(([id, name]) => ({ id: Number(id), name })),
    spawnEntity(x, y, z, typeId) { return createEntity(x, y, z, typeId); },
    spawnItem(x, y, z, itemId, count = 1, data = 0) {
      const id = createEntity(x, y, z, Math.trunc(Number(itemId)), "Dropped Item");
      const item = entities.get(id).selectedItem;
      item.id = Math.trunc(Number(itemId));
      item.count = Number.isFinite(Number(count)) ? Math.trunc(Number(count)) : 1;
      item.data = Number.isFinite(Number(data)) ? Math.trunc(Number(data)) : 0;
      return id;
    },
    removeEntity,
    removeEntities(typeId = -1) { const ids = findEntities(typeId).map((entity) => entity.id); ids.forEach(removeEntity); return ids.length; },
    setSign,
    getSign,
    getSeed: () => 0,
    getGameMode: () => 1,
    setTime(value) { worldTime = Math.trunc(Number(value)); return worldTime; },
    getTime: () => worldTime,
    checkpoint: {
      save() {
        savedBlocks.clear(); for (const [key, value] of blocks) savedBlocks.set(key, { ...value });
        savedSigns.clear(); for (const [key, value] of signs) savedSigns.set(key, value.slice());
      },
      restore() {
        blocks.clear(); for (const [key, value] of savedBlocks) blocks.set(key, { ...value });
        signs.clear(); for (const [key, value] of savedSigns) signs.set(key, value.slice());
        if (worldCore) {
          worldCore.mcpi_wasm_clear();
          for (const block of blocks.values()) worldCore.mcpi_wasm_set_block(block.x, block.y, block.z, block.id, block.data);
        }
        emitChange();
      },
    },
    setting(name, value) {
      if (!(name in settings)) throw new RangeError(`Unknown world setting: ${name}`);
      settings[name] = Number(value) === 0 ? 0 : 1;
      return settings[name];
    },
    getAllBlocks: snapshotBlocks,
    getWasmBlockCount: () => worldCore ? worldCore.mcpi_wasm_block_count() : null,
    getBlockNames: () => ({ ...BLOCK_NAMES }),
  };

  const player = {
    getPos: () => ({ ...playerPosition }),
    getTile: () => point(Math.floor(playerPosition.x), Math.floor(playerPosition.y), Math.floor(playerPosition.z)),
    setPos: setPlayerPosition,
    setTile(x, y, z) { setPlayerPosition(Math.floor(Number(x)) + 0.5, Math.floor(Number(y)), Math.floor(Number(z)) + 0.5); },
  };

  const entity = {
    getPos(id = 0) { const target = getEntity(id); return target ? { ...target.position } : null; },
    getAbsPos(id = 0) { return this.getPos(id); },
    getTile(id = 0) { const p = this.getPos(id); return p ? point(Math.floor(p.x), Math.floor(p.y), Math.floor(p.z)) : null; },
    setPos(id, x, y, z) {
      const target = getEntity(id);
      const p = point(Number(x), Number(y), Number(z));
      if (!target || !validPoint(p.x, p.y, p.z)) return false;
      Object.assign(target.position, p); emitChange(); return true;
    },
    setAbsPos(id, x, y, z) { return this.setPos(id, x, y, z); },
    setTile(id, x, y, z) { return this.setPos(id, Math.floor(Number(x)) + 0.5, Math.floor(Number(y)), Math.floor(Number(z)) + 0.5); },
    getEntities(id, distance = Infinity, typeId = -1) { return findNearbyEntities(id, distance, typeId).map(entitySummary); },
    removeEntities(id, distance = Infinity, typeId = -1) {
      const ids = findNearbyEntities(id, distance, typeId).map((item) => item.id); ids.forEach(removeEntity); return ids.length;
    },
    remove: removeEntity,
    getName(id) { return getEntity(id)?.name ?? null; },
    getType(id) { return getEntity(id)?.type ?? null; },
    getId(id) { return getEntity(id)?.id ?? null; },
    setDirection: setEntityDirection,
    getDirection(id) { return getEntity(id)?.direction ? { ...getEntity(id).direction } : null; },
    setRotation(id, value) {
      const target = getEntity(id); if (!target) return false;
      target.rotation = Number(value);
      const yaw = target.rotation * Math.PI / 180;
      const pitch = target.pitch * Math.PI / 180;
      target.direction = point(-Math.sin(yaw) * Math.cos(pitch), -Math.sin(pitch), Math.cos(yaw) * Math.cos(pitch));
      emitChange(); return true;
    },
    getRotation(id) { return getEntity(id)?.rotation ?? null; },
    setPitch(id, value) {
      const target = getEntity(id); if (!target) return false;
      target.pitch = Number(value);
      const yaw = target.rotation * Math.PI / 180;
      const pitch = target.pitch * Math.PI / 180;
      target.direction = point(-Math.sin(yaw) * Math.cos(pitch), -Math.sin(pitch), Math.cos(yaw) * Math.cos(pitch));
      emitChange(); return true;
    },
    getPitch(id) { return getEntity(id)?.pitch ?? null; },
    setVelocity(id, x, y, z) {
      const target = getEntity(id); const p = point(Number(x), Number(y), Number(z));
      if (!target || !validPoint(p.x, p.y, p.z)) return false;
      target.velocity = p; emitChange(); return true;
    },
    getVelocity(id) { const value = getEntity(id)?.velocity; return value ? { ...value } : null; },
    getSelectedItem(id) { const item = getEntity(id)?.selectedItem; return item ? { ...item } : null; },
  };

  Object.assign(player, {
    getId: () => 0,
    getName: () => entity.getName(0),
    getType: () => 0,
    getAbsPos: () => player.getPos(),
    setAbsPos: setPlayerPosition,
    getDirection: () => entity.getDirection(0),
    setDirection: (x, y, z) => entity.setDirection(0, x, y, z),
    getRotation: () => entity.getRotation(0),
    setRotation: (value) => entity.setRotation(0, value),
    getPitch: () => entity.getPitch(0),
    setPitch: (value) => entity.setPitch(0, value),
    getVelocity: () => entity.getVelocity(0),
    setVelocity: (x, y, z) => entity.setVelocity(0, x, y, z),
    getSelectedItem: () => entity.getSelectedItem(0),
  });

  const chat = { post: postChat, getPosts: () => chatPosts.map((item) => ({ ...item })) };
  const cameraApi = {
    mode: {
      setFixed() { camera.mode = "fixed"; },
      setNormal(entityId = 0) { camera.mode = "normal"; camera.entityId = Number(entityId); },
      setFollow(entityId = 0) { camera.mode = "follow"; camera.entityId = Number(entityId); },
    },
    setPos(x, y, z) { Object.assign(camera.position, point(Number(x) + 0.5, Number(y), Number(z) + 0.5)); },
    getState: () => ({ ...camera, position: { ...camera.position } }),
  };
  function takeEvents(queue, entityId) {
    const selected = [];
    for (let index = queue.length - 1; index >= 0; index -= 1) {
      if (entityId === undefined || queue[index].entityId === Number(entityId)) selected.unshift(...queue.splice(index, 1));
    }
    return selected.map((event) => ({ ...event }));
  }

  const events = {
    clear() { blockHits.length = 0; chatPosts.length = 0; projectileHits.length = 0; },
    block: { hits: () => takeEvents(blockHits) },
    chat: { posts: () => takeEvents(chatPosts) },
    projectile: { hits: () => takeEvents(projectileHits) },
    emitBlockHit(x, y, z, face = 1, entityId = 0) {
      blockHits.push({ x: Math.trunc(x), y: Math.trunc(y), z: Math.trunc(z), face: Math.trunc(face), entityId: Math.trunc(entityId) });
    },
    emitProjectileHit(x, y, z, shooterId = 0, targetId = -1) {
      projectileHits.push({ x: Math.trunc(x), y: Math.trunc(y), z: Math.trunc(z), face: 1, entityId: Math.trunc(shooterId), targetId: Math.trunc(targetId) });
    },
  };
  entity.events = {
    block: { hits: (entityId) => takeEvents(blockHits, entityId) },
    chat: { posts: (entityId) => takeEvents(chatPosts, entityId) },
    projectile: { hits: (entityId) => takeEvents(projectileHits, entityId) },
    clear(entityId) {
      for (const queue of [blockHits, chatPosts, projectileHits]) {
        for (let index = queue.length - 1; index >= 0; index -= 1) if (queue[index].entityId === Number(entityId)) queue.splice(index, 1);
      }
    },
  };

  function dispatchRaw(commandLine) {
    const line = String(commandLine).trim();
    if (!line) return "";
    const open = line.indexOf("(");
    if (open < 1 || !line.endsWith(")")) return "Fail";
    const command = line.slice(0, open);
    const raw = line.slice(open + 1, -1);
    const args = raw === "" ? [] : raw.split(",").map((part) => part.trim());
    const number = (index) => Number(String(args[index]).replace(/^:(.*):$/, "$1"));
    const numbers = () => args.map((_, index) => number(index));
    const tuple = (p) => p ? `${p.x},${p.y},${p.z}` : "Fail";
    const entityList = (list) => list.map((item) => `${item.id},${item.typeId},${item.name},${item.position.x},${item.position.y},${item.position.z}`).join("|");
    const id0 = () => 0;
    try {
      switch (command) {
        case "world.setBlock": setBlock(...numbers()); return "";
        case "world.getBlock": return String(getBlock(...numbers()));
        case "world.getBlockWithData": { const b = getBlockWithData(...numbers()); return `${b.id},${b.data}`; }
        case "world.setBlocks": setBlocks(...numbers()); return "";
        case "world.getBlocks": return getBlocks(...numbers()).map((b) => b.id).join(",");
        case "world.getHeight": return String(world.getHeight(number(0), number(1)));
        case "world.getPlayerIds": return "0";
        case "world.getPlayerId": return String(world.getPlayerId());
        case "world.getEntities": return entityList(world.getEntities(number(0)));
        case "world.getEntityTypes": return world.getEntityTypes().map((item) => `${item.id},${item.name}`).join("|");
        case "world.spawnEntity": return String(world.spawnEntity(number(0), number(1), number(2), number(3)));
        case "world.spawnItem": return String(world.spawnItem(number(0), number(1), number(2), number(3), number(4), number(5)));
        case "world.removeEntity": return String(world.removeEntity(number(0)) ? 1 : 0);
        case "world.removeEntities": return String(world.removeEntities(number(0)));
        case "world.setSign": world.setSign(number(0), number(1), number(2), number(3), number(4), ...args.slice(5)); return "";
        case "world.getSign": return world.getSign(number(0), number(1), number(2)).join("|");
        case "world.getSeed": return String(world.getSeed());
        case "world.getGameMode": return String(world.getGameMode());
        case "world.getTime": return String(world.getTime());
        case "world.setTime": world.setTime(number(0)); return "";
        case "world.checkpoint.save": world.checkpoint.save(); return "";
        case "world.checkpoint.restore": world.checkpoint.restore(); return "";
        case "world.setting":
        case "player.setting": world.setting(args[0], number(1)); return "";
        case "player.getPos": return tuple(player.getPos());
        case "player.getTile": return tuple(player.getTile());
        case "player.setPos": player.setPos(...numbers()); return "";
        case "player.setTile": player.setTile(...numbers()); return "";
        case "player.getId": return "0";
        case "player.getName": return entity.getName(id0());
        case "player.getType": return "0";
        case "player.getAbsPos": return tuple(player.getPos());
        case "player.setAbsPos": player.setPos(...numbers()); return "";
        case "player.getDirection": { const p = entity.getDirection(id0()); return tuple(p); }
        case "player.setDirection": entity.setDirection(0, ...numbers()); return "";
        case "player.getRotation": return String(entity.getRotation(0));
        case "player.setRotation": entity.setRotation(0, number(0)); return "";
        case "player.getPitch": return String(entity.getPitch(0));
        case "player.setPitch": entity.setPitch(0, number(0)); return "";
        case "player.getVelocity": return tuple(entity.getVelocity(0));
        case "player.setVelocity": entity.setVelocity(0, ...numbers()); return "";
        case "player.getSelectedItem": { const item = entity.getSelectedItem(0); return `${item.id},${item.count},${item.data}`; }
        case "entity.getPos": return tuple(entity.getPos(number(0)));
        case "entity.getTile": return tuple(entity.getTile(number(0)));
        case "entity.getAbsPos": return tuple(entity.getAbsPos(number(0)));
        case "entity.setAbsPos": entity.setAbsPos(...numbers()); return "";
        case "entity.setPos": entity.setPos(...numbers()); return "";
        case "entity.setTile": entity.setTile(...numbers()); return "";
        case "entity.getEntities": return entityList(entity.getEntities(number(0), number(1), args.length > 2 ? number(2) : -1));
        case "entity.removeEntities": return String(entity.removeEntities(number(0), number(1), args.length > 2 ? number(2) : -1));
        case "entity.getName": return entity.getName(number(0)) ?? "Fail";
        case "entity.getType": return String(entity.getType(number(0)) ?? "Fail");
        case "entity.getId": return String(entity.getId(number(0)) ?? "Fail");
        case "entity.setDirection": entity.setDirection(...numbers()); return "";
        case "entity.getDirection": return tuple(entity.getDirection(number(0)));
        case "entity.setRotation": entity.setRotation(number(0), number(1)); return "";
        case "entity.getRotation": return String(entity.getRotation(number(0)) ?? "Fail");
        case "entity.setPitch": entity.setPitch(number(0), number(1)); return "";
        case "entity.getPitch": return String(entity.getPitch(number(0)) ?? "Fail");
        case "entity.setVelocity": entity.setVelocity(...numbers()); return "";
        case "entity.getVelocity": return tuple(entity.getVelocity(number(0)));
        case "entity.getSelectedItem": { const item = entity.getSelectedItem(number(0)); return item ? `${item.id},${item.count},${item.data}` : "Fail"; }
        case "chat.post": postChat(args.join(",")); return "";
        case "camera.mode.setFixed": cameraApi.mode.setFixed(); return "";
        case "camera.mode.setNormal": cameraApi.mode.setNormal(number(0) || 0); return "";
        case "camera.mode.setFollow": cameraApi.mode.setFollow(number(0) || 0); return "";
        case "camera.setPos": cameraApi.setPos(...numbers()); return "";
        case "events.clear": events.clear(); return "";
        case "events.block.hits": return events.block.hits().map((e) => `${e.x},${e.y},${e.z},${e.face},${e.entityId}`).join("|");
        case "events.chat.posts": return events.chat.posts().map((e) => `${e.entityId},${e.message}`).join("|");
        case "events.projectile.hits": return events.projectile.hits().map((e) => `${e.x},${e.y},${e.z},${e.face},${entity.getName(e.entityId) ?? ""},${entity.getName(e.targetId) ?? ""},${e.entityId},${e.targetId}`).join("|");
        case "entity.events.block.hits": return entity.events.block.hits(number(0)).map((e) => `${e.x},${e.y},${e.z},${e.face},${e.entityId}`).join("|");
        case "entity.events.chat.posts": return entity.events.chat.posts(number(0)).map((e) => `${e.entityId},${e.message}`).join("|");
        case "entity.events.projectile.hits": return entity.events.projectile.hits(number(0)).map((e) => `${e.x},${e.y},${e.z},${e.face},${e.entityId},${e.targetId}`).join("|");
        case "entity.events.clear": entity.events.clear(number(0)); return "";
        case "reborn.disableCompatMode": compatibilityMode = false; return "1.0.0-web";
        case "reborn.enableCompatMode": compatibilityMode = true; return "";
        case "reborn.sendNullResponses": nullResponses = true; return "";
        case "reborn.hideNullResponses": nullResponses = false; return "";
        default: return "Fail";
      }
    } catch (error) {
      return `Fail:${error instanceof Error ? error.message : String(error)}`;
    }
  }

  function dispatch(commandLine) {
    const response = dispatchRaw(commandLine);
    if (response === "" && nullResponses) return "Null";
    return response;
  }

  return {
    world, player, entity, chat, camera: cameraApi, events, dispatch, blocks: BLOCKS,
    get compatibilityMode() { return compatibilityMode; },
    engine: worldCore ? "WebAssembly" : "JavaScript fallback",
  };
}
