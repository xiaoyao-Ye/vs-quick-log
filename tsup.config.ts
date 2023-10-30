import { defineConfig } from "tsup";

export default defineConfig({
  entry: ["src/index.ts"],
  format: ["cjs"],
  shims: false,
  sourcemap: true,
  dts: false,
  clean: true,
  external: ["vscode"],
});
