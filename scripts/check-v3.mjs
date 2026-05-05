import { chromium } from 'playwright';
import path from 'node:path';

const BASE = 'http://127.0.0.1:8765';
const OUT = path.resolve(process.cwd(), 'screenshots');

const browser = await chromium.launch();
const context = await browser.newContext({ viewport: { width: 1440, height: 900 } });
const page = await context.newPage();

// Home — categories with TiltCard
await page.goto(BASE, { waitUntil: 'networkidle' });
await page.waitForTimeout(1500);
await page.locator('section#categories').scrollIntoViewIfNeeded();
await page.waitForTimeout(700);

// Hover bottom-right of feature card "Image IA" to trigger tilt
await page.mouse.move(550, 700, { steps: 14 });
await page.waitForTimeout(700);
await page.screenshot({ path: path.join(OUT, 'v3-1-tilt-card-hover.png') });

// Move to a small card "Chatbot IA" (right column, middle)
await page.mouse.move(1200, 870, { steps: 14 });
await page.waitForTimeout(700);
await page.screenshot({ path: path.join(OUT, 'v3-2-tilt-small-card.png') });

// Category page — comparison bars
await page.goto(BASE + '/pages/image-ia/', { waitUntil: 'networkidle' });
await page.waitForTimeout(1500);
const sec = page.locator('section:has-text("Forces et")').first();
await sec.scrollIntoViewIfNeeded();
await page.waitForTimeout(700);
await page.screenshot({ path: path.join(OUT, 'v3-3-bars-default.png') });

// Click on "QUALITÉ" filter pill
const qualityBtn = page.locator('button:has-text("QUALITÉ")').first();
if (await qualityBtn.count() > 0) {
  await qualityBtn.click();
  await page.waitForTimeout(800);
  await page.screenshot({ path: path.join(OUT, 'v3-4-bars-quality.png') });
}

// Click on "FRANÇAIS" filter
const frBtn = page.locator('button:has-text("FRANÇAIS")').first();
if (await frBtn.count() > 0) {
  await frBtn.click();
  await page.waitForTimeout(800);
  await page.screenshot({ path: path.join(OUT, 'v3-5-bars-french.png') });
}

// Different category
await page.goto(BASE + '/pages/chatbot-ia/', { waitUntil: 'networkidle' });
await page.waitForTimeout(1200);
await page.locator('section:has-text("Forces et")').first().scrollIntoViewIfNeeded();
await page.waitForTimeout(700);
await page.screenshot({ path: path.join(OUT, 'v3-6-bars-chatbot.png') });

await browser.close();
console.log('Done');
