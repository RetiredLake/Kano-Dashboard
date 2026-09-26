import { BLOCKS, createMcpiWebApi } from "/hack-minecraft/api.js";

const STORE = {
  world: "hack-minecraft.web-world.v1",
  progress: "hack-minecraft.progress.v1",
  program: "hack-minecraft.program.v1",
};
const $ = (selector) => document.querySelector(selector);
const canvas = $("#world-canvas");
const context = canvas.getContext("2d");
const blockNames = Object.keys(BLOCKS).filter((name) => name !== "air");
const colors = {
  1: "#87949a", 2: "#70ad4b", 3: "#986943", 4: "#9c9b95", 5: "#bd8959", 6: "#59a849",
  7: "#343b44", 9: "#55a9cb", 11: "#f17937", 12: "#dbcc90", 13: "#a99b79", 14: "#e1bf42",
  15: "#b4a28b", 16: "#454d50", 17: "#946143", 18: "#508244", 20: "#addde5", 21: "#4a67bd",
  24: "#c4b180", 35: "#bba7d5", 41: "#e5be3f", 42: "#d4d8db", 45: "#a95146", 46: "#dc5143",
  47: "#95683e", 48: "#6b8571", 49: "#4d4369", 56: "#4dbec3", 57: "#5fd9d5", 78: "#edf8fc",
  82: "#bd9d85", 129: "#64a145", 133: "#59b84c", 152: "#bd4541", 155: "#e2e5db",
};
const pythonNames = {
  stone: "STONE", grass: "GRASS", dirt: "DIRT", cobblestone: "COBBLESTONE", planks: "WOOD_PLANKS",
  sand: "SAND", wood: "WOOD", leaves: "LEAVES", glass: "GLASS", sandstone: "SANDSTONE",
  wool: "WOOL", gold_block: "GOLD_BLOCK", iron_block: "IRON_BLOCK", brick: "BRICK_BLOCK",
  tnt: "TNT", obsidian: "OBSIDIAN", diamond_block: "DIAMOND_BLOCK", emerald_block: "EMERALD_BLOCK",
  redstone_block: "REDSTONE_BLOCK", lava: "LAVA_STATIONARY",
};

const lessons = [
  {
    title: "Place your first block",
    summary: "Every world starts with one block. Add a block to your program, then make it.",
    steps: ["Add a Place block block to your program.", "Choose a block and set its position to 0, 1, 0.", "Press MAKE, then check your build."],
    example: [{ type: "set", x: 0, y: 1, z: 0, block: "gold_block" }],
    check: (api) => api.world.getBlock(0, 1, 0) !== 0,
    success: "Nice work! You placed your first block with code.",
  },
  {
    title: "Build a little hut",
    summary: "Use the same building command to make a floor, four walls, and a roof.",
    steps: ["Build a 5 by 5 floor at y = 1.", "Raise the walls to y = 3 and leave a doorway.", "Add a roof, then check your build."],
    example: [
      { type: "fill", x0: -2, y0: 1, z0: -2, x1: 2, y1: 1, z1: 2, block: "planks" },
      { type: "fill", x0: -2, y0: 2, z0: -2, x1: -2, y1: 3, z1: 2, block: "brick" },
      { type: "fill", x0: 2, y0: 2, z0: -2, x1: 2, y1: 3, z1: 2, block: "brick" },
      { type: "fill", x0: -1, y0: 2, z0: -2, x1: 1, y1: 3, z1: -2, block: "brick" },
      { type: "fill", x0: -1, y0: 2, z0: 2, x1: 1, y1: 3, z1: 2, block: "brick" },
      { type: "fill", x0: -2, y0: 4, z0: -2, x1: 2, y1: 4, z1: 2, block: "planks" },
    ],
    check: (api) => api.world.getBlock(0, 1, 0) === BLOCKS.planks && api.world.getBlock(2, 2, 0) === BLOCKS.brick && api.world.getBlock(0, 4, 0) === BLOCKS.planks,
    success: "Looking good! The hut floor, wall, and roof are all there.",
  },
  {
    title: "Make a volcano",
    summary: "Stack smaller layers to shape a mountain, then place lava at its peak.",
    steps: ["Make a broad stone base at y = 1.", "Add two smaller stone layers above it.", "Put lava at the top and check your build."],
    example: [
      { type: "fill", x0: -3, y0: 1, z0: -3, x1: 3, y1: 1, z1: 3, block: "stone" },
      { type: "fill", x0: -2, y0: 2, z0: -2, x1: 2, y1: 2, z1: 2, block: "stone" },
      { type: "fill", x0: -1, y0: 3, z0: -1, x1: 1, y1: 3, z1: 1, block: "stone" },
      { type: "set", x: 0, y: 4, z: 0, block: "lava" },
    ],
    check: (api) => api.world.getBlock(0, 4, 0) === BLOCKS.lava && api.world.getBlock(-3, 1, -3) === BLOCKS.stone,
    success: "Eruption! Your layered volcano is ready.",
  },
  {
    title: "Repeat with a loop",
    summary: "A loop repeats an instruction. Grow a tower by placing one block on each turn.",
    steps: ["Add a Repeat upward block.", "Pick a material and choose how many times to repeat.", "Make the tower, then check the height."],
    example: [{ type: "tower", x: 3, y: 1, z: 3, count: 6, block: "emerald_block" }],
    check: (api) => api.world.getBlock(3, 6, 3) === BLOCKS.emerald_block,
    success: "Loop complete. One small instruction built a whole tower!",
  },
];

