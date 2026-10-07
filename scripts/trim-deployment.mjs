import { readdir, rm, stat } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import { join } from 'node:path';

// This archival backup is not referenced by the app. Keep it in source,
// but do not ship it alongside the live minecraft-tutorial.xml.
const backup = new URL('../dist/client/make-minecraft/original-ui/make-minecraft/minecraft/content/minecraft-tutorial.xml.orig', import.meta.url);
const live = new URL('../dist/client/make-minecraft/original-ui/make-minecraft/minecraft/content/minecraft-tutorial.xml', import.meta.url);
await stat(live);
await rm(fileURLToPath(backup), { force: true });
console.log('Excluded unused tutorial backup from deployment; source retained.');

// Only generated deployment output is cleaned. Keep all original app sources,
// libraries, lesson data, maps and game files in the checkout and deployment.
const cacheDirectories = new Set(['__pycache__', '.cache', '.pytest_cache', '.mypy_cache', '.ruff_cache']);
let discardedBytes = 0;
async function trim(directory, inCache = false) {
  for (const entry of await readdir(directory, { withFileTypes: true })) {
    const path = join(directory, entry.name);
    if (entry.isDirectory()) {
      await trim(path, inCache || cacheDirectories.has(entry.name));
      if (cacheDirectories.has(entry.name)) await rm(path, { recursive: true });
    } else if (entry.isFile() && (inCache ||
        /(?:\.py[co]|\.tmp|\.log)$/.test(entry.name) || entry.name === '.DS_Store')) {
      discardedBytes += (await stat(path)).size;
      await rm(path);
    }
  }
}
await trim(fileURLToPath(new URL('../dist/client/', import.meta.url)));
console.log(`Excluded ${discardedBytes} bytes of generated cache and temporary files.`);
