import { act } from "react";
import { afterEach, beforeEach, describe, expect, it } from "vitest";
import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import { AnnouncementTicker } from "./AnnouncementTicker";
import { useLangStore } from "@/stores/lang";

describe("AnnouncementTicker", () => {
  beforeEach(() => {
    localStorage.clear();
    act(() => useLangStore.getState().setLang("zh"));
  });

  afterEach(() => {
    cleanup();
  });

  it("renders the first zh announcement and follows language switch", () => {
    render(<AnnouncementTicker />);
    expect(screen.getAllByText(/不可能的事/).length).toBeGreaterThan(0);

    act(() => useLangStore.getState().setLang("en"));
    expect(screen.getAllByText(/impossible/).length).toBeGreaterThan(0);
  });

  it("cycles announcements with the prev/next arrows", () => {
    render(<AnnouncementTicker />);
    expect(screen.getByText(/不可能的事/)).toBeTruthy();
    expect(screen.queryByText(/商务合作/)).toBeNull();

    fireEvent.click(screen.getByRole("button", { name: "下一条公告" }));
    expect(screen.getByText(/商务合作/)).toBeTruthy();
    expect(screen.queryByText(/不可能的事/)).toBeNull();

    fireEvent.click(screen.getByRole("button", { name: "上一条公告" }));
    expect(screen.getByText(/不可能的事/)).toBeTruthy();
  });
});
