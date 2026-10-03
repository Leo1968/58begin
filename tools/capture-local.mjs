// Local visual-evidence capture for the visual redesign (P0 baseline + per-stage screenshots).
// Usage: node tools/capture-local.mjs <baseUrl> <outDir> <tag>
// Produces full-page screenshots for the core routes at the three reference viewports,
// plus a horizontal-overflow check per page (Gate 2 data). Never networked to anything else.
import { chromium } from "playwright";
import { mkdirSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";

const [baseUrl, outDir, tag] = process.argv.slice(2);
if (!baseUrl || !outDir || !tag) {
  console.error("usage: node tools/capture-local.mjs <baseUrl> <outDir> <tag>");
  process.exit(1);
}

const VIEWPORTS = [
  { name: "desktop", width: 1440, height: 900 },
  { name: "tablet", width: 768, height: 1024 },
  { name: "mobile", width: 390, height: 844 },
];
const PAGES = [
  { name: "home", path: "/" },
  { name: "posts", path: "/posts" },
  { name: "post-detail", path: "/posts/start-with-positioning" },
  { name: "privacy", path: "/privacy" },
  { name: "not-found", path: "/no-such-page-404-check" },
];

mkdirSync(outDir, { recursive: true });
const report = [];

const browser = await chromium.launch();
for (const vp of VIEWPORTS) {
  const context = await browser.newContext({ viewport: { width: vp.width, height: vp.height } });
  const page = await context.newPage();
  for (const p of PAGES) {
    const url = baseUrl.replace(/\/$/, "") + p.path;
    await page.goto(url, { waitUntil: "networkidle" }).catch(async () => {
      await page.goto(url, { waitUntil: "load" });
    });
    await page.waitForTimeout(600);
    const overflow = await page.evaluate(
      () => document.documentElement.scrollWidth - document.documentElement.clientWidth,
    );
    const file = join(outDir, `${tag}-${p.name}-${vp.name}.png`);
    await page.screenshot({ path: file, fullPage: true });
    report.push({ page: p.path, viewport: vp.name, overflowPx: overflow, screenshot: file });
    console.log(`${p.name} @${vp.name}: overflow=${overflow}px -> ${file}`);
  }
  await context.close();
}
await browser.close();

writeFileSync(join(outDir, `${tag}-overflow-report.json`), JSON.stringify(report, null, 2));
console.log(`report -> ${join(outDir, `${tag}-overflow-report.json`)}`);
