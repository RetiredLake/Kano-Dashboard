import { defineConfig } from "vite";

export default defineConfig({
  base: "/code/",
  publicDir: "public",
  build: {
    outDir: "../../public/code",
    emptyOutDir: true,
    sourcemap: false,
  },
});
