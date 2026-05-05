import { chromium } from 'playwright';
import path from 'node:path';

const BASE = 'http://127.0.0.1:8765';
const OUT = path.resolve(process.cwd(), 'screenshots');

const browser = await chromium.launch();
const context = await browser.newContext({ viewport: { width: 1440, height: 900 } });
const page = await context.newPage();

await page.goto(BASE + '/', { waitUntil: 'networkidle' });
await page.waitForTimeout(800);

// 1. Move over an empty area (paragraph text) → should show OPEN HAND
await page.mouse.move(720, 600, { steps: 10 });
await page.waitForTimeout(400);
const cursorSrc1 = await page.evaluate(() => {
  const img = document.querySelector('img[aria-hidden="true"][src*="cursors/"]');
  return img ? img.getAttribute('src') : null;
});
await page.screenshot({ path: path.join(OUT, 'cursor-state-1-open.png') });
console.log('After hover non-clickable:', cursorSrc1);

// 2. Move over the "Voir les comparatifs" CTA → should show POINT HAND
const cta = await page.locator('a:has-text("Voir les comparatifs")').first();
const box = await cta.boundingBox();
if (box) {
  await page.mouse.move(box.x + box.width / 2, box.y + box.height / 2, { steps: 10 });
  await page.waitForTimeout(400);
}
const cursorSrc2 = await page.evaluate(() => {
  const img = document.querySelector('img[aria-hidden="true"][src*="cursors/"]');
  return img ? img.getAttribute('src') : null;
});
await page.screenshot({ path: path.join(OUT, 'cursor-state-2-point.png') });
console.log('After hover CTA link:', cursorSrc2);

// 3. Click the CTA — verify pointer-events:none on the cursor doesn't block clicks
await page.mouse.click(box.x + box.width / 2, box.y + box.height / 2);
await page.waitForTimeout(800);
const url = page.url();
console.log('After click, url:', url);

await browser.close();
console.log('Done.');
