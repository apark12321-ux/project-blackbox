'use client';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
export default function Redirect() {
  const router = useRouter();
  useEffect(() => { router.replace('/create'); }, [router]);
  return (
    <div style={{ minHeight: '100vh', display: 'grid', placeItems: 'center', background: '#ffffff', color: '#6b7280', fontFamily: 'Pretendard, sans-serif' }}>
      <div style={{ textAlign: 'center' }}>
        <div style={{ width: 32, height: 32, border: '3px solid #e5e7eb', borderTopColor: '#2563eb', borderRadius: '50%', animation: 'spin 0.8s linear infinite', margin: '0 auto 14px' }} />
        <div style={{ fontSize: 14 }}>이동 중...</div>
        <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
      </div>
    </div>
  );
}
