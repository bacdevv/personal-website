---
title: "Why this website is static-first"
description: "A demonstration article about choosing a simple architecture for a personal website."
pubDatetime: "2026-10-08T00:00:00Z"
featured: true
draft: false
tags: ["Web Development", "Software Engineering"]
---

> Demonstration article · Replace or adapt this content before your personal launch.

## Start with the reader

A personal website is mostly words, links, and images. The first job is to deliver those reliably and quickly. This demonstration article explains the architecture of this site; it does not claim measured production results.

## Build once, serve many times

Astro turns Markdown and components into HTML during the build. Readers receive those files from a CDN instead of waiting for a database query.

```ts
const article = {
  title: "Learning in public",
  draft: false,
};
```

A static architecture still supports an editor. Pages CMS commits content to GitHub, and Cloudflare rebuilds the website. Saving a file is different from successfully deploying it.

## Use JavaScript where it helps

Theme switching, code copying, and search provide useful interactions. Ordinary navigation can stay native to the browser. Search loads only on the search page.

## Measure before claiming

A small bundle is encouraging, but it is not a Lighthouse score. Measure the built site on a defined device and network profile, then measure again on the production domain.

Continue with [my learning notes](/notes) or explore [the projects](/projects).
