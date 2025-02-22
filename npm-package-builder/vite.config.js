import { defineConfig } from "vite";

export default defineConfig({
  build: {
    lib: {
      entry: "src/index.ts",
      name: "dom-reactive",
      fileName: (format) => `dom-reactive.${format}.js`,
      formats: ["es"],
    },
    outDir: "../npm-package/",
  },
});
