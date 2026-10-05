import assert from "node:assert/strict";
import { readFileSync, existsSync } from "node:fs";
import vm from "node:vm";
import test from "node:test";

test("manifest has real installation icons and standalone launch", () => {
  const manifest = JSON.parse(readFileSync("public/manifest.webmanifest", "utf8"));
  assert.equal(manifest.display, "standalone");
  assert.equal(manifest.start_url, "/");
  for (const icon of manifest.icons) assert.ok(existsSync(`public${icon.src}`));
});

test("service worker only intercepts public assets and navigations", () => {
  const handlers = {};
  vm.runInNewContext(readFileSync("public/sw.js", "utf8"), {
    self: { location: { origin: "https://kano.example" }, addEventListener: (name, handler) => { handlers[name] = handler; } },
    URL, fetch: async () => ({ ok: false }), caches: {},
  });
  function intercepted(path, options = {}) {
    let handled = false;
    handlers.fetch({ request: { url: `https://kano.example${path}`, method: "GET", mode: "cors", ...options }, respondWith: () => { handled = true; } });
    return handled;
  }
  assert.equal(intercepted("/api/profile"), false);
  assert.equal(intercepted("/signin-with-chatgpt"), false);
  assert.equal(intercepted("/dashboard/icon.png?private=1"), false);
  assert.equal(intercepted("/dashboard/icon.png", { method: "POST" }), false);
  assert.equal(intercepted("/dashboard/projects-logo.png"), true);
});
