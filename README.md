# 🦜 껄무새 (ggulmuse)

> **"그때 샀더라면?"** — 과거 투자를 가상 체험하는 시간 여행 미니앱

[![AppsInToss](https://img.shields.io/badge/AppsInToss-WebView-blue)](https://developers-apps-in-toss.toss.im)
[![React](https://img.shields.io/badge/React-18-61dafb)](https://react.dev)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.6-3178c6)](https://typescriptlang.org)

---

## 데모

<p align="center">
  <img src="./docs/demo.gif" width="540" alt="껄무새 데모 - 종목선택부터 결과까지" />
</p>

---

## 한 줄 소개

**삼전 그때 샀으면 지금쯤...** 이런 후회, 숫자로 직접 체험해보세요.

과거 시점에 투자했다면 지금 얼마가 됐을지, 타임라인을 따라가며 시뮬레이션합니다. 중간에 급등/폭락이 오면 **"팔겠습니까?"** 선택지가 나와서 내가 진짜 버텼을지까지 시험합니다.

## 핵심 기능

```
[종목 선택] → [시점 선택] → [금액 입력] → [시간 여행] → [결과 카드 + 공유]
```

| 기능 | 설명 |
|---|---|
| **종목 선택** | 삼성전자, SK하이닉스, 카카오, 네이버, 셀트리온 |
| **시점 선택** | "코로나 폭락", "AI 열풍 시작" 등 역사적 순간 바로가기 |
| **금액 입력** | 10만~1000만원 슬라이더 + 프리셋 |
| **시간 여행** | 월별 타임라인 자동 스크롤 + 뉴스 이벤트 + 매도/보유 결정 |
| **결과 카드** | 수익률 결과 + Canvas 카드 생성 + 공유 |

## 시간 여행 체험

타임라인을 스크롤하면 시간이 흘러갑니다:

```
 2021.01  ██████████  +100%   100만→200만
          🔥 코스피 3000 돌파!

 2021.06  ████████░░  +84%    100만→184만
          🦜 꽥! 수익이 올랐는데... 팔까?
          [💎 계속 보유]  [💰 여기서 매도]

 2022.06  ███░░░░░░░  +41%    100만→141만
          💀 약세장 진입. 버티겠습니까?
          [🔥 존버]  [🏃 손절]
```

**선택에 따라 결과가 달라집니다** — 단순 계산기가 아니라 내 투자 심리까지 시험하는 게임!

## 기술 스택

| 구성 | 기술 |
|---|---|
| 플랫폼 | **앱인토스** (토스 앱 내 WebView 미니앱) |
| 프레임워크 | **Granite** (`@apps-in-toss/web-framework` 2.x) |
| 프론트엔드 | React 18 + TypeScript |
| 빌드 | Rsbuild |
| 디자인 시스템 | TDS (Toss Design System) 커스텀 |
| 카드 생성 | Canvas API |

## 프로젝트 구조

```
src/
├── types/          # TypeScript 타입 정의
├── data/           # 주가 데이터 + 뉴스 이벤트
│   ├── stocks.ts   # 5개 종목 75개월 가격 데이터
│   └── events.ts   # 26개 뉴스 이벤트 + 결정 포인트
├── engine/         # 시뮬레이션 엔진
│   └── simulation.ts
├── hooks/          # 커스텀 훅 (라우터 등)
├── components/     # 재사용 컴포넌트
│   └── DecisionModal.tsx  # 매도/보유 결정 모달
├── pages/          # 페이지 컴포넌트
│   ├── Home.tsx         # 종목 선택
│   ├── DatePicker.tsx   # 시점 선택
│   ├── AmountInput.tsx  # 금액 입력
│   ├── Timeline.tsx     # 시간 여행 (핵심)
│   └── ResultCard.tsx   # 결과 + 공유
├── App.tsx         # 루트 + 라우팅
└── index.tsx       # 엔트리포인트
```

## 설치 및 실행

```bash
# 패키지 설치
npm install

# 개발 서버 실행
npm run dev

# 프로덕션 빌드
npm run build

# 앱인토스 배포
npm run deploy

# 데모 GIF 자동 생성
yarn demo
```

## 앱인토스 테스트

1. [샌드박스 앱](https://developers-apps-in-toss.toss.im/development/test/sandbox) 설치
2. `npm run dev` 실행
3. 샌드박스 앱에서 `intoss://ggulmuse` 입력

## 바이럴 루프

```
A가 시뮬레이션 완료
  → 🦜 껄무새 카드 "+340%였는데..."
    → 카톡/인스타 공유
      → B가 "나도 해볼래" → 토스 앱 → 앱인토스
        → B도 카드 공유 → 반복
```

## 면책 조항

- 본 서비스는 **교육/엔터테인먼트 목적**이며 투자 권유가 아닙니다
- 과거 성과는 미래 수익을 보장하지 않습니다
- 모든 주가 데이터는 실제 데이터를 기반으로 한 근사치입니다

---

**Made with 🦜 by Toss-parrot**
