import { useRef, useCallback } from 'react';
import { SimulationState } from '../types';
import { formatMoney, formatDate } from '../engine/simulation';
import styles from './ResultCard.module.css';

interface Props {
  simulation: SimulationState;
  onRestart: () => void;
}

function getParrotEmoji(returnPct: number): string {
  if (returnPct > 200) return '🦜';
  if (returnPct > 100) return '🦜';
  if (returnPct > 50) return '🦜';
  if (returnPct > 0) return '🦜';
  if (returnPct > -20) return '🦜';
  return '🦜';
}

function getParrotMood(returnPct: number): string {
  if (returnPct > 200) return '껄무새가 환장하고 있어요!';
  if (returnPct > 100) return '껄무새가 노래를 부르고 있어요!';
  if (returnPct > 50) return '껄무새가 신나게 춤추고 있어요!';
  if (returnPct > 0) return '껄무새가 기분 좋아 보여요~';
  if (returnPct > -20) return '껄무새가 좀 시무룩해요...';
  if (returnPct > -50) return '껄무새가 울고 있어요...';
  return '껄무새가 기절했어요...';
}

function getReactionEmoji(returnPct: number): string {
  if (returnPct > 200) return '🤑🚀💎';
  if (returnPct > 100) return '🎉🔥✨';
  if (returnPct > 50) return '😎💪👍';
  if (returnPct > 0) return '😊📈🌱';
  if (returnPct > -20) return '😅💦📉';
  if (returnPct > -50) return '😭💔📉';
  return '💀🪦☠️';
}

function getComment(returnPct: number, soldEarly: boolean): string {
  if (soldEarly) return '중간에 팔았네요... 끝까지 갔다면 어땠을까?';
  if (returnPct > 200) return '"그때 샀더라면" — 진짜 인생이 바뀌었을 수도!';
  if (returnPct > 100) return '2배 이상! 이걸 놓치다니... 꽥!';
  if (returnPct > 50) return '꽤 괜찮았을걸요. 지금이라도... 아 안 돼!';
  if (returnPct > 0) return '소소하지만 수익이긴 하죠. 은행보단 나았어요!';
  if (returnPct > -20) return '에이, 이 정도면 양반이에요~';
  if (returnPct > -50) return '반토막... 존버가 답이 아니었을지도?';
  return '안 사길 잘했다는 게 위안이 될까요... 🦜';
}

