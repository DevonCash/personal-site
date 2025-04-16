import { defineConfig } from "astro/config";
import sectionize from "@hbsnow/rehype-sectionize";
import cloudflare from "@astrojs/cloudflare";

// https://astro.build/config
const defaultLayout = () => (_, file) => {
  file.data.astro.frontmatter.layout ??= "@/layouts/article.astro";
};

export default defineConfig({
  output: "server",
  adapter: cloudflare({
    imageService: "cloudflare",
  }),
  markdown: {
    remarkPlugins: [defaultLayout],
    rehypePlugins: [sectionize]
  },
});
