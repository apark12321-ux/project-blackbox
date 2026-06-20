'use client';

import Link from 'next/link';
import { useState } from 'react';
import { SITE, CATEGORIES, CATEGORY_KEYS } from '@/lib/site';

export default function Header() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <header className="nt-header">
      <div className="nt-header-inner">
        <Link href="/" className="nt-logo" onClick={() => setMenuOpen(false)}>
          <span className="nt-logo-mark">N</span>
          <span className="nt-logo-text">NuTube</span>
        </Link>

        <nav className="nt-nav-desktop">
          <div className="nt-nav-dropdown">
            <button className="nt-nav-link nt-nav-trigger">둘러보기 <span className="caret">▾</span></button>
            <div className="nt-dropdown-menu">
              {CATEGORY_KEYS.map((key) => {
                const cat = CATEGORIES[key];
                return (
                  <Link key={key} href={`/category/${key}`} className="nt-dropdown-item">
                    <span className="nt-dropdown-icon">{cat.icon}</span>
                    <span>
                      <strong>{cat.label}</strong>
                      <em>{cat.description}</em>
                    </span>
                  </Link>
                );
              })}
            </div>
          </div>
          <Link href="/blog" className="nt-nav-link">전체 가이드</Link>
          <Link href="/about" className="nt-nav-link">소개</Link>
          <Link href="/publish" className="nt-nav-cta">⚡ 메타데이터 생성기</Link>
        </nav>

        <button
          className="nt-menu-btn"
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label="메뉴"
        >
          <span className={menuOpen ? 'bar b1 open' : 'bar b1'} />
          <span className={menuOpen ? 'bar b2 open' : 'bar b2'} />
          <span className={menuOpen ? 'bar b3 open' : 'bar b3'} />
        </button>
      </div>

      {menuOpen && (
        <nav className="nt-nav-mobile">
          <div className="nt-mobile-section-label">카테고리</div>
          {CATEGORY_KEYS.map((key) => {
            const cat = CATEGORIES[key];
            return (
              <Link key={key} href={`/category/${key}`} className="nt-mobile-cat" onClick={() => setMenuOpen(false)}>
                <span>{cat.icon}</span> {cat.label}
              </Link>
            );
          })}
          <div className="nt-mobile-divider" />
          <Link href="/blog" onClick={() => setMenuOpen(false)}>전체 가이드</Link>
          <Link href="/about" onClick={() => setMenuOpen(false)}>소개</Link>
          <Link href="/publish" className="nt-mobile-cta" onClick={() => setMenuOpen(false)}>⚡ 메타데이터 생성기</Link>
        </nav>
      )}

      <style jsx global>{`
        .nt-header {
          position: sticky; top: 0; z-index: 100;
          background: rgba(13, 17, 23, 0.85);
          backdrop-filter: blur(12px);
          border-bottom: 1px solid rgba(255,255,255,0.08);
        }
        .nt-header-inner {
          max-width: 1200px; margin: 0 auto; padding: 0 20px;
          height: 64px; display: flex; align-items: center; justify-content: space-between;
        }
        .nt-logo {
          display: flex; align-items: center; gap: 9px;
          font-weight: 900; font-size: 21px; color: #fff;
          letter-spacing: -0.03em; text-decoration: none;
        }
        .nt-logo-mark {
          display: grid; place-items: center;
          width: 32px; height: 32px; border-radius: 9px;
          background: linear-gradient(135deg, #d9f99d 0%, #84cc16 100%);
          color: #0d1117; font-weight: 900; font-size: 19px;
          box-shadow: 0 0 18px rgba(132,204,22,0.5);
        }
        .nt-logo-text {
          background: linear-gradient(90deg, #fff 0%, #d9f99d 100%);
          -webkit-background-clip: text; background-clip: text;
          -webkit-text-fill-color: transparent;
        }

        .nt-nav-desktop {
          display: flex; align-items: center; gap: 4px;
        }
        .nt-nav-link {
          padding: 8px 14px; border-radius: 8px;
          color: rgba(255,255,255,0.75); font-size: 14.5px; font-weight: 600;
          text-decoration: none; transition: all 0.15s; background: none; border: none; cursor: pointer;
          font-family: inherit;
        }
        .nt-nav-link:hover { color: #fff; background: rgba(255,255,255,0.07); }
        .caret { font-size: 10px; opacity: 0.6; }

        .nt-nav-dropdown { position: relative; }
        .nt-dropdown-menu {
          position: absolute; top: calc(100% + 8px); left: 0;
          width: 320px; padding: 8px;
          background: #161b22; border: 1px solid rgba(255,255,255,0.1);
          border-radius: 14px; box-shadow: 0 16px 48px rgba(0,0,0,0.5);
          opacity: 0; visibility: hidden; transform: translateY(-8px);
          transition: all 0.18s;
        }
        .nt-nav-dropdown:hover .nt-dropdown-menu {
          opacity: 1; visibility: visible; transform: translateY(0);
        }
        .nt-dropdown-item {
          display: flex; align-items: flex-start; gap: 12px;
          padding: 12px; border-radius: 10px; text-decoration: none;
          transition: background 0.15s;
        }
        .nt-dropdown-item:hover { background: rgba(255,255,255,0.06); }
        .nt-dropdown-icon { font-size: 22px; line-height: 1; }
        .nt-dropdown-item strong {
          display: block; color: #fff; font-size: 14px; font-weight: 700; margin-bottom: 2px;
        }
        .nt-dropdown-item em {
          display: block; color: rgba(255,255,255,0.5); font-size: 12px;
          font-style: normal; line-height: 1.4;
        }

        .nt-nav-cta {
          margin-left: 8px; padding: 9px 18px; border-radius: 999px;
          background: linear-gradient(135deg, #84cc16 0%, #4ade80 100%);
          color: #0d1117; font-size: 14px; font-weight: 800;
          text-decoration: none; transition: all 0.18s;
          box-shadow: 0 4px 16px rgba(132,204,22,0.35);
        }
        .nt-nav-cta:hover {
          transform: translateY(-1px);
          box-shadow: 0 6px 22px rgba(132,204,22,0.5);
        }

        .nt-menu-btn {
          display: none; flex-direction: column; gap: 5px;
          background: none; border: none; cursor: pointer; padding: 8px;
        }
        .nt-menu-btn .bar {
          width: 24px; height: 2px; background: #fff; border-radius: 2px;
          transition: all 0.25s;
        }
        .nt-menu-btn .b1.open { transform: translateY(7px) rotate(45deg); }
        .nt-menu-btn .b2.open { opacity: 0; }
        .nt-menu-btn .b3.open { transform: translateY(-7px) rotate(-45deg); }

        .nt-nav-mobile {
          display: flex; flex-direction: column; padding: 16px 20px 24px;
          background: #0d1117; border-top: 1px solid rgba(255,255,255,0.08);
          gap: 4px;
        }
        .nt-mobile-section-label {
          font-size: 11px; font-weight: 700; text-transform: uppercase;
          color: rgba(255,255,255,0.4); letter-spacing: 0.05em;
          padding: 8px 12px 4px;
        }
        .nt-nav-mobile a {
          padding: 12px; border-radius: 10px;
          color: rgba(255,255,255,0.8); font-size: 15px; font-weight: 600;
          text-decoration: none;
        }
        .nt-nav-mobile a:hover { background: rgba(255,255,255,0.06); color: #fff; }
        .nt-mobile-cat { display: flex; align-items: center; gap: 10px; }
        .nt-mobile-divider {
          height: 1px; background: rgba(255,255,255,0.08); margin: 8px 0;
        }
        .nt-mobile-cta {
          background: linear-gradient(135deg, #84cc16 0%, #4ade80 100%);
          color: #0d1117 !important; font-weight: 800 !important;
          text-align: center; margin-top: 8px;
        }

        @media (max-width: 820px) {
          .nt-nav-desktop { display: none; }
          .nt-menu-btn { display: flex; }
        }
      `}</style>
    </header>
  );
}
