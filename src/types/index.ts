export interface Stock {
  id: string;
  name: string;
  code: string;
  sector: string;
  currentPrice: number;
  description: string;
}

export interface PricePoint {
  date: string; // YYYY-MM
  price: number;
  change: number; // percent change from start
}

export interface NewsEvent {
  date: string; // YYYY-MM
  emoji: string;
  title: string;
  description: string;
}

export interface DecisionPoint {
  date: string;
  type: 'peak' | 'crash';
  message: string;
  options: [string, string]; // [continue, sell/cut]
}

export interface TimelineEntry {
  date: string;
  price: number;
  value: number; // current value of investment
  changePercent: number;
  event?: NewsEvent;
  decision?: DecisionPoint;
}

export interface SimulationState {
  stock: Stock;
  startDate: string;
  investAmount: number;
  timeline: TimelineEntry[];
  decisions: { date: string; action: 'hold' | 'sell' }[];
  currentIndex: number;
  finalValue: number;
  finalReturn: number;
  soldAt?: string; // date if user sold
}

export type Page = 'home' | 'datePicker' | 'amountInput' | 'timeline' | 'result';

export interface RouterState {
  page: Page;
  params: Record<string, string>;
}
