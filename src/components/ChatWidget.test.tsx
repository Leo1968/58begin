import { act } from "react";
import { afterEach, describe, expect, it, vi } from "vitest";
import { cleanup, fireEvent, render, screen, waitFor } from "@testing-library/react";
import { ChatWidget } from "./ChatWidget";
import { useLangStore } from "@/stores/lang";

describe("ChatWidget", () => {
  afterEach(() => {
    cleanup();
    vi.unstubAllGlobals();
  });

  it("opens with a greeting and closes on Escape", async () => {
    act(() => useLangStore.getState().setLang("zh"));
    render(<ChatWidget />);
    fireEvent.click(screen.getByRole("button", { name: "智能客服" }));
    expect(screen.getByText(/我是小天/)).toBeTruthy();
    fireEvent.keyDown(window, { key: "Escape" });
    await waitFor(() => expect(screen.queryByText(/我是小天/)).toBeNull());
  });

  it("sends a message and renders the AI reply", async () => {
    act(() => useLangStore.getState().setLang("zh"));
    const fetchMock = vi.fn().mockResolvedValue({
      json: async () => ({ ok: true, reply: "我们提供开发咨询服务。" })
    });
    vi.stubGlobal("fetch", fetchMock);

    render(<ChatWidget />);
    fireEvent.click(screen.getByRole("button", { name: "智能客服" }));
    const input = screen.getByPlaceholderText("输入你的问题…");
    fireEvent.input(input, { target: { value: "你们提供什么服务？" } });
    fireEvent.click(screen.getByRole("button", { name: "发送" }));

    await waitFor(() =>
      expect(screen.getByText("我们提供开发咨询服务。")).toBeTruthy()
    );
    expect(fetchMock).toHaveBeenCalledTimes(1);
    const [url, init] = fetchMock.mock.calls[0];
    expect(url).toContain("/api/chat");
    expect((init as RequestInit).method).toBe("POST");
  });
});
