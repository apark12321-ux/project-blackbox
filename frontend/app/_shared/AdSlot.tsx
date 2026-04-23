'use client';
/**
 * AdSlot v2 — 네이티브 광고 스타일
 *
 * 철학:
 * - 승인 전에도 "광고 자리 placeholder"가 아니라
 *   "큐레이션 카드"처럼 보이게 (AlgoMaker 자체 프로모 / 팁 / 기능 소개)
 * - 승인 후엔 자연스럽게 실광고로 전환
 * - 사용자가 "광고만 잔뜩이네" 라는 느낌을 받지 않게
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

// 심사 전 자리에 들어갈 "큐레이션 콘텐츠" 풀
// 슬롯별로 다른 내용 돌아가며 — 단조로움 방지
const FALLBACK_CONTENT: Record<string, Array<{
  badge: string;
  title: string;
  desc: string;
  cta: string;
  gradient: string;
  icon: string;
}>> = {
  'sidebar': [
    {
      badge: 'TIP',
      title: '유지율 올리는 법',
      desc: '30초 안에 호기심 걸기',
      cta: '가이드 보기',
      gradient: 'linear-gradient(135deg, #fef3c7 0%, #fde68a 100%)',
      icon: '💡',
    },
    {
      badge: 'HOT',
      title: '이번 주 블루오션',
      desc: 'IT·자기계발 카테고리',
      cta: '분석 보기',
      gradient: 'linear-gradient(135deg, #fee2e2 0%, #fecaca 100%)',
      icon: '🔥',
    },
    {
      badge: 'NEW',
      title: '다큐 스타일 업데이트',
      desc: 'BBC식 차분한 내레이션',
      cta: '지금 시도',
      gradient: 'linear-gradient(135deg, #dbeafe 0%, #bfdbfe 100%)',
      icon: '✨',
    },
  ],
  'home-top': [
    {
      badge: 'SPONSORED',
      title: '크리에이터 필수 도구 모음',
      desc: '2026년 가장 주목받는 무료 AI 툴 7가지 — 썸네일, 자막, 분석까지',
      cta: '블로그에서 보기',
      gradient: 'linear-gradient(135deg, #0f0f0f 0%, #1a1a1a 100%)',
      icon: '🛠️',
    },
  ],
  'home-mid': [
    {
      badge: '추천',
      title: '경쟁 채널 분석이 처음이신가요?',
      desc: '키워드 하나로 Top 10 채널·평균 조회수·경쟁 강도를 3초 안에 확인하세요',
      cta: '경쟁 분석 시작',
      gradient: 'linear-gradient(135deg, #1a1a1a 0%, #2d1b1b 100%)',
      icon: '📊',
    },
  ],
  'home-bottom': [
    {
      badge: 'NEW GUIDE',
      title: '유튜브 초보의 첫 달 체크리스트 10가지',
      desc: '채널 세팅부터 첫 영상 업로드까지 — 실전 가이드',
      cta: '가이드 읽기',
      gradient: 'linear-gradient(135deg, #064e3b 0%, #065f46 100%)',
      icon: '📝',
    },
  ],
  'analytics-top': [
    {
      badge: 'PRO TIP',
      title: '경쟁 강도 판정 기준',
      desc: 'Top 10 총 구독자가 100만+이면 "높음", 10만 미만이면 "낮음"',
      cta: '자세히',
      gradient: 'linear-gradient(135deg, #1e3a8a 0%, #1e40af 100%)',
      icon: '🎯',
    },
  ],
  'analytics-bottom': [
    {
      badge: '다음 단계',
      title: '분석 결과를 영상으로 바꾸기',
      desc: '경쟁 분석 끝났다면 이제 영상 제작 — AI가 시나리오까지 추천해줍니다',
      cta: '영상 만들기',
      gradient: 'linear-gradient(135deg, #7c2d12 0%, #9a3412 100%)',
      icon: '🎬',
    },
  ],
  'blog-top': [
    {
      badge: 'FEATURED',
      title: '2026 유튜브 알고리즘 총정리',
      desc: '세션 시청 시간이 핵심 지표로, 썸네일 일관성이 가산점',
      cta: '전문 읽기',
      gradient: 'linear-gradient(135deg, #581c87 0%, #6b21a8 100%)',
      icon: '📊',
    },
  ],
  'blog-post-top': [
    {
      badge: 'TOOL',
      title: 'AlgoMaker로 이 글의 원칙 적용하기',
      desc: '키워드 입력 한 번으로 AI가 알고리즘 친화적 영상 자동 생성',
      cta: '무료로 시작',
      gradient: 'linear-gradient(135deg, #0c4a6e 0%, #075985 100%)',
      icon: '⚡',
    },
  ],
  'blog-post-bottom': [
    {
      badge: '관련 가이드',
      title: '더 깊이 들어가고 싶다면',
      desc: '크리에이터 인사이트 섹션의 다른 글들도 확인해보세요',
      cta: '블로그 홈',
      gradient: 'linear-gradient(135deg, #7c2d12 0%, #9a3412 100%)',
      icon: '📚',
    },
  ],
};

function getFallback(slot: string) {
  const pool = FALLBACK_CONTENT[slot] || FALLBACK_CONTENT['home-top'];
  // 시간 기반 로테이션 — 새로고침마다 다른 콘텐츠
  const idx = Math.floor(Date.now() / (1000 * 60 * 60)) % pool.length;
  return pool[idx];
}

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

  const [content, setContent] = useState<ReturnType<typeof getFallback> | null>(null);

  useEffect(() => {
    if (!isLive) {
      setContent(getFallback(slot));
    }
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

  // 🟢 승인 후: 실제 AdSense
  if (isLive) {
    return (
      <div className={`ad-slot-live ${className}`} style={getLiveStyle(variant)}>
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

  // 🎨 승인 전: 큐레이션 카드 (네이티브 광고 스타일)
  if (!content) return null;

  const isDark = content.gradient.includes('#0') || content.gradient.includes('#1') ||
                 content.gradient.includes('#2') || content.gradient.includes('#3') ||
                 content.gradient.includes('#5') || content.gradient.includes('#6') ||
                 content.gradient.includes('#7');
  const textColor = isDark ? '#fff' : '#1a1a1a';
  const mutedColor = isDark ? 'rgba(255,255,255,0.75)' : 'rgba(0,0,0,0.65)';
  const badgeBg = isDark ? 'rgba(255,255,255,0.15)' : 'rgba(0,0,0,0.08)';
  const borderColor = isDark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.06)';

  // 사이드바용 작은 카드
  if (variant === 'sidebar-card' || slot === 'sidebar') {
    return (
      <div className={`ad-native-sidebar ${className}`}>
        <style jsx>{`
          .ad-native-sidebar {
            padding: 12px 13px;
            background: ${content.gradient};
            border: 1px solid ${borderColor};
            border-radius: 10px;
            cursor: pointer;
            transition: all 0.2s cubic-bezier(0.22, 1, 0.36, 1);
            position: relative;
            overflow: hidden;
          }
          .ad-native-sidebar:hover {
            transform: translateY(-1px);
            box-shadow: 0 4px 12px rgba(0,0,0,0.08);
          }
          .native-top {
            display: flex;
            align-items: center;
            justify-content: space-between;
            margin-bottom: 6px;
          }
          .native-badge {
            font-size: 9px;
            font-weight: 800;
            letter-spacing: 0.08em;
            color: ${textColor};
            background: ${badgeBg};
            padding: 2px 6px;
            border-radius: 4px;
          }
          .native-icon {
            font-size: 14px;
          }
          .native-title {
            font-size: 12px;
            font-weight: 800;
            color: ${textColor};
            line-height: 1.3;
            letter-spacing: -0.01em;
            margin-bottom: 3px;
          }
          .native-desc {
            font-size: 10px;
            color: ${mutedColor};
            line-height: 1.45;
            margin-bottom: 7px;
          }
          .native-cta {
            font-size: 10px;
            font-weight: 700;
            color: ${textColor};
            display: inline-flex;
            align-items: center;
            gap: 2px;
          }
          .native-cta::after {
            content: '→';
            transition: transform 0.2s;
          }
          .ad-native-sidebar:hover .native-cta::after {
            transform: translateX(2px);
          }
        `}</style>
        <div className="native-top">
          <span className="native-badge">{content.badge}</span>
          <span className="native-icon">{content.icon}</span>
        </div>
        <div className="native-title">{content.title}</div>
        <div className="native-desc">{content.desc}</div>
        <div className="native-cta">{content.cta}</div>
      </div>
    );
  }

  // 가로형 (네이티브 대형 배너)
  return (
    <div className={`ad-native-horizontal ${className}`}>
      <style jsx>{`
        .ad-native-horizontal {
          background: ${content.gradient};
          border: 1px solid ${borderColor};
          border-radius: 14px;
          padding: 20px 24px;
          display: flex;
          align-items: center;
          gap: 18px;
          cursor: pointer;
          transition: all 0.25s cubic-bezier(0.22, 1, 0.36, 1);
          position: relative;
          overflow: hidden;
          min-height: 92px;
        }
        .ad-native-horizontal::before {
          content: '';
          position: absolute;
          inset: 0;
          background: radial-gradient(circle at 80% 20%, rgba(255,255,255,0.08), transparent 50%);
          pointer-events: none;
        }
        .ad-native-horizontal:hover {
          transform: translateY(-2px);
          box-shadow: 0 8px 24px rgba(0,0,0,0.12);
        }
        .big-icon {
          font-size: 32px;
          flex-shrink: 0;
        }
        .big-body {
          flex: 1;
          min-width: 0;
          z-index: 1;
        }
        .big-meta {
          display: flex;
          align-items: center;
          gap: 8px;
          margin-bottom: 4px;
        }
        .big-badge {
          font-size: 9px;
          font-weight: 800;
          letter-spacing: 0.12em;
          color: ${textColor};
          background: ${badgeBg};
          padding: 3px 8px;
          border-radius: 999px;
        }
        .big-label {
          font-size: 9px;
          font-weight: 600;
          color: ${mutedColor};
          letter-spacing: 0.06em;
        }
        .big-title {
          font-size: 16px;
          font-weight: 800;
          color: ${textColor};
          line-height: 1.3;
          letter-spacing: -0.02em;
          margin-bottom: 3px;
        }
        .big-desc {
          font-size: 12px;
          color: ${mutedColor};
          line-height: 1.5;
        }
        .big-cta {
          flex-shrink: 0;
          padding: 10px 18px;
          background: ${isDark ? 'rgba(255,255,255,0.15)' : '#0f0f0f'};
          color: ${isDark ? textColor : '#fff'};
          border-radius: 999px;
          font-size: 12px;
          font-weight: 700;
          display: inline-flex;
          align-items: center;
          gap: 4px;
          white-space: nowrap;
          z-index: 1;
          border: 1px solid ${isDark ? 'rgba(255,255,255,0.2)' : 'transparent'};
          transition: all 0.2s;
        }
        .ad-native-horizontal:hover .big-cta {
          transform: translateX(2px);
        }
        @media (max-width: 640px) {
          .ad-native-horizontal { padding: 16px; gap: 12px; }
          .big-icon { font-size: 24px; }
          .big-title { font-size: 14px; }
          .big-desc { font-size: 11px; }
          .big-cta { padding: 8px 14px; font-size: 11px; }
        }
      `}</style>
      <div className="big-icon">{content.icon}</div>
      <div className="big-body">
        <div className="big-meta">
          <span className="big-badge">{content.badge}</span>
          <span className="big-label">· AlgoMaker 추천</span>
        </div>
        <div className="big-title">{content.title}</div>
        <div className="big-desc">{content.desc}</div>
      </div>
      <div className="big-cta">
        {content.cta} →
      </div>
    </div>
  );
}

function getLiveStyle(variant: AdVariant): React.CSSProperties {
  switch (variant) {
    case 'horizontal':
      return { width: '100%', minHeight: 90, maxHeight: 120 };
    case 'vertical':
      return { width: '100%', minHeight: 250, maxHeight: 600 };
    case 'square':
      return { width: '100%', minHeight: 250, maxHeight: 300 };
    case 'in-content':
      return { width: '100%', minHeight: 120, maxHeight: 280 };
    case 'sidebar-card':
      return { width: '100%', minHeight: 100 };
    case 'native-card':
      return { width: '100%', minHeight: 120 };
    default:
      return { width: '100%', minHeight: 90 };
  }
}
