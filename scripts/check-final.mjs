import { chromium } from 'playwright';
import path from 'node:path';

const BASE = 'http://127.0.0.1:8765';
const OUT = path.resolve(process.cwd(), 'screenshots');

const browser = await chromium.launch();
const context = await browser.newContext({ viewport: { width: 1440, height: 900 } });
const page = await context.newPage();

// Home — categories section with mouse on a card
await page.goto(BASE, { waitUntil: 'networkidle' });
await page.waitForTimeout(1500);

// Scroll to categories section
await page.locator('section#categories').scrollIntoViewIfNeeded();
await page.waitForTimeout(700);

// Hover on the first big "Image IA" card — middle area
await page.mouse.move(400, 600, { steps: 12 });
await page.waitForTimeout(700);
await page.screenshot({ path: path.join(OUT, 'final-1-cards-hover-image.png') });

// Move to a small card (Vidéo IA, top right)
await page.mouse.move(900, 500, { steps: 12 });
await page.waitForTimeout(700);
await page.screenshot({ path: path.join(OUT, 'final-2-cards-hover-video.png') });

// Move to bottom small card
await page.mouse.move(700, 800, { steps: 12 });
await page.waitForTimeout(700);
await page.screenshot({ path: path.join(OUT, 'final-3-cards-hover-bottom.png') });

// Category page — show the radar
await page.goto(BASE + '/pages/image-ia/', { waitUntil: 'networkidle' });
await page.waitForTimeout(1500);
await page.locator('section:has(svg[role="img"][aria-label*="radar"])').scrollIntoViewIfNeeded();
await page.waitForTimeout(800);
await page.screenshot({ path: path.join(OUT, 'final-4-radar-image-ia.png') });

// Different category radar
await page.goto(BASE + '/pages/code-ia/', { waitUntil: 'networkidle' });
await page.waitForTimeout(1500);
await page.locator('section:has(svg[role="img"][aria-label*="radar"])').scrollIntoViewIfNeeded();
await page.waitForTimeout(800);
await page.screenshot({ path: path.join(OUT, 'final-5-radar-code-ia.png') });

await browser.close();
console.log('Done');
