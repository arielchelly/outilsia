import { chromium } from 'playwright';
import path from 'node:path';

const BASE = 'http://127.0.0.1:8765';
const OUT = path.resolve(process.cwd(), 'screenshots');

const browser = await chromium.launch();
const context = await browser.newContext({ viewport: { width: 1440, height: 900 } });
const page = await context.newPage();

await page.goto(BASE + '/pages/image-ia/', { waitUntil: 'networkidle' });
await page.waitForTimeout(1500);

// Locate the chart section by its eyebrow "Visualisation"
const chartSection = page.locator('section:has(svg[role="img"][aria-label*="radar"])');
await chartSection.scrollIntoViewIfNeeded();
await page.waitForTimeout(800);

// Compute its bounding box and position viewport on it
const box = await chartSection.boundingBox();
if (box) {
  await page.evaluate((y) => window.scrollBy(0, -120), box.y); // a bit of padding above
  await page.waitForTimeout(400);
}

await page.screenshot({ path: path.join(OUT, 'chart-1-default.png') });

// Now hover the second legend button to test the highlight effect
const legendButtons = await page.locator('.bg-white\\/\\[0\\.015\\] button').all();
console.log('legend buttons:', legendButtons.length);
if (legendButtons.length >= 2) {
  await legendButtons[1].hover();
  await page.waitForTimeout(600);
  await page.screenshot({ path: path.join(OUT, 'chart-2-hover.png') });
}

// Check on a different category page too
await page.goto(BASE + '/pages/chatbot-ia/', { waitUntil: 'networkidle' });
await page.waitForTimeout(1200);
await page.locator('section:has(svg[role="img"][aria-label*="radar"])').scrollIntoViewIfNeeded();
await page.waitForTimeout(700);
await page.screenshot({ path: path.join(OUT, 'chart-3-chatbot.png') });

await browser.close();
console.log('Done');
