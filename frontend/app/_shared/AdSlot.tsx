'use client';
/**
 * AdSlot v3 — Neural Lab "TRANSMISSION" 스타일
 *
 * 네이티브 광고를 "신호 전송" 카드로 표현.
 * 시안/바이올렛/핑크 네온 엣지로 각 슬롯 구분.
 */

import { useEffect, useState } from 'react';

const SLOT_ID_MAP: Record<string, string> = {
  'sidebar': '0000000001',
  'home-top': '0000000002',
  'home-mid': '0000000003',
  'home-bottom': '0000000008',
  'analytics-top': '0000000004',
  'analytics-bottom': '0000000005',
  'assets-top': '0000000006',
  'about-mid': '0000000007',
  'blog-top': '0000000009',
  'blog-post-top': '0000000010',
  'blog-post-bottom': '0000000011',
};

type AdVariant = 'horizontal' | 'vertical' | 'in-content' | 'square' | 'native-card' | 'sidebar-card';

interface AdSlotProps {
  slot: keyof typeof SLOT_ID_MAP | string;
  variant?: AdVariant;
  className?: string;
  label?: string;
}

declare global {
  interface Window {
    adsbygoogle?: any[];
  }
}

type FallbackContent = {
  code: string;
  title: string;
  desc: string;
  cta: string;
  accent: 'cyan' | 'violet' | 'pink' | 'green' | 'amber';
  tag: string;
};

const FALLBACK: Record<string, FallbackContent[]> = {
  'sidebar': [
    {
      code: 'TIP-001',
      title: '유지율 +40% 법칙',
      desc: '첫 30초에 호기심 훅 걸기',
      cta: 'GUIDE',
      accent: 'cyan',
      tag: 'INTEL',
    },
    {
      code: 'NODE-02',
      title: '블루오션 주간 분석',
      desc: 'IT·자기계발 · 경쟁 LOW',
      cta: 'SCAN',
      accent: 'pink',
      tag: 'HOT',
    },
    {
      code: 'UPD-034',
      title: '다큐 v2.1 모듈',
      desc: 'BBC식 차분한 내레이션',
      cta: 'DEPLOY',
      accent: 'violet',
      tag: 'NEW',
    },
  ],
  'home-top': [
    {
      code: 'TX-HOME-01',
      title: '크리에이터 필수 도구 7가지',
      desc: '2026 가장 주목받는 무료 AI 도구 모음 · 썸네일·자막·분석·편집',
      cta: 'ARCHIVE',
      accent: 'cyan',
      tag: 'FEATURED',
    },
  ],
  'home-mid': [
    {
      code: 'TX-HOME-02',
      title: '경쟁 채널 레이더',
      desc: '키워드 하나로 Top 10 채널·평균 조회수·경쟁 강도를 3초에 분석',
      cta: 'ANALYZE',
      accent: 'violet',
      tag: 'TOOL',
    },
  ],
  'home-bottom': [
    {
      code: 'TX-HOME-03',
      title: '첫 달 체크리스트 10가지',
      desc: '채널 세팅부터 첫 영상 업로드까지 실전 가이드',
      cta: 'READ',
      accent: 'green',
      tag: 'GUIDE',
    },
  ],
  'analytics-top': [
    {
      code: 'TX-ANL-01',
      title: '경쟁 강도 판정 기준',
      desc: 'Top 10 총 구독자 100만+ → HIGH · 10만↓ → LOW',
      cta: 'DOCS',
      accent: 'cyan',
      tag: 'INTEL',
    },
  ],
  'analytics-bottom': [
    {
      code: 'TX-ANL-02',
      title: '분석 → 영상 제작 파이프라인',
      desc: '경쟁 분석 결과를 바로 AI 시나리오로 연결',
      cta: 'GENERATE',
      accent: 'pink',
      tag: 'FLOW',
    },
  ],
  'blog-top': [
    {
      code: 'TX-BLG-01',
      title: '2026 YouTube 알고리즘',
      desc: '세션 시청 시간 핵심 · 썸네일 일관성 가산점',
      cta: 'FULL_TEXT',
      accent: 'violet',
      tag: 'FEATURED',
    },
  ],
  'blog-post-top': [
    {
      code: 'TX-POST-01',
      title: '이 글의 원칙 적용하기',
      desc: 'AlgoMaker 시나리오로 즉시 실험 가능',
      cta: 'LAUNCH',
      accent: 'cyan',
      tag: 'TOOL',
    },
  ],
  'blog-post-bottom': [
    {
      code: 'TX-POST-02',
      title: '다음 인사이트',
      desc: '크리에이터 인사이트 아카이브 전체',
      cta: 'ARCHIVE',
      accent: 'amber',
      tag: 'RELATED',
    },
  ],
};

function getFallback(slot: string): FallbackContent {
  const pool = FALLBACK[slot] || FALLBACK['home-top'];
  const idx = Math.floor(Date.now() / (1000 * 60 * 60)) % pool.length;
  return pool[idx];
}

