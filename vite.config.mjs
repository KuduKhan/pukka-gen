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
    trust:page("./trust.html"),
    services:page("./services.html"),
    studio:page("./studio.html"),
    about:page("./about.html"),
    industries:page("./industries.html"),
    careers:page("./careers.html"),
    faqs:page("./faqs.html"),
    contact:page("./contact.html")
  }}}
});
