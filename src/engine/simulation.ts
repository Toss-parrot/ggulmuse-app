import { priceHistory } from '../data/stocks';
import { newsEvents, generateDecisionPoints } from '../data/events';
import { TimelineEntry, SimulationState, Stock } from '../types';

export function buildTimeline(
  stockId: string,
  startDate: string,
  investAmount: number
): TimelineEntry[] {
  const history = priceHistory[stockId];
  if (!history) return [];

  const startIndex = history.findIndex((p) => p.date >= startDate);
  if (startIndex < 0) return [];

  const relevantPrices = history.slice(startIndex);
  const startPrice = relevantPrices[0].price;

  const decisions = generateDecisionPoints(stockId, relevantPrices);

  return relevantPrices.map((point) => {
    const shares = investAmount / startPrice;
    const value = Math.round(shares * point.price);
    const changePercent = ((point.price - startPrice) / startPrice) * 100;

    const event = newsEvents.find((e) => e.date === point.date);
    const decision = decisions.find((d) => d.date === point.date);

    return {
      date: point.date,
      price: point.price,
      value,
      changePercent: Math.round(changePercent * 10) / 10,
      event: event || undefined,
      decision: decision || undefined,
    };
  });
}

export function createSimulation(
  stock: Stock,
  startDate: string,
  investAmount: number
): SimulationState {
  const timeline = buildTimeline(stock.id, startDate, investAmount);
  const lastEntry = timeline[timeline.length - 1];

  return {
    stock,
    startDate,
    investAmount,
    timeline,
    decisions: [],
    currentIndex: 0,
    finalValue: lastEntry?.value ?? investAmount,
    finalReturn: lastEntry?.changePercent ?? 0,
  };
}

export function calculateResultAfterDecisions(
  simulation: SimulationState
): { finalValue: number; finalReturn: number; soldAt?: string } {
  const sellDecision = simulation.decisions.find((d) => d.action === 'sell');

  if (sellDecision) {
    const soldEntry = simulation.timeline.find((t) => t.date === sellDecision.date);
    if (soldEntry) {
      return {
        finalValue: soldEntry.value,
        finalReturn: soldEntry.changePercent,
        soldAt: sellDecision.date,
      };
    }
  }

  const lastEntry = simulation.timeline[simulation.timeline.length - 1];
  return {
    finalValue: lastEntry?.value ?? simulation.investAmount,
    finalReturn: lastEntry?.changePercent ?? 0,
  };
}

export function formatMoney(amount: number): string {
  if (amount >= 100000000) {
    return `${(amount / 100000000).toFixed(1)}억`;
  }
  if (amount >= 10000) {
    return `${Math.round(amount / 10000)}만`;
  }
  return amount.toLocaleString();
}

export function formatDate(dateStr: string): string {
  const [year, month] = dateStr.split('-');
  return `${year}년 ${parseInt(month)}월`;
}
