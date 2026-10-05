import { useEffect, useRef, useState } from "react";
import { MessageCircle, Send, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { useLangStore } from "@/stores/lang";

type Msg = { role: "user" | "assistant"; content: string };

const API_BASE = import.meta.env.VITE_API_BASE ?? "";

export function ChatWidget() {
  const { lang } = useLangStore();
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<Msg[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const listRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const t = {
    open: lang === "zh" ? "智能客服" : "AI assistant",
    title: lang === "zh" ? "小天 · 智能助手" : "Sky Assistant",
    greeting:
      lang === "zh"
        ? "你好！我是小天，Skywalker Labs 的智能助手。可以问我业务、服务或代表作的问题～"
        : "Hi! I'm Sky, the Skywalker Labs assistant. Ask me about our services or featured work.",
    placeholder: lang === "zh" ? "输入你的问题…" : "Type your question…",
    send: lang === "zh" ? "发送" : "Send",
    error:
      lang === "zh"
        ? "抱歉，我暂时联系不上服务，请稍后再试，或发邮件到 hello@58begin.com。"
        : "Sorry, I can't reach the service right now. Try again later or email hello@58begin.com.",
    chips:
      lang === "zh"
        ? ["你们提供什么服务？", "介绍一下代表作", "怎么联系你们？"]
        : ["What services do you offer?", "Tell me about your featured work", "How can I contact you?"],
  };

  useEffect(() => {
    if (open && messages.length === 0) {
      setMessages([{ role: "assistant", content: t.greeting }]);
    }
    if (open) inputRef.current?.focus();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open]);

  useEffect(() => {
    listRef.current?.scrollTo?.({ top: listRef.current.scrollHeight });
  }, [messages, loading]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  async function send(text: string) {
    const message = text.trim();
    if (!message || loading) return;
    const history = messages
      .filter((m) => m.role !== "assistant" || m.content !== t.greeting)
      .slice(-6)
      .map((m) => ({ role: m.role, content: m.content }));
    setMessages((m) => [...m, { role: "user", content: message }]);
    setInput("");
    setLoading(true);
    try {
      const res = await fetch(`${API_BASE}/api/chat`, {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ message, history })
      });
      const data = (await res.json()) as { ok: boolean; reply?: string };
      setMessages((m) => [
        ...m,
        { role: "assistant", content: data.ok && data.reply ? data.reply : t.error }
      ]);
    } catch {
      setMessages((m) => [...m, { role: "assistant", content: t.error }]);
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      {open ? (
        <div
          role="dialog"
          aria-label={t.title}
          className="fixed bottom-[92px] right-5 z-50 flex max-h-[70vh] w-[min(92vw,380px)] flex-col rounded-none border-2 border-fg bg-card shadow-[6px_6px_0_0_rgb(var(--fg))] motion-reduce:animate-none"
          style={{ animation: "announce-fade .3s ease-out" }}
        >
          <div className="flex items-center justify-between bg-fg px-4 py-3 text-bg">
            <div className="text-sm font-semibold">{t.title}</div>
            <button
              onClick={() => setOpen(false)}
              aria-label={lang === "zh" ? "关闭" : "Close"}
              className="rounded-full p-0.5 transition hover:opacity-70"
            >
              <X className="h-4 w-4" />
            </button>
          </div>

          <div ref={listRef} className="flex-1 space-y-2.5 overflow-y-auto p-3">
            {messages.map((m, i) => (
              <div
                key={i}
                className={cn(
                  "max-w-[85%] px-3 py-2 text-sm leading-relaxed",
                  m.role === "user"
                    ? "ml-auto rounded-lg bg-fg text-bg"
                    : "rounded-lg border border-border bg-bg text-fg"
                )}
              >
                {m.content}
              </div>
            ))}
            {loading ? (
              <div className="max-w-[85%] rounded-lg border border-border bg-bg px-3 py-2 text-sm text-muted">
                <span className="animate-pulse motion-reduce:animate-none">···</span>
              </div>
            ) : null}
          </div>

          <div className="flex flex-wrap gap-1.5 px-3 pb-2">
            {t.chips.map((chip) => (
              <button
                key={chip}
                onClick={() => send(chip)}
                className="rounded-full border border-border bg-transparent px-2.5 py-1 text-xs text-muted transition hover:border-fg/40 hover:text-fg"
              >
                {chip}
              </button>
            ))}
          </div>

          <form
            className="flex items-center gap-2 border-t border-border p-2"
            onSubmit={(e) => {
              e.preventDefault();
              send(input);
            }}
          >
            <input
              ref={inputRef}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder={t.placeholder}
              maxLength={600}
              className="min-w-0 flex-1 rounded-full border border-border bg-bg px-3.5 py-2 text-sm text-fg placeholder:text-muted/70 focus:outline-none focus:ring-2 focus:ring-accent/50"
            />
            <button
              type="submit"
              aria-label={t.send}
              className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-fg text-bg transition hover:bg-fg/90"
            >
              <Send className="h-4 w-4" />
            </button>
          </form>
        </div>
      ) : null}

      <button
        onClick={() => setOpen((o) => !o)}
        aria-label={t.open}
        aria-expanded={open}
        className="fixed bottom-5 right-5 z-50 grid h-14 w-14 place-items-center rounded-full border-2 border-fg bg-bg text-fg shadow-[5px_5px_0_0_rgb(var(--fg))] transition hover:-translate-y-0.5"
      >
        {open ? <X className="h-6 w-6" /> : <MessageCircle className="h-6 w-6" />}
      </button>
    </>
  );
}