let apiCalls = 0;
let currentLesson = 0;
let program = [];
let completed = readJson(STORE.progress, []);
if (!Array.isArray(completed)) completed = [];
completed = completed.filter((index) => Number.isInteger(index) && index >= 0 && index < lessons.length);
let resizeObserver;
let chatTimeout;
let selectedBlock = "stone";
let nativeBridge = null;

function readJson(key, fallback) {
  try { const value = JSON.parse(localStorage.getItem(key)); return value ?? fallback; } catch { return fallback; }
}

function escapeHtml(value) {
  return String(value).replace(/[&<>"']/g, (char) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[char]);
}

async function loadWorldCore() {
  if (typeof WebAssembly !== "object") return null;
  try {
    const response = await fetch("/hack-minecraft/world-core.wasm", { cache: "force-cache" });
    if (!response.ok) return null;
    const { instance } = await WebAssembly.instantiate(await response.arrayBuffer());
    return instance.exports.mcpi_wasm_abi_version() === 1 ? instance.exports : null;
  } catch (error) {
    console.warn("Hack Minecraft WebAssembly core unavailable; using the JavaScript fallback.", error);
    return null;
  }
}

const worldCore = await loadWorldCore();
const api = createMcpiWebApi({
  worldCore,
  onChange() { drawWorld(); queueSave(); },
  onChat(message) {
    const bubble = $("#chat-bubble");
    bubble.textContent = message;
    bubble.classList.add("is-visible");
    clearTimeout(chatTimeout);
    chatTimeout = setTimeout(() => bubble.classList.remove("is-visible"), 2600);
  },
});
window.mcpi = api;
window.mcpiWebReady = true;
window.mcpiCompatibility = "Pi Edition / RaspberryJuice browser adapter; local world, no TCP socket";
window.hackMinecraftEngine = api.engine;
$("#api-status-label").textContent = worldCore ? "MCPI WebAssembly world core ready" : "Browser MCPI API ready";

// A compact, editable practice island. User projects save independently of lesson progress.
api.world.setBlocks(-5, 0, -5, 5, 0, 5, BLOCKS.grass);
api.world.checkpoint.save();
const savedWorld = readJson(STORE.world, null);
if (Array.isArray(savedWorld)) {
  for (const item of savedWorld) {
    if (Array.isArray(item) && item.length === 4) {
      try { api.world.setBlock(item[0], item[1], item[2], item[3]); } catch { /* Ignore stale world data. */ }
    }
  }
}
program = readJson(STORE.program, []);
if (!Array.isArray(program)) program = [];

function queueSave() {
  clearTimeout(queueSave.timer);
  queueSave.timer = setTimeout(() => {
    const customBlocks = api.world.getAllBlocks().filter((block) => block.y > 0);
    try { localStorage.setItem(STORE.world, JSON.stringify(customBlocks.map(({ x, y, z, id }) => [x, y, z, id]))); } catch { /* Full storage does not stop building. */ }
  }, 140);
}

function resizeCanvas() {
  const rect = canvas.getBoundingClientRect();
  const ratio = Math.min(window.devicePixelRatio || 1, 2);
  canvas.width = Math.max(1, Math.round(rect.width * ratio));
  canvas.height = Math.max(1, Math.round(rect.height * ratio));
  context.setTransform(ratio, 0, 0, ratio, 0, 0);
  drawWorld();
}

function shade(hex, amount) {
  const color = hex.replace("#", "");
  const channels = [0, 2, 4].map((i) => parseInt(color.slice(i, i + 2), 16));
  return `rgb(${channels.map((channel) => Math.max(0, Math.min(255, Math.round(channel * (1 + amount))))).join(",")})`;
}

function project(x, y, z, originX, originY, tileW, tileH, blockH) {
  return { x: originX + (x - z) * tileW / 2, y: originY + (x + z) * tileH / 2 - y * blockH };
}

function polygon(points, fill, stroke = "rgba(56,92,80,.20)") {
  context.beginPath();
  context.moveTo(points[0].x, points[0].y);
  for (let i = 1; i < points.length; i += 1) context.lineTo(points[i].x, points[i].y);
  context.closePath();
  context.fillStyle = fill;
  context.fill();
  context.strokeStyle = stroke;
  context.lineWidth = 0.75;
  context.stroke();
}

function drawCube(block, originX, originY, tileW, tileH, blockH) {
  const center = project(block.x, block.y, block.z, originX, originY, tileW, tileH, blockH);
  const color = colors[block.id] || "#a3aeb2";
  const top = [
    { x: center.x, y: center.y },
    { x: center.x + tileW / 2, y: center.y + tileH / 2 },
    { x: center.x, y: center.y + tileH },
    { x: center.x - tileW / 2, y: center.y + tileH / 2 },
  ];
  polygon([top[1], top[2], { x: top[2].x, y: top[2].y + blockH }, { x: top[1].x, y: top[1].y + blockH }], shade(color, -0.25));
  polygon([top[2], top[3], { x: top[3].x, y: top[3].y + blockH }, { x: top[2].x, y: top[2].y + blockH }], shade(color, -0.12));
  polygon(top, shade(color, 0.1));
  if (block.id === BLOCKS.lava) {
    context.fillStyle = "rgba(255,244,139,.68)";
    context.beginPath(); context.ellipse(center.x, center.y + tileH / 2, tileW / 4, tileH / 5, 0, 0, Math.PI * 2); context.fill();
  }
}

function drawWorld() {
  if (!context || !canvas.clientWidth) return;
  const width = canvas.clientWidth;
  const height = canvas.clientHeight;
  context.clearRect(0, 0, width, height);
  const tileW = Math.max(22, Math.min(44, width / 17));
  const tileH = tileW * 0.5;
  const blockH = tileH * 1.55;
  const originX = width / 2;
  const originY = height * 0.57;

  // A soft horizon and a wide, quiet island shadow anchor the isometric grid.
  const horizon = context.createLinearGradient(0, 0, 0, height);
  horizon.addColorStop(0, "rgba(238,250,253,.06)");
  horizon.addColorStop(1, "rgba(247,249,234,.50)");
  context.fillStyle = horizon;
  context.fillRect(0, 0, width, height);
  context.beginPath();
  context.ellipse(originX, originY + tileH * 3.7, tileW * 7.3, tileH * 5.1, 0, 0, Math.PI * 2);
  context.fillStyle = "rgba(89,153,155,.12)";
  context.fill();

  const blocks = api.world.getAllBlocks().sort((a, b) => (a.x + a.z - b.x - b.z) || a.y - b.y || a.x - b.x);
  for (const block of blocks) drawCube(block, originX, originY, tileW, tileH, blockH);

  // Mark the player position so player.setPos changes are visible in the sandbox.
  const player = api.player.getPos();
  const person = project(player.x, player.y, player.z, originX, originY, tileW, tileH, blockH);
  context.save();
  context.fillStyle = "rgba(47,75,91,.24)";
  context.beginPath(); context.ellipse(person.x, person.y + tileH + 4, tileW * .27, tileH * .13, 0, 0, Math.PI * 2); context.fill();
  context.fillStyle = "#5c92b2";
  context.fillRect(person.x - 4, person.y - 4, 8, 15);
  context.fillStyle = "#f2c88f";
  context.beginPath(); context.arc(person.x, person.y - 9, 5, 0, Math.PI * 2); context.fill();
  context.restore();
  $("#world-coordinates").textContent = `x ${Math.floor(player.x)} · y ${Math.floor(player.y)} · z ${Math.floor(player.z)}`;
  $("#api-call-count").textContent = `${apiCalls} API call${apiCalls === 1 ? "" : "s"}`;
}

function blockOption(name) { return `<option value="${name}">${name.replaceAll("_", " ")}</option>`; }
$("#selected-block").innerHTML = ["stone", "grass", "dirt", "planks", "brick", "glass", "gold_block", "diamond_block", "emerald_block", "lava", "sand", "wood"]
  .map(blockOption).join("");
$("#selected-block").value = selectedBlock;

function lessonList() {
  $("#lesson-list").innerHTML = lessons.map((lesson, index) => `
    <button class="lesson-link${completed.includes(index) ? " is-done" : ""}" data-lesson="${index}" type="button" ${index === currentLesson ? 'aria-current="step"' : ""}>
      <span class="lesson-number">${completed.includes(index) ? "✓" : index + 1}</span><span>${escapeHtml(lesson.title)}</span>
    </button>`).join("");
  $("#progress-count").textContent = `${completed.length} / ${lessons.length}`;
  $("#progress-fill").style.width = `${completed.length / lessons.length * 100}%`;
}

function showLesson(index) {
  currentLesson = index;
  const lesson = lessons[index];
  $("#lesson-kicker").textContent = `LESSON ${index + 1}`;
  $("#lesson-title").textContent = lesson.title;
  $("#lesson-description").textContent = lesson.summary;
  $("#lesson-steps").innerHTML = lesson.steps.map((step) => `<li>${escapeHtml(step)}</li>`).join("");
  $("#lesson-feedback").textContent = "";
  lessonList();
}

function makeBlock(type) {
  if (type === "set") return { type, x: 0, y: 1, z: 0, block: selectedBlock };
  if (type === "fill") return { type, x0: -1, y0: 1, z0: -1, x1: 1, y1: 1, z1: 1, block: selectedBlock };
  if (type === "move") return { type, x: 0, y: 2, z: 4 };
  if (type === "chat") return { type, message: "Hello from my world!" };
  return { type: "tower", x: 0, y: 1, z: 0, count: 5, block: selectedBlock };
}

function numericField(action, key, label) {
  return `<label class="block-coordinate-label">${label}<input inputmode="numeric" type="number" data-field="${key}" value="${Number(action[key]) || 0}" aria-label="${label}"></label>`;
}

function fieldsFor(action) {
  if (action.type === "set") return `<strong>Place a block at</strong>${numericField(action, "x", "x")}${numericField(action, "y", "y")}${numericField(action, "z", "z")}<select data-field="block" aria-label="Block type">${blockNames.map((name) => `${blockOption(name)}`).join("")}</select>`;
  if (action.type === "fill") return `<strong>Fill from corner to corner</strong>${["x0", "y0", "z0", "x1", "y1", "z1"].map((key) => numericField(action, key, key)).join("")}<select data-field="block" aria-label="Block type">${blockNames.map(blockOption).join("")}</select>`;
  if (action.type === "move") return `<strong>Move player to</strong>${numericField(action, "x", "x")}${numericField(action, "y", "y")}${numericField(action, "z", "z")}`;
  if (action.type === "chat") return `<strong>Post a chat message</strong><input type="text" data-field="message" value="${escapeHtml(action.message)}" aria-label="Chat message">`;
  return `<strong>Repeat place block</strong>${numericField(action, "count", "times")}${numericField(action, "x", "x")}${numericField(action, "y", "start y")}${numericField(action, "z", "z")}<select data-field="block" aria-label="Block type">${blockNames.map(blockOption).join("")}</select>`;
}

function renderProgram() {
  const stack = $("#program-stack");
  if (!program.length) {
    stack.innerHTML = '<div class="stack-empty">Choose a colorful block below<br>to start your program.</div>';
  } else {
    stack.innerHTML = program.map((action, index) => `
      <article class="program-block block-${action.type === "set" || action.type === "fill" ? "world" : action.type === "tower" ? "loop" : action.type === "move" ? "player" : "chat"}">
        <div class="block-fields">${fieldsFor(action)}</div>
        <div class="block-buttons"><button type="button" data-move="up" data-index="${index}" aria-label="Move block up" title="Move up">↑</button><button type="button" data-move="down" data-index="${index}" aria-label="Move block down" title="Move down">↓</button><button type="button" data-remove="${index}" aria-label="Remove block" title="Remove">×</button></div>
      </article>`).join("");
    for (const select of stack.querySelectorAll('select[data-field="block"]')) {
      const index = Number(select.closest(".program-block").querySelector("[data-remove]").dataset.remove);
      select.value = program[index]?.block || "stone";
    }
  }
  saveProgram();
  updateCode();
}

function saveProgram() {
  try { localStorage.setItem(STORE.program, JSON.stringify(program)); } catch { /* The current program still runs. */ }
}

function codeFor(action) {
  const blockCode = `block.${pythonNames[action.block] || "STONE"}.id`;
  if (action.type === "set") return `mc.setBlock(${action.x}, ${action.y}, ${action.z}, ${blockCode})`;
  if (action.type === "fill") return `mc.setBlocks(${action.x0}, ${action.y0}, ${action.z0}, ${action.x1}, ${action.y1}, ${action.z1}, ${blockCode})`;
  if (action.type === "move") return `mc.player.setPos(${action.x}, ${action.y}, ${action.z})`;
  if (action.type === "chat") return `mc.postToChat(${JSON.stringify(action.message)})`;
  return `for i in range(${Math.max(1, Math.min(64, Number(action.count) || 1))}):\n    mc.setBlock(${action.x}, ${Number(action.y) || 0} + i, ${action.z}, ${blockCode})`;
}

function updateCode() {
  const lines = ["from mcpi.minecraft import Minecraft", "from mcpi import block", "mc = Minecraft.create()", ""];
  if (program.length) lines.push(...program.flatMap((action) => codeFor(action).split("\n")));
  else lines.push("# Add a block to make your first world change.");
  $("#code-output").textContent = lines.join("\n");
}

function execute(action) {
  apiCalls += 1;
  if (action.type === "set") api.world.setBlock(action.x, action.y, action.z, BLOCKS[action.block] || BLOCKS.stone);
  else if (action.type === "fill") api.world.setBlocks(action.x0, action.y0, action.z0, action.x1, action.y1, action.z1, BLOCKS[action.block] || BLOCKS.stone);
  else if (action.type === "move") api.player.setPos(action.x, action.y, action.z);
  else if (action.type === "chat") api.chat.post(action.message);
  else {
    const count = Math.max(1, Math.min(64, Math.trunc(Number(action.count) || 1)));
    for (let index = 0; index < count; index += 1) {
      apiCalls += 1;
      api.world.setBlock(action.x, Number(action.y) + index, action.z, BLOCKS[action.block] || BLOCKS.stone);
    }
  }
  drawWorld();
}

function nativeCommands(actions) {
  const commands = [];
  for (const action of actions) {
    const blockId = BLOCKS[action.block] || BLOCKS.stone;
    if (action.type === "set") commands.push(`world.setBlock(${action.x},${action.y},${action.z},${blockId})`);
    else if (action.type === "fill") commands.push(`world.setBlocks(${action.x0},${action.y0},${action.z0},${action.x1},${action.y1},${action.z1},${blockId})`);
    else if (action.type === "move") commands.push(`player.setPos(:${action.x}:,:${action.y}:,:${action.z}:)`);
    else if (action.type === "chat") {
      const message = String(action.message).replace(/[\r\n,]/g, " ").replace(/\)/g, " ");
      commands.push(`chat.post(${message})`);
    } else {
      const count = Math.max(1, Math.min(64, Math.trunc(Number(action.count) || 1)));
      for (let index = 0; index < count; index += 1) commands.push(`world.setBlock(${action.x},${Number(action.y) + index},${action.z},${blockId})`);
    }
  }
  return commands;
}

async function refreshNativeStatus() {
  try {
    const response = await fetch("/native/status", { cache: "no-store" });
    if (!response.ok) return;
    const result = await response.json();
    if (!result.bridge) return;
    nativeBridge = { gameReachable: Boolean(result.game_reachable) };
    const label = $("#api-status-label");
    const pulse = $("#api-pulse");
    label.textContent = nativeBridge.gameReachable ? "MCPI-Reborn detected · port 4711" : "Linux bridge ready · launch MCPI-Reborn";
    pulse.style.background = nativeBridge.gameReachable ? "#9fe66d" : "#e6b849";
  } catch {
    // A regular hosted web page has no same-origin native bridge.
  }
}

async function runProgram() {
  try {
    for (const action of program) execute(action);
    let feedback = program.length ? "Program made it into your world!" : "Add a block to your program first.";
    if (nativeBridge && program.length) {
      await refreshNativeStatus();
      if (!nativeBridge.gameReachable) {
        feedback = "Built in your browser world. Start MCPI-Reborn, then press MAKE to send these blocks to the game.";
      } else {
        const response = await fetch("/native/execute", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ commands: nativeCommands(program) }),
        });
        if (!response.ok) throw new Error("MCPI-Reborn did not accept the block program. Check that its API is listening on port 4711.");
        feedback = "Built in the browser world and sent the program to MCPI-Reborn.";
      }
    }
    $("#lesson-feedback").textContent = feedback;
    $("#lesson-feedback").style.color = "#539b38";
  } catch (error) {
    $("#lesson-feedback").textContent = error instanceof Error ? error.message : String(error);
    $("#lesson-feedback").style.color = "#a85044";
  }
}

