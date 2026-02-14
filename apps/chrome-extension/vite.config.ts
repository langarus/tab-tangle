import { defineConfig } from "vite";
import { viteStaticCopy } from "vite-plugin-static-copy";
import { resolve } from "path";

export default defineConfig(({ mode }) => {
  const isFirefox = mode === "firefox";
  const manifestFile = isFirefox
    ? "src/manifest.firefox.json"
    : "src/manifest.json";

  return {
    plugins: [
      viteStaticCopy({
        targets: [
          {
            src: manifestFile,
            dest: ".",
            rename: "manifest.json",
          },
          {
            // Copy the polyfill to dist for use by content scripts
            src: "node_modules/webextension-polyfill/dist/browser-polyfill.js",
            dest: ".",
          },
        ],
      }),
    ],
    build: {
      outDir:
        mode === "firefox"
          ? "dist-firefox"
          : mode === "chrome"
            ? "dist-chrome"
            : "dist",
      rollupOptions: {
        input: {
          background: resolve(__dirname, "src/background.ts"),
          content: resolve(__dirname, "src/content.ts"),
        },
        output: {
          entryFileNames: "[name].js",
          chunkFileNames: "[name].js",
          assetFileNames: "[name].[ext]",
        },
      },
      target: "esnext",
      minify: false,
    },
  };
});
