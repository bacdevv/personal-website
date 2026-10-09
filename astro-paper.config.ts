import { defineAstroPaperConfig } from "./src/types/config";
import { profile, siteUrl } from "./src/site";
export default defineAstroPaperConfig({
  site: { url: siteUrl, title: "bacdev.", description: "Software projects, technical writing, and learning notes on software engineering and machine learning.", author: profile.name, profile: profile.github, ogImage: "default-og.png", lang: "en", timezone: "Asia/Ho_Chi_Minh", dir: "ltr" },
  posts: { perPage: 6, perIndex: 3, scheduledPostMargin: 0 },
  features: { lightAndDarkMode: true, dynamicOgImage: false, showArchives: true, showBackButton: false, editPost: { enabled: false }, search: "pagefind" },
  socials: [{name: "github", url: profile.github}, ...(profile.email ? [{name: "mail" as const, url: `mailto:${profile.email}`}] : []), ...(profile.linkedin ? [{name: "linkedin" as const, url: profile.linkedin}] : [])],
  shareLinks: [{name: "x", url: "https://x.com/intent/post?url="}, {name: "linkedin", url: "https://www.linkedin.com/sharing/share-offsite/?url="}, {name: "mail", url: "mailto:?subject=Article&body="}],
});