const ACCENT_COLORS: Record<FallbackContent['accent'], { color: string; dim: string; glow: string }> = {
  cyan: { color: '#00e5ff', dim: 'rgba(0,229,255,0.1)', glow: 'rgba(0,229,255,0.3)' },
  violet: { color: '#a855f7', dim: 'rgba(168,85,247,0.1)', glow: 'rgba(168,85,247,0.3)' },
  pink: { color: '#ec4899', dim: 'rgba(236,72,153,0.1)', glow: 'rgba(236,72,153,0.3)' },
  green: { color: '#4ade80', dim: 'rgba(74,222,128,0.1)', glow: 'rgba(74,222,128,0.3)' },
  amber: { color: '#fbbf24', dim: 'rgba(251,191,36,0.1)', glow: 'rgba(251,191,36,0.3)' },
};

export default function AdSlot({
  slot,
  variant = 'horizontal',
  className = '',
  label,
}: AdSlotProps) {
  const clientId = process.env.NEXT_PUBLIC_ADSENSE_CLIENT_ID || '';
  const enabled = process.env.NEXT_PUBLIC_ADSENSE_ENABLED === 'true';
  const slotId = SLOT_ID_MAP[slot] || slot;
  const isLive = Boolean(clientId && enabled);

  const [content, setContent] = useState<FallbackContent | null>(null);

  useEffect(() => {
    if (!isLive) setContent(getFallback(slot));
  }, [slot, isLive]);

  useEffect(() => {
    if (!isLive) return;
    try {
      if (typeof window !== 'undefined') {
        (window.adsbygoogle = window.adsbygoogle || []).push({});
      }
    } catch (e) {
      console.warn('[AdSlot] push failed:', e);
    }
  }, [isLive, slot]);

  // 🟢 실광고 (승인 후)
  if (isLive) {
    const sizeStyle: React.CSSProperties = variant === 'sidebar-card' ? { width: '100%', minHeight: 100 } :
      variant === 'vertical' ? { width: '100%', minHeight: 250 } :
      variant === 'in-content' ? { width: '100%', minHeight: 120 } :
      { width: '100%', minHeight: 90 };

    return (
      <div className={`ad-live ${className}`} style={sizeStyle}>
        <ins
          className="adsbygoogle"
          style={{ display: 'block', width: '100%', height: '100%' }}
          data-ad-client={clientId}
          data-ad-slot={slotId}
          data-ad-format={variant === 'in-content' ? 'fluid' : 'auto'}
          data-full-width-responsive="true"
        />
      </div>
    );
  }

  if (!content) return null;

  const c = ACCENT_COLORS[content.accent];

  // Sidebar compact
  if (variant === 'sidebar-card' || slot === 'sidebar') {
    return (
      <div className={`txSidebar ${className}`}>
        <style jsx>{`
          .txSidebar {
            padding: 12px 13px 11px;
            background: linear-gradient(145deg, #0f0f18 0%, #0a0a0f 100%);
            border: 1px solid rgba(255,255,255,0.08);
            border-radius: 7px;
            cursor: pointer;
            transition: all 0.2s;
            position: relative;
            overflow: hidden;
          }
          .txSidebar::before {
            content: '';
            position: absolute;
            left: 0; top: 0; bottom: 0;
            width: 2px;
            background: ${c.color};
            box-shadow: 0 0 8px ${c.color};
          }
          .txSidebar:hover {
            border-color: ${c.color};
            transform: translateY(-1px);
          }
          .txHead {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 7px;
          }
          .txCode {
            font-family: 'JetBrains Mono', monospace;
            font-size: 8.5px;
            font-weight: 600;
            color: ${c.color};
            letter-spacing: 0.08em;
          }
          .txTag {
            font-family: 'JetBrains Mono', monospace;
            font-size: 8px;
            font-weight: 700;
            padding: 1px 5px;
            border-radius: 2px;
            background: ${c.dim};
            color: ${c.color};
            letter-spacing: 0.1em;
            border: 1px solid ${c.color};
          }
          .txTitle {
            font-family: 'Space Grotesk', 'Inter', sans-serif;
            font-size: 12px;
            font-weight: 700;
            color: #fff;
            letter-spacing: -0.01em;
            line-height: 1.35;
            margin-bottom: 3px;
          }
          .txDesc {
            font-size: 10.5px;
            color: #909098;
            line-height: 1.45;
            margin-bottom: 8px;
          }
          .txCta {
            font-family: 'JetBrains Mono', monospace;
            font-size: 9px;
            font-weight: 700;
            color: ${c.color};
            letter-spacing: 0.12em;
            display: inline-flex;
            align-items: center;
            gap: 3px;
          }
          .txCta::after {
            content: '→';
          }
        `}</style>
        <div className="txHead">
          <span className="txCode">▸ {content.code}</span>
          <span className="txTag">{content.tag}</span>
        </div>
        <div className="txTitle">{content.title}</div>
        <div className="txDesc">{content.desc}</div>
        <div className="txCta">{content.cta}</div>
      </div>
    );
  }

  // Horizontal (big transmission card)
  return (
    <div className={`txBig ${className}`}>
      <style jsx>{`
        .txBig {
          background: linear-gradient(135deg, #0a0a0f 0%, #0f0f18 100%);
          border: 1px solid rgba(255,255,255,0.08);
          border-radius: 10px;
          padding: 18px 22px;
          display: flex;
          align-items: center;
          gap: 20px;
          cursor: pointer;
          transition: all 0.25s cubic-bezier(0.22, 1, 0.36, 1);
          position: relative;
          overflow: hidden;
          min-height: 96px;
        }
        .txBig::before {
          content: '';
          position: absolute;
          left: 0; top: 0; bottom: 0;
          width: 3px;
          background: linear-gradient(180deg, ${c.color}, transparent);
          box-shadow: 0 0 12px ${c.color};
        }
        .txBig::after {
          content: '';
          position: absolute;
          top: 0; right: 0;
          width: 160px; height: 100%;
          background: radial-gradient(circle at top right, ${c.glow} 0%, transparent 60%);
          pointer-events: none;
          opacity: 0.6;
        }
        .txBig:hover {
          border-color: ${c.color};
          transform: translateY(-2px);
          box-shadow: 0 8px 32px ${c.dim};
        }

        .txSide {
          flex-shrink: 0;
          width: 80px;
          display: flex;
          flex-direction: column;
          justify-content: space-between;
          align-self: stretch;
          padding: 4px 0;
        }
        .sideCode {
          font-family: 'JetBrains Mono', monospace;
          font-size: 9px;
          font-weight: 600;
          color: ${c.color};
          letter-spacing: 0.12em;
        }
        .sideMarks {
          display: flex;
          gap: 4px;
          margin-top: auto;
        }
        .sideMark {
          width: 4px; height: 4px;
          background: ${c.color};
          border-radius: 1px;
          box-shadow: 0 0 4px ${c.color};
        }
        .sideMark:nth-child(2) { opacity: 0.6; }
        .sideMark:nth-child(3) { opacity: 0.3; }

        .txBody {
          flex: 1;
          min-width: 0;
          z-index: 1;
        }
        .txMeta {
          display: flex;
          align-items: center;
          gap: 8px;
          margin-bottom: 6px;
        }
        .bigTag {
          font-family: 'JetBrains Mono', monospace;
          font-size: 9px;
          font-weight: 700;
          padding: 2px 7px;
          border-radius: 3px;
          background: ${c.dim};
          color: ${c.color};
          letter-spacing: 0.12em;
          border: 1px solid ${c.color};
        }
        .metaLabel {
          font-family: 'JetBrains Mono', monospace;
          font-size: 9px;
          color: #606070;
          letter-spacing: 0.06em;
        }
        .bigTitle {
          font-family: 'Space Grotesk', 'Inter', sans-serif;
          font-size: 16px;
          font-weight: 700;
          color: #fff;
          letter-spacing: -0.015em;
          line-height: 1.3;
          margin-bottom: 4px;
        }
        .bigDesc {
          font-size: 12.5px;
          color: #909098;
          line-height: 1.55;
        }

        .bigCta {
          flex-shrink: 0;
          padding: 10px 18px;
          background: transparent;
          color: ${c.color};
          border: 1px solid ${c.color};
          border-radius: 4px;
          font-family: 'JetBrains Mono', monospace;
          font-size: 10.5px;
          font-weight: 700;
          letter-spacing: 0.12em;
          display: inline-flex;
          align-items: center;
          gap: 6px;
          white-space: nowrap;
          z-index: 1;
          transition: all 0.15s;
          cursor: pointer;
        }
        .txBig:hover .bigCta {
          background: ${c.color};
          color: #0a0a0f;
          box-shadow: 0 0 16px ${c.glow};
        }

        @media (max-width: 640px) {
          .txBig { padding: 14px 16px; gap: 12px; min-height: 84px; }
          .txSide { width: 48px; }
          .sideCode { font-size: 8px; }
          .bigTitle { font-size: 13.5px; }
          .bigDesc { font-size: 11px; }
          .bigCta { padding: 8px 12px; font-size: 9.5px; }
        }
      `}</style>
      <div className="txSide">
        <span className="sideCode">{content.code}</span>
        <div className="sideMarks">
          <span className="sideMark" />
          <span className="sideMark" />
          <span className="sideMark" />
        </div>
      </div>
      <div className="txBody">
        <div className="txMeta">
          <span className="bigTag">{content.tag}</span>
          <span className="metaLabel">▸ SPONSORED · ALGOMAKER</span>
        </div>
        <div className="bigTitle">{content.title}</div>
        <div className="bigDesc">{content.desc}</div>
      </div>
      <button className="bigCta">
        {content.cta}
      </button>
    </div>
  );
}
