import { chromium } from 'playwright';
import path from 'node:path';

const BASE = 'http://127.0.0.1:8765';
const OUT = path.resolve(process.cwd(), 'screenshots');

const browser = await chromium.launch();
const context = await browser.newContext({ viewport: { width: 1440, height: 900 } });
const page = await context.newPage();

await page.goto(BASE + '/pages/image-ia/', { waitUntil: 'networkidle' });
await page.waitForTimeout(1500);

const sec = page.locator('section:has-text("Comparateur visuel")').first();
await sec.scrollIntoViewIfNeeded();
await page.waitForTimeout(2500); // wait for chart to mount and animation
await page.screenshot({ path: path.join(OUT, 'lines-1-default.png') });

// Check all
await page.locator('button:has-text("Tout cocher")').first().click();
await page.waitForTimeout(2000);
await page.screenshot({ path: path.join(OUT, 'lines-2-all.png') });

// Decheck a few — toggle Stable Diffusion off and Adobe Firefly off
await page.locator('button:has(span:text("Stable Diffusion"))').first().click();
await page.waitForTimeout(400);
await page.locator('button:has(span:text("Adobe Firefly"))').first().click();
await page.waitForTimeout(1500);
await page.screenshot({ path: path.join(OUT, 'lines-3-some-off.png') });

// Different category — chatbot
await page.goto(BASE + '/pages/chatbot-ia/', { waitUntil: 'networkidle' });
await page.waitForTimeout(1500);
await page.locator('section:has-text("Comparateur visuel")').first().scrollIntoViewIfNeeded();
await page.waitForTimeout(2500);
await page.screenshot({ path: path.join(OUT, 'lines-4-chatbot.png') });

// Code-ia
await page.goto(BASE + '/pages/code-ia/', { waitUntil: 'networkidle' });
await page.waitForTimeout(1500);
await page.locator('section:has-text("Comparateur visuel")').first().scrollIntoViewIfNeeded();
await page.waitForTimeout(2500);
await page.screenshot({ path: path.join(OUT, 'lines-5-code.png') });

await browser.close();
console.log('Done');
