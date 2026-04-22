'use client';
/**
 * /login - 로그인 페이지
 *
 * Supabase가 설정돼 있으면: 실제 매직링크/비밀번호 로그인 UI
 * Supabase가 비활성 상태면: 기존 동작(/create로 리다이렉트)
 */
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '../../lib/useAuth';

export default function LoginPage() {
  const router = useRouter();
  const { enabled, ready, isAuthenticated, signInWithEmail } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [usePassword, setUsePassword] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState<{ type: 'ok' | 'err'; text: string } | null>(null);

  // Supabase 비활성 상태면 기존 동작 유지
  useEffect(() => {
    if (ready && !enabled) {
      router.replace('/create');
    }
  }, [ready, enabled, router]);

  // 이미 로그인된 상태면 /assets 로
  useEffect(() => {
    if (ready && enabled && isAuthenticated) {
      router.replace('/assets');
    }
  }, [ready, enabled, isAuthenticated, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    setSubmitting(true);
    setMessage(null);
    try {
      const { error } = await signInWithEmail(email, usePassword ? password : undefined);
      if (error) {
        setMessage({ type: 'err', text: error.message || '로그인 실패' });
      } else if (usePassword) {
        // 비밀번호 로그인 성공 → useEffect에서 자동 리다이렉트
        setMessage({ type: 'ok', text: '로그인 중...' });
      } else {
        setMessage({ type: 'ok', text: `${email} 로 로그인 링크를 보냈어요. 메일함을 확인해주세요.` });
      }
    } catch (err: any) {
      setMessage({ type: 'err', text: String(err?.message || err) });
    } finally {
      setSubmitting(false);
    }
  };

  if (!ready) {
    return (
      <div style={{ minHeight: '100vh', display: 'grid', placeItems: 'center', background: '#fff' }}>
        <div style={{ width: 32, height: 32, border: '3px solid #e5e7eb', borderTopColor: '#cc0000', borderRadius: '50%', animation: 'spin 0.8s linear infinite' }} />
        <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
      </div>
    );
  }

  if (!enabled) {
    // 리다이렉트 진행 중 (위 useEffect)
    return null;
  }

  return (
    <div style={{ minHeight: '100vh', display: 'grid', placeItems: 'center', background: '#fafafa', padding: '24px', fontFamily: 'Pretendard, sans-serif' }}>
      <div style={{ width: '100%', maxWidth: 400, background: '#fff', border: '1px solid #e5e5e5', borderRadius: 16, padding: 32, boxShadow: '0 4px 20px rgba(0,0,0,0.04)' }}>
        <div style={{ textAlign: 'center', marginBottom: 28 }}>
          <div style={{ fontSize: 11, fontWeight: 700, color: '#cc0000', letterSpacing: '0.12em', marginBottom: 6 }}>ALGOMAKER</div>
          <h1 style={{ fontSize: 22, fontWeight: 800, letterSpacing: '-0.02em', margin: '0 0 6px' }}>로그인</h1>
          <p style={{ fontSize: 13, color: '#606060', margin: 0 }}>이메일로 빠르게 시작하세요</p>
        </div>

        <form onSubmit={handleSubmit}>
          <label style={{ display: 'block', marginBottom: 12 }}>
            <span style={{ display: 'block', fontSize: 12, fontWeight: 700, color: '#404040', marginBottom: 6 }}>이메일</span>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              required
              style={{ width: '100%', padding: '12px 14px', fontSize: 14, border: '1px solid #d4d4d4', borderRadius: 10, fontFamily: 'inherit', boxSizing: 'border-box' }}
            />
          </label>

          {usePassword && (
            <label style={{ display: 'block', marginBottom: 12 }}>
              <span style={{ display: 'block', fontSize: 12, fontWeight: 700, color: '#404040', marginBottom: 6 }}>비밀번호</span>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                style={{ width: '100%', padding: '12px 14px', fontSize: 14, border: '1px solid #d4d4d4', borderRadius: 10, fontFamily: 'inherit', boxSizing: 'border-box' }}
              />
            </label>
          )}

          <button
            type="submit"
            disabled={submitting || !email}
            style={{
              width: '100%', padding: '13px', background: submitting ? '#888' : '#cc0000', color: '#fff',
              border: 'none', borderRadius: 10, fontSize: 14, fontWeight: 700, cursor: submitting ? 'wait' : 'pointer',
              fontFamily: 'inherit', marginTop: 8,
            }}
          >
            {submitting ? '처리 중...' : usePassword ? '로그인' : '로그인 링크 받기'}
          </button>
        </form>

        <button
          onClick={() => { setUsePassword(!usePassword); setMessage(null); }}
          style={{ width: '100%', marginTop: 12, background: 'transparent', border: 'none', color: '#666', fontSize: 12, cursor: 'pointer', fontFamily: 'inherit' }}
        >
          {usePassword ? '메일 링크로 로그인' : '비밀번호로 로그인'}
        </button>

        {message && (
          <div style={{
            marginTop: 16, padding: '10px 12px', borderRadius: 8, fontSize: 12,
            background: message.type === 'ok' ? '#f0fdf4' : '#fef2f2',
            color: message.type === 'ok' ? '#166534' : '#991b1b',
            border: `1px solid ${message.type === 'ok' ? '#bbf7d0' : '#fecaca'}`,
          }}>
            {message.text}
          </div>
        )}

        <div style={{ marginTop: 24, paddingTop: 20, borderTop: '1px solid #f0f0f0', textAlign: 'center' }}>
          <button
            onClick={() => router.push('/create')}
            style={{ background: 'transparent', border: 'none', color: '#888', fontSize: 12, cursor: 'pointer', fontFamily: 'inherit', textDecoration: 'underline' }}
          >
            로그인 없이 시작하기 →
          </button>
        </div>
      </div>
    </div>
  );
}
