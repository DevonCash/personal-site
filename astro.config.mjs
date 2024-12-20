import { defineConfig } from "astro/config";
import starlight from "@astrojs/starlight";
import cloudflare from "@astrojs/cloudflare";

// https://astro.build/config
export default defineConfig({
  output: "server",

  integrations: [
    starlight({
      title: "devon.cash",
      customCss: ["./src/styles/custom.css"],
      plugins: [],
      components: {
        MarkdownContent: "./src/components/CommentablePage.astro",
      },
    }),
  ],

  adapter: cloudflare({
    imageService: 'cloudflare'
  }),
});
