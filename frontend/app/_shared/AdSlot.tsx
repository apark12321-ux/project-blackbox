'use client';
/**
 * AdSlot - Google AdSense 광고 컴포넌트
 *
 * 박예준 요청:
 * ✅ 광고 삽입 (AdSense)
 * ✅ AdSense ID 없어도 빌드 안 깨짐
 * ✅ 환경변수만 추가하면 즉시 작동
 *
 * 사용법:
 *   <AdSlot slot="home-bottom" variant="horizontal" />
 *
 * AdSense 승인 후:
 *   1. Vercel 환경변수: NEXT_PUBLIC_ADSENSE_CLIENT=ca-pub-XXXX
 *   2. 각 위치별: NEXT_PUBLIC_ADSENSE_SLOT_HOME_BOTTOM=1234567890
 *   3. 자동으로 실제 광고 표시
 */

import { useEffect, useRef } from 'react';

interface AdSlotProps {
  slot: string;
  variant?: 'horizontal' | 'square' | 'sidebar-card';
}

declare global {
  interface Window {
    adsbygoogle?: any[];
  }
}

export default function AdSlot({ slot, variant = 'horizontal' }: AdSlotProps) {
  const adRef = useRef<HTMLDivElement>(null);
  
  // 환경변수에서 자동 로드
  const client = (typeof process !== 'undefined' && process.env.NEXT_PUBLIC_ADSENSE_CLIENT) || '';
  const slotEnvKey = `NEXT_PUBLIC_ADSENSE_SLOT_${slot.toUpperCase().replace(/-/g, '_')}`;
  const slotId = (typeof process !== 'undefined' && process.env[slotEnvKey]) || '';

  useEffect(() => {
    if (!client || !slotId) return;
    
    try {
      if (typeof window !== 'undefined') {
        window.adsbygoogle = window.adsbygoogle || [];
        window.adsbygoogle.push({});
      }
    } catch (e) {
      // 광고 로드 실패해도 사이트는 정상
    }
  }, [client, slotId]);

  const showPlaceholder = !client || !slotId;

  return (
    <div className={`adSlot adSlot-${variant}`} ref={adRef}>
      {showPlaceholder ? (
        <div className="adPlaceholder">
          <div className="adLabel">광고</div>
        </div>
      ) : (
        <ins
          className="adsbygoogle"
          style={{ display: 'block' }}
          data-ad-client={client}
          data-ad-slot={slotId}
          data-ad-format="auto"
          data-full-width-responsive="true"
        />
      )}

      <style jsx>{`
        .adSlot {
          width: 100%;
          margin: 16px 0;
        }
        .adSlot-horizontal { min-height: 90px; }
        .adSlot-square {
          min-height: 250px;
          max-width: 336px;
          margin: 16px auto;
        }
        .adSlot-sidebar-card {
          min-height: 250px;
          margin: 12px 0;
        }
        .adPlaceholder {
          width: 100%;
          min-height: 90px;
          background: linear-gradient(135deg, rgba(245,241,234,0.5), rgba(250,248,244,0.8));
          border: 1px dashed rgba(90,74,58,0.15);
          border-radius: 12px;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 24px;
        }
        .adSlot-square .adPlaceholder,
        .adSlot-sidebar-card .adPlaceholder {
          min-height: 250px;
        }
        .adLabel {
          font-size: 9px;
          font-weight: 800;
          letter-spacing: 0.2em;
          color: rgba(90,74,58,0.4);
          text-transform: uppercase;
        }
      `}</style>
    </div>
  );
}
