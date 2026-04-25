'use client';
/**
 * /done - 완료 페이지
 */

import { useEffect } from 'react';
import Link from 'next/link';
import { V11Shell, getProject } from '../_shared/V11Shell';
import { getCategoryById, CATEGORIES } from '../_shared/platforms';
import AdSlot from '../_shared/AdSlot';

export default function DonePage() {
  const project = typeof window !== 'undefined' ? getProject() : {};
  const cat = project.category ? getCategoryById(project.category) : null;
  
  // 다른 추천 카테고리 (HOT 카테고리만)
  const otherCategories = CATEGORIES.filter(c => c.hot && c.id !== project.category).slice(0, 4);

  return (
    <V11Shell>
      <style jsx>{`
        .page { max-width: 920px; margin: 0 auto; padding: 60px 24px; }
        
        .hero { text-align: center; margin-bottom: 48px; }
        .successIcon {
          width: 80px; height: 80px;
          background: #e8f5e9; color: #2e7d32;
          border-radius: 50%; line-height: 80px;
          font-size: 40px; margin: 0 auto 20px;
        }
        .title {
          font-size: 32px; font-weight: 800;
          color: #1a1a1a; letter-spacing: -0.025em;
          margin: 0 0 12px;
        }
        .sub { font-size: 16px; color: #666; line-height: 1.7; }
        @media (max-width: 600px) { .title { font-size: 24px; } }

        .summary {
          background: #fafafa; border: 1px solid #e5e5e5;
          border-radius: 12px; padding: 20px;
          margin-bottom: 32px; text-align: center;
          font-size: 14px; color: #555;
        }
        .summary strong { color: #1a1a1a; }

        .actions {
          display: grid; grid-template-columns: 1fr 1fr;
          gap: 12px; margin-bottom: 40px;
        }
        @media (max-width: 600px) { .actions { grid-template-columns: 1fr; } }
        
        .actionBtn {
          padding: 18px 24px;
          border-radius: 12px; font-size: 15px;
          font-weight: 700; cursor: pointer;
          font-family: inherit; transition: all 0.2s;
          text-align: center; text-decoration: none;
          display: block;
        }
        .actionBtn.primary {
          background: #c65f3b; color: #fff;
        }
        .actionBtn.primary:hover { background: #a64a2a; }
        .actionBtn.secondary {
          background: #fff; color: #555;
          border: 1px solid #e5e5e5;
        }
        .actionBtn.secondary:hover {
          background: #fafafa; border-color: #ccc;
        }

        .section { margin: 48px 0; }
        .sectionTitle {
          font-size: 18px; font-weight: 800;
          color: #1a1a1a; text-align: center;
          margin-bottom: 20px;
        }
        
        .recCardGrid {
          display: grid; grid-template-columns: repeat(4, 1fr);
          gap: 12px;
        }
        @media (max-width: 720px) { .recCardGrid { grid-template-columns: 1fr 1fr; } }
        
        .recCard {
          background: #fff; border: 1px solid #e5e5e5;
          border-radius: 12px; padding: 20px 12px;
          text-align: center; cursor: pointer;
          transition: all 0.15s; text-decoration: none;
          color: inherit; display: block;
        }
        .recCard:hover {
          border-color: #c65f3b; background: #fffbf8;
          transform: translateY(-2px);
        }
        .recEmoji { font-size: 28px; margin-bottom: 8px; }
        .recName {
          font-size: 13px; font-weight: 700;
          color: #1a1a1a; margin-bottom: 2px;
        }
        .recHot {
          display: inline-block; margin-top: 4px;
          padding: 1px 6px; background: #ff6b35;
          color: #fff; font-size: 9px; font-weight: 700;
          border-radius: 4px;
        }

        .adArea { margin: 32px 0; }
      `}</style>

      <div className="page">
        <section className="hero">
          <div className="successIcon">✓</div>
          <h1 className="title">영상 자료가 모두 준비됐어요!</h1>
          <p className="sub">
            이제 복사한 자료로 영상을 제작하시면 됩니다.<br />
            영상 업로드 시 도움이 되었기를 바랍니다.
          </p>
        </section>

        {cat && (
          <div className="summary">
            방금 <strong>{cat.emoji} {cat.name}</strong> 분야의<br />
            <strong>"{project.keyword}"</strong> 영상 자료를 생성했어요.
          </div>
        )}

        <div className="actions">
          <Link href="/publish" className="actionBtn primary">
            📋 결과 다시 보기
          </Link>
          <Link href="/create" className="actionBtn secondary">
            🔄 다른 영상 만들기
          </Link>
        </div>

        {/* 광고 */}
        <div className="adArea">
          <AdSlot slot="done-mid" variant="horizontal" />
        </div>

        {/* 다른 추천 카테고리 */}
        {otherCategories.length > 0 && (
          <section className="section">
            <div className="sectionTitle">🔥 인기 분야로 더 만들어보세요</div>
            <div className="recCardGrid">
              {otherCategories.map(c => (
                <Link
                  key={c.id}
                  href={`/create?category=${c.id}`}
                  className="recCard"
                >
                  <div className="recEmoji">{c.emoji}</div>
                  <div className="recName">{c.name}</div>
                  <div className="recHot">HOT</div>
                </Link>
              ))}
            </div>
          </section>
        )}

        <div className="adArea">
          <AdSlot slot="done-bottom" variant="horizontal" />
        </div>
      </div>
    </V11Shell>
  );
}
