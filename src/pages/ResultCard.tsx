import { useRef, useCallback } from 'react';
import { SimulationState } from '../types';
import { formatMoney, formatDate } from '../engine/simulation';
import styles from './ResultCard.module.css';

interface Props {
  simulation: SimulationState;
  onRestart: () => void;
}

export function ResultCard({ simulation, onRestart }: Props) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const isProfit = simulation.finalReturn >= 0;
  const emoji = getEmoji(simulation.finalReturn);
  const lastDate = simulation.timeline[simulation.timeline.length - 1]?.date ?? '';

  const holdDecisions = simulation.decisions.filter((d) => d.action === 'hold').length;
  const soldEarly = !!simulation.soldAt;

  function getEmoji(returnPct: number): string {
    if (returnPct > 200) return '🤑';
    if (returnPct > 100) return '🚀';
    if (returnPct > 50) return '😎';
    if (returnPct > 0) return '😊';
    if (returnPct > -20) return '😅';
    if (returnPct > -50) return '😭';
    return '💀';
  }

  function getComment(returnPct: number, soldEarly: boolean): string {
    if (soldEarly) return '중간에 팔았네요... 끝까지 갔다면?';
    if (returnPct > 200) return '대박! 인생이 바뀌었을 수도...';
    if (returnPct > 100) return '2배 이상! 진짜 샀어야 했는데...';
    if (returnPct > 50) return '꽤 괜찮았을걸요. 아쉽죠?';
    if (returnPct > 0) return '소소하지만 수익이긴 하죠';
    if (returnPct > -20) return '에이, 이 정도면 양반이에요';
    if (returnPct > -50) return '반토막... 마음이 아프네요';
    return '이건 진짜 안 사길 잘한 거예요';
  }

  const generateCard = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return null;

    const ctx = canvas.getContext('2d');
    if (!ctx) return null;

    const w = 600;
    const h = 400;
    canvas.width = w;
    canvas.height = h;

    // Background
    const grad = ctx.createLinearGradient(0, 0, w, h);
    grad.addColorStop(0, '#1B1B2F');
    grad.addColorStop(1, '#162447');
    ctx.fillStyle = grad;
    ctx.roundRect(0, 0, w, h, 20);
    ctx.fill();

    // Title
    ctx.fillStyle = 'rgba(255,255,255,0.5)';
    ctx.font = '500 16px Pretendard, sans-serif';
    ctx.fillText('껄무새 시간 여행 결과', 32, 40);

    // Stock name
    ctx.fillStyle = '#FFFFFF';
    ctx.font = '800 28px Pretendard, sans-serif';
    ctx.fillText(simulation.stock.name, 32, 80);

    // Period
    ctx.fillStyle = 'rgba(255,255,255,0.4)';
    ctx.font = '400 14px Pretendard, sans-serif';
    ctx.fillText(
      `${formatDate(simulation.startDate)} → ${formatDate(lastDate)}`,
      32,
      105
    );

    // Investment
    ctx.fillStyle = 'rgba(255,255,255,0.6)';
    ctx.font = '500 16px Pretendard, sans-serif';
    ctx.fillText(`투자금: ${formatMoney(simulation.investAmount)}원`, 32, 150);

    // Result
    const returnColor = isProfit ? '#FF4545' : '#3182F6';
    ctx.fillStyle = returnColor;
    ctx.font = '800 48px Pretendard, sans-serif';
    const returnText = `${isProfit ? '+' : ''}${simulation.finalReturn.toFixed(1)}%`;
    ctx.fillText(returnText, 32, 220);

    // Final value
    ctx.fillStyle = '#FFFFFF';
    ctx.font = '700 24px Pretendard, sans-serif';
    ctx.fillText(`→ ${formatMoney(simulation.finalValue)}원`, 32, 260);

    // Emoji
    ctx.font = '64px sans-serif';
    ctx.fillText(emoji, w - 100, 220);

    // Footer
    ctx.fillStyle = 'rgba(255,255,255,0.25)';
    ctx.font = '400 12px Pretendard, sans-serif';
    ctx.fillText('과거 성과는 미래 수익을 보장하지 않습니다', 32, h - 24);

    return canvas.toDataURL('image/png');
  }, [simulation, emoji, isProfit, lastDate]);

  const handleShare = async () => {
    const dataUrl = generateCard();
    if (!dataUrl) return;

    const text = `[껄무새] ${simulation.stock.name}에 ${formatMoney(simulation.investAmount)}원 투자했다면?\n${formatDate(simulation.startDate)} → ${formatDate(lastDate)}\n결과: ${isProfit ? '+' : ''}${simulation.finalReturn.toFixed(1)}% (${formatMoney(simulation.finalValue)}원)\n\n나도 해보기 → 토스 앱에서 "껄무새" 검색!`;

    try {
      const { share } = await import('@apps-in-toss/web-framework');
      await share({ message: text });
    } catch {
      // Fallback: clipboard
      try {
        await navigator.clipboard.writeText(text);
        alert('결과가 클립보드에 복사되었습니다!');
      } catch {
        alert('공유하기를 사용할 수 없습니다.');
      }
    }
  };

  const handleSaveImage = () => {
    const dataUrl = generateCard();
    if (!dataUrl) return;

    // Web fallback: download link
    const link = document.createElement('a');
    link.download = `ggulmuse-${simulation.stock.name}.png`;
    link.href = dataUrl;
    link.click();
  };

  return (
    <div className={styles.container}>
      <div className={styles.emojiWrap}>
        <span className={styles.emoji}>{emoji}</span>
      </div>

      <div className={styles.resultBox}>
        <p className={styles.stockName}>{simulation.stock.name}</p>
        <p className={styles.period}>
          {formatDate(simulation.startDate)} → {soldEarly && simulation.soldAt ? formatDate(simulation.soldAt) : formatDate(lastDate)}
        </p>

        <div className={styles.returnWrap}>
          <span
            className={styles.returnValue}
            style={{ color: isProfit ? 'var(--color-danger)' : 'var(--color-primary)' }}
          >
            {isProfit ? '+' : ''}{simulation.finalReturn.toFixed(1)}%
          </span>
        </div>

        <div className={styles.valueRow}>
          <div className={styles.valueItem}>
            <span className={styles.valueLabel}>투자금</span>
            <span className={styles.valueAmount}>{formatMoney(simulation.investAmount)}원</span>
          </div>
          <div className={styles.arrow}>→</div>
          <div className={styles.valueItem}>
            <span className={styles.valueLabel}>평가금액</span>
            <span className={styles.valueAmount}>{formatMoney(simulation.finalValue)}원</span>
          </div>
        </div>

        <p className={styles.comment}>{getComment(simulation.finalReturn, soldEarly)}</p>

        {holdDecisions > 0 && (
          <p className={styles.holdInfo}>
            {holdDecisions}번의 위기에서 버텼어요!
          </p>
        )}

        {soldEarly && simulation.soldAt && (
          <p className={styles.soldInfo}>
            {formatDate(simulation.soldAt)}에 매도했어요.
            끝까지 갔다면 {formatMoney(simulation.timeline[simulation.timeline.length - 1].value)}원이었을 거예요.
          </p>
        )}
      </div>

      <canvas ref={canvasRef} style={{ display: 'none' }} />

      <div className={styles.actions}>
        <button className={styles.shareBtn} onClick={handleShare}>
          결과 공유하기
        </button>
        <button className={styles.saveBtn} onClick={handleSaveImage}>
          카드 이미지 저장
        </button>
        <button className={styles.restartBtn} onClick={onRestart}>
          다시 해보기
        </button>
      </div>

      <footer className={styles.footer}>
        <p>과거 성과는 미래 수익을 보장하지 않습니다</p>
        <p>본 서비스는 교육/엔터테인먼트 목적이며 투자 권유가 아닙니다</p>
      </footer>
    </div>
  );
}