function setLessonProgram(index) {
  program = lessons[index].example.map((action) => ({ ...action }));
  renderProgram();
  showLesson(index);
}

$("#lesson-list").addEventListener("click", (event) => {
  const button = event.target.closest("[data-lesson]");
  if (button) showLesson(Number(button.dataset.lesson));
});
$("#load-lesson").addEventListener("click", () => setLessonProgram(currentLesson));
$("#check-lesson").addEventListener("click", () => {
  const lesson = lessons[currentLesson];
  if (lesson.check(api)) {
    if (!completed.includes(currentLesson)) completed.push(currentLesson);
    try { localStorage.setItem(STORE.progress, JSON.stringify(completed)); } catch { /* Keep progress in memory. */ }
    lessonList();
    $("#lesson-feedback").textContent = lesson.success;
    $("#lesson-feedback").style.color = "#539b38";
  } else {
    $("#lesson-feedback").textContent = "Not quite yet. Follow the steps or load the example program, then press MAKE.";
    $("#lesson-feedback").style.color = "#ad7553";
  }
});
$("#run-program").addEventListener("click", () => void runProgram());
$("#program-stack").addEventListener("click", (event) => {
  const remove = event.target.closest("[data-remove]");
  if (remove) { program.splice(Number(remove.dataset.remove), 1); renderProgram(); return; }
  const move = event.target.closest("[data-move]");
  if (move) {
    const index = Number(move.dataset.index);
    const target = move.dataset.move === "up" ? index - 1 : index + 1;
    if (target >= 0 && target < program.length) [program[index], program[target]] = [program[target], program[index]];
    renderProgram();
  }
});
$("#program-stack").addEventListener("input", (event) => {
  const field = event.target.closest("[data-field]");
  if (!field) return;
  const block = field.closest(".program-block");
  const index = Number(block.querySelector("[data-remove]").dataset.remove);
  const key = field.dataset.field;
  program[index][key] = field.type === "number" ? Number(field.value) || 0 : field.value;
  saveProgram(); updateCode();
});
$(".block-palette").addEventListener("click", (event) => {
  const button = event.target.closest("[data-add]");
  if (!button) return;
  program.push(makeBlock(button.dataset.add));
  renderProgram();
  $("#program-stack").scrollTop = $("#program-stack").scrollHeight;
});
$(".block-palette").addEventListener("dragstart", (event) => {
  const button = event.target.closest("[data-add]");
  if (button) event.dataTransfer.setData("text/plain", button.dataset.add);
});
$("#program-stack").addEventListener("dragover", (event) => event.preventDefault());
$("#program-stack").addEventListener("drop", (event) => {
  event.preventDefault();
  const type = event.dataTransfer.getData("text/plain");
  if (["set", "fill", "move", "chat", "tower"].includes(type)) { program.push(makeBlock(type)); renderProgram(); }
});
$("#selected-block").addEventListener("change", (event) => { selectedBlock = event.target.value; });

