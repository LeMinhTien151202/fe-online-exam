import styled from 'styled-components';
import { Cefr } from '@/shared/utils/cefrScale';

// Bảng màu band CEFR (hex) cho các khối tự vẽ (badge lớn, viền), đồng bộ với cefrTagColor.
export const BAND_HEX: Record<string, { bg: string; fg: string; soft: string }> = {
  C1: { bg: '#c026d3', fg: '#ffffff', soft: '#fae8ff' },
  B2: { bg: '#16a34a', fg: '#ffffff', soft: '#dcfce7' },
  B1: { bg: '#0891b2', fg: '#ffffff', soft: '#cffafe' },
  A2: { bg: '#2563eb', fg: '#ffffff', soft: '#dbeafe' },
  A1: { bg: '#ea580c', fg: '#ffffff', soft: '#ffedd5' },
  A0: { bg: '#dc2626', fg: '#ffffff', soft: '#fee2e2' },
  none: { bg: '#94a3b8', fg: '#ffffff', soft: '#f1f5f9' },
};

export const bandHex = (band: Cefr | null) => BAND_HEX[band ?? 'none'] ?? BAND_HEX.none;

// Nền trang kết quả: cuộn được, canh giữa, gradient nhạt.
export const ResultPage = styled.div`
  min-height: 100vh;
  width: 100%;
  overflow-y: auto;
  background: linear-gradient(180deg, #f8fafc 0%, #eef2f7 100%);
  display: flex;
  justify-content: center;
  padding: 2.5rem 1rem 3rem;
  font-family: 'Outfit', 'Inter', system-ui, sans-serif;
`;

export const ResultInner = styled.div`
  width: 100%;
  max-width: 760px;
  display: flex;
  flex-direction: column;
  gap: 1.25rem;
`;

// KHỐI HERO — nền tối, hiển thị CEFR tổng
export const HeroCard = styled.div`
  position: relative;
  border-radius: 20px;
  padding: 2.25rem 2rem 2rem;
  background: radial-gradient(120% 140% at 50% 0%, #1e3a5f 0%, #0d2245 60%);
  color: #fff;
  text-align: center;
  box-shadow: 0 18px 40px rgba(13, 34, 69, 0.28);
  overflow: hidden;

  &::after {
    content: '';
    position: absolute;
    inset: 0;
    background: radial-gradient(60% 60% at 50% -10%, rgba(96, 165, 250, 0.25), transparent 70%);
    pointer-events: none;
  }
`;

export const HeroCheck = styled.div`
  width: 56px;
  height: 56px;
  border-radius: 50%;
  margin: 0 auto 0.75rem;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(16, 185, 129, 0.18);
  border: 1px solid rgba(16, 185, 129, 0.5);
  font-size: 28px;
  color: #34d399;
`;

export const HeroTitle = styled.h2`
  margin: 0;
  font-size: 1.5rem;
  font-weight: 800;
  letter-spacing: -0.01em;
`;

export const HeroSubtitle = styled.p`
  margin: 0.35rem 0 0;
  font-size: 0.9rem;
  color: rgba(255, 255, 255, 0.65);
`;

// Badge CEFR tổng lớn (tròn), màu theo band
export const CefrBadge = styled.div<{ $band: Cefr | null }>`
  position: relative;
  z-index: 1;
  margin: 1.5rem auto 0.25rem;
  width: 108px;
  height: 108px;
  border-radius: 50%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  background: ${({ $band }) => bandHex($band).bg};
  color: ${({ $band }) => bandHex($band).fg};
  box-shadow: 0 10px 30px ${({ $band }) => bandHex($band).bg}66;
  border: 4px solid rgba(255, 255, 255, 0.25);

  .band {
    font-size: 2.25rem;
    font-weight: 900;
    line-height: 1;
  }
  .caption {
    font-size: 0.62rem;
    letter-spacing: 0.12em;
    text-transform: uppercase;
    opacity: 0.85;
    margin-top: 2px;
  }
`;

export const CefrPending = styled.div`
  position: relative;
  z-index: 1;
  margin: 1.5rem auto 0.5rem;
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.6rem 1.1rem;
  border-radius: 999px;
  background: rgba(255, 255, 255, 0.1);
  border: 1px dashed rgba(255, 255, 255, 0.35);
  font-size: 0.85rem;
  color: rgba(255, 255, 255, 0.85);
`;

