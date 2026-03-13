import { NewsEvent, DecisionPoint } from '../types';

export const newsEvents: NewsEvent[] = [
  { date: '2019-07', emoji: '🇯🇵', title: '일본 수출 규제', description: '반도체 소재 수출 규제 발표' },
  { date: '2019-10', emoji: '📱', title: '5G 상용화', description: '국내 5G 서비스 본격 시작' },
  { date: '2020-01', emoji: '🦠', title: '코로나19 발생', description: '중국 우한에서 신종 코로나바이러스 발생' },
  { date: '2020-03', emoji: '💥', title: '코로나 대폭락', description: '코스피 1400대까지 폭락, 서킷브레이커 발동' },
  { date: '2020-06', emoji: '🚀', title: '동학개미운동', description: '개인투자자 대거 유입, 역대급 매수세' },
  { date: '2020-09', emoji: '💰', title: '유동성 랠리', description: '각국 양적완화로 주식시장 급등' },
  { date: '2020-12', emoji: '💉', title: '백신 개발 성공', description: '화이자·모더나 백신 긴급사용 승인' },
  { date: '2021-01', emoji: '🔥', title: '코스피 3000 돌파', description: '사상 최초 코스피 3000 시대 개막' },
  { date: '2021-04', emoji: '📊', title: '카카오 액면분할', description: '카카오 5:1 액면분할 실시' },
  { date: '2021-06', emoji: '🏠', title: '부동산 과열', description: '수도권 집값 급등, 대출 규제 강화' },
  { date: '2021-08', emoji: '📈', title: '네이버 최고가', description: '네이버 사상 최고가 경신' },
  { date: '2021-11', emoji: '⚠️', title: '금리 인상 시그널', description: '미 연준 테이퍼링 시작 시사' },
  { date: '2022-01', emoji: '📉', title: '긴축의 시작', description: '미국 금리 인상 시작, 성장주 약세' },
  { date: '2022-03', emoji: '🇺🇦', title: '러시아-우크라이나 전쟁', description: '전쟁 발발로 글로벌 공급망 혼란' },
  { date: '2022-06', emoji: '💀', title: '약세장 진입', description: '코스피 2300선 붕괴, 약세장 본격화' },
  { date: '2022-09', emoji: '🏦', title: '급격한 금리 인상', description: '미 연준 자이언트 스텝, 한은도 빅스텝' },
  { date: '2022-11', emoji: '🪙', title: 'FTX 파산', description: '가상자산 거래소 FTX 파산, 크립토 겨울' },
  { date: '2023-01', emoji: '🌱', title: '반등 기대감', description: '금리 인상 속도 둔화 기대로 반등' },
  { date: '2023-05', emoji: '🤖', title: 'AI 열풍', description: 'ChatGPT 열풍으로 AI 관련주 급등' },
  { date: '2023-07', emoji: '💾', title: 'HBM 수요 폭증', description: 'AI 서버용 HBM 수요 급증, SK하이닉스 수혜' },
  { date: '2023-11', emoji: '📱', title: '삼성 AI 전략', description: '삼성전자 AI 반도체 투자 확대 발표' },
  { date: '2024-01', emoji: '🎉', title: 'AI 랠리 본격화', description: '엔비디아 사상 최고가, AI 수혜주 동반 상승' },
  { date: '2024-04', emoji: '💹', title: '반도체 슈퍼사이클', description: 'HBM3E 양산 본격화, 반도체 수출 역대 최고' },
  { date: '2024-07', emoji: '🎢', title: '고점 논란', description: 'AI 관련주 고평가 논란, 차익 실현 매물' },
  { date: '2024-09', emoji: '📉', title: '조정장', description: '글로벌 경기 둔화 우려로 코스피 하락' },
  { date: '2025-01', emoji: '🔄', title: '새해 반등 기대', description: '트럼프 2기 출범, 규제 완화 기대감' },
];

export function getEventsForDateRange(startDate: string, endDate: string): NewsEvent[] {
  return newsEvents.filter((e) => e.date >= startDate && e.date <= endDate);
}

export function generateDecisionPoints(
  stockId: string,
  prices: { date: string; price: number }[]
): DecisionPoint[] {
  const decisions: DecisionPoint[] = [];

  for (let i = 3; i < prices.length; i++) {
    const current = prices[i];
    const prev3 = prices[i - 3];

    const changeFrom3MonthsAgo = (current.price - prev3.price) / prev3.price;

    // Peak decision: 3개월간 20% 이상 상승
    if (changeFrom3MonthsAgo > 0.2) {
      const lastDecision = decisions[decisions.length - 1];
      if (!lastDecision || current.date > lastDecision.date.slice(0, 7).replace(/-/, '-')) {
        decisions.push({
          date: current.date,
          type: 'peak',
          message: `+${(changeFrom3MonthsAgo * 100).toFixed(0)}% 급등! 지금 팔겠습니까?`,
          options: ['계속 보유', '여기서 매도'],
        });
      }
    }

    // Crash decision: 3개월간 15% 이상 하락
    if (changeFrom3MonthsAgo < -0.15) {
      const lastDecision = decisions[decisions.length - 1];
      if (!lastDecision || current.date > lastDecision.date.slice(0, 7).replace(/-/, '-')) {
        decisions.push({
          date: current.date,
          type: 'crash',
          message: `${(changeFrom3MonthsAgo * 100).toFixed(0)}% 하락... 버티겠습니까?`,
          options: ['존버', '손절'],
        });
      }
    }
  }

  // Limit to at most 4 decisions for good UX
  if (decisions.length > 4) {
    const step = Math.floor(decisions.length / 4);
    return decisions.filter((_, i) => i % step === 0).slice(0, 4);
  }

  return decisions;
}
