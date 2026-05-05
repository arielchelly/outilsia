import { chromium } from 'playwright';
import fs from 'node:fs';
import path from 'node:path';

const BASE = process.env.BASE_URL || 'http://127.0.0.1:8765';
const OUT = path.resolve(process.cwd(), 'screenshots');
fs.mkdirSync(OUT, { recursive: true });

const VIEWPORT_W = 1440;
const VIEWPORT_H = 900;

const browser = await chromium.launch();
const context = await browser.newContext({
  viewport: { width: VIEWPORT_W, height: VIEWPORT_H },
  deviceScaleFactor: 1,
});
const page = await context.newPage();

async function captureAt(url, name, scrollY = 0, mouseX = 720, mouseY = 450) {
  const fullUrl = BASE + url;
  console.log(`→ ${name} (scroll=${scrollY}, mouse=${mouseX},${mouseY})`);
  await page.goto(fullUrl, { waitUntil: 'networkidle', timeout: 20000 }).catch(() => {});
  await page.waitForTimeout(1200);
  if (scrollY) {
    await page.evaluate((y) => window.scrollTo(0, y), scrollY);
    await page.waitForTimeout(400);
  }
  // Move mouse first to a corner (reset glow), then to target
  await page.mouse.move(50, 50, { steps: 4 });
  await page.waitForTimeout(150);
  await page.mouse.move(mouseX, mouseY, { steps: 14 });
  await page.waitForTimeout(900);
  await page.screenshot({ path: path.join(OUT, name + '.png') });
}

// ── Targets specifically check the constellation rectangle issue ──
// Mouse OVER the constellation area (right side of hero)
await captureAt('/', 'home-1-hero-mouse-on-constellation', 0, 1100, 350);
await captureAt('/', 'home-1b-hero-mouse-left-of-constellation', 0, 850, 350);
await captureAt('/', 'home-1c-hero-mouse-on-text', 0, 350, 350);

// All scrolls with mouse in middle of viewport
await captureAt('/', 'home-2-marquee', 700, 720, 400);
await captureAt('/', 'home-3-categories', 1400, 720, 400);
await captureAt('/', 'home-4-top3', 2700, 720, 400);
await captureAt('/', 'home-5-bento', 3500, 720, 400);
await captureAt('/', 'home-6-articles', 4200, 720, 400);
await captureAt('/', 'home-7-newsletter', 5000, 720, 400);

// Categories
await captureAt('/pages/image-ia/', 'cat-hero', 0, 720, 400);

await browser.close();
console.log('\n✓ Screenshots dans', OUT);
