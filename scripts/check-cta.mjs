import { chromium } from 'playwright';
import path from 'node:path';

const BASE = 'http://127.0.0.1:8765';
const OUT = path.resolve(process.cwd(), 'screenshots');

const browser = await chromium.launch();
const context = await browser.newContext({ viewport: { width: 1440, height: 900 } });
const page = await context.newPage();

await page.goto(BASE, { waitUntil: 'networkidle' });
await page.waitForTimeout(1500);

// Get total page height
const totalHeight = await page.evaluate(() => document.body.scrollHeight);
console.log('Total height:', totalHeight);

// Scroll just above the bottom to see FinalCTA + footer top
const scrollY = totalHeight - 1300;
await page.evaluate((y) => window.scrollTo(0, y), scrollY);
await page.waitForTimeout(800);
await page.mouse.move(720, 400, { steps: 10 });
await page.waitForTimeout(800);
await page.screenshot({ path: path.join(OUT, 'check-final-cta.png') });

// Footer view
await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
await page.waitForTimeout(800);
await page.screenshot({ path: path.join(OUT, 'check-footer.png') });

await browser.close();
console.log('Done');
