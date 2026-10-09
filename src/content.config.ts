import { defineCollection } from "astro:content";
import { z } from "astro/zod";
import { glob } from "astro/loaders";
import config from "@/config";

export const BLOG_PATH = "src/content/posts";

const posts = defineCollection({
  loader: glob({ pattern: "**/[^_]*.{md,mdx}", base: `./${BLOG_PATH}` }),
  schema: ({ image }) =>
    z.object({
      author: z.string().default(config.site.author),
      pubDatetime: z.coerce.date(),
      modDatetime: z.preprocess(
        v => (v === "" ? undefined : v),
        z.coerce.date().optional().nullable()
      ),
      title: z.string(),
      featured: z.boolean().optional(),
      draft: z.boolean().optional(),
      tags: z.array(z.string()).default(["others"]),
      ogImage: image().or(z.string()).optional(),
      cover: image().or(z.string()).optional(),
      coverAlt: z.string().optional(),
      description: z.string(),
      canonicalURL: z.string().optional(),
      hideEditPost: z.boolean().optional(),
      timezone: z.string().optional(),
    }),
});

const pages = defineCollection({
  loader: glob({ pattern: "**/[^_]*.{md,mdx}", base: "./src/content/pages" }),
  schema: z.object({
    title: z.string(),
    description: z.string().optional(),
    ogImage: z.string().optional(),
    canonicalURL: z.string().optional(),
  }),
});

const base = {
  title: z.string(),
  description: z.string(),
  date: z.coerce.date(),
  updated: z.preprocess(
    v => (v === "" ? undefined : v),
    z.coerce.date().optional()
  ),
  draft: z.boolean().default(true),
  tags: z.array(z.string()).default([]),
};
const projects = defineCollection({
  loader: glob({
    pattern: "**/[^_]*.{md,mdx}",
    base: "./src/content/projects",
  }),
  schema: ({ image }) =>
    z.object({
      ...base,
      summary: z.string().optional(),
      technologies: z.array(z.string()).default([]),
      cover: image().or(z.string()).optional(),
      github: z.union([z.literal(""), z.url()]).optional(),
      demo: z.union([z.literal(""), z.url()]).optional(),
      status: z
        .enum(["Demo project", "Ongoing", "Completed", "Archived"])
        .default("Demo project"),
      featured: z.boolean().default(false),
    }),
});
const notes = defineCollection({
  loader: glob({ pattern: "**/[^_]*.{md,mdx}", base: "./src/content/notes" }),
  schema: z.object({ ...base, subject: z.string() }),
});
const research = defineCollection({
  loader: glob({
    pattern: "**/[^_]*.{md,mdx}",
    base: "./src/content/research",
  }),
  schema: z.object({
    ...base,
    status: z
      .enum([
        "Hypothesis",
        "Ongoing investigation",
        "Completed experiment",
        "Published work",
        "Paper summary",
      ])
      .default("Hypothesis"),
    source: z.union([z.literal(""), z.url()]).optional(),
  }),
});
export const collections = { posts, pages, projects, notes, research };
