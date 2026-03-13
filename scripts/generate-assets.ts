/**
 * 껄무새 앱인토스 콘솔 등록용 리소스 자동 생성
 *
 * 생성 리소스:
 *   1. 앱 로고 (600x600)
 *   2. 정방형 썸네일 (1000x1000)
 *   3. 가로형 썸네일 (1932x828)
 *   4. OG 이미지 (1200x600)
 *   5. 스크린샷 세로형 (636x1048) x 5장
 *   6. 콘솔 입력용 텍스트 (console-info.md)
 *
 * 사용법: yarn assets
 */

import { chromium, Browser } from '@playwright/test';
import { writeFileSync, mkdirSync, existsSync } from 'fs';
import { resolve } from 'path';
import { spawn, ChildProcess } from 'child_process';

const PROJECT_ROOT = resolve(import.meta.dirname, '..');
const ASSETS_DIR = resolve(PROJECT_ROOT, 'docs', 'console-assets');
const DEV_PORT = 3000;
const DEV_URL = `http://localhost:${DEV_PORT}`;

function ensureDir() {
  if (!existsSync(ASSETS_DIR)) mkdirSync(ASSETS_DIR, { recursive: true });
}

// ─── Playwright HTML → PNG ───

async function renderHtmlToImage(
  browser: Browser, html: string, width: number, height: number, outputPath: string
) {
  const page = await browser.newPage({ viewport: { width, height }, deviceScaleFactor: 1 });
  await page.setContent(html, { waitUntil: 'networkidle' });
  await page.waitForTimeout(500);
  await page.screenshot({ path: outputPath, fullPage: false });
  await page.close();
}

const BASE_CSS = `
  @import url('https://cdn.jsdelivr.net/gh/orioncactus/pretendard@v1.3.9/dist/web/variable/pretendardvariable-dynamic-subset.min.css');
  * { margin: 0; padding: 0; box-sizing: border-box; }
  body { font-family: 'Pretendard Variable', Pretendard, -apple-system, sans-serif; overflow: hidden; }
`;

// ─── 1. 앱 로고 (600x600) ───

function logoHtml(): string {
  return `<!DOCTYPE html><html><head><style>
    ${BASE_CSS}
    body {
      width: 600px; height: 600px;
      background: linear-gradient(135deg, #0F4C3A 0%, #0F172A 50%, #1A1A4E 100%);
      display: flex; flex-direction: column; align-items: center; justify-content: center;
      position: relative;
    }
    .orb1 { position: absolute; top: -10%; right: -10%; width: 300px; height: 300px;
      background: radial-gradient(circle, rgba(85,197,149,0.15) 0%, transparent 70%); border-radius: 50%; }
    .orb2 { position: absolute; bottom: 5%; left: -5%; width: 250px; height: 250px;
      background: radial-gradient(circle, rgba(49,130,246,0.12) 0%, transparent 70%); border-radius: 50%; }
    .parrot { font-size: 180px; margin-bottom: -10px; position: relative; z-index: 1;
      filter: drop-shadow(0 8px 24px rgba(0,0,0,0.3)); }
    .title { font-size: 72px; font-weight: 900; color: #fff; position: relative; z-index: 1;
      text-shadow: 0 4px 20px rgba(0,0,0,0.3); }
    .sub { font-size: 26px; color: #A0EFCF; margin-top: 8px; position: relative; z-index: 1; font-weight: 600; }
  </style></head><body>
    <div class="orb1"></div><div class="orb2"></div>
    <div class="parrot">🦜</div>
    <div class="title">껄무새</div>
    <div class="sub">그때 샀더라면?</div>
  </body></html>`;
}

// ─── 2. 정방형 썸네일 (1000x1000) ───

