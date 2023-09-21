import { defineConfig } from "tsup";

export default defineConfig({
  entryPoints: ["./src/extension.ts"],
  bundle: true,
  splitting: false,
  outDir: "out",
  // format: ["cjs", "esm"],
  format: ["cjs"],
  // format: ["esm"],
  // dts: true,
  clean: true,
  external: ["vscode"],
});
