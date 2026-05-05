import { chromium } from 'playwright';
import path from 'node:path';

const BASE = process.env.BASE_URL || 'http://127.0.0.1:8765';
const OUT = path.resolve(process.cwd(), 'screenshots');

const browser = await chromium.launch();
const context = await browser.newContext({
  viewport: { width: 1440, height: 900 },
  deviceScaleFactor: 1.5,
});
const page = await context.newPage();

await page.goto(BASE, { waitUntil: 'networkidle' });
await page.waitForTimeout(1500);

// Move mouse smoothly across the constellation area at different positions
async function snap(name, mx, my) {
  await page.mouse.move(50, 50, { steps: 4 });
  await page.waitForTimeout(150);
  await page.mouse.move(mx, my, { steps: 14 });
  await page.waitForTimeout(900);
  await page.screenshot({
    path: path.join(OUT, name),
    clip: { x: 700, y: 100, width: 720, height: 700 },
  });
}

await snap('check-1-mouse-on-constellation-center.png', 1100, 450);
await snap('check-2-mouse-just-outside-left.png', 760, 450);
await snap('check-3-mouse-just-outside-bottom.png', 1100, 800);
await snap('check-4-no-mouse-baseline.png', 5, 5);

await browser.close();
console.log('Screenshots OK');
