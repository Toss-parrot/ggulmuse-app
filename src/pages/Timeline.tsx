import { useState, useEffect, useRef } from 'react';
import { SimulationState, TimelineEntry } from '../types';
import { formatMoney, formatDate } from '../engine/simulation';
import { DecisionModal } from '../components/DecisionModal';
import styles from './Timeline.module.css';

interface Props {
  simulation: SimulationState;
  onFinish: (sim: SimulationState) => void;
}

function getParrotComment(changePercent: number): string {
  if (changePercent > 100) return '🦜 꽥!!! 100% 넘었어! 대박!';
  if (changePercent > 50) return '🦜 오오오 반타작 넘었다!';
  if (changePercent > 20) return '🦜 슬슬 재미있어지는데~';
  if (changePercent > 0) return '🦜 아직은 순항 중~';
  if (changePercent > -10) return '🦜 살짝 마이너스... 괜찮아!';
  if (changePercent > -30) return '🦜 으으... 조금 아프다...';
  return '🦜 꽥... 이건 좀...';
}

export function Timeline({ simulation, onFinish }: Props) {
  const [visibleCount, setVisibleCount] = useState(1);
  const [pendingDecision, setPendingDecision] = useState<TimelineEntry | null>(null);
  const [decisions, setDecisions] = useState<{ date: string; action: 'hold' | 'sell' }[]>([]);
  const [sold, setSold] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);
  const pendingRef = useRef(false);

  const entries = simulation.timeline.slice(0, visibleCount);
  const allRevealed = visibleCount >= simulation.timeline.length || sold;
  const currentEntry = entries[entries.length - 1];
  const progress = (visibleCount / simulation.timeline.length) * 100;

  useEffect(() => {
    if (pendingDecision || allRevealed || pendingRef.current) return;

    const timer = setTimeout(() => {
      if (pendingRef.current) return;

      const nextIndex = visibleCount;
      if (nextIndex >= simulation.timeline.length) return;

      const nextEntry = simulation.timeline[nextIndex];
      if (nextEntry.decision) {
        pendingRef.current = true;
        setPendingDecision(nextEntry);
      } else {
        setVisibleCount((c) => c + 1);
      }
    }, 350);

    return () => clearTimeout(timer);
  }, [visibleCount, pendingDecision, allRevealed, simulation.timeline]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth', block: 'end' });
  }, [visibleCount]);

  const handleDecision = (action: 'hold' | 'sell') => {
    if (!pendingDecision) return;
    const newDecisions = [...decisions, { date: pendingDecision.date, action }];
    setDecisions(newDecisions);
    setVisibleCount((c) => c + 1);
    pendingRef.current = false;
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

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <div className={styles.headerTop}>
          <div>
            <h1 className={styles.title}>🦜 시간 여행 중...</h1>
            <p className={styles.subtitle}>
              {simulation.stock.name} · {formatMoney(simulation.investAmount)}원
            </p>
          </div>
        </div>
        <div className={styles.progressWrap}>
          <div className={styles.progressBar} style={{ width: `${progress}%` }} />
        </div>
      </header>

      {currentEntry && (
        <div className={styles.currentStatus}>
          <div className={styles.statusGlass}>
            <div className={styles.currentValue}>
              <span className={styles.currentLabel}>현재 평가금액</span>
              <span className={styles.currentAmount}>{formatMoney(currentEntry.value)}원</span>
            </div>
            <div className={styles.currentReturnWrap}>
              <span
                className={styles.currentReturn}
                style={{ color: currentEntry.changePercent >= 0 ? '#FF6B6B' : '#6BB5FF' }}
              >
                {currentEntry.changePercent >= 0 ? '+' : ''}{currentEntry.changePercent}%
              </span>
            </div>
          </div>
          <div className={styles.parrotComment}>
            <p>{getParrotComment(currentEntry.changePercent)}</p>
          </div>
        </div>
      )}

      <div className={styles.timeline}>
        {entries.map((entry, i) => {
          const isUp = entry.changePercent >= 0;
          return (
            <div
              key={entry.date}
              className={styles.entry}
              style={{ animationDelay: `${i * 0.03}s` }}
            >
              <div className={styles.timelineDot}>
                <div className={`${styles.dot} ${isUp ? styles.dotUp : styles.dotDown}`} />
                {i < entries.length - 1 && <div className={styles.timelineLine} />}
              </div>
              <div className={styles.entryContent}>
                <div className={styles.entryHeader}>
                  <span className={styles.entryDate}>{formatDate(entry.date)}</span>
                  <span
                    className={styles.entryReturn}
                    style={{ color: isUp ? '#FF6B6B' : '#6BB5FF' }}
                  >
                    {isUp ? '+' : ''}{entry.changePercent}%
                  </span>
                </div>

                <div className={styles.barWrap}>
                  <div
                    className={styles.bar}
                    style={{
                      width: `${getBarWidth(entry.changePercent)}%`,
                      background: isUp
                        ? 'linear-gradient(90deg, #FF6B6B, #FF4545)'
                        : 'linear-gradient(90deg, #6BB5FF, #3182F6)',
                    }}
                  />
                </div>

                <div className={styles.entryValues}>
                  <span className={styles.entryPrice}>{entry.price.toLocaleString()}원</span>
                  <span className={styles.entryValue}>{formatMoney(entry.value)}원</span>
                </div>

                {entry.event && (
                  <div className={styles.event}>
                    <span className={styles.eventEmoji}>{entry.event.emoji}</span>
                    <div>
                      <span className={styles.eventTitle}>{entry.event.title}</span>
                      <span className={styles.eventDesc}>{entry.event.description}</span>
                    </div>
                  </div>
                )}

                {sold && entry.date === decisions.find((d) => d.action === 'sell')?.date && (
                  <div className={styles.soldBadge}>🦜 여기서 매도!</div>
                )}
              </div>
            </div>
          );
        })}
        <div ref={bottomRef} />
      </div>

      {allRevealed && (
        <div className={styles.finishWrap}>
          <button className={styles.finishBtn} onClick={handleFinish}>
            🦜 결과 확인하기
          </button>
        </div>
      )}

      {pendingDecision && pendingDecision.decision && (
        <DecisionModal
          decision={pendingDecision.decision}
          currentReturn={pendingDecision.changePercent}
          currentValue={pendingDecision.value}
          onChoice={handleDecision}
        />
      )}
    </div>
  );
}
