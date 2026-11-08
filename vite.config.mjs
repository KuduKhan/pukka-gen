import { fileURLToPath } from "node:url";
import { defineConfig } from "vite";
const page = name => fileURLToPath(new URL(name, import.meta.url));
export default defineConfig({
  build:{rollupOptions:{input:{
    home:page("./index.html"),
    privacy:page("./privacy.html"),
    terms:page("./terms.html")
  }}}
});
