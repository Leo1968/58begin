import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { ClosingCtaSection } from "./ClosingCtaSection";
import { siteZh } from "@/content/site.zh";
import { siteEn } from "@/content/site.en";

describe("ClosingCtaSection", () => {
  it("renders zh closing CTA with both actions", () => {
    render(
      <MemoryRouter>
        <ClosingCtaSection closingCta={siteZh.closingCta} />
      </MemoryRouter>
    );
    expect(screen.getByText(siteZh.closingCta.title)).toBeTruthy();
    expect(screen.getByText(siteZh.closingCta.primaryCta.text)).toBeTruthy();
    expect(screen.getByText(siteZh.closingCta.secondaryCta.text)).toBeTruthy();
  });

  it("renders en closing CTA with both actions", () => {
    render(
      <MemoryRouter>
        <ClosingCtaSection closingCta={siteEn.closingCta} />
      </MemoryRouter>
    );
    expect(screen.getByText(siteEn.closingCta.title)).toBeTruthy();
    expect(screen.getByText(siteEn.closingCta.primaryCta.text)).toBeTruthy();
    expect(screen.getByText(siteEn.closingCta.secondaryCta.text)).toBeTruthy();
  });
});
