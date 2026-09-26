import { cp, mkdir, rm } from "node:fs/promises";
import { execFileSync } from "node:child_process";
import { fileURLToPath } from "node:url";
import path from "node:path";

const root = fileURLToPath(new URL("..", import.meta.url));
const source = path.join(root, "src", "story");
const destination = path.join(root, "public", "story");

await rm(destination, { recursive: true, force: true });
await mkdir(path.dirname(destination), { recursive: true });
await cp(source, destination, {
  recursive: true,
  filter: (entry) => path.basename(entry) !== "patch-cookie-storage.mjs",
});
execFileSync(
  process.execPath,
  [
    path.join(source, "patch-cookie-storage.mjs"),
    path.join(source, "love.js"),
    path.join(destination, "love.js"),
  ],
  { stdio: "inherit" },
);
