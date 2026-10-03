import { act } from "react";
import { beforeEach, describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import { AnnouncementTicker } from "./AnnouncementTicker";
import { useLangStore } from "@/stores/lang";

describe("AnnouncementTicker", () => {
  beforeEach(() => {
    localStorage.clear();
    act(() => useLangStore.getState().setLang("zh"));
  });

  it("renders zh announcement items and follows language switch", () => {
    render(<AnnouncementTicker />);
    expect(screen.getAllByText(/不可能的事/).length).toBeGreaterThan(0);

    act(() => useLangStore.getState().setLang("en"));
    expect(screen.getAllByText(/impossible/).length).toBeGreaterThan(0);
  });

  it("duplicates items for the seamless marquee loop but hides the copy from AT", () => {
    const { container } = render(<AnnouncementTicker />);
    const lists = container.querySelectorAll("ul");
    expect(lists.length).toBe(2);
    expect(lists[1]?.getAttribute("aria-hidden")).toBe("true");
  });
});
