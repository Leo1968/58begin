// P6 QA matrix runner: 7 viewports x 2 languages x 5 routes.
// Collects: horizontal overflow, screenshots, a11y checks (lang sync,
// aria-expanded + Escape, keyboard tab order), and CWV (LCP/CLS).
// Usage: node tools/qa-matrix.mjs <baseUrl> <outDir>
import { chromium } from "playwright";
import { mkdirSync, writeFileSync } from "node:fs";
import { join } from "node:path";

const [baseUrl, outDir] = process.argv.slice(2);
if (!baseUrl || !outDir) {
  console.error("usage: node tools/qa-matrix.mjs <baseUrl> <outDir>");
  process.exit(1);
}
mkdirSync(outDir, { recursive: true });

const VIEWPORTS = [
  { name: "1440x900", width: 1440, height: 900 },
  { name: "1280x800", width: 1280, height: 800 },
  { name: "1024x768", width: 1024, height: 768 },
  { name: "768x1024", width: 768, height: 1024 },
  { name: "430x932", width: 430, height: 932 },
  { name: "390x844", width: 390, height: 844 },
  { name: "375x812", width: 375, height: 812 },
];
const ROUTES = [
  { name: "home", path: "/" },
  { name: "posts", path: "/posts" },
  { name: "post-detail", path: "/posts/start-with-positioning" },
  { name: "privacy", path: "/privacy" },
  { name: "not-found", path: "/no-such-page-404-check" },
];
const LANGS = ["zh", "en"];

const report = { matrix: [], a11y: {}, cwv: {}, generatedAt: new Date().toISOString() };

const browser = await chromium.launch();

// --- overflow + screenshot matrix ---
for (const vp of VIEWPORTS) {
  for (const lang of LANGS) {
    const context = await browser.newContext({
      viewport: { width: vp.width, height: vp.height },
      reducedMotion: "reduce", // matrix walks static states; motion verified separately
    });
    await context.addInitScript((l) => localStorage.setItem("lang", l), lang);
    const page = await context.newPage();
    for (const route of ROUTES) {
      await page.goto(baseUrl.replace(/\/$/, "") + route.path, { waitUntil: "networkidle" }).catch(() => {});
      await page.waitForTimeout(300);
      const overflow = await page.evaluate(
        () => document.documentElement.scrollWidth - document.documentElement.clientWidth
      );
      const shot = join(outDir, `m-${route.name}-${lang}-${vp.name}.png`);
      await page.screenshot({ path: shot, fullPage: true });
      report.matrix.push({ viewport: vp.name, lang, route: route.name, overflowPx: overflow });
    }
    await context.close();
  }
}
const overflows = report.matrix.filter((m) => m.overflowPx > 0);
console.log(`matrix: ${report.matrix.length} cells, overflow>0: ${overflows.length}`);
if (overflows.length) console.log(overflows);

