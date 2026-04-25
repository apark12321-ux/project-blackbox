'use client';
import { useEffect, useRef } from 'react';

interface AdSlotProps {
  slot: string;
  variant?: 'horizontal' | 'square' | 'sidebar' | 'sidebar-card' | 'in-article';
}

declare global {
  interface Window {
    adsbygoogle?: any[];
  }
}

export default function AdSlot({ slot, variant = 'horizontal' }: AdSlotProps) {
  const adRef = useRef<HTMLModElement>(null);
  
  const client = (typeof process !== 'undefined' && process.env.NEXT_PUBLIC_ADSENSE_CLIENT) || '';
  const slotEnvKey = `NEXT_PUBLIC_ADSENSE_SLOT_${slot.toUpperCase().replace(/-/g, '_')}`;
  const slotId = (typeof process !== 'undefined' && (process.env as any)[slotEnvKey]) || '';

  useEffect(() => {
    if (!client || !slotId) return;
    try {
      if (typeof window !== 'undefined') {
        window.adsbygoogle = window.adsbygoogle || [];
        window.adsbygoogle.push({});
      }
    } catch (e) {}
  }, [client, slotId]);

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
        .adContainer { width: 100%; margin: 24px 0; padding: 8px 0; }
        .adContainer-horizontal { min-height: 100px; }
        .adContainer-in-article { min-height: 100px; margin: 32px 0; }
        .adContainer-square { max-width: 336px; margin: 24px auto; }
        .adContainer-sidebar, .adContainer-sidebar-card { max-width: 300px; }
        .adLabel {
          font-size: 10px; font-weight: 600; color: #999;
          text-align: left; margin-bottom: 4px; letter-spacing: 0.05em;
        }
        .adPlaceholder {
          width: 100%; min-height: 90px;
          background: #f5f5f5; border: 1px solid #e5e5e5;
          border-radius: 8px;
          display: flex; align-items: center; justify-content: center;
          color: #999; font-size: 12px; font-weight: 500;
        }
        .adContainer-square .adPlaceholder,
        .adContainer-sidebar .adPlaceholder,
        .adContainer-sidebar-card .adPlaceholder { min-height: 250px; }
      `}</style>
    </div>
  );
}
