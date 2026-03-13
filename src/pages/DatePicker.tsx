import { Stock } from '../types';
import { formatDate } from '../engine/simulation';
import styles from './DatePicker.module.css';

interface Props {
  stock: Stock;
  onSelectDate: (date: string) => void;
  onBack: () => void;
}

const shortcuts = [
  { label: '5년 전 오늘', emoji: '📅', getDate: () => {
    const d = new Date();
    d.setFullYear(d.getFullYear() - 5);
    return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
  }},
  { label: '3년 전 오늘', emoji: '🗓️', getDate: () => {
    const d = new Date();
    d.setFullYear(d.getFullYear() - 3);
    return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
  }},
  { label: '코로나 직전', emoji: '😷', getDate: () => '2020-01' },
  { label: '코로나 폭락', emoji: '💥', getDate: () => '2020-03' },
  { label: '동학개미운동', emoji: '🐜', getDate: () => '2020-06' },
  { label: '코스피 3000', emoji: '🚀', getDate: () => '2021-01' },
  { label: 'AI 열풍 시작', emoji: '🤖', getDate: () => '2023-05' },
  { label: '반도체 슈퍼사이클', emoji: '💾', getDate: () => '2024-01' },
];

const yearMonths: string[] = [];
for (let y = 2019; y <= 2024; y++) {
  for (let m = 1; m <= 12; m++) {
    yearMonths.push(`${y}-${String(m).padStart(2, '0')}`);
  }
}

export function DatePicker({ stock, onSelectDate, onBack }: Props) {
  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <button className={styles.backBtn} onClick={onBack}>
          ← 뒤로
        </button>
        <div className={styles.headerTop}>
          <div>
            <h1 className={styles.title}>{stock.name}</h1>
            <p className={styles.subtitle}>🦜 언제로 시간 여행할까요?</p>
          </div>
          <span className={styles.headerParrot}>⏰</span>
        </div>
      </header>

      <section className={styles.section}>
        <h2 className={styles.sectionTitle}>
          <span>⚡</span> 역사적 순간 바로가기
        </h2>
        <div className={styles.shortcuts}>
          {shortcuts.map((s, i) => (
            <button
              key={s.label}
              className={styles.shortcutBtn}
              onClick={() => onSelectDate(s.getDate())}
              style={{ animationDelay: `${i * 0.05}s` }}
            >
              <span className={styles.shortcutEmoji}>{s.emoji}</span>
              <span>{s.label}</span>
            </button>
          ))}
        </div>
      </section>

      <section className={styles.section}>
        <h2 className={styles.sectionTitle}>
          <span>📆</span> 직접 선택
        </h2>
        <div className={styles.monthGrid}>
          {yearMonths.map((ym) => (
            <button
              key={ym}
              className={styles.monthBtn}
              onClick={() => onSelectDate(ym)}
            >
              {formatDate(ym)}
            </button>
          ))}
        </div>
      </section>
    </div>
  );
}
