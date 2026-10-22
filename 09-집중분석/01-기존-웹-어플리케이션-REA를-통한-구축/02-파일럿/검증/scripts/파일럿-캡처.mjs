// 파일럿 화면(localhost) Playwright 캡처 — 원본 관찰과 동일한 1280x720·ko-KR·Asia/Seoul·light 조건
// 관찰 안전 원칙: 파일럿은 입력·제출 없음(클릭 내비게이션만), 원본 VAATZ에는 접속하지 않는다.
import { chromium } from '@playwright/test';
import fs from 'node:fs';
import path from 'node:path';

const outDir = process.argv[2];
fs.mkdirSync(outDir, { recursive: true });

const browser = await chromium.launch({ headless: true });
const context = await browser.newContext({
  viewport: { width: 1280, height: 720 },
  deviceScaleFactor: 1,
  locale: 'ko-KR',
  timezoneId: 'Asia/Seoul',
  colorScheme: 'light',
  reducedMotion: 'reduce',
});
const page = await context.newPage();
const log = [];

async function snap(label) {
  const ax = await page.locator('body').ariaSnapshot();
  fs.writeFileSync(path.join(outDir, `파일럿-${label}-접근성트리.txt`), ax);
  await page.screenshot({ path: path.join(outDir, `파일럿-${label}.png`) });
  log.push({ label, url: page.url() });
}

await page.goto('http://localhost:5173/', { waitUntil: 'load' });
await page.waitForTimeout(600);
await snap('main');

await page.getByRole('button', { name: '로그인' }).click();
await page.waitForURL('**/login');
await page.waitForTimeout(600);
await snap('login');

// 오류 상태(입력 없이 제출만) — 파일럿 자체 데모이므로 제출 허용 범위: 입력 없음, submit 이벤트만
await page.getByRole('button', { name: '로그인' }).click();
await page.waitForTimeout(300);
await snap('login-inline-error');

fs.writeFileSync(path.join(outDir, '파일럿-캡처-로그.json'), JSON.stringify(log, null, 2));
await browser.close();
console.log(JSON.stringify(log));
