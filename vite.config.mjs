import { fileURLToPath } from "node:url";
import { defineConfig } from "vite";
const page = name => fileURLToPath(new URL(name, import.meta.url));
export default defineConfig({
  build:{rollupOptions:{input:{
    home:page("./index.html"),
    privacy:page("./privacy.html"),
    terms:page("./terms.html"),
    company:page("./company.html"),
    partners:page("./partners.html"),
    investors:page("./investors.html"),
    trust:page("./trust.html")
  }}}
});
