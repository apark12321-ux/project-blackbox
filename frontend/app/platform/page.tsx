'use client';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function PlatformRedirect() {
  const router = useRouter();
  useEffect(() => { router.replace('/publish'); }, [router]);
  return (
    <div style={{ minHeight: '100vh', display: 'grid', placeItems: 'center', background: '#fafafa', color: '#888', fontFamily: 'Pretendard, sans-serif' }}>
      <div style={{ textAlign: 'center' }}>
        <div style={{ width: 32, height: 32, border: '3px solid #fdf1e7', borderTopColor: '#c65f3b', borderRadius: '50%', animation: 'spin 0.8s linear infinite', margin: '0 auto 14px' }} />
        <div style={{ fontSize: 14 }}>이동 중...</div>
        <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
      </div>
    </div>
  );
}