function squareThumbHtml(): string {
  return `<!DOCTYPE html><html><head><style>
    ${BASE_CSS}
    body {
      width: 1000px; height: 1000px;
      background: linear-gradient(180deg, #0F172A 0%, #1E293B 50%, #0F4C3A 100%);
      display: flex; flex-direction: column; align-items: center; justify-content: center;
      position: relative; color: #fff;
    }
    .orb1 { position: absolute; top: -5%; right: -10%; width: 400px; height: 400px;
      background: radial-gradient(circle, rgba(85,197,149,0.12) 0%, transparent 70%); border-radius: 50%; }
    .orb2 { position: absolute; bottom: 5%; left: -8%; width: 300px; height: 300px;
      background: radial-gradient(circle, rgba(49,130,246,0.1) 0%, transparent 70%); border-radius: 50%; }
    .card {
      background: rgba(255,255,255,0.06); backdrop-filter: blur(12px);
      border: 1px solid rgba(255,255,255,0.1); border-radius: 32px;
      padding: 48px 40px; text-align: center; position: relative; z-index: 1; width: 80%;
    }
    .parrot { font-size: 140px; margin-bottom: 10px; position: relative; z-index: 1;
      filter: drop-shadow(0 8px 24px rgba(0,0,0,0.3)); }
    .title { font-size: 60px; font-weight: 900; margin-bottom: 8px; }
    .sub { font-size: 28px; color: #A0EFCF; margin-bottom: 32px; font-weight: 500; }
    .pct { font-size: 88px; font-weight: 900; color: #FF6B6B; margin-bottom: 8px; }
    .desc { font-size: 24px; color: rgba(255,255,255,0.5); margin-bottom: 32px; }
    .cta {
      display: inline-block; padding: 20px 60px;
      background: linear-gradient(135deg, #A0EFCF, #55C595);
      border-radius: 20px; color: #0F172A; font-size: 26px; font-weight: 800;
      box-shadow: 0 8px 32px rgba(85,197,149,0.3);
    }
  </style></head><body>
    <div class="orb1"></div><div class="orb2"></div>
    <div class="parrot">🦜</div>
    <div class="card">
      <div class="title">껄무새</div>
      <div class="sub">"그때 샀더라면?" 후회를 숫자로 체험해요</div>
      <div class="pct">+340%</div>
      <div class="desc">삼성전자에 100만원 투자했다면...</div>
      <div class="cta">🦜 나도 시간 여행 해보기</div>
    </div>
  </body></html>`;
}

// ─── 3. 가로형 썸네일 (1932x828) ───

