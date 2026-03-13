import { DecisionPoint } from '../types';
import styles from './DecisionModal.module.css';

interface Props {
  decision: DecisionPoint;
  onChoice: (action: 'hold' | 'sell') => void;
}

export function DecisionModal({ decision, onChoice }: Props) {
  const isPeak = decision.type === 'peak';

  return (
    <div className={styles.overlay}>
      <div className={styles.modal}>
        <div className={`${styles.emoji} ${isPeak ? styles.peak : styles.crash}`}>
          {isPeak ? '🔥' : '💀'}
        </div>
        <h2 className={styles.title}>{decision.message}</h2>
        <p className={styles.desc}>
          {isPeak
            ? '수익이 꽤 올랐어요. 여기서 팔면 확정 수익!'
            : '계속 떨어지고 있어요. 버틸 수 있을까요?'}
        </p>
        <div className={styles.buttons}>
          <button
            className={`${styles.btn} ${styles.holdBtn}`}
            onClick={() => onChoice('hold')}
          >
            {decision.options[0]}
          </button>
          <button
            className={`${styles.btn} ${styles.sellBtn}`}
            onClick={() => onChoice('sell')}
          >
            {decision.options[1]}
          </button>
        </div>
      </div>
    </div>
  );
}
