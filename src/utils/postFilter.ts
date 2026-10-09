import type { CollectionEntry } from "astro:content";
export function postFilter({ data }: CollectionEntry<"posts">) {
  return !data.draft && data.pubDatetime.getTime() <= Date.now();
}
