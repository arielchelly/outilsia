import { chromium } from 'playwright';
import path from 'node:path';

const BASE = 'http://127.0.0.1:8765';
const OUT = path.resolve(process.cwd(), 'screenshots');

const browser = await chromium.launch();
const context = await browser.newContext({ viewport: { width: 1440, height: 900 } });
const page = await context.newPage();

await page.goto(BASE + '/pages/image-ia/', { waitUntil: 'networkidle' });
await page.waitForTimeout(1500);

const sec = page.locator('section:has-text("Forces et")').first();
await sec.scrollIntoViewIfNeeded();
await page.waitForTimeout(800);
await page.screenshot({ path: path.join(OUT, 'v4-1-default-top5.png') });

// Click "Tous" to add all tools
const allBtn = page.locator('button:has-text("Tous")').first();
await allBtn.click();
await page.waitForTimeout(1500); // wait for animations
await page.screenshot({ path: path.join(OUT, 'v4-2-all-selected.png') });

// Now switch to FRANÇAIS criterion
const frBtn = page.locator('button:has-text("FRANÇAIS")').first();
await frBtn.click();
await page.waitForTimeout(1500);
await page.screenshot({ path: path.join(OUT, 'v4-3-french-all.png') });

// Click "Aucun"
const noneBtn = page.locator('button:has-text("Aucun")').first();
await noneBtn.click();
await page.waitForTimeout(800);
await page.screenshot({ path: path.join(OUT, 'v4-4-empty-state.png') });

// Click 3 specific tool chips: Midjourney, DALL-E, Stable Diffusion
const midjourneyChip = page.locator('button:has-text("Midjourney")').last();
const dalleChip = page.locator('button:has-text("DALL-E 3")').last();
const stableChip = page.locator('button:has-text("Stable Diffusion")').last();
await midjourneyChip.click();
await page.waitForTimeout(400);
await dalleChip.click();
await page.waitForTimeout(400);
await stableChip.click();
await page.waitForTimeout(1200);
await page.screenshot({ path: path.join(OUT, 'v4-5-three-selected.png') });

// Different category to verify it works everywhere
await page.goto(BASE + '/pages/code-ia/', { waitUntil: 'networkidle' });
await page.waitForTimeout(1200);
await page.locator('section:has-text("Forces et")').first().scrollIntoViewIfNeeded();
await page.waitForTimeout(800);
await page.screenshot({ path: path.join(OUT, 'v4-6-code-ia.png') });

await browser.close();
console.log('Done');