function wideThumbHtml(): string {
  const entries = [
    { date: '2020.03', pct: -26.3, price: '42,000', val: '74만', up: false },
    { date: '2020.06', pct: -7, price: '53,000', val: '93만', up: false },
    { date: '2020.09', pct: 3.8, price: '57,000', val: '104만', up: true },
    { date: '2021.01', pct: 58, price: '87,000', val: '158만', up: true },
    { date: '2021.06', pct: 40, price: '80,000', val: '140만', up: true },
    { date: '2022.01', pct: 23, price: '68,000', val: '123만', up: true },
    { date: '2022.06', pct: -5, price: '55,000', val: '95만', up: false },
    { date: '2023.01', pct: 8, price: '60,000', val: '108만', up: true },
  ];

  const tlHtml = entries.map((e, i) => `
    <div style="display:flex;gap:12px;margin-bottom:16px">
      <div style="display:flex;flex-direction:column;align-items:center;width:14px;padding-top:4px">
        <div style="width:10px;height:10px;border-radius:50%;background:${e.up ? '#FF6B6B' : '#6BB5FF'};box-shadow:0 0 6px ${e.up ? 'rgba(255,107,107,0.4)' : 'rgba(107,181,255,0.4)'};flex-shrink:0"></div>
        ${i < entries.length - 1 ? '<div style="flex:1;width:2px;background:rgba(255,255,255,0.08);margin-top:4px"></div>' : ''}
      </div>
      <div style="flex:1">
        <div style="display:flex;justify-content:space-between;margin-bottom:4px">
          <span style="font-size:13px;color:rgba(255,255,255,0.5)">${e.date}</span>
          <span style="font-size:15px;font-weight:800;color:${e.up ? '#FF6B6B' : '#6BB5FF'}">${e.up ? '+' : ''}${e.pct}%</span>
        </div>
        <div style="height:4px;background:rgba(255,255,255,0.06);border-radius:2px;margin-bottom:4px">
          <div style="height:100%;border-radius:2px;width:${Math.min(95, Math.max(5, 50 + e.pct * 0.4))}%;background:${e.up ? 'linear-gradient(90deg,#FF6B6B,#FF4545)' : 'linear-gradient(90deg,#6BB5FF,#3182F6)'}"></div>
        </div>
        <div style="display:flex;justify-content:space-between;font-size:11px;color:rgba(255,255,255,0.35)">
          <span>${e.price}원</span><span style="font-weight:700;color:rgba(255,255,255,0.7)">${e.val}원</span>
        </div>
      </div>
    </div>`).join('');

  return `<!DOCTYPE html><html><head><style>
    ${BASE_CSS}
    body {
      width: 1932px; height: 828px;
      background: linear-gradient(135deg, #0F172A 0%, #1E293B 40%, #0F4C3A 100%);
      display: flex; align-items: center; padding: 0 80px;
      position: relative; color: #fff;
    }
    .orb1 { position: absolute; top: -15%; right: 5%; width: 400px; height: 400px;
      background: radial-gradient(circle, rgba(85,197,149,0.12) 0%, transparent 70%); border-radius: 50%; }
  </style></head><body>
    <div class="orb1"></div>
    <div style="flex:1;position:relative;z-index:1">
      <div style="font-size:80px;margin-bottom:16px;filter:drop-shadow(0 4px 12px rgba(0,0,0,0.3))">🦜</div>
      <div style="font-size:64px;font-weight:900;margin-bottom:8px">껄무새</div>
      <div style="font-size:30px;color:#A0EFCF;margin-bottom:40px;font-weight:500">"그때 샀더라면?" 후회를 숫자로 체험해요</div>
      <div style="display:flex;flex-direction:column;gap:16px">
        <div style="display:flex;justify-content:space-between;align-items:center;background:rgba(255,255,255,0.06);border:1px solid rgba(255,255,255,0.08);border-radius:16px;padding:18px 24px;width:680px">
          <span style="font-size:24px;color:rgba(255,255,255,0.6)">5년 전 100만원 → 삼성전자</span>
          <span style="font-size:32px;font-weight:900;color:#FF6B6B">+131%</span>
        </div>
        <div style="display:flex;justify-content:space-between;align-items:center;background:rgba(255,255,255,0.06);border:1px solid rgba(255,255,255,0.08);border-radius:16px;padding:18px 24px;width:680px">
          <span style="font-size:24px;color:rgba(255,255,255,0.6)">5년 전 100만원 → SK하이닉스</span>
          <span style="font-size:32px;font-weight:900;color:#FF6B6B">+265%</span>
        </div>
        <div style="display:flex;justify-content:space-between;align-items:center;background:rgba(255,255,255,0.06);border:1px solid rgba(255,255,255,0.08);border-radius:16px;padding:18px 24px;width:680px">
          <span style="font-size:24px;color:rgba(255,255,255,0.6)">5년 전 100만원 → 카카오</span>
          <span style="font-size:32px;font-weight:900;color:#6BB5FF">-72%</span>
        </div>
      </div>
    </div>
    <div style="position:relative;z-index:1;width:400px;height:720px;background:#1A1A2E;border-radius:40px;border:2px solid rgba(255,255,255,0.12);overflow:hidden;padding:24px">
      <div style="background:rgba(85,197,149,0.1);border-radius:12px;padding:16px;text-align:center;margin-bottom:20px">
        <div style="font-size:20px;color:#A0EFCF;font-weight:600">🦜 시간 여행 중...</div>
        <div style="font-size:16px;color:rgba(255,255,255,0.5);margin-top:4px">삼성전자 · 100만원</div>
      </div>
      ${tlHtml}
    </div>
  </body></html>`;
}

// ─── 4. OG 이미지 (1200x600) ───

