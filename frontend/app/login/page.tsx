'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

// v10 · 로그인 없음 · /create로 자동 이동
export default function LoginRedirect() {
  const router = useRouter();

  useEffect(() => {
    router.replace('/create');
  }, [router]);

  return (
    <div style={{
      minHeight: '100vh',
      display: 'grid',
      placeItems: 'center',
      background: '#0a0a0c',
      color: '#a8a8b0',
      fontFamily: 'Pretendard, -apple-system, sans-serif',
    }}>
      <div style={{ textAlign: 'center' }}>
        <div style={{
          width: 36,
          height: 36,
          border: '3px solid rgba(212, 165, 55, 0.2)',
          borderTopColor: '#d4a537',
          borderRadius: '50%',
          animation: 'spin 0.9s linear infinite',
          margin: '0 auto 16px',
        }} />
        <div style={{ fontSize: 14 }}>카테고리 선택으로 이동 중...</div>
        <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
      </div>
    </div>
  );
}
