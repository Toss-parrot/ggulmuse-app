/**
 * 껄무새 데모 자동 녹화 스크립트
 *
 * 사용법: npm run demo (또는 npx tsx scripts/record-demo.ts)
 *
 * 1. dev 서버가 떠있는지 확인 (없으면 자동 시작)
 * 2. Playwright가 앱을 iPhone 화면으로 열고 자동 조작
 * 3. webm 비디오 녹화 → ffmpeg로 GIF 변환
 * 4. docs/demo.gif 에 저장
 */

import { chromium } from '@playwright/test';
import { execFileSync, spawn, ChildProcess } from 'child_process';
import { existsSync, mkdirSync, rmSync, statSync } from 'fs';
import { resolve } from 'path';

const PROJECT_ROOT = resolve(import.meta.dirname, '..');
const DOCS_DIR = resolve(PROJECT_ROOT, 'docs');
const TEMP_DIR = resolve(PROJECT_ROOT, '.demo-temp');
const OUTPUT_GIF = resolve(DOCS_DIR, 'demo.gif');
const DEV_PORT = 3000;
const DEV_URL = `http://localhost:${DEV_PORT}`;

const VIEWPORT = { width: 390, height: 844 };

async function waitForServer(url: string, timeoutMs = 30000): Promise<void> {
  const start = Date.now();
  while (Date.now() - start < timeoutMs) {
    try {
      const res = await fetch(url);
      if (res.ok) return;
    } catch {
      // not ready
    }
    await new Promise((r) => setTimeout(r, 500));
  }
  throw new Error(`Server did not start within ${timeoutMs}ms`);
}

async function startDevServer(): Promise<ChildProcess> {
  console.log('🚀 dev 서버 시작...');
  const child = spawn('yarn', ['dev'], {
    cwd: PROJECT_ROOT,
    stdio: 'pipe',
    env: { ...process.env, PORT: String(DEV_PORT) },
  });

  child.stderr?.on('data', (d) => {
    const msg = d.toString();
    if (msg.includes('error') || msg.includes('Error')) {
      console.error('  ⚠️', msg.trim());
    }
  });

  await waitForServer(DEV_URL);
  console.log('✅ dev 서버 준비 완료');
  return child;
}

