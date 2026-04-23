'use client';
/**
 * /blog - 블로그 목록
 *
 * AdSense 심사용 콘텐츠 섹션.
 * MDX 대신 정적 메타 배열로 관리 (초기 간결함).
 * 글 추가 방법: blogPosts 배열에 추가 + /blog/[slug]/page.tsx에 내용
 */

import { DashboardShell } from '../_shared/V11Shell';
import AdSlot from '../_shared/AdSlot';
import Link from 'next/link';

export const blogPosts = [
  {
    slug: 'youtube-algorithm-2026',
    title: '2026년 유튜브 알고리즘 대격변 — 크리에이터가 꼭 알아야 할 4가지',
    excerpt: '2026년 들어 유튜브 추천 알고리즘이 크게 바뀌었습니다. 조회수 중심에서 시청 유지율과 세션 시청 시간 중심으로 무게가 옮겨갔는데요, 이 변화가 일반 크리에이터에게 어떤 영향을 주는지 정리했습니다.',
    category: '알고리즘',
    readingTime: 6,
    publishedAt: '2026-04-22',
  },
  {
    slug: 'retention-rate-editing-tips',
    title: '시청 유지율 40% 올린 실전 편집 기법 7가지',
    excerpt: '영상 품질이 아무리 좋아도 유지율이 40% 미만이면 알고리즘이 추천해주지 않습니다. 실제로 유지율을 크게 개선한 7가지 편집 기법을 사례와 함께 공유합니다.',
    category: '편집',
    readingTime: 8,
    publishedAt: '2026-04-21',
  },
  {
    slug: 'thumbnail-ctr-guide',
    title: '썸네일 CTR 2배 올리는 심리학 — 클릭 유발 요소 분석',
    excerpt: '좋은 썸네일에는 공통된 심리적 장치가 있습니다. 전문가들이 공통적으로 꼽는 CTR을 올리는 6가지 디자인 원칙과 실패 사례들을 정리했어요.',
    category: '썸네일',
    readingTime: 7,
    publishedAt: '2026-04-20',
  },
  {
    slug: 'first-month-creator-checklist',
    title: '유튜브 첫 달에 반드시 해야 할 10가지 체크리스트',
    excerpt: '유튜브를 처음 시작하는 분들이 첫 달에 놓치기 쉬운 10가지 핵심 작업을 정리했습니다. 채널 설정부터 썸네일 템플릿 제작까지, 구독자 0명에서 시작하는 실전 가이드입니다.',
    category: '초보 가이드',
    readingTime: 9,
    publishedAt: '2026-04-19',
  },
  {
    slug: 'ai-video-automation-trends',
    title: 'AI 영상 자동화는 유튜브 생태계를 어떻게 바꾸고 있나',
    excerpt: 'AI가 대본·이미지·음성·편집까지 자동 생성하는 시대, 개인 크리에이터에게 이것이 위협인가 기회인가. 업계 변화와 현실적인 활용 전략을 솔직하게 짚어봅니다.',
    category: 'AI 트렌드',
    readingTime: 10,
    publishedAt: '2026-04-18',
  },
];

