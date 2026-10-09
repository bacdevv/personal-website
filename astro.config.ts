import { defineConfig, envField, svgoOptimizer } from "astro/config";
import tailwindcss from "@tailwindcss/vite";
import remarkMath from "remark-math";
import rehypeKatex from "rehype-katex";
import uploadedImages from "./scripts/rehype-upload-images.mjs";
import mdx from "@astrojs/mdx";
import sitemap from "@astrojs/sitemap";
import { unified } from "@astrojs/markdown-remark";
import remarkToc from "remark-toc";
import remarkCollapse from "remark-collapse";
import rehypeCallouts from "rehype-callouts";
import {
  transformerNotationDiff,
  transformerNotationHighlight,
  transformerNotationWordHighlight,
} from "@shikijs/transformers";
import { transformerFileName } from "./src/utils/transformers/fileName";
import config from "./astro-paper.config";

export default defineConfig({
  site: config.site.url,
  output: "static",
  integrations: [
    mdx(),
    sitemap({
      filter: page =>
        (config.features?.showArchives !== false || !page.endsWith("/archives/")) &&
        !page.includes("/adminn"),
    }),
  ],
  i18n: {
    locales: ["en"],
    defaultLocale: "en",
    routing: {
      prefixDefaultLocale: false,
    },
  },
  markdown: {
    processor: unified({
      remarkPlugins: [
        remarkToc,
        remarkMath,
        [remarkCollapse, { test: "Table of contents" }],
      ],
      rehypePlugins: [rehypeCallouts, rehypeKatex, uploadedImages],
    }),
    shikiConfig: {
      themes: { light: "min-light", dark: "night-owl" },
      defaultColor: false,
      wrap: false,
      transformers: [
        transformerFileName({ style: "v2", hideDot: false }),
        transformerNotationHighlight(),
        transformerNotationWordHighlight(),
        transformerNotationDiff({ matchAlgorithm: "v3" }),
        // Preserve the fenced-code language after Shiki highlighting so the
        // optional code runner never guesses Python versus Java.
        {
          pre(node) {
            node.properties["data-language"] = this.options.lang;
          },
        },
      ],
    },
  },
  vite: {
    plugins: [tailwindcss()],
  },
  // Only two self-hosted font families. Fira Code Retina = variable weight 450.
  fonts: [
    {
      name: "Inter",
      cssVariable: "--font-inter",
      provider: fontProviders.google(),
      weights: ["400 700"],
      styles: ["normal"],
      subsets: ["latin", "latin-ext", "vietnamese"],
      formats: ["woff2"],
      fallbacks: ["sans-serif"],
    },
    {
      name: "Fira Code",
      cssVariable: "--font-fira-code",
      provider: fontProviders.google(),
      weights: ["300 700"],
      styles: ["normal"],
      subsets: ["latin", "latin-ext"],
      formats: ["woff2"],
      fallbacks: ["monospace"],
    },
  ],
  env: {
    schema: {
      PUBLIC_GOOGLE_SITE_VERIFICATION: envField.string({
        access: "public",
        context: "client",
        optional: true,
      }),
    },
  },
  experimental: {
    svgOptimizer: svgoOptimizer(),
  },
});
