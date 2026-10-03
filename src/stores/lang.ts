import { create } from "zustand";
import type { Lang } from "@/content/types";

type LangState = {
  lang: Lang;
  setLang: (lang: Lang) => void;
  toggleLang: () => void;
};

function detectDefaultLang(): Lang {
  const fromStorage = localStorage.getItem("lang");
  if (fromStorage === "zh" || fromStorage === "en") return fromStorage;

  const fromEnv = import.meta.env.VITE_SITE_LANG_DEFAULT;
  if (fromEnv === "zh" || fromEnv === "en") return fromEnv;

  const browser = navigator.language.toLowerCase();
  if (browser.startsWith("zh")) return "zh";
  return "en";
}

export const useLangStore = create<LangState>((set, get) => ({
  lang: detectDefaultLang(),
  setLang: (lang) => {
    localStorage.setItem("lang", lang);
    syncDocumentLang(lang);
    set({ lang });
  },
  toggleLang: () => {
    const next = get().lang === "zh" ? "en" : "zh";
    localStorage.setItem("lang", next);
    syncDocumentLang(next);
    set({ lang: next });
  }
}));

// Keep <html lang> in step with the UI language (a11y requirement; UI side effect only —
// the store's data contract is unchanged).
function syncDocumentLang(lang: Lang) {
  document.documentElement.lang = lang;
}

syncDocumentLang(useLangStore.getState().lang);

