import type { SiteContent, Lang } from "./types";
import { siteZh } from "./site.zh";
import { siteEn } from "./site.en";

export function getSiteContent(lang: Lang): SiteContent {
  return lang === "zh" ? siteZh : siteEn;
}

