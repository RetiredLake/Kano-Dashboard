import { defineConfig } from "vite";

export default defineConfig({
  base: "/code/",
  publicDir: "public",
  build: {
    outDir: "../../dist/code",
    emptyOutDir: true,
    sourcemap: false,
  },
});
