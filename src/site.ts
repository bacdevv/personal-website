import { existsSync } from "node:fs";
if (existsSync(".env")) process.loadEnvFile(".env");
export const profile = {
  name: "Bac",
  handle: "bacdevv",
  initials: "B.",
  brand: "bacdev.",
  role: "Computer Science student · Developer",
  intro: "Building software. Understanding intelligence.",
  bio: "I'm a third-year Computer Science student exploring software engineering, machine learning, and the ideas that connect them. This is where I share what I build and what I learn.",
  email: "vietbac.coding@gmail.com",
  github: "https://github.com/bacdevv",
  linkedin: "https://www.linkedin.com/in/tr%E1%BA%A7n-vi%E1%BB%87t-b%E1%BA%AFc-a69a33327/",
  university: "",
  location: "",
  cv: "",
  interests: [
    "Software engineering",
    "Full-stack development",
    "Machine learning",
    "Person Re-Identification",
  ],
  skills: ["Java", "Python", "TypeScript", "Astro", "Git", "PyTorch"],
};
export const siteUrl = process.env.SITE_URL || "https://example.com";
export const indexable =
  process.env.SITE_INDEXABLE === "true" &&
  (!process.env.CF_PAGES_BRANCH || process.env.CF_PAGES_BRANCH === "main") &&
  new URL(siteUrl).hostname !== "example.com";
