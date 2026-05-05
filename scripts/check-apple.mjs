import { chromium } from 'playwright';
import path from 'node:path';

const BASE = 'http://127.0.0.1:8765';
const OUT = path.resolve(process.cwd(), 'screenshots');

const browser = await chromium.launch();
const context = await browser.newContext({ viewport: { width: 1440, height: 900 } });
const page = await context.newPage();

async function shoot(name, url, scrollTo = 0) {
  await page.goto(BASE + url, { waitUntil: 'networkidle' });
  await page.waitForTimeout(900);
  if (scrollTo) {
    await page.evaluate((y) => window.scrollTo(0, y), scrollTo);
    await page.waitForTimeout(500);
  }
  // Move the mouse so the custom cursor renders in the screenshots
  await page.mouse.move(720, 450, { steps: 8 });
  await page.waitForTimeout(300);
  await page.screenshot({ path: path.join(OUT, `apple-${name}.png`), fullPage: false });
}

await shoot('1-home-hero', '/');
await shoot('2-home-categories', '/', 800);
await shoot('3-home-top3', '/', 1800);
await shoot('4-image-cat', '/pages/image-ia/');
await shoot('5-image-graph', '/pages/image-ia/', 2700);
await shoot('6-image-card', '/pages/image-ia/', 4200);

// Cursor hover state — hover the first CTA on the homepage
await page.goto(BASE + '/', { waitUntil: 'networkidle' });
await page.waitForTimeout(900);
const cta = await page.locator('a:has-text("Voir les comparatifs")').first();
const box = await cta.boundingBox();
if (box) {
  await page.mouse.move(box.x + box.width / 2, box.y + box.height / 2, { steps: 12 });
  await page.waitForTimeout(450);
  await page.screenshot({ path: path.join(OUT, 'apple-7-cursor-hover.png'), fullPage: false });
}

await browser.close();
console.log('Done — screenshots written.');
