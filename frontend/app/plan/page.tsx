'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function PlanPage() {
  const router = useRouter();

  useEffect(() => {
    router.replace('/keyword');
  }, [router]);

  return (
    <div
      style={{
        minHeight: '100vh',
        background: '#0a0a0c',
        color: '#a8a8b0',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontFamily: 'Pretendard, -apple-system, sans-serif',
        fontSize: '14px',
      }}
    >
      <div style={{ textAlign: 'center' }}>
        <div
          style={{
            width: 28,
            height: 28,
            border: '3px solid rgba(212, 165, 55, 0.2)',
            borderTopColor: '#d4a537',
            borderRadius: '50%',
            animation: 'spin 0.9s linear infinite',
            margin: '0 auto 16px',
          }}
        />
        <div>키워드 발굴 단계로 이동 중...</div>
      </div>
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );
}