function ogHtml(): string {
  return `<!DOCTYPE html><html><head><style>
    ${BASE_CSS}
    body {
      width: 1200px; height: 600px;
      background: linear-gradient(135deg, #0F172A 0%, #0F4C3A 60%, #1E293B 100%);
      padding: 0 60px; display: flex; align-items: center;
      position: relative; color: #fff;
    }
    .accent { position: absolute; top: 0; left: 0; right: 0; height: 4px;
      background: linear-gradient(90deg, #55C595, #3182F6, #7C3AED); }
    .orb1 { position: absolute; top: -10%; right: 0; width: 350px; height: 350px;
      background: radial-gradient(circle, rgba(85,197,149,0.15) 0%, transparent 70%); border-radius: 50%; }
  </style></head><body>
    <div class="accent"></div>
    <div class="orb1"></div>
    <div style="flex:1;position:relative;z-index:1">
      <div style="font-size:72px;margin-bottom:12px;filter:drop-shadow(0 4px 12px rgba(0,0,0,0.3))">🦜</div>
      <div style="font-size:52px;font-weight:900;margin-bottom:4px">껄무새</div>
      <div style="font-size:24px;color:#A0EFCF;margin-bottom:28px;font-weight:500">"그때 샀더라면?" 후회를 숫자로 체험해요</div>
      <div style="font-size:76px;font-weight:900;color:#FF6B6B;margin-bottom:8px">+340%</div>
      <div style="font-size:22px;color:rgba(255,255,255,0.4);margin-bottom:28px">5년 전 100만원이 440만원이 됐을 수도?</div>
      <div style="display:inline-block;padding:16px 48px;background:linear-gradient(135deg,#A0EFCF,#55C595);border-radius:16px;color:#0F172A;font-size:22px;font-weight:800;box-shadow:0 6px 24px rgba(85,197,149,0.3)">토스에서 "껄무새" 검색!</div>
    </div>
    <div style="position:relative;z-index:1;text-align:center">
      <div style="font-size:48px;margin-bottom:24px">📈💎🚀</div>
      <div style="font-size:48px">🤑💰📉</div>
    </div>
    <div style="position:absolute;bottom:16px;right:40px;font-size:13px;color:rgba(255,255,255,0.2);z-index:1">과거 성과는 미래 수익을 보장하지 않습니다</div>
  </body></html>`;
}

// ─── 5. 스크린샷 (636x1048) ───

async function waitForServer(url: string, timeoutMs = 30000): Promise<void> {
  const start = Date.now();
  while (Date.now() - start < timeoutMs) {
    try {
      const res = await fetch(url);
      if (res.ok) return;
    } catch { /* not ready */ }
    await new Promise((r) => setTimeout(r, 500));
  }
  throw new Error(`Server did not start within ${timeoutMs}ms`);
}

