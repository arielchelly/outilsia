import { chromium } from 'playwright';
import path from 'node:path';

const BASE = 'http://127.0.0.1:8765';
const OUT = path.resolve(process.cwd(), 'screenshots');

const browser = await chromium.launch();
const context = await browser.newContext({ viewport: { width: 720, height: 360 } });
const page = await context.newPage();

await page.goto(BASE + '/cursor-preview.html', { waitUntil: 'networkidle' });
await page.waitForTimeout(400);
await page.screenshot({ path: path.join(OUT, 'cursor-preview.png') });

await browser.close();
console.log('Done.');
