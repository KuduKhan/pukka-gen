import { resolve } from "node:path";
import { defineConfig } from "vite";

// Build all public HTML entry points. Vite does not otherwise emit standalone
// root-level privacy.html and terms.html when input is only index.html.
export default defineConfig({
  build: {
    rollupOptions: {
      input: {
        index: resolve(process.cwd(), "index.html"),
        privacy: resolve(process.cwd(), "privacy.html"),
        terms: resolve(process.cwd(), "terms.html"),
      },
    },
  },
});
