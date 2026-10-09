import { defineConfig, envField, fontProviders, svgoOptimizer } from "astro/config";
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
        config.features?.showArchives !== false || !page.endsWith("/archives/"),
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
      ],
    },
  },
  vite: {
    plugins: [tailwindcss()],
  },
  // Both fonts are downloaded by Astro during the build and served from
  // the site's own _astro/fonts directory. No runtime font CDN is needed.
  fonts: [
    {
      name: "Iosevka Charon Mono",
      cssVariable: "--font-iosevka-charon-mono",
      provider: fontProviders.fontsource(),
      // This family is static (400/500/700), not a variable-weight font.
      weights: [400, 500, 700],
      styles: ["normal"],
      subsets: ["latin", "latin-ext", "vietnamese"],
      formats: ["woff2"],
      fallbacks: ["monospace"],
    },
    {
      name: "JetBrains Mono",
      cssVariable: "--font-jetbrains-mono",
      provider: fontProviders.fontsource(),
      // Variable font: one weight range covers regular and bold code.
      weights: ["400 700"],
      styles: ["normal"],
      subsets: ["latin", "latin-ext", "vietnamese"],
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