async function captureScreenshots(browser: Browser): Promise<ChildProcess | null> {
  let devServer: ChildProcess | null = null;

  let serverRunning = false;
  try { const res = await fetch(DEV_URL); if (res.ok) serverRunning = true; } catch { /* */ }

  if (!serverRunning) {
    console.log('  🚀 dev 서버 시작...');
    devServer = spawn('yarn', ['dev'], { cwd: PROJECT_ROOT, stdio: 'pipe' });
    await waitForServer(DEV_URL);
    console.log('  ✅ dev 서버 준비');
  }

  const SW = 636, SH = 1048;
  type Page = Awaited<ReturnType<typeof browser.newPage>>;

  const screenshots: { name: string; actions: (p: Page) => Promise<void> }[] = [
    {
      name: 'screenshot-01-home',
      actions: async (p) => { await p.goto(DEV_URL); await p.waitForTimeout(1500); },
    },
    {
      name: 'screenshot-02-datepicker',
      actions: async (p) => {
        await p.goto(DEV_URL); await p.waitForTimeout(1000);
        await p.locator('li').first().click(); await p.waitForTimeout(1000);
      },
    },
    {
      name: 'screenshot-03-amount',
      actions: async (p) => {
        await p.goto(DEV_URL); await p.waitForTimeout(1000);
        await p.locator('li').first().click(); await p.waitForTimeout(500);
        await p.locator('button', { hasText: '코로나 직전' }).click(); await p.waitForTimeout(1000);
      },
    },
    {
      name: 'screenshot-04-timeline',
      actions: async (p) => {
        await p.goto(DEV_URL); await p.waitForTimeout(800);
        await p.locator('li').first().click(); await p.waitForTimeout(500);
        await p.locator('button', { hasText: '코로나 직전' }).click(); await p.waitForTimeout(500);
        await p.locator('button', { hasText: '시간 여행 출발' }).click(); await p.waitForTimeout(5000);
        const hold = p.locator('button', { hasText: /계속 보유|존버/ }).first();
        if (await hold.isVisible().catch(() => false)) { await hold.click(); await p.waitForTimeout(2000); }
      },
    },
    {
      name: 'screenshot-05-result',
      actions: async (p) => {
        await p.goto(DEV_URL); await p.waitForTimeout(800);
        await p.locator('li').first().click(); await p.waitForTimeout(500);
        await p.locator('button', { hasText: '코로나 직전' }).click(); await p.waitForTimeout(500);
        await p.locator('button', { hasText: '시간 여행 출발' }).click(); await p.waitForTimeout(3000);
        const maxWait = 60000; const start = Date.now();
        while (Date.now() - start < maxWait) {
          const fin = p.locator('button', { hasText: '결과 확인' });
          if (await fin.isVisible().catch(() => false)) { await fin.click(); break; }
          const hold = p.locator('button', { hasText: /계속 보유|존버/ }).first();
          if (await hold.isVisible().catch(() => false)) { await hold.click(); await p.waitForTimeout(300); continue; }
          await p.waitForTimeout(500);
        }
        await p.waitForTimeout(2000);
      },
    },
  ];

  for (const ss of screenshots) {
    const ctx = await browser.newContext({ viewport: { width: SW, height: SH }, deviceScaleFactor: 2 });
    const page = await ctx.newPage();
    try {
      await ss.actions(page);
      await page.screenshot({ path: resolve(ASSETS_DIR, `${ss.name}-636x1048.png`), fullPage: false });
      console.log(`  ✅ ${ss.name}`);
    } catch (err) { console.log(`  ⚠️ ${ss.name} 실패:`, (err as Error).message); }
    await page.close(); await ctx.close();
  }

  return devServer;
}

// ─── 6. 콘솔 입력 텍스트 ───

