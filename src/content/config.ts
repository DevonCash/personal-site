import { defineCollection } from "astro:content";
import { docsSchema } from "@astrojs/starlight/schema";
import { z } from "astro:content";
export const collections = {
  docs: defineCollection({
    schema: docsSchema({
      extend: z.object({
        link: z.string().optional()
      }),
    }),
  }),
};
