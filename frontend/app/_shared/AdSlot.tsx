'use client';
/**
 * AdSlot v4 — "크리에이터의 서재" 스타일
 *
 * 승인 전: 따뜻한 베이지/테라코타/세이지 큐레이션 카드
 * 승인 후: 실제 AdSense 광고
 * 언어: 100% 한국어
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
  tag: string;
  title: string;
  desc: string;
  cta: string;
  accent: 'terra' | 'sage' | 'mustard' | 'dusk';
};

// 모든 콘텐츠 한글
const FALLBACK: Record<string, FallbackContent[]> = {
  'sidebar': [
    {
      tag: '오늘의 팁',
      title: '유지율 40% 올리는 법',
      desc: '첫 30초에 호기심 훅 거는 기술',
      cta: '읽어보기',
      accent: 'terra',
    },
    {
      tag: '이번 주 인기',
      title: '블루오션 카테고리',
      desc: 'IT·자기계발, 경쟁 강도 낮음',
      cta: '분석 보기',
      accent: 'sage',
    },
    {
      tag: '업데이트',
      title: '다큐 스타일 개선',
      desc: 'BBC식 차분한 내레이션 적용',
      cta: '시도하기',
      accent: 'mustard',
    },
  ],
  'home-top': [
    {
      tag: '추천 도구',
      title: '크리에이터 필수 도구 7가지',
      desc: '2026년 주목받는 무료 AI 도구 모음 — 썸네일, 자막, 분석, 편집까지 한 번에',
      cta: '블로그에서 보기',
      accent: 'terra',
    },
  ],
  'home-mid': [
    {
      tag: '이런 기능도 있어요',
      title: '경쟁 채널 분석',
      desc: '키워드 하나로 상위 10개 채널과 평균 조회수, 경쟁 강도를 3초 안에 알려드려요',
      cta: '바로 분석하기',
      accent: 'dusk',
    },
  ],
  'home-bottom': [
    {
      tag: '새 가이드',
      title: '유튜브 초보의 첫 달 체크리스트',
      desc: '채널 세팅부터 첫 영상 업로드까지 10가지 실전 가이드',
      cta: '읽어보기',
      accent: 'sage',
    },
  ],
  'analytics-top': [
    {
      tag: '알아두면 좋은 팁',
      title: '경쟁 강도 판단 기준',
      desc: '상위 10개 채널 총 구독자가 100만 이상이면 높음, 10만 미만이면 낮음',
      cta: '자세히 보기',
      accent: 'terra',
    },
  ],
  'analytics-bottom': [
    {
      tag: '다음 단계',
      title: '분석 결과로 영상 만들기',
      desc: '경쟁 분석이 끝났다면, AI가 맞춤 시나리오까지 추천해드려요',
      cta: '영상 만들기',
      accent: 'mustard',
    },
  ],
  'blog-top': [
    {
      tag: '이번 주 인기 글',
      title: '2026년 유튜브 알고리즘 정리',
      desc: '세션 시청 시간이 핵심 지표로, 썸네일 일관성이 새로운 가산점',
      cta: '전문 읽기',
      accent: 'dusk',
    },
  ],
  'blog-post-top': [
    {
      tag: '실전 도구',
      title: '이 글의 원칙을 바로 적용해보기',
      desc: '알고메이커로 알고리즘 친화적 영상을 자동 생성할 수 있어요',
      cta: '무료로 시작',
      accent: 'terra',
    },
  ],
  'blog-post-bottom': [
    {
      tag: '더 읽어보기',
      title: '관련 가이드 모음',
      desc: '크리에이터 인사이트 섹션의 다른 글들도 확인해보세요',
      cta: '블로그 홈',
      accent: 'sage',
    },
  ],
};

const ACCENT: Record<FallbackContent['accent'], { color: string; soft: string; deep: string }> = {
  terra: { color: '#c65f3b', soft: '#fdf1e7', deep: '#a64a2a' },
  sage: { color: '#7d9b7c', soft: '#eaf2ea', deep: '#5e7e5d' },
  mustard: { color: '#d4a545', soft: '#fbf3df', deep: '#a67e1e' },
  dusk: { color: '#6b8cae', soft: '#eaf0f5', deep: '#5a7a99' },
};

function getFallback(slot: string): FallbackContent {
  const pool = FALLBACK[slot] || FALLBACK['home-top'];
  const idx = Math.floor(Date.now() / (1000 * 60 * 60)) % pool.length;
  return pool[idx];
}

export default function AdSlot({
  slot,
  variant = 'horizontal',
  className = '',
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

  // 실광고 (승인 후)
  if (isLive) {
    const sizeStyle: React.CSSProperties =
      variant === 'sidebar-card' ? { width: '100%', minHeight: 100 } :
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

  const c = ACCENT[content.accent];

  // 사이드바용
  if (variant === 'sidebar-card' || slot === 'sidebar') {
    return (
      <div className={`warmSide ${className}`}>
        <style jsx>{`
          .warmSide {
            padding: 13px 14px;
            background: ${c.soft};
            border: 1px solid rgba(0,0,0,0.03);
            border-radius: 10px;
            cursor: pointer;
            transition: all 0.2s;
            position: relative;
          }
          .warmSide::before {
            content: '';
            position: absolute;
            left: 0; top: 12px; bottom: 12px;
            width: 2px;
            background: ${c.color};
            border-radius: 0 1px 1px 0;
          }
          .warmSide:hover {
            transform: translateY(-1px);
            box-shadow: 0 4px 10px rgba(90,74,58,0.08);
          }
          .sideTag {
            font-size: 10px;
            font-weight: 700;
            color: ${c.deep};
            margin-bottom: 5px;
            letter-spacing: -0.01em;
          }
          .sideTitle {
            font-size: 13px;
            font-weight: 800;
            color: #2a2419;
            letter-spacing: -0.015em;
            line-height: 1.35;
            margin-bottom: 4px;
          }
          .sideDesc {
            font-size: 11px;
            color: #564a3a;
            line-height: 1.5;
            margin-bottom: 9px;
          }
          .sideCta {
            font-size: 11px;
            font-weight: 700;
            color: ${c.deep};
            display: inline-flex;
            align-items: center;
            gap: 3px;
          }
          .sideCta::after {
            content: '→';
            transition: transform 0.2s;
          }
          .warmSide:hover .sideCta::after {
            transform: translateX(3px);
          }
        `}</style>
        <div className="sideTag">{content.tag}</div>
        <div className="sideTitle">{content.title}</div>
        <div className="sideDesc">{content.desc}</div>
        <div className="sideCta">{content.cta}</div>
      </div>
    );
  }

  // 가로형 - 큰 카드
  return (
    <div className={`warmBig ${className}`}>
      <style jsx>{`
        .warmBig {
          background: linear-gradient(135deg, ${c.soft} 0%, #faf8f4 100%);
          border: 1px solid rgba(0,0,0,0.04);
          border-radius: 14px;
          padding: 22px 26px;
          display: flex;
          align-items: center;
          gap: 20px;
          cursor: pointer;
          transition: all 0.25s cubic-bezier(0.22, 1, 0.36, 1);
          position: relative;
          overflow: hidden;
          min-height: 100px;
        }
        .warmBig::before {
          content: '';
          position: absolute;
          left: 0; top: 0; bottom: 0;
          width: 4px;
          background: ${c.color};
        }
        .warmBig::after {
          content: '';
          position: absolute;
          top: -40%; right: -10%;
          width: 220px; height: 220px;
          background: radial-gradient(circle, ${c.color}22 0%, transparent 70%);
          pointer-events: none;
        }
        .warmBig:hover {
          transform: translateY(-2px);
          box-shadow: 0 6px 20px rgba(90,74,58,0.1);
        }

        .bigIcon {
          flex-shrink: 0;
          width: 56px; height: 56px;
          background: #fff;
          border-radius: 12px;
          display: flex;
          align-items: center;
          justify-content: center;
          position: relative;
          z-index: 1;
          border: 1px solid rgba(0,0,0,0.05);
        }
        .bigIconInner {
          width: 28px;
          height: 28px;
          border-radius: 8px;
          background: ${c.color};
          position: relative;
        }
        .bigIconInner::before,
        .bigIconInner::after {
          content: '';
          position: absolute;
          background: #fff;
        }
        .bigIconInner::before {
          width: 10px;
          height: 2px;
          top: 13px;
          left: 9px;
        }
        .bigIconInner::after {
          width: 2px;
          height: 10px;
          top: 9px;
          left: 13px;
        }

        .bigBody {
          flex: 1;
          min-width: 0;
          z-index: 1;
          position: relative;
        }
        .bigTag {
          display: inline-block;
          padding: 3px 9px;
          font-size: 10px;
          font-weight: 800;
          color: ${c.deep};
          background: #fff;
          border-radius: 999px;
          letter-spacing: -0.01em;
          margin-bottom: 6px;
          border: 1px solid rgba(0,0,0,0.04);
        }
        .bigTitle {
          font-size: 16px;
          font-weight: 800;
          color: #2a2419;
          letter-spacing: -0.02em;
          line-height: 1.3;
          margin-bottom: 4px;
        }
        .bigDesc {
          font-size: 12.5px;
          color: #564a3a;
          line-height: 1.6;
        }
        .bigCta {
          flex-shrink: 0;
          padding: 11px 22px;
          background: ${c.color};
          color: #fff;
          border: none;
          border-radius: 999px;
          font-family: inherit;
          font-size: 12.5px;
          font-weight: 700;
          letter-spacing: -0.01em;
          cursor: pointer;
          display: inline-flex;
          align-items: center;
          gap: 5px;
          white-space: nowrap;
          z-index: 1;
          position: relative;
          transition: all 0.15s;
          box-shadow: 0 2px 6px ${c.color}40;
        }
        .warmBig:hover .bigCta {
          background: ${c.deep};
          transform: translateX(2px);
          box-shadow: 0 4px 12px ${c.color}60;
        }
        .bigCta::after {
          content: '→';
        }

        @media (max-width: 640px) {
          .warmBig { padding: 18px 20px; gap: 14px; min-height: 92px; }
          .bigIcon { width: 44px; height: 44px; }
          .bigIconInner { width: 22px; height: 22px; }
          .bigIconInner::before { top: 10px; left: 6px; }
          .bigIconInner::after { top: 6px; left: 10px; }
          .bigTitle { font-size: 14px; }
          .bigDesc { font-size: 11.5px; }
          .bigCta { padding: 9px 16px; font-size: 11px; }
        }
      `}</style>
      <div className="bigIcon">
        <div className="bigIconInner" />
      </div>
      <div className="bigBody">
        <div className="bigTag">{content.tag}</div>
        <div className="bigTitle">{content.title}</div>
        <div className="bigDesc">{content.desc}</div>
      </div>
      <button className="bigCta">
        {content.cta}
      </button>
    </div>
  );
}
