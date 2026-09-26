import { readFile, writeFile } from "node:fs/promises";
import { fileURLToPath } from "node:url";

const upstreamIndex = fileURLToPath(new URL("../../../kano-apps/make-art/index.js", import.meta.url));
let source = await readFile(upstreamIndex, "utf8");

if (!source.includes("Could not load Make Art header")) {
  source = source.replace(
    "        fetch(headerPath)\n            .then(r => r.text())",
    "        this.ready = fetch(headerPath)\n            .then((response) => {\n                if (!response.ok) {\n                    throw new Error(`Could not load Make Art header (${response.status}): ${headerPath}`);\n                }\n                return response.text();\n            })",
  );

  const oldBootstrap = `            .then(() => {
                import('./lib/index.js').then(() => {
                    window.MakeArt.app.constant('_config', config);
                    window.MakeArt.bootstrap(this.root);
                    this.root.style.opacity = 1;
                });
            });`;
  const newBootstrap = `            .then(() => import('./lib/index.js'))
            .then(() => {
                if (!window.MakeArt || !window.MakeArt.app || !window.MakeArt.bootstrap) {
                    throw new Error('Make Art modules did not initialize');
                }
                window.MakeArt.app.constant('_config', config);
                window.MakeArt.bootstrap(this.root);
                this.root.style.opacity = 1;
                return this;
            });`;
  if (!source.includes("this.ready = fetch(headerPath)")) {
    throw new Error("Could not patch Make Art header initialization");
  }
  if (!source.includes(oldBootstrap)) {
    throw new Error("Could not patch Make Art application bootstrap");
  }
  source = source.replace(oldBootstrap, newBootstrap);
  await writeFile(upstreamIndex, source);
}

console.log("Make Art startup errors will be reported by the page wrapper.");
