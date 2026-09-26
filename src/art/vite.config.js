import { defineConfig } from "vite";
import { fileURLToPath } from "node:url";

const root = fileURLToPath(new URL(".", import.meta.url));

export default defineConfig({
  root,
  base: "/art/",
  publicDir: "public",
  build: {
    outDir: "../../public/art",
    emptyOutDir: true,
    sourcemap: false,
  },
});
