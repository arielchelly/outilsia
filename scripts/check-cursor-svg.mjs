import { chromium } from 'playwright';
import path from 'node:path';

const browser = await chromium.launch();
const context = await browser.newContext({ viewport: { width: 800, height: 320 } });
const page = await context.newPage();
await page.goto('http://127.0.0.1:8766/cursor-preview.html', { waitUntil: 'networkidle' });
await page.waitForTimeout(400);
await page.screenshot({ path: path.resolve(process.cwd(), 'screenshots', 'cursor-svg-preview.png') });
await browser.close();
console.log('Done.');