export const CefrLabel = styled.div`
  position: relative;
  z-index: 1;
  font-size: 0.72rem;
  letter-spacing: 0.14em;
  text-transform: uppercase;
  color: rgba(255, 255, 255, 0.55);
  margin-top: 1.25rem;
`;

// Dải điểm tổng (trắc nghiệm / điểm ý)
export const ScoreStrip = styled.div`
  position: relative;
  z-index: 1;
  margin-top: 1.5rem;
  display: flex;
  justify-content: center;
  gap: 0.75rem;
  flex-wrap: wrap;
`;

export const ScorePill = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  min-width: 108px;
  padding: 0.65rem 1.1rem;
  border-radius: 14px;
  background: rgba(255, 255, 255, 0.08);
  border: 1px solid rgba(255, 255, 255, 0.12);

  .val {
    font-size: 1.35rem;
    font-weight: 800;
    line-height: 1.1;
  }
  .lbl {
    font-size: 0.72rem;
    color: rgba(255, 255, 255, 0.6);
    margin-top: 2px;
  }
`;

export const ManualReviewNote = styled.div`
  position: relative;
  z-index: 1;
  margin-top: 1.25rem;
  display: inline-flex;
  align-items: center;
  gap: 0.4rem;
  padding: 0.4rem 0.9rem;
  border-radius: 999px;
  background: rgba(251, 191, 36, 0.16);
  border: 1px solid rgba(251, 191, 36, 0.4);
  color: #fde68a;
  font-size: 0.8rem;
  font-weight: 600;
`;

// PANEL trắng chung (điểm kỹ năng / AI)
export const Panel = styled.section`
  background: #fff;
  border-radius: 18px;
  padding: 1.5rem;
  box-shadow: 0 6px 24px rgba(15, 23, 42, 0.06);
  border: 1px solid #eef2f7;
`;

export const PanelHead = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-bottom: 1.25rem;

  h3 {
    margin: 0;
    font-size: 1.05rem;
    font-weight: 800;
    color: #0f172a;
  }
  .hint {
    font-size: 0.75rem;
    color: #94a3b8;
    font-weight: 500;
    cursor: help;
  }
`;

// Một dòng kỹ năng
export const SkillRow = styled.div`
  & + & {
    margin-top: 1.1rem;
  }
`;

export const SkillTop = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 0.4rem;
`;

export const SkillName = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;

  .name {
    font-weight: 700;
    color: #1e293b;
    font-size: 0.95rem;
  }
`;

export const SkillScore = styled.div`
  font-weight: 800;
  color: #334155;
  font-size: 0.95rem;

  small {
    font-weight: 600;
    color: #94a3b8;
    font-size: 0.75rem;
  }
`;

// Thanh tiến độ band tự vẽ (tránh phụ thuộc màu antd)
export const BandTrack = styled.div`
  width: 100%;
  height: 8px;
  border-radius: 999px;
  background: #f1f5f9;
  overflow: hidden;
`;

export const BandFill = styled.div<{ $pct: number; $color: string }>`
  height: 100%;
  width: ${({ $pct }) => Math.max(2, Math.min(100, $pct))}%;
  background: ${({ $color }) => $color};
  border-radius: 999px;
  transition: width 0.5s cubic-bezier(0.4, 0, 0.2, 1);
`;

// Dòng nhận xét AI
export const AiRow = styled.div`
  padding: 0.9rem 0;
  border-bottom: 1px solid #f1f5f9;

  &:last-child {
    border-bottom: none;
    padding-bottom: 0;
  }
`;

export const AiTop = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 0.5rem;
  gap: 0.5rem;
`;

export const AiFeedback = styled.p`
  margin: 0;
  color: #475569;
  font-size: 0.88rem;
  line-height: 1.55;
`;

export const AiScoreVal = styled.b<{ $color: string }>`
  color: ${({ $color }) => $color};
  font-size: 0.95rem;
  white-space: nowrap;
`;

export const Footer = styled.div`
  display: flex;
  justify-content: center;
  padding-top: 0.5rem;
`;
