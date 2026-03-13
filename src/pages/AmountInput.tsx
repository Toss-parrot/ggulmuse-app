import { useState } from 'react';
import { Stock } from '../types';
import { formatDate, formatMoney } from '../engine/simulation';
import { getPriceAtDate } from '../data/stocks';
import styles from './AmountInput.module.css';

interface Props {
  stock: Stock;
  date: string;
  onStart: (amount: number) => void;
  onBack: () => void;
}

const presets = [100000, 500000, 1000000, 5000000, 10000000];

export function AmountInput({ stock, date, onStart, onBack }: Props) {
  const [amount, setAmount] = useState(1000000);
  const priceAtDate = getPriceAtDate(stock.id, date);
  const shares = priceAtDate ? (amount / priceAtDate).toFixed(2) : '?';

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <button className={styles.backBtn} onClick={onBack}>
          ← 뒤로
        </button>
        <h1 className={styles.title}>얼마나 투자했다면?</h1>
        <p className={styles.subtitle}>
          {stock.name} · {formatDate(date)}
        </p>
      </header>

      <div className={styles.amountDisplay}>
        <span className={styles.amountValue}>{formatMoney(amount)}원</span>
        <p className={styles.shareInfo}>
          {priceAtDate && `당시 주가 ${priceAtDate.toLocaleString()}원 → 약 ${shares}주`}
        </p>
      </div>

      <div className={styles.sliderWrap}>
        <input
          type="range"
          className={styles.slider}
          min={100000}
          max={10000000}
          step={100000}
          value={amount}
          onChange={(e) => setAmount(Number(e.target.value))}
        />
        <div className={styles.sliderLabels}>
          <span>10만</span>
          <span>1000만</span>
        </div>
      </div>

      <div className={styles.presets}>
        {presets.map((p) => (
          <button
            key={p}
            className={`${styles.presetBtn} ${amount === p ? styles.presetActive : ''}`}
            onClick={() => setAmount(p)}
          >
            {formatMoney(p)}
          </button>
        ))}
      </div>

      <div className={styles.startWrap}>
        <button className={styles.startBtn} onClick={() => onStart(amount)}>
          시간 여행 시작하기
        </button>
      </div>
    </div>
  );
}