function placeAtPointer(event) {
  const rect = canvas.getBoundingClientRect();
  const width = rect.width;
  const height = rect.height;
  const tileW = Math.max(22, Math.min(44, width / 17));
  const tileH = tileW * .5;
  const originX = width / 2;
  const originY = height * .57;
  const dx = event.clientX - rect.left - originX;
  const dy = event.clientY - rect.top - originY;
  const x = Math.round(dx / tileW + dy / tileH);
  const z = Math.round(dy / tileH - dx / tileW);
  if (Math.abs(x) > 6 || Math.abs(z) > 6) return;
  const y = Math.max(1, api.world.getHeight(x, z) + 1);
  api.world.setBlock(x, y, z, BLOCKS[selectedBlock]);
  api.events.emitBlockHit(x, y, z, 1);
  apiCalls += 1;
  api.player.setPos(x + .5, y, z + .5);
  drawWorld();
}
canvas.addEventListener("click", placeAtPointer);

$("#clear-world").addEventListener("click", () => {
  api.world.checkpoint.restore();
  api.player.setPos(0, 1, 0);
  localStorage.removeItem(STORE.world);
  drawWorld();
});
$("#reset-world").addEventListener("click", () => {
  api.world.checkpoint.restore();
  api.player.setPos(0, 1, 0);
  program = [];
  renderProgram();
  localStorage.removeItem(STORE.world);
  $("#lesson-feedback").textContent = "World reset. Your lessons are ready to try again.";
});

$("#python-tab").addEventListener("click", () => {
  $("#python-tab").classList.add("is-selected"); $("#api-tab").classList.remove("is-selected");
  $("#python-tab").setAttribute("aria-selected", "true"); $("#api-tab").setAttribute("aria-selected", "false");
  $("#code-output").hidden = false; $("#api-output").hidden = true;
});
$("#api-tab").addEventListener("click", () => {
  $("#api-tab").classList.add("is-selected"); $("#python-tab").classList.remove("is-selected");
  $("#api-tab").setAttribute("aria-selected", "true"); $("#python-tab").setAttribute("aria-selected", "false");
  $("#code-output").hidden = true; $("#api-output").hidden = false;
});

const helpDialog = $("#help-dialog");
$("#help-button").addEventListener("click", () => helpDialog.showModal());
$("#close-help").addEventListener("click", () => helpDialog.close());
$("#help-done").addEventListener("click", () => helpDialog.close());

showLesson(0);
renderProgram();
if (!program.length) setLessonProgram(0);
resizeObserver = new ResizeObserver(resizeCanvas);
resizeObserver.observe(canvas.parentElement);
window.addEventListener("resize", resizeCanvas);
resizeCanvas();
void refreshNativeStatus();