export default function BlogListPage() {
  return (
    <DashboardShell>
      <style jsx>{`
        .page {
          padding: 32px 32px 48px;
          max-width: 900px;
          margin: 0 auto;
        }
        .pageHeader {
          margin-bottom: 24px;
        }
        .pageBadge {
          display: inline-block;
          padding: 3px 10px;
          background: #fef3c7;
          color: #92400e;
          border-radius: 999px;
          font-size: 10px;
          font-weight: 800;
          letter-spacing: 0.1em;
          margin-bottom: 10px;
        }
        .pageTitle {
          font-size: 30px;
          font-weight: 800;
          letter-spacing: -0.03em;
          line-height: 1.2;
          margin-bottom: 8px;
          color: #0f0f0f;
        }
        .pageSub {
          font-size: 14px;
          color: #606060;
          line-height: 1.6;
          max-width: 640px;
        }

        .adRow { margin: 20px 0; }

        .postList {
          display: flex;
          flex-direction: column;
          gap: 14px;
        }
        .postCard {
          background: #fff;
          border: 1px solid #e5e5e5;
          border-radius: 14px;
          padding: 22px 24px;
          cursor: pointer;
          transition: all 0.2s;
          text-decoration: none;
          color: inherit;
          display: block;
        }
        .postCard:hover {
          border-color: #cc0000;
          transform: translateY(-2px);
          box-shadow: 0 4px 20px rgba(0,0,0,0.04);
        }
        .postMeta {
          display: flex;
          align-items: center;
          gap: 8px;
          font-size: 11px;
          color: #888;
          margin-bottom: 10px;
        }
        .postCategory {
          padding: 2px 8px;
          background: #fafafa;
          border: 1px solid #e5e5e5;
          border-radius: 999px;
          font-weight: 600;
          color: #555;
        }
        .postDot { color: #ddd; }
        .postTitle {
          font-size: 18px;
          font-weight: 800;
          color: #0f0f0f;
          line-height: 1.3;
          letter-spacing: -0.02em;
          margin-bottom: 8px;
        }
        .postExcerpt {
          font-size: 13px;
          color: #606060;
          line-height: 1.6;
        }

        .cta {
          margin-top: 32px;
          padding: 24px;
          background: linear-gradient(135deg, #fff0f0 0%, #fafafa 100%);
          border: 1px solid #fecaca;
          border-radius: 14px;
          text-align: center;
        }
        .ctaTitle {
          font-size: 15px;
          font-weight: 800;
          color: #0f0f0f;
          margin-bottom: 6px;
        }
        .ctaSub {
          font-size: 12px;
          color: #606060;
          margin-bottom: 14px;
        }
        .ctaBtn {
          padding: 10px 22px;
          background: #cc0000;
          color: #fff;
          border: none;
          border-radius: 999px;
          font-size: 13px;
          font-weight: 700;
          cursor: pointer;
          text-decoration: none;
          display: inline-block;
        }

        @media (max-width: 640px) {
          .page { padding: 20px 14px 40px; }
          .pageTitle { font-size: 24px; }
          .postCard { padding: 18px 20px; }
          .postTitle { font-size: 16px; }
        }
      `}</style>

      <div className="page">
        <header className="pageHeader">
          <span className="pageBadge">📝 BLOG</span>
          <h1 className="pageTitle">크리에이터 인사이트</h1>
          <p className="pageSub">
            유튜브 알고리즘, 편집 기법, 썸네일 심리학, AI 자동화 트렌드까지. 
            구독자 0명에서 시작하는 크리에이터를 위한 실전 정보.
          </p>
        </header>

        <div className="adRow">
          <AdSlot slot="blog-top" variant="horizontal" label="blog-top" />
        </div>

        <div className="postList">
          {blogPosts.map((post) => (
            <Link key={post.slug} href={`/blog/${post.slug}`} className="postCard">
              <div className="postMeta">
                <span className="postCategory">{post.category}</span>
                <span className="postDot">·</span>
                <span>{post.publishedAt}</span>
                <span className="postDot">·</span>
                <span>{post.readingTime}분 읽기</span>
              </div>
              <h2 className="postTitle">{post.title}</h2>
              <p className="postExcerpt">{post.excerpt}</p>
            </Link>
          ))}
        </div>

        <div className="cta">
          <div className="ctaTitle">🎬 AlgoMaker로 영상 자동 생성</div>
          <div className="ctaSub">키워드 하나로 AI가 완성된 유튜브 영상을 만들어드립니다 · 무료</div>
          <Link href="/" className="ctaBtn">
            영상 만들기 시작 →
          </Link>
        </div>
      </div>
    </DashboardShell>
  );
}
