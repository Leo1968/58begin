import { beforeEach, describe, expect, it } from "vitest";
import { fireEvent, render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { SiteNav } from "./SiteNav";
import { useLangStore } from "@/stores/lang";

describe("SiteNav", () => {
  beforeEach(() => {
    localStorage.clear();
    useLangStore.getState().setLang("zh");
  });

  it("should toggle language", () => {
    render(
      <MemoryRouter initialEntries={["/"]}>
        <SiteNav activeSectionId={null} />
      </MemoryRouter>
    );

    expect(screen.getAllByText("EN").length).toBeGreaterThan(0);
    fireEvent.click(screen.getAllByText("EN")[0]);
    expect(screen.getAllByText("中").length).toBeGreaterThan(0);
  });
});

