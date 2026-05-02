'use client';
/**
 * AlgoMaker V11Shell v11.5 - GNB 간결화 + /blog 트래픽 유도
 *
 * 박 대표님 v11.5 요청:
 *   "GNB에 가이드 카테고리 너무 많음"
 *   "하위 카테고리로 내려서 목록형으로 조회수 나오게"
 *   → GNB 간결화 + /blog 페이지 트래픽 유도
 *   → AdSense 친화 (페이지뷰 누적 효과)
 *
 * v11.5 변경 (v11.4 → v11.5):
 *  ✅ GNB 가이드 8편 직접 노출 → 1개 메뉴로
 *    "📚 가이드 [10편 배지]" 클릭 → /blog 목록 페이지 진입
 *  ✅ "도구" 메뉴도 1개로 → /create 진입
 *  ✅ menuLabel "가이드/도구/정보" → 단순화
 *    (가이드/도구는 라벨 없이 직접 메뉴 1개씩)
 *  ✅ menuBadge 추가 (10편 표시)
 *  ✅ 푸터는 그대로 유지 (SEO 내부 링크)
 *
 * 사용자 흐름 개선:
 *  이전: 메인 → 가이드 직접 (2페이지뷰)
 *  이후: 메인 → /blog 목록 → 가이드 (3페이지뷰)
 *  → AdSense 페이지뷰 누적 ↑
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
// Logo Component (v11.2: 사이즈 확대 + 클릭 시 홈 이동)
// ============================================================
export function AlgoMakerLogo({ 
  size = 'md', 
  showSubtitle = true,
  asLink = true,
}: { 
  size?: 'sm' | 'md' | 'lg'; 
  showSubtitle?: boolean;
  asLink?: boolean;
}) {
  // v11.2: 사이즈 약 30% 확대 (sm 14→18, md 18→22, lg 24→28)
  const sizes = { 
    sm: { logo: 18, sub: 10 }, 
    md: { logo: 22, sub: 11 }, 
    lg: { logo: 28, sub: 13 } 
  };
  const s = sizes[size];

  const content = (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
      <div style={{ fontSize: s.logo, fontWeight: 800, color: '#1a1a1a', letterSpacing: '-0.02em', lineHeight: 1.1 }}>
        <span style={{ color: '#c65f3b' }}>Algo</span>Maker
      </div>
      {showSubtitle && (
        <div style={{ fontSize: s.sub, color: '#888', fontWeight: 600, letterSpacing: '0.05em' }}>
          AI 콘텐츠 추천 도구
        </div>
      )}
    </div>
  );

  if (asLink) {
    return (
      <Link 
        href="/" 
        style={{ 
          textDecoration: 'none', 
          color: 'inherit',
          display: 'inline-block',
          cursor: 'pointer',
        }}
        aria-label="홈으로 이동"
      >
        {content}
      </Link>
    );
  }
  return content;
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
  // ============================================================
  // v11.5: GNB 간결화 - 카테고리 페이지로 유도
  // 박 대표님 v11.5 요청:
  //   "GNB에 가이드 카테고리 너무 많음"
  //   "하위 카테고리로 내려서 목록형으로 조회수 나오게"
  //   → /blog 페이지 트래픽 유도 (AdSense 중요 지표)
  // ============================================================
  
  // 핵심 CTA 버튼
  const ctaAction = {
    label: '자료 만들기',
    sub: 'AI가 5초 안에',
    path: '/create',
    key: 'create',
  };
  
  // 홈 버튼 (CTA 위)
  const homeMenu = { icon: '🏠', label: '홈', path: '/', key: 'home' };
  
  // 메인 메뉴 (간결!)
  // → 가이드 클릭 시 /blog 목록 페이지로 → 조회수 누적
  const mainMenu = [
    { icon: '📚', label: '가이드', path: '/blog', key: 'blog', badge: '10편' },
    { icon: '🛠', label: '도구', path: '/create', key: 'tool' },
  ];
  
  // 정보 메뉴
  const infoMenu = [
    { icon: 'ℹ️', label: '서비스 소개', path: '/about', key: 'about' },
    { icon: '✉️', label: '문의하기', path: '/contact', key: 'contact' },
  ];
  
  // 정책 메뉴 (작게)
  const policyMenu = [
    { label: '개인정보 처리방침', path: '/privacy', key: 'privacy' },
    { label: '이용약관', path: '/terms', key: 'terms' },
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

        /* v11.3 NEW: CTA 강조 버튼 (자료 만들기) */
        .ctaBtn {
          margin: 0 0 18px;
          padding: 12px 14px;
          background: linear-gradient(135deg, #c2410c 0%, #ea580c 100%);
          color: #ffffff;
          cursor: pointer;
          transition: all 0.15s;
          position: relative;
          overflow: hidden;
        }
        .ctaBtn:hover {
          background: linear-gradient(135deg, #a3340a 0%, #c2410c 100%);
          transform: translateY(-1px);
          box-shadow: 0 4px 8px rgba(194, 65, 12, 0.25);
        }
        .ctaBtnLabel {
          font-size: 14px;
          font-weight: 800;
          letter-spacing: -0.015em;
          margin-bottom: 2px;
        }
        .ctaBtnSub {
          font-size: 10.5px;
          font-weight: 600;
          letter-spacing: 0.04em;
          color: rgba(255, 255, 255, 0.85);
          font-family: 'SF Mono', 'Consolas', monospace;
        }
        .ctaBtnArrow {
          position: absolute;
          right: 14px;
          top: 50%;
          transform: translateY(-50%);
          font-size: 18px;
          font-weight: 700;
          color: #fbbf24;
        }

        /* v11.3 NEW: 정책 메뉴 (작게) */
        .policySection {
          margin-top: 8px;
          padding-top: 12px;
          border-top: 1px dashed #e5e5e5;
        }
        .policyItem {
          padding: 6px 8px;
          font-size: 11px;
          color: #a3a3a3;
          cursor: pointer;
          transition: color 0.15s;
          letter-spacing: -0.005em;
        }
        .policyItem:hover {
          color: #525252;
        }
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
        
        /* v11.5: 메뉴 배지 (가이드 옆 "10편" 등) */
        .menuBadge {
          margin-left: auto;
          padding: 2px 7px;
          background: #fef3e7;
          color: #c2410c;
          font-size: 10px;
          font-weight: 700;
          letter-spacing: 0.02em;
          font-family: 'SF Mono', 'Consolas', monospace;
          border-radius: 4px;
        }
        .menuItem.active .menuBadge {
          background: #c2410c;
          color: #ffffff;
        }
        
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
            <AlgoMakerLogo size="md" showSubtitle={true} />
            <div className="freeLabel">무료</div>
          </div>

          {/* 홈 (CTA 위) */}
          <div
            className={`menuItem ${isActive(homeMenu.path) ? 'active' : ''}`}
            onClick={() => { router.push(homeMenu.path); setSidebarOpen(false); }}
            style={{ marginBottom: 12 }}
          >
            <span className="menuIcon">{homeMenu.icon}</span>
            <span>{homeMenu.label}</span>
          </div>

          {/* CTA 강조 버튼 (자료 만들기 - 핵심 액션) */}
          <div
            className="ctaBtn"
            onClick={() => { router.push(ctaAction.path); setSidebarOpen(false); }}
          >
            <div className="ctaBtnLabel">✏️ {ctaAction.label}</div>
            <div className="ctaBtnSub">{ctaAction.sub}</div>
            <div className="ctaBtnArrow">→</div>
          </div>

          {/* 메인 메뉴 (가이드/도구 - 카테고리만, 클릭 시 목록 페이지로) */}
          <div className="menuSection">
            {mainMenu.map((m) => (
              <div
                key={m.key}
                className={`menuItem ${isActive(m.path) ? 'active' : ''}`}
                onClick={() => { router.push(m.path); setSidebarOpen(false); }}
              >
                <span className="menuIcon">{m.icon}</span>
                <span>{m.label}</span>
                {(m as any).badge && (
                  <span className="menuBadge">{(m as any).badge}</span>
                )}
              </div>
            ))}
          </div>

          {/* 정보 메뉴 */}
          <div className="menuSection">
            <div className="menuLabel">정보</div>
            {infoMenu.map((m) => (
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

          {/* 정책 메뉴 (작게) */}
          <div className="policySection">
            {policyMenu.map((m) => (
              <div
                key={m.key}
                className="policyItem"
                onClick={() => { router.push(m.path); setSidebarOpen(false); }}
              >
                {m.label}
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
            <AlgoMakerLogo size="md" showSubtitle={false} />
            <div style={{ width: 24 }} />
          </div>

          <div className="content">
            {children}
          </div>

          {/* 푸터 */}
          <footer className="footer">
            <div className="footerInner">
              <div>
                <AlgoMakerLogo size="lg" showSubtitle={false} />
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
                  <li><Link href="/blog" className="fLink">📚 전체 가이드 모음</Link></li>
                  <li><Link href="/blog/algorithm-seo" className="fLink">🔍 SEO 검색 최적화</Link></li>
                  <li><Link href="/blog/algorithm-retention" className="fLink">⏱ 시청 지속률 전략</Link></li>
                  <li><Link href="/blog/algorithm-branding" className="fLink">🎨 채널 브랜딩</Link></li>
                  <li><Link href="/blog/algorithm-mistakes" className="fLink">⚠️ 치명적 실수 방어</Link></li>
                  <li><Link href="/blog/algorithm-mindset" className="fLink">💪 유튜버 멘탈</Link></li>
                </ul>
              </div>
              <div className="footerCol">
                <h4>도구</h4>
                <ul>
                  <li><Link href="/create" className="fLink">✏️ 자료 만들기</Link></li>
                  <li><Link href="/blog/youtube-start" className="fLink">🎬 영상 처음 시작</Link></li>
                  <li><Link href="/blog/ai-tools" className="fLink">🤖 AI 도구 활용법</Link></li>
                </ul>
              </div>
              <div className="footerCol">
                <h4>정보 · 정책</h4>
                <ul>
                  <li><Link href="/about" className="fLink">서비스 소개</Link></li>
                  <li><Link href="/contact" className="fLink">문의하기</Link></li>
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
