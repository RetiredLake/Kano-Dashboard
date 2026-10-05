import { rm, stat } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';

// This archival backup is not referenced by the app. Keep it in source,
// but do not ship it alongside the live minecraft-tutorial.xml.
const backup = new URL('../dist/client/make-minecraft/original-ui/make-minecraft/minecraft/content/minecraft-tutorial.xml.orig', import.meta.url);
const live = new URL('../dist/client/make-minecraft/original-ui/make-minecraft/minecraft/content/minecraft-tutorial.xml', import.meta.url);
await stat(live);
await rm(fileURLToPath(backup), { force: true });
console.log('Excluded unused tutorial backup from deployment; source retained.');
