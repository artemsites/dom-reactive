import { defineConfig } from "vite";
import dts from "vite-plugin-dts";

export default defineConfig({
  build: {
    lib: {
      entry: "./index.ts",
      name: "dom-reactive",
      fileName: (format) => {
        return format === "es" ? `index.mjs` : `index.js`;
      },
      formats: ["es"],
    },
    outDir: "./",
    sourcemap: true,
    minify: "esbuild",
  },
  plugins: [dts()],
});
