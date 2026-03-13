import { useState } from 'react';
import { Stock } from '../types';
import { stocks, getTeaser } from '../data/stocks';
import styles from './Home.module.css';

interface Props {
  onSelectStock: (stock: Stock) => void;
}

const PARROT_LINES = [
  '삼전 그때 샀으면 지금쯤... 🦜',
  '후회는 숫자로 해야 제맛이지~ 🦜',
  '과거로 돌아갈 순 없지만, 체험은 가능! 🦜',
];

export function Home({ onSelectStock }: Props) {
  const [search, setSearch] = useState('');
  const [parrotLine] = useState(() => PARROT_LINES[Math.floor(Math.random() * PARROT_LINES.length)]);

  const filtered = stocks.filter(
    (s) => s.name.includes(search) || s.sector.includes(search) || s.code.includes(search)
  );

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <div className={styles.headerBg} />
        <div className={styles.headerContent}>
          <div className={styles.parrotWrap}>
            <span className={styles.parrot}>🦜</span>
          </div>
          <h1 className={styles.title}>껄무새</h1>
          <p className={styles.subtitle}>"그때 샀더라면?" 후회를 숫자로 체험해요</p>
          <div className={styles.speechBubble}>
            <p>{parrotLine}</p>
          </div>
        </div>
      </header>

      <div className={styles.searchWrap}>
        <div className={styles.searchIcon}>🔍</div>
        <input
          className={styles.search}
          type="text"
          placeholder="종목명 또는 코드로 검색"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      <section className={styles.section}>
        <h2 className={styles.sectionTitle}>
          <span>🔥</span> 요즘 다들 후회하는 종목
        </h2>
        <ul className={styles.stockList}>
          {filtered.map((stock, idx) => (
            <li
              key={stock.id}
              className={styles.stockCard}
              onClick={() => onSelectStock(stock)}
              style={{ animationDelay: `${idx * 0.08}s` }}
            >
              <div className={styles.cardInner}>
                <div className={styles.stockTop}>
                  <div className={styles.stockInfo}>
                    <span className={styles.stockName}>{stock.name}</span>
                    <span className={styles.stockCode}>{stock.code}</span>
                  </div>
                  <div className={styles.stockBadge}>{stock.sector}</div>
                </div>
                <p className={styles.stockDesc}>{stock.description}</p>
                <div className={styles.stockTeaser}>
                  <span className={styles.teaserLabel}>5년 전 100만원 →</span>
                  <span className={styles.teaserValue}>{getTeaser(stock.id)}</span>
                </div>
                <div className={styles.cardArrow}>→</div>
              </div>
            </li>
          ))}
        </ul>
      </section>

      <footer className={styles.footer}>
        <span className={styles.footerParrot}>🦜</span>
        <p>과거 성과는 미래 수익을 보장하지 않습니다</p>
        <p>본 서비스는 교육/엔터테인먼트 목적입니다</p>
      </footer>
    </div>
  );
}
