import { mkdir, readFile } from "node:fs/promises";
import path from "node:path";
import { chromium } from "@playwright/test";
import {
  SPLASH_BACKGROUND,
  SPLASH_DEVICES,
  splashFileName,
  type ColorScheme,
} from "../lib/splashScreens.ts";

const ROOT = path.resolve(import.meta.dirname, "..");
const OUT_DIR = path.join(ROOT, "public/splash");
const ICON_SIZE = 120;
const ICON_RADIUS = 27;

const icon = await readFile(path.join(ROOT, "public/work-calendar-icon.png"));
const iconSrc = `data:image/png;base64,${icon.toString("base64")}`;

const html = (scheme: ColorScheme) => `<!doctype html>
<html><body style="margin:0;height:100vh;display:grid;place-items:center;background:${SPLASH_BACKGROUND[scheme]}">
<img src="${iconSrc}" width="${ICON_SIZE}" height="${ICON_SIZE}" style="border-radius:${ICON_RADIUS}px">
</body></html>`;

await mkdir(OUT_DIR, { recursive: true });

const browser = await chromium
  .launch()
  .catch(() => chromium.launch({ channel: "chrome" }));

for (const device of SPLASH_DEVICES) {
  const context = await browser.newContext({
    viewport: { width: device.width, height: device.height },
    deviceScaleFactor: device.ratio,
  });
  const page = await context.newPage();
  for (const scheme of ["light", "dark"] as const) {
    await page.setContent(html(scheme));
    const file = path.join(OUT_DIR, splashFileName(device, scheme));
    await page.screenshot({ path: file });
    console.log(path.relative(ROOT, file));
  }
  await context.close();
}

await browser.close();
