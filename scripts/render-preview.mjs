import { createRequire } from "node:module";
const require = createRequire(
  "C:/Users/ASUS/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/.pnpm/playwright@1.61.1/node_modules/playwright/",
);
const { chromium } = require("playwright");

const browser = await chromium.launch({ headless: true });
const page = await browser.newPage({
  viewport: { width: 1440, height: 1200 },
  deviceScaleFactor: 1,
});

await page.goto("file:///D:/CodexProjects/%E7%BD%91%E7%AB%991.0/preview.html", {
  waitUntil: "load",
});
await page.screenshot({
  path: "D:/CodexProjects/网站1.0/preview-home.png",
  fullPage: false,
});

await browser.close();