export function ResultCard({ simulation, onRestart }: Props) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const isProfit = simulation.finalReturn >= 0;
  const parrotEmoji = getParrotEmoji(simulation.finalReturn);
  const lastDate = simulation.timeline[simulation.timeline.length - 1]?.date ?? '';

  const holdDecisions = simulation.decisions.filter((d) => d.action === 'hold').length;
  const soldEarly = !!simulation.soldAt;

  const generateCard = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return null;

    const ctx = canvas.getContext('2d');
    if (!ctx) return null;

    const w = 600;
    const h = 420;
    canvas.width = w;
    canvas.height = h;

    // Background
    const grad = ctx.createLinearGradient(0, 0, w, h);
    grad.addColorStop(0, '#0F172A');
    grad.addColorStop(0.5, '#1E293B');
    grad.addColorStop(1, '#0F4C3A');
    ctx.fillStyle = grad;
    ctx.roundRect(0, 0, w, h, 20);
    ctx.fill();

    // Accent line
    const lineGrad = ctx.createLinearGradient(0, 0, w, 0);
    lineGrad.addColorStop(0, '#55C595');
    lineGrad.addColorStop(1, '#3182F6');
    ctx.fillStyle = lineGrad;
    ctx.roundRect(0, 0, w, 4, [20, 20, 0, 0]);
    ctx.fill();

    // Parrot + Title
    ctx.font = '40px sans-serif';
    ctx.fillText('🦜', 32, 56);
    ctx.fillStyle = 'rgba(255,255,255,0.4)';
    ctx.font = '600 16px Pretendard, sans-serif';
    ctx.fillText('껄무새 시간 여행 결과', 80, 50);

    // Stock name
    ctx.fillStyle = '#FFFFFF';
    ctx.font = '800 28px Pretendard, sans-serif';
    ctx.fillText(simulation.stock.name, 32, 100);

    // Period
    ctx.fillStyle = 'rgba(255,255,255,0.35)';
    ctx.font = '500 14px Pretendard, sans-serif';
    ctx.fillText(
      `${formatDate(simulation.startDate)} → ${formatDate(lastDate)}`,
      32,
      125
    );

    // Investment
    ctx.fillStyle = 'rgba(255,255,255,0.5)';
    ctx.font = '600 16px Pretendard, sans-serif';
    ctx.fillText(`투자금: ${formatMoney(simulation.investAmount)}원`, 32, 170);

    // Result
    const returnColor = isProfit ? '#FF6B6B' : '#6BB5FF';
    ctx.fillStyle = returnColor;
    ctx.font = '900 52px Pretendard, sans-serif';
    const returnText = `${isProfit ? '+' : ''}${simulation.finalReturn.toFixed(1)}%`;
    ctx.fillText(returnText, 32, 245);

    // Final value
    ctx.fillStyle = '#FFFFFF';
    ctx.font = '700 22px Pretendard, sans-serif';
    ctx.fillText(`→ ${formatMoney(simulation.finalValue)}원`, 32, 285);

    // Reaction emojis
    ctx.font = '40px sans-serif';
    ctx.fillText(getReactionEmoji(simulation.finalReturn), w - 150, 240);

    // Footer
    ctx.fillStyle = 'rgba(255,255,255,0.2)';
    ctx.font = '400 12px Pretendard, sans-serif';
    ctx.fillText('과거 성과는 미래 수익을 보장하지 않습니다', 32, h - 20);

    return canvas.toDataURL('image/png');
  }, [simulation, isProfit, lastDate]);

  const handleShare = async () => {
    generateCard();

    const text = `🦜 [껄무새] ${simulation.stock.name}에 ${formatMoney(simulation.investAmount)}원 투자했다면?\n\n${formatDate(simulation.startDate)} → ${formatDate(lastDate)}\n결과: ${isProfit ? '+' : ''}${simulation.finalReturn.toFixed(1)}% (${formatMoney(simulation.finalValue)}원)\n\n${getComment(simulation.finalReturn, soldEarly)}\n\n나도 해보기 → 토스 앱에서 "껄무새" 검색!`;

    try {
      const { share } = await import('@apps-in-toss/web-framework');
      await share({ message: text });
    } catch {
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

    const link = document.createElement('a');
    link.download = `ggulmuse-${simulation.stock.name}.png`;
    link.href = dataUrl;
    link.click();
  };

  return (
    <div className={styles.container}>
      <div className={styles.bgOrbs}>
        <div className={styles.orb1} />
        <div className={styles.orb2} />
      </div>

      <div className={styles.parrotSection}>
        <span className={styles.parrot}>{parrotEmoji}</span>
        <p className={styles.parrotMood}>{getParrotMood(simulation.finalReturn)}</p>
      </div>

      <div className={styles.reactionEmojis}>
        {getReactionEmoji(simulation.finalReturn)}
      </div>

      <div className={styles.resultCard}>
        <div className={styles.cardAccent} />
        <p className={styles.stockName}>{simulation.stock.name}</p>
        <p className={styles.period}>
          {formatDate(simulation.startDate)} → {soldEarly && simulation.soldAt ? formatDate(simulation.soldAt) : formatDate(lastDate)}
        </p>

        <div className={styles.returnWrap}>
          <span
            className={styles.returnValue}
            style={{ color: isProfit ? '#FF6B6B' : '#6BB5FF' }}
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

        <div className={styles.commentBox}>
          <p>🦜 {getComment(simulation.finalReturn, soldEarly)}</p>
        </div>

        {holdDecisions > 0 && (
          <div className={styles.holdBadge}>
            💎 {holdDecisions}번의 위기에서 버텼어요!
          </div>
        )}

        {soldEarly && simulation.soldAt && (
          <div className={styles.soldInfo}>
            {formatDate(simulation.soldAt)}에 매도. 끝까지 갔다면 {formatMoney(simulation.timeline[simulation.timeline.length - 1].value)}원이었을 거예요.
          </div>
        )}
      </div>

      <canvas ref={canvasRef} style={{ display: 'none' }} />

      <div className={styles.actions}>
        <button className={styles.shareBtn} onClick={handleShare}>
          🦜 결과 공유하기
        </button>
        <button className={styles.saveBtn} onClick={handleSaveImage}>
          📸 카드 이미지 저장
        </button>
        <button className={styles.restartBtn} onClick={onRestart}>
          다른 종목으로 다시 해보기
        </button>
      </div>

      <footer className={styles.footer}>
        <p>과거 성과는 미래 수익을 보장하지 않습니다</p>
        <p>본 서비스는 교육/엔터테인먼트 목적이며 투자 권유가 아닙니다</p>
      </footer>
    </div>
  );
}
