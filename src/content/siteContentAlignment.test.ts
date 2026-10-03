import { describe, expect, it } from "vitest";
import { siteEn } from "./site.en";
import { siteZh } from "./site.zh";

function ids<T extends { id: string }>(items: T[]) {
  return items.map((i) => i.id);
}

describe("site content alignment", () => {
  it("should keep key lists aligned between zh and en", () => {
    expect(ids(siteZh.nav.sections)).toEqual(ids(siteEn.nav.sections));
    expect(ids(siteZh.featured.items)).toEqual(ids(siteEn.featured.items));
    expect(ids(siteZh.findMeOn.items)).toEqual(ids(siteEn.findMeOn.items));
    expect(ids(siteZh.products.groups)).toEqual(ids(siteEn.products.groups));

    for (const group of siteZh.products.groups) {
      const enGroup = siteEn.products.groups.find((g) => g.id === group.id);
      expect(enGroup).toBeTruthy();
      expect(ids(group.items)).toEqual(ids(enGroup!.items));
    }

    expect(ids(siteZh.tools.items)).toEqual(ids(siteEn.tools.items));
    expect(siteZh.posts.items.map((p) => p.slug)).toEqual(siteEn.posts.items.map((p) => p.slug));
  });

  it("should keep announcement / trustBadges / closingCta aligned between zh and en", () => {
    expect(siteZh.announcement.items.length).toBeGreaterThan(0);
    expect(siteZh.announcement.items.length).toBe(siteEn.announcement.items.length);

    expect(siteZh.trustBadges.length).toBe(siteEn.trustBadges.length);
    expect(siteZh.trustBadges.length).toBeGreaterThan(0);
    expect(siteZh.trustBadges.every((b) => b.label && b.detail)).toBe(true);
    expect(siteEn.trustBadges.every((b) => b.label && b.detail)).toBe(true);

    expect(Object.keys(siteZh.closingCta).sort()).toEqual(
      Object.keys(siteEn.closingCta).sort()
    );
    expect(siteZh.closingCta.primaryCta.text).toBeTruthy();
    expect(siteEn.closingCta.primaryCta.text).toBeTruthy();
    expect(siteZh.closingCta.secondaryCta.text).toBeTruthy();
    expect(siteEn.closingCta.secondaryCta.text).toBeTruthy();
  });
});

