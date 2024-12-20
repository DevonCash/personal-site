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
      sidebar: [
        {
          label: "Rulesets",
          collapsed: false,
          autogenerate: { directory: "Rulesets" },
        },
        {
          label: "Modules",
          collapsed: false,
          items: [
            {
              label: "LANCER: Hardsuits",
              slug: "modules/lancer-hardsuits"
            },
            {
              label: "LANCER: Scarcity",
              slug: "modules/lancer-scarcity"
            },
            {
              label: "WWN: Eberron",
              slug: "modules/worlds-without-number-eberron"
            },
            {
              label: "The Luminous Order",
              collapsed: true,
              autogenerate: { directory: "Modules/The Luminous Order" }
            }
          ]
        }
      ],
    }),
  ],

  adapter: cloudflare({
    imageService: "cloudflare",
  }),
});
