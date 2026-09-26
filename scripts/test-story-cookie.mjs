import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import vm from "node:vm";

const runtime = await readFile(new URL("../public/story/love.js", import.meta.url), "utf8");
const start = runtime.indexOf('FS.mkdir("/home/web_user/love");');
const endMarker = "KANO_COOKIE_SAVE_V1.initialize();";
const end = runtime.indexOf(endMarker, start);
assert.notEqual(start, -1, "cookie storage patch is in the served Story runtime");
assert.notEqual(end, -1, "cookie storage initialization is present");
const setup = runtime.slice(start, end + endMarker.length);

const cookies = new Map();
const modeDirectory = 0x4000;
const modeFile = 0x8000;

function makeDocument() {
  const listeners = {};
  const document = {
    visibilityState: "visible",
    addEventListener(name, callback) { listeners[name] = callback; },
    listeners,
  };
  Object.defineProperty(document, "cookie", {
    get() { return [...cookies].map(([name, value]) => `${name}=${value}`).join("; "); },
    set(value) {
      const [pair, ...attributes] = value.split(";");
      const separator = pair.indexOf("=");
      const name = pair.slice(0, separator);
      const cookieValue = pair.slice(separator + 1);
      if (attributes.some((attribute) => attribute.trim() === "Max-Age=0")) cookies.delete(name);
      else cookies.set(name, cookieValue);
    },
  });
  return document;
}

function makeFileSystem(seed = {}) {
  const files = new Map(Object.entries(seed).map(([name, value]) => [name, Uint8Array.from(value)]));
  const directories = new Set(["/", "/home", "/home/web_user", "/home/web_user/love", "/home/web_user/love/sync"]);
  function mkdirTree(directory) {
    const pieces = directory.split("/").filter(Boolean);
    let current = "";
    for (const piece of pieces) {
      current += `/${piece}`;
      directories.add(current);
    }
  }
  return {
    files,
    mkdir(directory) { directories.add(directory); },
    mkdirTree,
    mount() {},
    syncfs(populate, callback) { callback(null); },
    isDir(mode) { return mode === modeDirectory; },
    isFile(mode) { return mode === modeFile; },
    readdir(directory) {
      const children = new Set();
      for (const entry of [...directories, ...files.keys()]) {
        if (!entry.startsWith(`${directory}/`)) continue;
        const child = entry.slice(directory.length + 1).split("/")[0];
        if (child) children.add(child);
      }
      return [".", "..", ...children];
    },
    stat(filePath) {
      if (directories.has(filePath)) return { mode: modeDirectory };
      if (files.has(filePath)) return { mode: modeFile };
      throw new Error(`missing file: ${filePath}`);
    },
    readFile(filePath) { return new Uint8Array(files.get(filePath)); },
    writeFile(filePath, value) {
      mkdirTree(filePath.slice(0, filePath.lastIndexOf("/")));
      files.set(filePath, new Uint8Array(value));
    },
    unlink(filePath) { files.delete(filePath); },
  };
}

function startRuntime(FS) {
  const document = makeDocument();
  const window = {
    location: { protocol: "https:" },
    addEventListener(name, callback) { document.listeners[name] = callback; },
    setInterval() { return 1; },
  };
  let removedDependencies = 0;
  const errors = [];
  vm.runInNewContext(setup, {
    FS,
    IDBFS: {},
    Module: {
      removeRunDependency() { removedDependencies += 1; },
      printErr(error) { errors.push(String(error)); },
    },
    window,
    document,
    TextEncoder,
    TextDecoder,
    Uint8Array,
    Math,
    JSON,
    Number,
    String,
    btoa,
    atob,
  });
  assert.equal(removedDependencies, 1, "IDBFS startup dependency is released");
  assert.deepEqual(errors, [], "cookie migration completes without errors");
  return { FS, document };
}

const savePath = "/home/web_user/love/sync/savefile-data.lua";
const originalBytes = [0, 1, 2, 127, 128, 255];
const first = startRuntime(makeFileSystem({ [savePath]: originalBytes }));
assert.ok(cookies.has("kano_story_v1_manifest"), "legacy IndexedDB state is copied to a cookie");

const restored = startRuntime(makeFileSystem());
assert.deepEqual([...restored.FS.files.get(savePath)], originalBytes, "cookie save is restored into LÖVE's save directory");

const updatedBytes = [9, 8, 7, 0, 255];
restored.FS.writeFile(savePath, Uint8Array.from(updatedBytes));
restored.document.listeners.beforeunload();
const afterUnload = startRuntime(makeFileSystem());
assert.deepEqual([...afterUnload.FS.files.get(savePath)], updatedBytes, "exit-time save updates the cookie data");

console.log("Story cookie save migration, restore, and exit update checks passed.");
