import { chromium } from 'playwright';
import path from 'node:path';

const BASE = 'http://127.0.0.1:8765';
const OUT = path.resolve(process.cwd(), 'screenshots');

const browser = await chromium.launch();
const context = await browser.newContext({ viewport: { width: 1440, height: 900 } });
const page = await context.newPage();

await page.goto(BASE + '/pages/image-ia/', { waitUntil: 'networkidle' });
await page.waitForTimeout(1500);

// Locate the new comparateur (it has the title "Comparateur visuel")
const sec = page.locator('section:has-text("Comparateur visuel")').first();
await sec.scrollIntoViewIfNeeded();
await page.waitForTimeout(2000); // wait for chart to mount (dynamic import)
await page.screenshot({ path: path.join(OUT, 'graph-1-default.png') });

// Click on more tools - check all (using "Tout cocher")
const allBtn = page.locator('button:has-text("Tout cocher")').first();
await allBtn.click();
await page.waitForTimeout(1500);
await page.screenshot({ path: path.join(OUT, 'graph-2-all-tools.png') });

// Change Y axis to "Support français"
const ySelect = page.locator('select').nth(1);
await ySelect.selectOption('french_support');
await page.waitForTimeout(1500);
await page.screenshot({ path: path.join(OUT, 'graph-3-y-french.png') });

// Change X axis to "Facilité d'utilisation"
const xSelect = page.locator('select').first();
await xSelect.selectOption('ease_of_use');
await page.waitForTimeout(1500);
await page.screenshot({ path: path.join(OUT, 'graph-4-x-ease-y-french.png') });

// Hover on a point to show tooltip — just place mouse roughly in the chart center
await page.mouse.move(720, 1300, { steps: 14 });
await page.waitForTimeout(800);
await page.screenshot({ path: path.join(OUT, 'graph-5-hover.png') });

// Check on chatbot category
await page.goto(BASE + '/pages/chatbot-ia/', { waitUntil: 'networkidle' });
await page.waitForTimeout(1200);
await page.locator('section:has-text("Comparateur visuel")').first().scrollIntoViewIfNeeded();
await page.waitForTimeout(2000);
await page.screenshot({ path: path.join(OUT, 'graph-6-chatbot.png') });

await browser.close();
console.log('Done');
