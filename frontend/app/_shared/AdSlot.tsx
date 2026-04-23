'use client';
/**
 * AdSense 슬롯 재사용 컴포넌트
 *
 * 환경변수 2개로 제어:
 * - NEXT_PUBLIC_ADSENSE_CLIENT_ID: "ca-pub-XXXXXXXXXXXXXXXX"
 * - NEXT_PUBLIC_ADSENSE_ENABLED: "true" 일 때만 실광고 로드
 *
 * 승인 전: 회색 placeholder 표시 (dev-only 라벨)
 * 승인 후: 환경변수 추가하고 재배포하면 즉시 실광고 송출
 *
 * 사용 예:
 *   <AdSlot slot="home-top" variant="horizontal" />
 *   <AdSlot slot="sidebar" variant="vertical" />
 *   <AdSlot slot="in-content" variant="in-content" />
 */

import { useEffect } from 'react';

// 슬롯별 AdSense slot ID 매핑 (승인 후 실제 slot ID로 교체)
// AdSense 승인 후 각 slot을 만들고 이 맵을 업데이트하세요.
const SLOT_ID_MAP: Record<string, string> = {
  'sidebar': '0000000001',        // 사이드바 수직 광고
  'home-top': '0000000002',       // 홈 Hero 아래
  'home-mid': '0000000003',       // 홈 시나리오 라이브러리 아래
  'analytics-top': '0000000004',  // Analytics 검색창 위
  'analytics-bottom': '0000000005', // Analytics 결과 아래
  'assets-top': '0000000006',     // 내 영상 상단
  'about-mid': '0000000007',      // 소개 중간
};

type AdVariant = 'horizontal' | 'vertical' | 'in-content' | 'square';

interface AdSlotProps {
  slot: keyof typeof SLOT_ID_MAP | string;
  variant?: AdVariant;
  className?: string;
  label?: string; // 선택: 개발 중 어떤 슬롯인지 구분
}

declare global {
  interface Window {
    adsbygoogle?: any[];
  }
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

  useEffect(() => {
    if (!isLive) return;
    try {
      if (typeof window !== 'undefined') {
        (window.adsbygoogle = window.adsbygoogle || []).push({});
      }
    } catch (e) {
      // adsbygoogle 스크립트 미로드 시 silent fail
      console.warn('[AdSlot] adsbygoogle push failed:', e);
    }
  }, [isLive, slot]);

  const sizeStyle = getSizeStyle(variant);

  // 🔴 승인 전: 회색 placeholder
  if (!isLive) {
    return (
      <div
        className={`ad-slot-placeholder ${className}`}
        style={{
          ...sizeStyle,
          background: 'repeating-linear-gradient(45deg, #f5f5f5, #f5f5f5 10px, #efefef 10px, #efefef 20px)',
          border: '1px dashed #d0d0d0',
          borderRadius: 8,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: '#999',
          fontSize: 11,
          fontWeight: 600,
          letterSpacing: '0.05em',
          textTransform: 'uppercase',
          fontFamily: 'monospace',
        }}
        aria-hidden="true"
      >
        <span>AD · {slot}{label ? ` · ${label}` : ''}</span>
      </div>
    );
  }

  // 🟢 승인 후: 실제 AdSense 광고
  return (
    <div className={`ad-slot-live ${className}`} style={sizeStyle}>
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

function getSizeStyle(variant: AdVariant): React.CSSProperties {
  switch (variant) {
    case 'horizontal':
      return { width: '100%', minHeight: 90, maxHeight: 120 };
    case 'vertical':
      return { width: '100%', minHeight: 250, maxHeight: 600 };
    case 'square':
      return { width: '100%', minHeight: 250, maxHeight: 300 };
    case 'in-content':
      return { width: '100%', minHeight: 120, maxHeight: 280 };
    default:
      return { width: '100%', minHeight: 90 };
  }
}
