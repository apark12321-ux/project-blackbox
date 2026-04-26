'use client';
/**
 * Cookie Consent Banner - AdSense GDPR/CCPA/한국 개인정보보호법 준수
 * 
 * AdSense 정책 필수:
 * - 광고 쿠키 사용 시 사용자 동의 필수
 * - 명확한 거부 옵션 제공
 * - 거부 시에도 기본 사이트 사용 가능
 */

import { useState, useEffect } from 'react';
import Link from 'next/link';

const CONSENT_KEY = 'algomaker_cookie_consent';

type ConsentStatus = 'pending' | 'accepted' | 'rejected';

export default function CookieConsent() {
  const [status, setStatus] = useState<ConsentStatus>('pending');
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    try {
      const stored = localStorage.getItem(CONSENT_KEY);
      if (stored === 'accepted' || stored === 'rejected') {
        setStatus(stored);
      }
    } catch {}
  }, []);

  const handleAccept = () => {
    try {
      localStorage.setItem(CONSENT_KEY, 'accepted');
      setStatus('accepted');
      // AdSense 광고 활성화 (실제 광고 표시 시점)
      if (typeof window !== 'undefined' && (window as any).gtag) {
        (window as any).gtag('consent', 'update', {
          ad_storage: 'granted',
          analytics_storage: 'granted',
        });
      }
    } catch {}
  };

  const handleReject = () => {
    try {
      localStorage.setItem(CONSENT_KEY, 'rejected');
      setStatus('rejected');
      if (typeof window !== 'undefined' && (window as any).gtag) {
        (window as any).gtag('consent', 'update', {
          ad_storage: 'denied',
          analytics_storage: 'denied',
        });
      }
    } catch {}
  };

  // 마운트 안 됐거나 이미 결정한 경우 표시 X
  if (!mounted || status !== 'pending') return null;

  return (
    <div className="cookieBanner" role="dialog" aria-label="쿠키 동의">
      <div className="cookieContent">
        <div className="cookieText">
          <strong>🍪 쿠키 사용 안내</strong>
          <p>
            본 사이트는 더 나은 서비스 제공을 위해 쿠키를 사용합니다.
            광고 개인화(Google AdSense)와 사이트 분석에 활용되며,
            거부하셔도 사이트 이용에 제한은 없습니다.
            <Link href="/privacy" className="cookieLink">개인정보처리방침</Link>
          </p>
        </div>
        <div className="cookieButtons">
          <button onClick={handleReject} className="btnReject">
            거부
          </button>
          <button onClick={handleAccept} className="btnAccept">
            동의하기
          </button>
        </div>
      </div>

      <style jsx>{`
        .cookieBanner {
          position: fixed;
          bottom: 0;
          left: 0;
          right: 0;
          background: #1a1a1a;
          color: #fff;
          padding: 16px 20px;
          z-index: 9998;
          box-shadow: 0 -4px 20px rgba(0, 0, 0, 0.15);
          animation: slideUp 0.3s ease-out;
        }
        @keyframes slideUp {
          from { transform: translateY(100%); }
          to { transform: translateY(0); }
        }
        .cookieContent {
          max-width: 1200px;
          margin: 0 auto;
          display: flex;
          gap: 20px;
          align-items: center;
          flex-wrap: wrap;
        }
        @media (max-width: 720px) {
          .cookieContent {
            flex-direction: column;
            gap: 14px;
            align-items: stretch;
          }
        }
        .cookieText {
          flex: 1;
          min-width: 0;
        }
        .cookieText strong {
          display: block;
          font-size: 14px;
          font-weight: 800;
          margin-bottom: 4px;
        }
        .cookieText p {
          font-size: 12.5px;
          line-height: 1.6;
          margin: 0;
          color: #d1d5db;
        }
        .cookieLink {
          color: #fcd34d;
          text-decoration: underline;
          margin-left: 4px;
        }
        .cookieLink:hover {
          color: #fde68a;
        }
        .cookieButtons {
          display: flex;
          gap: 8px;
          flex-shrink: 0;
        }
        @media (max-width: 720px) {
          .cookieButtons { width: 100%; }
          .cookieButtons button { flex: 1; }
        }
        .btnReject {
          padding: 10px 18px;
          background: transparent;
          color: #d1d5db;
          border: 1px solid #4b5563;
          border-radius: 8px;
          font-size: 13px;
          font-weight: 600;
          cursor: pointer;
          font-family: inherit;
          transition: all 0.15s;
          min-height: 40px;
        }
        .btnReject:hover {
          background: rgba(255, 255, 255, 0.05);
          color: #fff;
          border-color: #6b7280;
        }
        .btnAccept {
          padding: 10px 22px;
          background: #c65f3b;
          color: #fff;
          border: none;
          border-radius: 8px;
          font-size: 13px;
          font-weight: 800;
          cursor: pointer;
          font-family: inherit;
          transition: all 0.15s;
          min-height: 40px;
        }
        .btnAccept:hover {
          background: #d97155;
          transform: translateY(-1px);
        }
      `}</style>
    </div>
  );
}
