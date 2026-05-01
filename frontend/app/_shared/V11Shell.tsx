'use client';
/**
 * AlgoMaker V11Shell v11.1 - 컴팩트 모드 (사이드바 + 푸터)
 * 
 * 박예준 대표 컨셉:
 * - 김 부장(40대 퇴직자) 타겟
 * - "키워드만 입력하면 AI가 모두 대신해드립니다"
 * - 깔끔한 SaaS 도구 (가독성 최우선)
 * - SEO/AdSense 최적화
 * - 박 대표님 페이지 21개 모두 메뉴에서 접근 가능
 *
 * v11.1 변경 (2026.04.30) - 컴팩트 모드:
 *  - 사이드바 패딩/마진 ~30% 단축
 *  - 푸터 padding-top 48 → 32, margin-top 60 → 36
 *  - footerInner gap 40 → 28, padding-bottom 36 → 22
 *  - menuSection margin-bottom 24 → 16
 *  - 줄간격 1.7 → 1.55
 *  - 박 대표님 자산 100% 보존 (메뉴/노출/링크 그대로)
 */

import { ReactNode, useState, useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import Link from 'next/link';

// ============================================================
// Project State (localStorage 기반)
// ============================================================
const PROJECT_KEY = 'algomaker_project';

export interface ProjectState {
  category?: string;
  categoryLabel?: string;
  keyword?: string;
  scenarioStyleId?: string;
  templateId?: string;
  step?: number;
}

export function getProject(): ProjectState {
  if (typeof window === 'undefined') return {};
  try {
    const stored = localStorage.getItem(PROJECT_KEY);
    return stored ? JSON.parse(stored) : {};
  } catch {
    return {};
  }
}

export function setProject(updates: Partial<ProjectState>) {
  if (typeof window === 'undefined') return;
  try {
    const current = getProject();
    const next = { ...current, ...updates };
    localStorage.setItem(PROJECT_KEY, JSON.stringify(next));
  } catch {}
}

export function clearProject() {
  if (typeof window === 'undefined') return;
  try {
    localStorage.removeItem(PROJECT_KEY);
  } catch {}
}

// ============================================================
// Logo Component
// ============================================================
export function AlgoMakerLogo({ size = 'md', showSubtitle = true }: { size?: 'sm' | 'md' | 'lg'; showSubtitle?: boolean }) {
  const sizes = { sm: { logo: 14, sub: 9 }, md: { logo: 18, sub: 10 }, lg: { logo: 24, sub: 12 } };
  const s = sizes[size];
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
      <div style={{ fontSize: s.logo, fontWeight: 800, color: '#1a1a1a', letterSpacing: '-0.02em' }}>
        <span style={{ color: '#c65f3b' }}>Algo</span>Maker
      </div>
      {showSubtitle && (
        <div style={{ fontSize: s.sub, color: '#888', fontWeight: 600, letterSpacing: '0.05em' }}>
          AI 콘텐츠 추천 도구
        </div>
      )}
    </div>
  );
}

// ============================================================
// Notice Items (가짜 통계 X, 진짜 정보만)
// ============================================================
const NOTICES = [
  { dot: '💡', text: 'AI 추천 키워드 활용으로 알고리즘 최적화', tag: '팁' },
  { dot: '🎯', text: '퇴직 예정/예정자 (40대~70대)에게 인기있는 분야 12개 제공', tag: '신규' },
  { dot: '✨', text: '키워드 입력 한 번이면 4개 SNS 메타데이터 한 번에', tag: '편리' },
  { dot: '🚀', text: '완전 무료 · 회원가입 불필요 · 신용카드 X', tag: '무료' },
];