function generateConsoleInfo() {
  writeFileSync(resolve(ASSETS_DIR, 'console-info.md'), `# 껄무새 — 앱인토스 콘솔 등록 정보

## 기본 정보

- **앱 이름**: 껄무새
- **앱 이름 (영문)**: Ggulmuse
- **appName**: ggulmuse
- **사용 연령**: 만 19세 이상

## 부제

\`\`\`
"그때 샀더라면?" 후회를 숫자로 체험해요
\`\`\`

## 상세 설명

\`\`\`
껄무새는 과거 시점에 주식을 샀다면 지금 얼마가 됐을지 시뮬레이션하는 미니앱이에요.

삼성전자, SK하이닉스, 카카오, 네이버, 셀트리온 중 종목을 선택하고,
"코로나 폭락", "AI 열풍 시작" 등 역사적 순간을 골라 가상 투자를 시작해요.

타임라인이 자동으로 흘러가면서 실제 뉴스 이벤트가 함께 표시되고,
주가가 급등하거나 폭락할 때 "팔겠습니까?" 선택지가 등장해요.
💎 계속 보유할지, 💰 여기서 매도할지 — 내 투자 심리까지 시험하는 게임이에요.

시뮬레이션이 끝나면 수익률 결과 카드가 생성되고,
카카오톡이나 인스타그램으로 친구에게 공유할 수 있어요.

"삼전 그때 샀으면 지금쯤..." 이런 후회, 숫자로 직접 체험해보세요!

주요 기능:
- 5개 인기 종목 (삼성전자, SK하이닉스, 카카오, 네이버, 셀트리온)
- 역사적 순간 바로가기 (코로나 폭락, 동학개미운동, AI 열풍 등)
- 10만원~1000만원 투자금 설정
- 월별 타임라인 자동 재생 + 실제 뉴스 이벤트
- 급등/폭락 시 매도/보유 결정 포인트
- 수익률 결과 카드 생성 및 공유

* 본 서비스는 교육/엔터테인먼트 목적이며 투자 권유가 아닙니다.
* 과거 성과는 미래 수익을 보장하지 않습니다.
\`\`\`

## 앱 검색 키워드

\`\`\`
껄무새, 주식, 투자, 시뮬레이션, 수익률, 삼성전자, SK하이닉스, 카카오, 네이버, 셀트리온, 과거투자, 후회, 코로나, 동학개미, AI, 주식게임, 투자체험, 시간여행
\`\`\`

## 앱 내 기능 (비게임 앱 필수 — 최소 1개)

| 기능 이름 | 기능 URL |
|---|---|
| 투자 시뮬레이션 해보기 | intoss://ggulmuse |
| 종목별 수익률 확인하기 | intoss://ggulmuse |

## 고객센터

- **이메일**: (등록 필요)
- **연락처**: (등록 필요)

## 리소스 파일 목록

| 파일명 | 용도 | 규격 |
|---|---|---|
| app-logo-600x600.png | 앱 로고 | 600x600 |
| thumbnail-square-1000x1000.png | 정방형 썸네일 | 1000x1000 |
| thumbnail-wide-1932x828.png | 가로형 썸네일 | 1932x828 |
| og-image-1200x600.png | OG 이미지 (공유용) | 1200x600 |
| screenshot-01-home-636x1048.png | 스크린샷: 홈 | 636x1048 |
| screenshot-02-datepicker-636x1048.png | 스크린샷: 날짜 선택 | 636x1048 |
| screenshot-03-amount-636x1048.png | 스크린샷: 금액 입력 | 636x1048 |
| screenshot-04-timeline-636x1048.png | 스크린샷: 타임라인 | 636x1048 |
| screenshot-05-result-636x1048.png | 스크린샷: 결과 화면 | 636x1048 |
`);
  console.log('  ✅ 콘솔 입력 정보 (console-info.md)');
}

// ─── main ───

async function main() {
  console.log('🦜 껄무새 앱인토스 콘솔 리소스 생성\\n');
  ensureDir();

  const browser = await chromium.launch({ headless: true });

  console.log('📐 브랜딩 이미지 생성...');
  await renderHtmlToImage(browser, logoHtml(), 600, 600, resolve(ASSETS_DIR, 'app-logo-600x600.png'));
  console.log('  ✅ 앱 로고 (600x600)');
  await renderHtmlToImage(browser, squareThumbHtml(), 1000, 1000, resolve(ASSETS_DIR, 'thumbnail-square-1000x1000.png'));
  console.log('  ✅ 정방형 썸네일 (1000x1000)');
  await renderHtmlToImage(browser, wideThumbHtml(), 1932, 828, resolve(ASSETS_DIR, 'thumbnail-wide-1932x828.png'));
  console.log('  ✅ 가로형 썸네일 (1932x828)');
  await renderHtmlToImage(browser, ogHtml(), 1200, 600, resolve(ASSETS_DIR, 'og-image-1200x600.png'));
  console.log('  ✅ OG 이미지 (1200x600)');

  console.log('\\n📸 앱 스크린샷 캡처...');
  const devServer = await captureScreenshots(browser);

  await browser.close();

  console.log('\\n📝 콘솔 입력 정보 생성...');
  generateConsoleInfo();

  if (devServer) { devServer.kill(); console.log('\\n🛑 dev 서버 종료'); }
  console.log('\\n🎉 완료! docs/console-assets/ 에 모든 리소스가 생성되었습니다.');
}

main();
