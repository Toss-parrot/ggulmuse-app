import { useState } from 'react';
import { Stock } from '../types';
import { stocks, getTeaser } from '../data/stocks';
import styles from './Home.module.css';

interface Props {
  onSelectStock: (stock: Stock) => void;
}

export function Home({ onSelectStock }: Props) {
  const [search, setSearch] = useState('');

  const filtered = stocks.filter(
    (s) => s.name.includes(search) || s.sector.includes(search) || s.code.includes(search)
  );

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <p className={styles.label}>시간 여행 투자 시뮬레이터</p>
        <h1 className={styles.title}>껄무새</h1>
        <p className={styles.subtitle}>"그때 샀더라면?" 후회를 숫자로 체험해요</p>
      </header>

      <div className={styles.searchWrap}>
        <input
          className={styles.search}
          type="text"
          placeholder="종목명 또는 코드로 검색"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      <section className={styles.section}>
        <h2 className={styles.sectionTitle}>요즘 다들 후회하는 종목</h2>
        <ul className={styles.stockList}>
          {filtered.map((stock) => (
            <li key={stock.id} className={styles.stockCard} onClick={() => onSelectStock(stock)}>
              <div className={styles.stockInfo}>
                <span className={styles.stockName}>{stock.name}</span>
                <span className={styles.stockCode}>{stock.code}</span>
              </div>
              <p className={styles.stockDesc}>{stock.description}</p>
              <div className={styles.stockTeaser}>
                <span className={styles.teaserLabel}>5년 전 100만원 →</span>
                <span className={styles.teaserValue}>{getTeaser(stock.id)}</span>
              </div>
              <div className={styles.stockBadge}>{stock.sector}</div>
            </li>
          ))}
        </ul>
      </section>

      <footer className={styles.footer}>
        <p>과거 성과는 미래 수익을 보장하지 않습니다</p>
      </footer>
    </div>
  );
}
