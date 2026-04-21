'use client';

/**
 * v11 공용 레이아웃 · 클린 화이트 + 파란 포인트
 * Pretendard + 절제된 디자인
 */

import Link from 'next/link';
import { useRouter, usePathname } from 'next/navigation';
import { useState, useEffect } from 'react';
import styles from './shell.module.css';

export interface V11ProjectState {
  category?: string;
  categoryLabel?: string;
  keyword?: string;
  keywordData?: any;
  tone?: 'formal' | 'friendly' | 'casual' | 'slang';
  duration?: number;
  mode?: 'normal' | 'senior';
  customTopic?: string;
  step?: number;
}

const PROJECT_KEY = 'v11_project';

export function getProject(): V11ProjectState {
  if (typeof window === 'undefined') return {};
  try {
    const raw = localStorage.getItem(PROJECT_KEY);
    return raw ? JSON.parse(raw) : {};
  } catch {
    return {};
  }
}

export function setProject(updates: Partial<V11ProjectState>) {
  if (typeof window === 'undefined') return;
  try {
    const current = getProject();
    localStorage.setItem(PROJECT_KEY, JSON.stringify({ ...current, ...updates }));
  } catch {}
}

export function clearProject() {
  if (typeof window === 'undefined') return;
  try { localStorage.removeItem(PROJECT_KEY); } catch {}
}

export interface V11ShellProps {
  children: React.ReactNode;
  currentStep?: number;  // 1~5
}

export function V11Shell({ children, currentStep }: V11ShellProps) {
  const router = useRouter();
  const pathname = usePathname();

  return (
    <div className={styles.root}>
      <FontStyles />

      <header className={styles.header}>
        <div className={styles.headerInner}>
          <Link href="/" className={styles.logo}>
            Algo<span>Maker</span>
          </Link>
          <nav className={styles.navLinks}>
            <a href="#guides" onClick={e => { e.preventDefault(); router.push('/'); }}>소개</a>
            <a href="#process">프로세스</a>
            <a href="#faq">FAQ</a>
          </nav>
          <button
            className={styles.btnNav}
            onClick={() => router.push('/create')}
          >
            무료 시작
          </button>
        </div>
      </header>

      {currentStep !== undefined && (
        <div className={styles.stepBar}>
          <div className={styles.stepBarInner}>
            <StepItem num={1} label="카테고리" current={currentStep} target={1} onClick={() => currentStep > 1 && router.push('/create')} />
            <StepArrow />
            <StepItem num={2} label="키워드" current={currentStep} target={2} onClick={() => currentStep > 2 && router.push('/keyword')} />
            <StepArrow />
            <StepItem num={3} label="설정" current={currentStep} target={3} onClick={() => currentStep > 3 && router.push('/configure')} />
            <StepArrow />
            <StepItem num={4} label="AI 처리" current={currentStep} target={4} />
            <StepArrow />
            <StepItem num={5} label="완성" current={currentStep} target={5} />
          </div>
        </div>
      )}

      <main className={styles.main}>
        {children}
      </main>

      <footer className={styles.footer}>
        <div className={styles.footerInner}>
          <div className={styles.footerTop}>
            <div className={styles.footerCol}>
              <div className={styles.logo} style={{ fontSize: 16 }}>
                Algo<span>Maker</span>
              </div>
              <p className={styles.footerBrandDesc}>
                AI가 키워드 발굴부터 영상 제작, SEO까지 자동으로 처리하는
                YouTube 콘텐츠 자동화 플랫폼.
              </p>
            </div>
            <div className={styles.footerCol}>
              <h5>제품</h5>
              <ul>
                <li><a href="/create">시작하기</a></li>
                <li><a href="#process">프로세스</a></li>
                <li><a href="#faq">FAQ</a></li>
              </ul>
            </div>
            <div className={styles.footerCol}>
              <h5>회사</h5>
              <ul>
                <li><a href="#about">소개</a></li>
                <li><a href="mailto:contact@algomaker.kr">문의</a></li>
              </ul>
            </div>
          </div>

          <div className={styles.bizInfo}>
            <span className={styles.bizValueWrap}>
              <span className={styles.bizLabel}>상호</span> 한줄컴퍼니
            </span>
            <span className={styles.bizValue}>
              <span className={styles.bizLabel}>대표</span> 박예준
            </span>
            <span className={styles.bizValue}>
              <span className={styles.bizLabel}>사업자등록번호</span> 450-07-03104
            </span>
            <br />
            <span className={styles.bizValueWrap}>
              <span className={styles.bizLabel}>통신판매업신고</span> 제 2025-인천서구-3321호
            </span>
            <br />
            <span className={styles.bizValueWrap}>
              <span className={styles.bizLabel}>주소</span> 인천광역시 서구 청라커낼로 270, 커낼힐스빌 2층 2498호
            </span>
          </div>

          <div className={styles.footerBottom}>
            <span>© 2026 AlgoMaker · 한줄컴퍼니</span>
            <span>
              <a href="#">이용약관</a>
              <a href="#">개인정보처리방침</a>
            </span>
          </div>
        </div>
      </footer>
    </div>
  );
}

function StepItem({ num, label, current, target, onClick }: any) {
  const isDone = current > target;
  const isActive = current === target;
  const isClickable = isDone && !!onClick;

  return (
    <button
      className={`${styles.stepItem} ${isActive ? styles.stepActive : ''} ${isDone ? styles.stepDone : ''}`}
      onClick={isClickable ? onClick : undefined}
      disabled={!isClickable && !isActive}
    >
      <span className={styles.stepNum}>{isDone ? '✓' : num}</span>
      <span className={styles.stepLabel}>{label}</span>
    </button>
  );
}

function StepArrow() {
  return (
    <span className={styles.stepArrow}>
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <polyline points="9 18 15 12 9 6" />
      </svg>
    </span>
  );
}

function FontStyles() {
  return (
    <style dangerouslySetInnerHTML={{ __html: `
      @import url('https://cdn.jsdelivr.net/gh/orioncactus/pretendard@v1.3.9/dist/web/static/pretendard.min.css');
      * { margin: 0; padding: 0; box-sizing: border-box; }
      html { scroll-behavior: smooth; scroll-padding-top: 80px; -webkit-text-size-adjust: 100%; }
      body { font-family: 'Pretendard', -apple-system, BlinkMacSystemFont, sans-serif; font-size: 16px; line-height: 1.7; color: #111827; background: #ffffff; -webkit-font-smoothing: antialiased; }
    ` }} />
  );
}
