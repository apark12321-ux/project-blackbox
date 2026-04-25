'use client';
/**
 * AdSlot - Google AdSense 광고 슬롯
 *
 * AdSense 정책 준수:
 * ✅ 명확한 "광고" 라벨 (사용자 혼동 방지)
 * ✅ 콘텐츠와 충분한 간격
 * ✅ 클릭 유도 문구 X
 * ✅ Auto ads 지원
 * ✅ 환경변수로 ID 관리 (코드 노출 X)
 *
 * 사용법:
 *   <AdSlot slot="home-mid" variant="horizontal" />
 *
 * 활성화 (AdSense 승인 후):
 *   환경변수 NEXT_PUBLIC_ADSENSE_CLIENT 설정
 *   환경변수 NEXT_PUBLIC_ADSENSE_SLOT_HOME_MID 설정
 */

import { useEffect, useRef } from 'react';

interface AdSlotProps {
  slot: string;
  variant?: 'horizontal' | 'square' | 'sidebar';
}

declare global {
  interface Window {
    adsbygoogle?: any[];
  }
}

export default function AdSlot({ slot, variant = 'horizontal' }: AdSlotProps) {
  const adRef = useRef<HTMLModElement>(null);
  
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
      // 광고 로드 실패해도 사이트는 정상 작동
    }
  }, [client, slotId]);

  // AdSense ID 없으면 placeholder
  const showPlaceholder = !client || !slotId;

  return (
    <div className={`adContainer adContainer-${variant}`}>
      <div className="adLabel">광고</div>
      
      {showPlaceholder ? (
        <div className="adPlaceholder">
          <span>Advertisement</span>
        </div>
      ) : (
        <ins
          ref={adRef}
          className="adsbygoogle"
          style={{ display: 'block' }}
          data-ad-client={client}
          data-ad-slot={slotId}
          data-ad-format="auto"
          data-full-width-responsive="true"
        />
      )}

      <style jsx>{`
        .adContainer {
          width: 100%;
          margin: 24px 0;
          padding: 8px 0;
        }
        
        .adContainer-horizontal {
          min-height: 100px;
        }
        
        .adContainer-square {
          max-width: 336px;
          margin: 24px auto;
        }
        
        .adContainer-sidebar {
          max-width: 300px;
        }
        
        /* "광고" 라벨 - AdSense 정책 권장 */
        .adLabel {
          font-size: 10px;
          font-weight: 600;
          color: #999;
          text-align: left;
          margin-bottom: 4px;
          letter-spacing: 0.05em;
        }
        
        .adPlaceholder {
          width: 100%;
          min-height: 90px;
          background: #f5f5f5;
          border: 1px solid #e5e5e5;
          border-radius: 8px;
          display: flex;
          align-items: center;
          justify-content: center;
          color: #999;
          font-size: 12px;
          font-weight: 500;
          letter-spacing: 0.05em;
        }
        
        .adContainer-square .adPlaceholder {
          min-height: 250px;
        }
        
        .adContainer-sidebar .adPlaceholder {
          min-height: 250px;
        }
      `}</style>
    </div>
  );
}
