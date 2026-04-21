'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

// v10 · 구 경로 → /create 리다이렉트
export default function LegacyRedirect() {
  const router = useRouter();
  useEffect(() => { router.replace('/create'); }, [router]);
  return (
    <div style={{ minHeight: '100vh', display: 'grid', placeItems: 'center', background: '#0a0a0c', color: '#a8a8b0', fontFamily: 'Pretendard, sans-serif' }}>
      <div style={{ textAlign: 'center' }}>
        <div style={{ width: 36, height: 36, border: '3px solid rgba(212,165,55,0.2)', borderTopColor: '#d4a537', borderRadius: '50%', animation: 'spin 0.9s linear infinite', margin: '0 auto 16px' }} />
        <div style={{ fontSize: 14 }}>새 페이지로 이동 중...</div>
        <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
      </div>
    </div>
  );
}
