Based on official satnaing/astro-paper tag v6.1.0, commit 4c33a60529f9c443145a89fe526ff231c009272d. MIT license retained.
Repository: https://github.com/satnaing/astro-paper

Original blog utilities, MDX, Shiki, tags, pagination, RSS and content collections retained. Blog route moved from /posts to /blog. Fonts use system stacks; client routing and scroll listeners removed for static-first navigation.

Official implementation references checked on 2026-10-09:

- https://github.com/satnaing/astro-paper/releases/tag/v6.1.0
- https://docs.astro.build/en/guides/content-collections/
- https://pagescms.org/docs/configuration/
- https://pagescms.org/docs/configuration/content/
- https://pagescms.org/docs/configuration/content/editors/
- https://pagescms.org/docs/configuration/fields/date/
- https://pagescms.org/docs/configuration/media/
- https://developers.cloudflare.com/pages/framework-guides/deploy-an-astro-site/

The default branch had newer dependencies than the stable release. This project deliberately starts from the v6.1.0 release tag and retains its compatible Astro 6.4.2 dependency line instead of copying main's Astro 7 changes.
