import { defineConfig } from "astro/config";
import starlight from "@astrojs/starlight";

// https://astro.build/config
export default defineConfig({
  output: "hybrid",
  integrations: [
    starlight({
      title: "devon.cash",
      customCss: ["./src/styles/custom.css"],
      plugins: [],
    }),
  ],
});