// ============================================================
// AdSlot Component (인라인) - AdSense 승인 전 자동 숨김
// ============================================================
function AdSlot({ slot, variant = 'horizontal' }: { slot: string; variant?: string }) {
  const client = (typeof process !== 'undefined' && process.env.NEXT_PUBLIC_ADSENSE_CLIENT) || '';
  const slotEnvKey = `NEXT_PUBLIC_ADSENSE_SLOT_${slot.toUpperCase().replace(/-/g, '_')}`;
  const slotId = (typeof process !== 'undefined' && (process.env as any)[slotEnvKey]) || '';

  // 🔑 AdSense 승인 전이면 완전히 숨김
  if (!client || !slotId) {
    return null;
  }

  return (
    <div className={`adContainer adContainer-${variant}`}>
      <div className="adLabel">광고</div>
      <ins
        className="adsbygoogle"
        style={{ display: 'block' }}
        data-ad-client={client}
        data-ad-slot={slotId}
        data-ad-format="auto"
        data-full-width-responsive="true"
      />

      <style jsx>{`
        .adContainer { width: 100%; padding: 6px 0; }
        .adLabel {
          font-size: 10px; font-weight: 600; color: #999;
          text-align: left; margin-bottom: 3px; letter-spacing: 0.05em;
        }
      `}</style>
    </div>
  );
}

