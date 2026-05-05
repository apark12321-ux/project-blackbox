'use client';
/**
 * V18Shell - 애드센스 친화 표준 블로그 셸 (v18)
 *
 * 박 대표님 v18 결정:
 *   "구글이 애드센스 승인 위한 사람들을 위해서 만든 샘플 사이트처럼"
 *
 * 설계 원칙:
 *   ✅ 표준 블로그 구조 (구글 검색 친화)
 *   ✅ 단일 컬럼 (사이드바 X)
 *   ✅ 명확한 H 태그
 *   ✅ 카드 / 매거진 / 인터랙션 모두 X
 *   ✅ 모바일 우선 (애드센스 70%+ 모바일)
 *   ✅ 큰 글씨, 가독성 최우선
 *
 * 모든 페이지 공통 사용
 */

import Link from 'next/link';
import { useState, ReactNode } from 'react';
import { usePathname } from 'next/navigation';

interface V18ShellProps {
  children: ReactNode;
}

export function V18Shell({ children }: V18ShellProps) {
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);

  const isActive = (path: string) => {
    if (path === '/') return pathname === '/';
    return pathname?.startsWith(path);
  };

  return (
    <div className="site">
      <header className="site-header">
        <div className="container header-inner">
          <Link href="/" className="logo">AlgoMaker</Link>

          <nav className="nav-desktop">
            <Link href="/" className={isActive('/') ? 'nav-link active' : 'nav-link'}>홈</Link>
            <Link href="/blog" className={isActive('/blog') ? 'nav-link active' : 'nav-link'}>가이드</Link>
            <Link href="/publish" className={isActive('/publish') ? 'nav-link active' : 'nav-link'}>메타데이터 생성기</Link>
            <Link href="/about" className={isActive('/about') ? 'nav-link active' : 'nav-link'}>소개</Link>
            <Link href="/contact" className={isActive('/contact') ? 'nav-link active' : 'nav-link'}>문의</Link>
          </nav>

          <button className="menu-btn" onClick={() => setMenuOpen(!menuOpen)} aria-label="메뉴">
            <span className={menuOpen ? 'bar bar-1 open' : 'bar bar-1'} />
            <span className={menuOpen ? 'bar bar-2 open' : 'bar bar-2'} />
            <span className={menuOpen ? 'bar bar-3 open' : 'bar bar-3'} />
          </button>
        </div>

        {menuOpen && (
          <nav className="nav-mobile">
            <Link href="/" onClick={() => setMenuOpen(false)}>홈</Link>
            <Link href="/blog" onClick={() => setMenuOpen(false)}>가이드</Link>
            <Link href="/publish" onClick={() => setMenuOpen(false)}>메타데이터 생성기</Link>
            <Link href="/about" onClick={() => setMenuOpen(false)}>소개</Link>
            <Link href="/contact" onClick={() => setMenuOpen(false)}>문의</Link>
          </nav>
        )}
      </header>

      <main className="site-main">{children}</main>

      <footer className="site-footer">
        <div className="container footer-inner">
          <div className="footer-col">
            <div className="footer-title">AlgoMaker</div>
            <p className="footer-desc">
              유튜브 채널 운영 노하우 가이드.<br />
              알고리즘, 시니어 사연 쇼츠, AI 도구, 수익화 27편.
            </p>
          </div>

          <div className="footer-col">
            <div className="footer-title">카테고리</div>
            <ul className="footer-list">
              <li><Link href="/blog?cat=algorithm">유튜브 알고리즘</Link></li>
              <li><Link href="/blog?cat=senior">시니어 사연 쇼츠</Link></li>
              <li><Link href="/blog?cat=aitools">AI 도구 활용</Link></li>
              <li><Link href="/blog?cat=monetization">영상 채널 수익화</Link></li>
            </ul>
          </div>

          <div className="footer-col">
            <div className="footer-title">사이트 정보</div>
            <ul className="footer-list">
              <li><Link href="/about">서비스 소개</Link></li>
              <li><Link href="/contact">문의하기</Link></li>
              <li><Link href="/privacy">개인정보 처리방침</Link></li>
              <li><Link href="/terms">이용약관</Link></li>
            </ul>
          </div>
        </div>

        <div className="footer-bottom container">
          © 2026 알고파트너스 · 대표 박예준 · apark12321@gmail.com
        </div>
      </footer>

      <style jsx global>{`
        /* ============================================ */
        /* v18 - 애드센스 친화 표준 블로그 (전역 리셋) */
        /* ============================================ */

        *, *::before, *::after { box-sizing: border-box; }

        html { -webkit-text-size-adjust: 100%; }

        body {
          margin: 0;
          padding: 0;
          font-family: 'Pretendard', -apple-system, BlinkMacSystemFont, system-ui, 'Apple SD Gothic Neo', 'Malgun Gothic', sans-serif;
          font-size: 16px;
          line-height: 1.7;
          color: #1a1a1a;
          background: #ffffff;
          -webkit-font-smoothing: antialiased;
        }

        a { color: inherit; text-decoration: none; }
        button { font-family: inherit; }
        img { max-width: 100%; height: auto; display: block; }

        /* ============================================ */
        /* 공통 컨테이너 */
        /* ============================================ */
        .container {
          max-width: 760px;
          margin: 0 auto;
          padding: 0 20px;
        }
        @media (max-width: 600px) {
          .container { padding: 0 16px; }
        }

        /* ============================================ */
        /* 사이트 레이아웃 */
        /* ============================================ */
        .site {
          min-height: 100vh;
          display: flex;
          flex-direction: column;
        }
        .site-main { flex: 1; }

        /* ============================================ */
        /* HEADER */
        /* ============================================ */
        .site-header {
          background: #ffffff;
          border-bottom: 1px solid #e5e5e5;
          position: sticky;
          top: 0;
          z-index: 100;
        }

        .header-inner {
          display: flex;
          align-items: center;
          justify-content: space-between;
          height: 60px;
        }

        .logo {
          font-size: 20px;
          font-weight: 700;
          color: #1a1a1a;
          letter-spacing: -0.02em;
        }
        @media (max-width: 600px) { .logo { font-size: 18px; } }

        .nav-desktop {
          display: flex;
          gap: 28px;
        }
        @media (max-width: 768px) { .nav-desktop { display: none; } }

        .nav-link {
          font-size: 15px;
          font-weight: 500;
          color: #525252;
          padding: 4px 0;
          transition: color 0.15s;
        }
        .nav-link:hover { color: #1a1a1a; }
        .nav-link.active {
          color: #1a1a1a;
          font-weight: 700;
        }

        .menu-btn {
          display: none;
          width: 36px;
          height: 36px;
          background: transparent;
          border: none;
          cursor: pointer;
          flex-direction: column;
          justify-content: center;
          align-items: center;
          gap: 5px;
        }
        @media (max-width: 768px) { .menu-btn { display: flex; } }

        .bar {
          width: 22px;
          height: 2px;
          background: #1a1a1a;
          transition: transform 0.2s, opacity 0.2s;
        }
        .bar-1.open { transform: translateY(7px) rotate(45deg); }
        .bar-2.open { opacity: 0; }
        .bar-3.open { transform: translateY(-7px) rotate(-45deg); }

        .nav-mobile {
          display: flex;
          flex-direction: column;
          background: #ffffff;
          border-top: 1px solid #f0f0f0;
        }
        .nav-mobile a {
          padding: 14px 20px;
          font-size: 16px;
          font-weight: 500;
          color: #1a1a1a;
          border-bottom: 1px solid #f0f0f0;
        }
        .nav-mobile a:last-child { border-bottom: none; }

        /* ============================================ */
        /* FOOTER */
        /* ============================================ */
        .site-footer {
          background: #f8f8f8;
          border-top: 1px solid #e5e5e5;
          padding: 48px 0 24px;
          margin-top: 80px;
        }
        @media (max-width: 600px) {
          .site-footer { padding: 36px 0 20px; margin-top: 56px; }
        }

        .footer-inner {
          display: grid;
          grid-template-columns: 2fr 1fr 1fr;
          gap: 36px;
          margin-bottom: 32px;
        }
        @media (max-width: 600px) {
          .footer-inner { grid-template-columns: 1fr; gap: 24px; margin-bottom: 24px; }
        }

        .footer-title {
          font-size: 15px;
          font-weight: 700;
          color: #1a1a1a;
          margin-bottom: 12px;
          letter-spacing: -0.015em;
        }

        .footer-desc {
          font-size: 14px;
          color: #525252;
          line-height: 1.7;
          margin: 0;
        }

        .footer-list {
          list-style: none;
          padding: 0;
          margin: 0;
        }
        .footer-list li { margin-bottom: 8px; }
        .footer-list a {
          font-size: 14px;
          color: #525252;
          transition: color 0.15s;
        }
        .footer-list a:hover { color: #1a1a1a; }

        .footer-bottom {
          padding-top: 20px;
          border-top: 1px solid #e5e5e5;
          font-size: 13px;
          color: #737373;
          text-align: center;
        }
      `}</style>
    </div>
  );
}