async function recordDemo(): Promise<string> {
  if (existsSync(TEMP_DIR)) rmSync(TEMP_DIR, { recursive: true });
  mkdirSync(TEMP_DIR, { recursive: true });

  console.log('🎬 Playwright 녹화 시작...');

  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({
    viewport: VIEWPORT,
    deviceScaleFactor: 2,
    recordVideo: {
      dir: TEMP_DIR,
      size: { width: VIEWPORT.width * 2, height: VIEWPORT.height * 2 },
    },
  });

  const page = await context.newPage();

  // ── 1. 홈 화면 ──
  console.log('  📱 홈 화면...');
  await page.goto(DEV_URL);
  await page.waitForTimeout(2500);

  // ── 2. 종목 선택 (삼성전자 — 첫 번째 li.stockCard) ──
  console.log('  📱 종목 선택: 삼성전자...');
  const stockCard = page.locator('li').first();
  await stockCard.waitFor({ timeout: 5000 });
  await page.waitForTimeout(500);
  await stockCard.click();
  await page.waitForTimeout(1500);

  // ── 3. 날짜 선택 (코로나 직전) ──
  console.log('  📱 날짜 선택: 코로나 직전...');
  const dateBtn = page.locator('button', { hasText: '코로나 직전' });
  try {
    await dateBtn.waitFor({ timeout: 5000 });
    await dateBtn.click();
  } catch {
    // fallback: 아무 shortcut 버튼
    const anyShortcut = page.locator('button').nth(1);
    await anyShortcut.click();
  }
  await page.waitForTimeout(1500);

  // ── 4. 금액 입력 (기본 100만원 유지) ──
  console.log('  📱 금액: 100만원 (기본값)...');
  await page.waitForTimeout(1000);

  // 시간 여행 출발 버튼
  const startBtn = page.locator('button', { hasText: '시간 여행 출발' });
  await startBtn.waitFor({ timeout: 5000 });
  await page.waitForTimeout(500);
  await startBtn.click();
  console.log('  📱 시간 여행 출발!');
  await page.waitForTimeout(2000);

  // ── 5. 타임라인 자동 재생 관찰 ──
  console.log('  📱 타임라인 진행 중...');

  // 결정 모달 처리 + 타임라인 대기 루프
  const maxWaitMs = 60000; // 타임라인 최대 60초 대기
  const loopStart = Date.now();

  while (Date.now() - loopStart < maxWaitMs) {
    // 결과 확인 버튼이 나타났는지 체크
    const finishBtn = page.locator('button', { hasText: '결과 확인' });
    const finishVisible = await finishBtn.isVisible().catch(() => false);
    if (finishVisible) {
      console.log('  📱 타임라인 완료!');
      await page.waitForTimeout(500);
      await finishBtn.click();
      break;
    }

    // 결정 모달이 나타났는지 체크 (hold 버튼)
    // DecisionModal의 holdBtn: 💎 계속 보유 or 🔥 존버
    const holdBtn = page.locator('button', { hasText: /계속 보유|존버/ }).first();
    const holdVisible = await holdBtn.isVisible().catch(() => false);
    if (holdVisible) {
      await page.waitForTimeout(300);
      await holdBtn.click();
      console.log('  📱 결정: 💎 보유!');
      await page.waitForTimeout(500);
      continue;
    }

    await page.waitForTimeout(500);
  }

  // 결과 화면 감상
  console.log('  📱 결과 화면 표시 중...');
  await page.waitForTimeout(3500);

  // 녹화 종료
  await page.close();
  const videoPath = await page.video()?.path();
  await context.close();
  await browser.close();

  if (!videoPath) throw new Error('비디오 파일을 찾을 수 없습니다');
  console.log(`✅ 녹화 완료: ${videoPath}`);
  return videoPath;
}

function convertToGif(videoPath: string): void {
  if (!existsSync(DOCS_DIR)) mkdirSync(DOCS_DIR, { recursive: true });

  console.log('🎨 GIF 변환 중...');

  const paletteFile = resolve(TEMP_DIR, 'palette.png');

  // Pass 1: 팔레트 생성
  execFileSync('ffmpeg', [
    '-y', '-i', videoPath,
    '-vf', 'fps=12,scale=360:-1:flags=lanczos,palettegen=max_colors=128',
    paletteFile,
  ], { stdio: 'pipe' });

  // Pass 2: GIF 생성
  execFileSync('ffmpeg', [
    '-y', '-i', videoPath, '-i', paletteFile,
    '-lavfi', 'fps=12,scale=360:-1:flags=lanczos[x];[x][1:v]paletteuse=dither=bayer:bayer_scale=3',
    OUTPUT_GIF,
  ], { stdio: 'pipe' });

  const { size } = statSync(OUTPUT_GIF);
  const sizeMB = (size / 1024 / 1024).toFixed(1);
  console.log(`✅ GIF 생성 완료: docs/demo.gif (${sizeMB}MB)`);
}

async function main() {
  console.log('🦜 껄무새 데모 자동 녹화\n');

  let devServer: ChildProcess | null = null;

  try {
    let serverAlreadyRunning = false;
    try {
      const res = await fetch(DEV_URL);
      if (res.ok) serverAlreadyRunning = true;
    } catch {
      // not running
    }

    if (!serverAlreadyRunning) {
      devServer = await startDevServer();
    } else {
      console.log('✅ dev 서버가 이미 실행 중');
    }

    const videoPath = await recordDemo();
    convertToGif(videoPath);

    // 정리
    if (existsSync(TEMP_DIR)) rmSync(TEMP_DIR, { recursive: true });

    console.log('\n🎉 완료! docs/demo.gif 가 생성되었습니다.');
    console.log('README.md에 자동으로 추가합니다.');
  } catch (err) {
    console.error('❌ 에러:', err);
    process.exit(1);
  } finally {
    if (devServer) {
      devServer.kill();
      console.log('🛑 dev 서버 종료');
    }
  }
}

main();
