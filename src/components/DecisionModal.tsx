import { DecisionPoint } from '../types';
import styles from './DecisionModal.module.css';

interface Props {
  decision: DecisionPoint;
  onChoice: (action: 'hold' | 'sell') => void;
}

const PEAK_LINES = [
  '🦜 꽥! 수익이 꽤 올랐는데... 팔까?',
  '🦜 지금 팔면 치킨 몇 마리 사먹을 수 있어!',
  '🦜 욕심은 끝이 없고 후회는 짧다던데~',
];

const CRASH_LINES = [
  '🦜 꽥꽥... 계속 떨어지고 있어...',
  '🦜 존버는 승리의 어머니? 아니면 파산의 아버지?',
  '🦜 멘탈 괜찮아? 나도 좀 무서운데...',
];

export function DecisionModal({ decision, onChoice }: Props) {
  const isPeak = decision.type === 'peak';
  const lines = isPeak ? PEAK_LINES : CRASH_LINES;
  const randomLine = lines[Math.floor(Math.random() * lines.length)];

  return (
    <div className={styles.overlay}>
      <div className={`${styles.modal} ${isPeak ? styles.peakModal : styles.crashModal}`}>
        <div className={styles.parrotWrap}>
          <span className={styles.parrot}>{isPeak ? '🦜' : '🦜'}</span>
          <div className={styles.parrotGlow} />
        </div>

        <div className={styles.alertBadge}>
          {isPeak ? '📈 급등 알림' : '📉 급락 알림'}
        </div>

        <h2 className={styles.title}>{decision.message}</h2>

        <div className={styles.speechBubble}>
          <p>{randomLine}</p>
        </div>

        <div className={styles.buttons}>
          <button
            className={`${styles.btn} ${styles.holdBtn}`}
            onClick={() => onChoice('hold')}
          >
            <span className={styles.btnEmoji}>{isPeak ? '💎' : '🔥'}</span>
            <span>{decision.options[0]}</span>
          </button>
          <button
            className={`${styles.btn} ${styles.sellBtn}`}
            onClick={() => onChoice('sell')}
          >
            <span className={styles.btnEmoji}>{isPeak ? '💰' : '🏃'}</span>
            <span>{decision.options[1]}</span>
          </button>
        </div>
      </div>
    </div>
  );
}
