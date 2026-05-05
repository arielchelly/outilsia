import { chromium } from 'playwright';
import path from 'node:path';

const BASE = 'http://127.0.0.1:8765';
const OUT = path.resolve(process.cwd(), 'screenshots');

const browser = await chromium.launch();
const context = await browser.newContext({ viewport: { width: 1440, height: 900 } });
const page = await context.newPage();

async function shoot(name, url, scrollTo = 0) {
  await page.goto(BASE + url, { waitUntil: 'networkidle' });
  await page.waitForTimeout(900);
  if (scrollTo) {
    await page.evaluate((y) => window.scrollTo(0, y), scrollTo);
    await page.waitForTimeout(500);
  }
  await page.screenshot({ path: path.join(OUT, `redesign-${name}.png`), fullPage: false });
}

async function fullshoot(name, url) {
  await page.goto(BASE + url, { waitUntil: 'networkidle' });
  await page.waitForTimeout(1500);
  await page.screenshot({ path: path.join(OUT, `redesign-${name}.png`), fullPage: true });
}

await shoot('1-home-hero', '/');
await shoot('2-home-categories', '/', 800);
await shoot('3-home-top3', '/', 1800);
await shoot('4-home-bento', '/', 2700);
await shoot('5-image-cat', '/pages/image-ia/');
await shoot('6-image-table', '/pages/image-ia/', 1600);
await shoot('7-image-graph', '/pages/image-ia/', 2700);
await shoot('8-image-cards', '/pages/image-ia/', 4000);
await shoot('9-blog-index', '/blog/');
await fullshoot('10-about-full', '/about/');

await browser.close();
console.log('Done — screenshots written.');