// --- a11y checks (desktop zh + mobile zh) ---
{
  const context = await browser.newContext({ viewport: { width: 1440, height: 900 } });
  await context.addInitScript(() => localStorage.setItem("lang", "zh"));
  const page = await context.newPage();
  await page.goto(baseUrl + "/", { waitUntil: "networkidle" });

  // modal Escape (QR dialog) — page is zh at load
  await page.getByRole("button", { name: "查看二维码区域" }).click();
  const modalOpen = await page.locator('[role="dialog"]').isVisible();
  await page.keyboard.press("Escape");
  await page.waitForTimeout(200);
  const modalAfterEscape = await page.locator('[role="dialog"]').count();

  // <html lang> follows UI language
  await page.getByRole("button", { name: /^(EN|中)$/ }).first().click();
  const langAfterToggle = await page.evaluate(() => document.documentElement.lang);
  await page.getByRole("button", { name: /^(EN|中)$/ }).first().click();
  const langBack = await page.evaluate(() => document.documentElement.lang);

  // keyboard tab order: first tab stop in the header
  await page.keyboard.press("Tab");
  const firstStop = await page.evaluate(
    () => document.activeElement?.getAttribute("href") ?? document.activeElement?.tagName
  );

  // focus visible on interactive element
  const focusOutline = await page.evaluate(() => {
    const btn = document.querySelector("header button, div.sticky button");
    if (!btn) return "none-found";
    btn.focus();
    return getComputedStyle(btn).outlineStyle !== "none" ? "custom-or-ua" : "relies-on-focus-visible";
  });

  report.a11y = {
    htmlLangAfterToggleToEn: langAfterToggle,
    htmlLangAfterToggleBack: langBack,
    firstTabStop: firstStop,
    qrModalOpens: modalOpen,
    qrModalClosedByEscape: modalAfterEscape === 0,
    focusOutlineProbe: focusOutline,
  };
  await context.close();
}
{
  // mobile menu: aria-expanded + Escape close
  const context = await browser.newContext({ viewport: { width: 390, height: 844 } });
  await context.addInitScript(() => localStorage.setItem("lang", "zh"));
  const page = await context.newPage();
  await page.goto(baseUrl + "/", { waitUntil: "networkidle" });
  const menuBtn = page.getByRole("button", { name: "Menu" });
  await menuBtn.click();
  const expanded = await menuBtn.getAttribute("aria-expanded");
  await page.keyboard.press("Escape");
  await page.waitForTimeout(200);
  const expandedAfterEscape = await menuBtn.getAttribute("aria-expanded");
  report.a11y.mobileMenuAriaExpandedWhenOpen = expanded;
  report.a11y.mobileMenuClosedByEscape = expandedAfterEscape === "false";
  await context.close();
}

// --- CWV: LCP + CLS (desktop zh, home) ---
async function measureCwv(contextOptions) {
  const context = await browser.newContext({
    viewport: { width: 1440, height: 900 },
    ...contextOptions,
  });
  await context.addInitScript(() => localStorage.setItem("lang", "zh"));
  const page = await context.newPage();
  await page.addInitScript(() => {
    window.__lcp = 0;
    window.__cls = 0;
    new PerformanceObserver((l) => {
      const es = l.getEntries();
      if (es.length) window.__lcp = es[es.length - 1].startTime;
    }).observe({ type: "largest-contentful-paint", buffered: true });
    new PerformanceObserver((l) => {
      for (const e of l.getEntries()) if (!e.hadRecentInput) window.__cls += e.value;
    }).observe({ type: "layout-shift", buffered: true });
  });
  await page.goto(baseUrl + "/", { waitUntil: "load" });
  await page.waitForTimeout(2500);
  const cwv = await page.evaluate(() => ({ lcp: window.__lcp, cls: window.__cls }));
  await context.close();
  return cwv;
}
report.cwv.regular = await measureCwv({});

// Fast 3G via CDP (chromium)
{
  const context = await browser.newContext({ viewport: { width: 1440, height: 900 } });
  await context.addInitScript(() => localStorage.setItem("lang", "zh"));
  const page = await context.newPage();
  const cdp = await context.newCDPSession(page);
  await cdp.send("Network.enable");
  await cdp.send("Network.emulateNetworkConditions", {
    offline: false,
    latency: 150,
    downloadThroughput: (1.6 * 1024 * 1024) / 8,
    uploadThroughput: (750 * 1024) / 8,
  });
  await page.addInitScript(() => {
    window.__cls3g = 0;
    new PerformanceObserver((l) => {
      for (const e of l.getEntries()) if (!e.hadRecentInput) window.__cls3g += e.value;
    }).observe({ type: "layout-shift", buffered: true });
  });
  await page.goto(baseUrl + "/", { waitUntil: "load" });
  await page.waitForTimeout(3000);
  report.cwv.fast3g = { cls: await page.evaluate(() => window.__cls3g) };
  await context.close();
}

await browser.close();
writeFileSync(join(outDir, "qa-report.json"), JSON.stringify(report, null, 2));
console.log("a11y:", JSON.stringify(report.a11y));
console.log("cwv:", JSON.stringify(report.cwv));
console.log(`report -> ${join(outDir, "qa-report.json")}`);
