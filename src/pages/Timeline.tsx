import { useState, useEffect, useRef } from 'react';
import { SimulationState, TimelineEntry } from '../types';
import { formatMoney, formatDate } from '../engine/simulation';
import { DecisionModal } from '../components/DecisionModal';
import styles from './Timeline.module.css';

interface Props {
  simulation: SimulationState;
  onFinish: (sim: SimulationState) => void;
}

export function Timeline({ simulation, onFinish }: Props) {
  const [visibleCount, setVisibleCount] = useState(1);
  const [pendingDecision, setPendingDecision] = useState<TimelineEntry | null>(null);
  const [decisions, setDecisions] = useState<{ date: string; action: 'hold' | 'sell' }[]>([]);
  const [sold, setSold] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);

  const entries = simulation.timeline.slice(0, visibleCount);
  const allRevealed = visibleCount >= simulation.timeline.length || sold;
  const currentEntry = entries[entries.length - 1];

  useEffect(() => {
    if (pendingDecision || allRevealed) return;

    const timer = setTimeout(() => {
      const nextIndex = visibleCount;
      if (nextIndex >= simulation.timeline.length) return;

      const nextEntry = simulation.timeline[nextIndex];
      if (nextEntry.decision) {
        setPendingDecision(nextEntry);
        setVisibleCount((c) => c + 1);
      } else {
        setVisibleCount((c) => c + 1);
      }
    }, 400);

    return () => clearTimeout(timer);
  }, [visibleCount, pendingDecision, allRevealed, simulation.timeline]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [visibleCount]);

  const handleDecision = (action: 'hold' | 'sell') => {
    if (!pendingDecision) return;
    const newDecisions = [...decisions, { date: pendingDecision.date, action }];
    setDecisions(newDecisions);
    setPendingDecision(null);

    if (action === 'sell') {
      setSold(true);
    }
  };

  const handleFinish = () => {
    const updatedSim: SimulationState = {
      ...simulation,
      decisions,
      soldAt: sold ? decisions.find((d) => d.action === 'sell')?.date : undefined,
    };

    if (sold) {
      const sellDate = decisions.find((d) => d.action === 'sell')?.date;
      const sellEntry = simulation.timeline.find((t) => t.date === sellDate);
      if (sellEntry) {
        updatedSim.finalValue = sellEntry.value;
        updatedSim.finalReturn = sellEntry.changePercent;
      }
    } else {
      const last = simulation.timeline[simulation.timeline.length - 1];
      updatedSim.finalValue = last.value;
      updatedSim.finalReturn = last.changePercent;
    }

    onFinish(updatedSim);
  };

  const getBarWidth = (changePercent: number) => {
    const maxChange = Math.max(
      ...simulation.timeline.map((t) => Math.abs(t.changePercent))
    );
    if (maxChange === 0) return 50;
    return Math.min(95, Math.max(5, 50 + (changePercent / maxChange) * 45));
  };

  const getBarColor = (changePercent: number) => {
    if (changePercent > 0) return 'var(--color-danger)';
    if (changePercent < 0) return 'var(--color-primary)';
    return 'var(--color-gray-400)';
  };

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <h1 className={styles.title}>시간 여행 중...</h1>
        <p className={styles.subtitle}>
          {simulation.stock.name} · {formatMoney(simulation.investAmount)}원 투자
        </p>
      </header>

      {currentEntry && (
        <div className={styles.currentStatus}>
          <div className={styles.currentValue}>
            <span className={styles.currentLabel}>현재 평가금액</span>
            <span className={styles.currentAmount}>{formatMoney(currentEntry.value)}원</span>
          </div>
          <span
            className={styles.currentReturn}
            style={{ color: currentEntry.changePercent >= 0 ? 'var(--color-danger)' : 'var(--color-primary)' }}
          >
            {currentEntry.changePercent >= 0 ? '+' : ''}{currentEntry.changePercent}%
          </span>
        </div>
      )}

      <div className={styles.timeline}>
        {entries.map((entry, i) => (
          <div
            key={entry.date}
            className={styles.entry}
            style={{ animationDelay: `${i * 0.05}s` }}
          >
            <div className={styles.entryHeader}>
              <span className={styles.entryDate}>{formatDate(entry.date)}</span>
              <span
                className={styles.entryReturn}
                style={{ color: entry.changePercent >= 0 ? 'var(--color-danger)' : 'var(--color-primary)' }}
              >
                {entry.changePercent >= 0 ? '+' : ''}{entry.changePercent}%
              </span>
            </div>

            <div className={styles.barWrap}>
              <div
                className={styles.bar}
                style={{
                  width: `${getBarWidth(entry.changePercent)}%`,
                  backgroundColor: getBarColor(entry.changePercent),
                }}
              />
            </div>

            <div className={styles.entryValues}>
              <span className={styles.entryPrice}>{entry.price.toLocaleString()}원</span>
              <span className={styles.entryValue}>{formatMoney(entry.value)}원</span>
            </div>

            {entry.event && (
              <div className={styles.event}>
                <span>{entry.event.emoji}</span>
                <span className={styles.eventTitle}>{entry.event.title}</span>
              </div>
            )}

            {sold && entry.date === decisions.find((d) => d.action === 'sell')?.date && (
              <div className={styles.soldBadge}>여기서 매도!</div>
            )}
          </div>
        ))}
        <div ref={bottomRef} />
      </div>

      {allRevealed && (
        <div className={styles.finishWrap}>
          <button className={styles.finishBtn} onClick={handleFinish}>
            결과 확인하기
          </button>
        </div>
      )}

      {pendingDecision && pendingDecision.decision && (
        <DecisionModal
          decision={pendingDecision.decision}
          onChoice={handleDecision}
        />
      )}
    </div>
  );
}
