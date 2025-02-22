import { defineConfig } from "vite";
import dts from "vite-plugin-dts";
import { copyFileSync } from "fs";
import path from "path";

// const dist = "../npm-package/dist";

export default defineConfig({
  build: {
    lib: {
      entry: "./src/index.ts",
      name: "dom-reactive",
      fileName: (format) => {
        return format === "es" ? `index.mjs` : `index.js`;
      },
      formats: ["es"],
    },
    outDir: "./dist",
    sourcemap: true,
    minify: "esbuild",
  },
  plugins: [
    dts(),
    {
      name: "copy-index-ts",
      closeBundle() {
        copyFileSync(
          path.resolve(__dirname, "./src/index.ts"),
          path.resolve(__dirname, "./dist/index.ts")
        );
      },
    },
  ],
});
