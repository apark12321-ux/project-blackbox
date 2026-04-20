'use client';

import { useState, FormEvent } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '../../lib/useAuth';
import styles from './login.module.css';

export default function LoginPage() {
  const router = useRouter();
  const { signInWithEmail, signUpWithEmail, signInWithGoogle, ready } = useAuth();
  const [mode, setMode] = useState<'signin' | 'signup'>('signin');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  if (!ready) {
    return (
      <div className={styles.root}>
        <div className={styles.card}>
          <h1 className={styles.title}>🔧 설정 필요</h1>
          <p className={styles.subtitle}>
            Supabase 환경변수가 설정되지 않았습니다.<br />
            <code>NEXT_PUBLIC_SUPABASE_URL</code>과{' '}
            <code>NEXT_PUBLIC_SUPABASE_ANON_KEY</code>를 Vercel에 추가해주세요.
          </p>
          <button className={styles.btn} onClick={() => router.push('/keyword')}>
            게스트로 둘러보기 →
          </button>
        </div>
      </div>
    );
  }

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);
    setLoading(true);

    try {
      if (mode === 'signin') {
        const { error } = await signInWithEmail(email, password);
        if (error) throw error;
        router.push('/keyword');
      } else {
        const { error } = await signUpWithEmail(email, password);
        if (error) throw error;
        setSuccess('가입 완료! 이메일 확인 후 로그인해주세요.');
        setMode('signin');
      }
    } catch (e: any) {
      setError(e.message || '오류가 발생했습니다');
    } finally {
      setLoading(false);
    }
  };

  const handleGoogle = async () => {
    setError(null);
    setLoading(true);
    try {
      await signInWithGoogle();
    } catch (e: any) {
      setError(e.message || 'Google 로그인 실패');
      setLoading(false);
    }
  };

  return (
    <div className={styles.root}>
      <div className={styles.card}>
        <div className={styles.brand}>
          <div className={styles.brandMark}>AM</div>
          <div>
            Algo<span className={styles.gold}>Maker</span>
          </div>
        </div>

        <h1 className={styles.title}>
          {mode === 'signin' ? '로그인' : '회원가입'}
        </h1>
        <p className={styles.subtitle}>
          {mode === 'signin'
            ? '계정이 있다면 이메일로 로그인하세요'
            : 'Beta 무료 체험 · 10개 영상 제작 크레딧 제공'}
        </p>

        {error && <div className={styles.error}>⚠ {error}</div>}
        {success && <div className={styles.success}>✓ {success}</div>}

        <form onSubmit={handleSubmit} className={styles.form}>
          <label className={styles.label}>
            이메일
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              className={styles.input}
              disabled={loading}
            />
          </label>

          <label className={styles.label}>
            비밀번호
            <input
              type="password"
              required
              minLength={6}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="6자 이상"
              className={styles.input}
              disabled={loading}
            />
          </label>

          <button
            type="submit"
            className={`${styles.btn} ${styles.btnPrimary}`}
            disabled={loading || !email || !password}
          >
            {loading ? '처리 중...' : mode === 'signin' ? '로그인 →' : '가입하고 시작 →'}
          </button>
        </form>

        <div className={styles.divider}>
          <span>또는</span>
        </div>

        <button
          className={styles.btnGoogle}
          onClick={handleGoogle}
          disabled={loading}
        >
          <svg width="18" height="18" viewBox="0 0 24 24">
            <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
            <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
            <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
            <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
          </svg>
          Google로 계속하기
        </button>

        <div className={styles.switcher}>
          {mode === 'signin' ? (
            <>
              계정이 없으신가요?{' '}
              <button onClick={() => { setMode('signup'); setError(null); }} className={styles.link}>
                회원가입
              </button>
            </>
          ) : (
            <>
              이미 계정이 있나요?{' '}
              <button onClick={() => { setMode('signin'); setError(null); }} className={styles.link}>
                로그인
              </button>
            </>
          )}
        </div>

        <div className={styles.guest}>
          <button onClick={() => router.push('/keyword')} className={styles.guestLink}>
            먼저 둘러보기 (로그인 없이) →
          </button>
        </div>
      </div>
    </div>
  );
}