// ============================================================
// V11Shell (사이드바가 있는 메인 레이아웃) - v11.1 컴팩트
// ============================================================
export function V11Shell({ children, currentStep }: { children: ReactNode; currentStep?: number }) {
  const router = useRouter();
  const pathname = usePathname();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [noticeIdx, setNoticeIdx] = useState(0);

  useEffect(() => {
    const t = setInterval(() => setNoticeIdx((i) => (i + 1) % NOTICES.length), 4500);
    return () => clearInterval(t);
  }, []);

  // 시니어 영상 멘토링 채널 컨셉 (v6.2.0)
  const mainMenu = [
    { icon: '🏠', label: '홈', path: '/', key: 'home' },
    { icon: '🔥', label: '떡상 분석', path: '/blog?cat=viral', key: 'viral' },
    { icon: '📱', label: '핸드폰 가이드', path: '/blog?cat=phone', key: 'phone' },
    { icon: '🤖', label: 'AI 도구', path: '/blog?cat=ai', key: 'ai' },
    { icon: '✏️', label: '자료 만들기', path: '/create', key: 'create' },
  ];

  const subMenu = [
    { icon: '📝', label: '전체 가이드', path: '/blog', key: 'blog' },
    { icon: 'ℹ️', label: '서비스 소개', path: '/about', key: 'about' },
    { icon: '✉️', label: '문의하기', path: '/contact', key: 'contact' },
  ];

  const isActive = (path: string) => {
    if (path === '/') return pathname === '/';
    return pathname.startsWith(path);
  };

  const currentNotice = NOTICES[noticeIdx];

  return (
    <div className="shell">
      <style jsx>{`
        .shell {
          min-height: 100vh;
          background: #fafafa;
          font-family: 'Pretendard Variable', Pretendard, system-ui, sans-serif;
          color: #1a1a1a;
        }
        .layout { display: flex; min-height: 100vh; }
        
        /* 사이드바 - 컴팩트 */
        .sidebar {
          width: 240px; flex-shrink: 0; background: #fff;
          border-right: 1px solid #e5e5e5;
          display: flex; flex-direction: column;
          padding: 14px 14px;
          height: 100vh;
          position: sticky; top: 0; overflow-y: auto;
        }
        .sidebarLogo { padding: 4px 6px 14px; }
        .freeLabel {
          display: inline-block; padding: 2px 9px;
          background: #e8f5e9; color: #2e7d32;
          border-radius: 100px; font-size: 10px; font-weight: 700;
          margin-top: 6px; letter-spacing: 0.05em;
        }
        .menuSection { margin-bottom: 16px; }
        .menuLabel {
          font-size: 10.5px; font-weight: 700; color: #999;
          padding: 0 8px 6px; letter-spacing: 0.08em;
        }
        .menuItem {
          display: flex; align-items: center; gap: 10px;
          padding: 9px 11px; border-radius: 10px; cursor: pointer;
          transition: all 0.15s; margin-bottom: 2px;
          font-size: 14.5px; color: #444; font-weight: 600;
          min-height: 40px;
        }
        .menuItem:hover { background: #fafafa; color: #1a1a1a; }
        .menuItem.active {
          background: #fdf1e7; color: #c65f3b; font-weight: 700;
        }
        .menuIcon { font-size: 17px; }
        
        /* 알림 카드 - 컴팩트 */
        .noticeCard {
          background: #fafafa; border: 1px solid #e5e5e5;
          border-radius: 10px; padding: 9px 10px;
          margin-bottom: 10px;
        }
        .noticeRow {
          display: flex; align-items: flex-start; gap: 7px;
        }
        .noticeText {
          font-size: 12px; color: #555; line-height: 1.5;
          flex: 1;
        }
        .noticeTag {
          font-size: 9px; font-weight: 700;
          background: #c65f3b; color: #fff;
          padding: 2px 6px; border-radius: 4px;
          margin-top: 1px;
        }
        
        .spacer { flex: 1; }
        .sidebarAd { padding: 6px 0; }
        
        /* 메인 콘텐츠 */
        .main {
          flex: 1; min-width: 0;
          display: flex; flex-direction: column;
        }
        
        /* 모바일 헤더 - 컴팩트 */
        .mobileHeader {
          display: none;
          background: #fff; border-bottom: 1px solid #e5e5e5;
          padding: 9px 16px;
          align-items: center; justify-content: space-between;
          position: sticky; top: 0; z-index: 100;
        }
        .menuToggle {
          background: none; border: none; cursor: pointer;
          padding: 8px; font-size: 22px; color: #555;
          min-width: 44px; min-height: 44px;
          display: flex; align-items: center; justify-content: center;
        }
        
        /* 콘텐츠 */
        .content { flex: 1; padding: 0; }
        
        /* 푸터 - 컴팩트 (가장 중요) */
        .footer {
          background: #1a1a1a; color: #ccc;
          padding: 32px 24px 18px;
          margin-top: 36px;
        }
        .footerInner {
          max-width: 1200px; margin: 0 auto;
          display: grid; grid-template-columns: 2fr 1fr 1fr 1fr;
          gap: 28px;
          padding-bottom: 22px;
          border-bottom: 1px solid #333;
        }
        .footerCol h4 {
          font-size: 13px; font-weight: 700;
          color: #fff; margin: 0 0 10px;
        }
        .footerCol ul {
          list-style: none; padding: 0; margin: 0;
        }
        .footerCol li { margin-bottom: 6px; }
        .fLink {
          color: #999; font-size: 13px;
          text-decoration: none; transition: color 0.15s;
        }
        .fLink:hover { color: #fff; }
        .fTag {
          font-size: 13px; color: #999;
          line-height: 1.55; margin: 8px 0;
        }
        .fCompany {
          font-size: 11.5px; color: #777;
          line-height: 1.55;
        }
        .fBottom {
          max-width: 1200px; margin: 0 auto;
          padding-top: 16px;
          display: flex; justify-content: space-between;
          align-items: center; flex-wrap: wrap; gap: 10px;
          font-size: 11.5px; color: #777;
        }
        
        /* 모바일 - 컴팩트 */
        @media (max-width: 768px) {
          .sidebar {
            position: fixed; left: -280px;
            top: 0; bottom: 0; height: 100vh;
            transition: left 0.25s; z-index: 1000;
            box-shadow: 0 0 24px rgba(0,0,0,0.1);
            width: 280px;
            padding: 16px 14px;
          }
          .sidebar.open { left: 0; }
          .mobileHeader { display: flex; }
          .footerInner {
            grid-template-columns: 1fr 1fr;
            gap: 18px;
          }
          /* 모바일 사이드바 메뉴 살짝 크게 (시니어 친화 유지) */
          .menuItem {
            font-size: 15.5px !important;
            padding: 11px 13px !important;
            min-height: 46px;
          }
          .menuIcon { font-size: 19px !important; }
          .menuLabel { font-size: 11.5px !important; }
          
          .footer {
            padding: 24px 18px 14px;
            margin-top: 28px;
          }
        }
        @media (max-width: 480px) {
          .footerInner { 
            grid-template-columns: 1fr; 
            gap: 16px;
            padding-bottom: 18px;
          }
        }
        
        /* 백드롭 */
        .backdrop {
          display: none;
          position: fixed; inset: 0;
          background: rgba(0,0,0,0.4);
          z-index: 999;
        }
        .backdrop.show { display: block; }
      `}</style>

      <div className="layout">
        {/* 사이드바 */}
        <aside className={`sidebar ${sidebarOpen ? 'open' : ''}`}>
          <div className="sidebarLogo">
            <AlgoMakerLogo size="sm" showSubtitle={true} />
            <div className="freeLabel">무료</div>
          </div>

          <div className="menuSection">
            <div className="menuLabel">메뉴</div>
            {mainMenu.map((m) => (
              <div
                key={m.key}
                className={`menuItem ${isActive(m.path) ? 'active' : ''}`}
                onClick={() => { router.push(m.path); setSidebarOpen(false); }}
              >
                <span className="menuIcon">{m.icon}</span>
                <span>{m.label}</span>
              </div>
            ))}
          </div>

          <div className="menuSection">
            <div className="menuLabel">정보</div>
            {subMenu.map((m) => (
              <div
                key={m.key}
                className={`menuItem ${isActive(m.path) ? 'active' : ''}`}
                onClick={() => { router.push(m.path); setSidebarOpen(false); }}
              >
                <span className="menuIcon">{m.icon}</span>
                <span>{m.label}</span>
              </div>
            ))}
          </div>

          <div className="noticeCard">
            <div className="noticeRow">
              <span style={{ fontSize: 14 }}>{currentNotice.dot}</span>
              <div className="noticeText">{currentNotice.text}</div>
              <span className="noticeTag">{currentNotice.tag}</span>
            </div>
          </div>

          <div className="spacer" />

          <div className="sidebarAd">
            <AdSlot slot="sidebar" variant="sidebar-card" />
          </div>
        </aside>

        {/* 백드롭 (모바일) */}
        <div 
          className={`backdrop ${sidebarOpen ? 'show' : ''}`}
          onClick={() => setSidebarOpen(false)}
        />

        {/* 메인 */}
        <main className="main">
          <div className="mobileHeader">
            <button className="menuToggle" onClick={() => setSidebarOpen(!sidebarOpen)}>
              ☰
            </button>
            <AlgoMakerLogo size="sm" showSubtitle={false} />
            <div style={{ width: 24 }} />
          </div>

          <div className="content">
            {children}
          </div>

          {/* 푸터 */}
          <footer className="footer">
            <div className="footerInner">
              <div>
                <AlgoMakerLogo size="md" showSubtitle={false} />
                <div className="fTag">
                  키워드만 입력하면 AI가<br />
                  영상 제목·태그·대본을 추천해드립니다.
                </div>
                <div className="fCompany">
                  무료 · 회원가입 X<br />
                  광고 보고 무제한 사용
                </div>
              </div>
              <div className="footerCol">
                <h4>가이드</h4>
                <ul>
                  <li><Link href="/blog?cat=viral" className="fLink">🔥 떡상 분석</Link></li>
                  <li><Link href="/blog?cat=phone" className="fLink">📱 핸드폰 가이드</Link></li>
                  <li><Link href="/blog?cat=ai" className="fLink">🤖 AI 도구</Link></li>
                  <li><Link href="/blog" className="fLink">📝 전체 가이드</Link></li>
                </ul>
              </div>
              <div className="footerCol">
                <h4>도구·회사</h4>
                <ul>
                  <li><Link href="/create" className="fLink">✏️ 자료 만들기</Link></li>
                  <li><Link href="/about" className="fLink">서비스 소개</Link></li>
                  <li><Link href="/contact" className="fLink">문의하기</Link></li>
                </ul>
              </div>
              <div className="footerCol">
                <h4>정책</h4>
                <ul>
                  <li><Link href="/privacy" className="fLink">개인정보 처리방침</Link></li>
                  <li><Link href="/terms" className="fLink">이용약관</Link></li>
                </ul>
              </div>
            </div>
            <div className="fBottom">
              <div>© 2026 AlgoMaker · 알고파트너스. 모든 권리 보유.</div>
              <div>
                <Link href="/privacy" className="fLink">개인정보 처리방침</Link>
                {' · '}
                <Link href="/terms" className="fLink">이용약관</Link>
                {' · '}
                <Link href="/contact" className="fLink">Contact</Link>
              </div>
            </div>
          </footer>
        </main>
      </div>
    </div>
  );
}

// 별칭 (호환성)
export const DashboardShell = V11Shell;
