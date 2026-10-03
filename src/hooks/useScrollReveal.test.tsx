import { describe, expect, it, vi, afterEach } from "vitest";
import { render, screen, act, cleanup } from "@testing-library/react";
import { useRef } from "react";
import { useScrollReveal } from "./useScrollReveal";

type IOCallback = (entries: { isIntersecting: boolean; target: Element }[]) => void;

class MockIntersectionObserver {
  static instances: MockIntersectionObserver[] = [];
  callback: IOCallback;
  observed: Element[] = [];
  constructor(callback: IOCallback) {
    this.callback = callback;
    MockIntersectionObserver.instances.push(this);
  }
  observe(target: Element) {
    this.observed.push(target);
  }
  unobserve() {}
  disconnect() {}
}

function Fixture() {
  const ref = useRef<HTMLDivElement>(null);
  useScrollReveal(ref);
  return (
    <div ref={ref}>
      <div className="reveal" data-testid="a" />
      <div className="reveal" data-testid="b" />
    </div>
  );
}

describe("useScrollReveal", () => {
  afterEach(() => {
    cleanup();
    vi.unstubAllGlobals();
    MockIntersectionObserver.instances = [];
  });

  it("arms the root and observes .reveal targets", () => {
    vi.stubGlobal("IntersectionObserver", MockIntersectionObserver as unknown as typeof IntersectionObserver);
    render(<Fixture />);
    const a = screen.getByTestId("a");
    const b = screen.getByTestId("b");
    const root = a.parentElement!;
    expect(root.classList.contains("reveal-ready")).toBe(true);
    expect(MockIntersectionObserver.instances[0]?.observed).toContain(a);
    expect(MockIntersectionObserver.instances[0]?.observed).toContain(b);
    expect(a.classList.contains("is-revealed")).toBe(false);
  });

  it("adds is-revealed once the element intersects (one-shot)", () => {
    vi.stubGlobal("IntersectionObserver", MockIntersectionObserver as unknown as typeof IntersectionObserver);
    render(<Fixture />);
    const a = screen.getByTestId("a");
    const b = screen.getByTestId("b");
    const io = MockIntersectionObserver.instances[0]!;
    act(() => {
      io.callback([
        { isIntersecting: true, target: a },
        { isIntersecting: false, target: b }
      ]);
    });
    expect(a.classList.contains("is-revealed")).toBe(true);
    expect(b.classList.contains("is-revealed")).toBe(false);
  });
});
