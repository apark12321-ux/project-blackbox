'use client';
/**
 * 블로그 메인 페이지 — 보호 버전
 *
 * 12개 노하우를 "왜 복잡한가" 톤으로 소개
 * 각 글 제목이 템플릿이 아닌 "문제 제기" 식
 */

import Link from 'next/link';
import { DashboardShell } from '../_shared/V11Shell';
import AdSlot from '../_shared/AdSlot';

const POSTS = [
  {
    id: 'first-30-seconds-hook',
    num: '05',
    phase: '제작 단계',
    title: '첫 30초가 영상의 운명을 결정합니다',
    sub: '왜 4명 중 3명이 30초 안에 떠나는가, 그리고 AlgoMaker의 해결법',
    read: '5분',
    tag: '🎬',
    color: '#c65f3b',
  },
  {
    id: 'seo-title-formula',
    num: '11',
    phase: '업로드 단계',
    title: '검색 1페이지 진입하는 제목의 비밀',
    sub: 'SEO와 클릭 유도를 동시에 만족시키는 제목은 왜 어려운가',
    read: '5분',
    tag: '📤',
    color: '#d4a545',
  },
  {
    id: 'ctr-thumbnail',
    num: '10',
    phase: '업로드 단계',
    title: 'CTR 2배 차이, 썸네일에 숨은 과학',
    sub: '0.5% 차이가 조회수 100배를 만드는 이유',
    read: '4분',
    tag: '📤',
    color: '#d4a545',
  },
  {
    id: 'viral-topic-formula',
    num: '02',
    phase: '기획 단계',
    title: '같은 주제인데 조회수가 100배 차이나는 이유',
    sub: '심리적 끌림을 만드는 주제 설계는 왜 복잡한가',
    read: '6분',
    tag: '🎯',
    color: '#c65f3b',
  },
  {
    id: 'algorithm-script-structure',
    num: '08',
    phase: '제작 단계',
    title: '영상 플랫폼 알고리즘이 좋아하는 대본 구조',
    sub: '공개되지 않은 알고리즘을 어떻게 공략할 수 있을까',
    read: '5분',
    tag: '🎬',
    color: '#c65f3b',
  },
  {
    id: 'first-page-tags',
    num: '12',
    phase: '업로드 단계',
    title: '태그 하나로 검색 노출이 10배 달라진다',
    sub: '500자 제한 안에 담아야 하는 전략의 복잡성',
    read: '4분',
    tag: '📤',
    color: '#d4a545',
  },
  {
    id: '8min-hook-points',
    num: '06',
    phase: '제작 단계',
    title: '롱폼 영상에서 50% 시청자가 중간에 떠나는 이유',
    sub: '재몰입 장치 설계가 왜 감각만으로는 안 되는가',
    read: '5분',
    tag: '🎬',
    color: '#c65f3b',
  },
  {
    id: 'blue-ocean-keyword',
    num: '01',
    phase: '기획 단계',
    title: '경쟁 낮고 수요 높은 블루오션 키워드 찾기',
    sub: '데이터 접근 없이 블루오션을 찾는 건 왜 불가능에 가까운가',
    read: '5분',
    tag: '🎯',
    color: '#c65f3b',
  },
  {
    id: 'retention-editing-rhythm',
    num: '07',
    phase: '제작 단계',
    title: '편집 리듬만 바꿔도 유지율 30% 차이',
    sub: '전문 편집자 6개월 교육이 필요한 이유',
    read: '4분',
    tag: '🎬',
    color: '#c65f3b',
  },
  {
    id: '12-narrative-structures',
    num: '03',
    phase: '기획 단계',
    title: '12가지 서사 구조, 당신 영상에 맞는 건?',
    sub: '같은 정보도 구조에 따라 유지율 2배 차이나는 이유',
    read: '6분',
    tag: '🎯',
    color: '#c65f3b',
  },
  {
    id: 'target-viewer-design',
    num: '04',
    phase: '기획 단계',
    title: '모두를 위한 영상은 아무도 보지 않습니다',
    sub: '타겟 설계를 잘못하면 좋은 내용도 외면받는 이유',
    read: '4분',
    tag: '🎯',
    color: '#c65f3b',
  },
  {
    id: 'narration-tone-match',
    num: '09',
    phase: '제작 단계',
    title: '내레이션 톤 하나로 신뢰가 무너질 수 있다',
    sub: '주제와 음성이 안 맞으면 생기는 일',
    read: '4분',
    tag: '🎬',
    color: '#c65f3b',
  },
];

export default function BlogPage() {
  const phaseColors: { [key: string]: string } = {
    '기획 단계': '#c65f3b',
    '제작 단계': '#d4a545',
    '업로드 단계': '#7d9b7c',
  };

  return (
    <DashboardShell>
      <style jsx>{`
        .page {
          max-width: 1100px;
          margin: 0 auto;
          padding: 40px 24px 64px;
        }

        .hero {
          text-align: center;
          margin-bottom: 48px;
          padding: 44px 24px;
          background: linear-gradient(135deg, #fdf1e7 0%, #faf8f4 100%);
          border-radius: 20px;
        }
        .heroTag {
          display: inline-block;
          padding: 5px 14px;
          background: rgba(198, 95, 59, 0.12);
          color: #a64a2a;
          border-radius: 999px;
          font-size: 12px;
          font-weight: 800;
          letter-spacing: -0.01em;
          margin-bottom: 14px;
        }
        .heroTitle {
          font-size: 34px;
          font-weight: 800;
          color: #2a2419;
          letter-spacing: -0.035em;
          line-height: 1.2;
          margin-bottom: 14px;
        }
        .heroTitle .accent { color: #c65f3b; }
        .heroSub {
          font-size: 16px;
          color: #564a3a;
          line-height: 1.7;
          font-weight: 500;
          max-width: 640px;
          margin: 0 auto;
        }

        .filterBar {
          display: flex;
          justify-content: center;
          gap: 8px;
          margin-bottom: 28px;
          flex-wrap: wrap;
        }
        .filterChip {
          padding: 8px 16px;
          background: #faf8f4;
          border: 1px solid rgba(90, 74, 58, 0.08);
          border-radius: 999px;
          font-size: 13px;
          font-weight: 700;
          color: #564a3a;
          cursor: pointer;
          transition: all 0.15s;
        }
        .filterChip.active {
          background: #c65f3b;
          color: #fff;
          border-color: #c65f3b;
        }

        .grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 16px;
        }
        .card {
          background: #faf8f4;
          border: 1px solid rgba(90, 74, 58, 0.06);
          border-radius: 14px;
          padding: 24px 22px;
          cursor: pointer;
          transition: all 0.2s;
          display: flex;
          flex-direction: column;
          min-height: 240px;
        }
        .card:hover {
          transform: translateY(-3px);
          box-shadow: 0 8px 20px rgba(90, 74, 58, 0.08);
          border-color: rgba(198, 95, 59, 0.2);
        }
        .cardHead {
          display: flex;
          align-items: center;
          gap: 10px;
          margin-bottom: 14px;
        }
        .cardNum {
          font-size: 11px;
          font-weight: 800;
          color: #c65f3b;
          padding: 3px 8px;
          background: #fdf1e7;
          border-radius: 5px;
          letter-spacing: 0.02em;
        }
        .cardPhase {
          font-size: 10.5px;
          font-weight: 700;
          color: #8a7d6a;
          letter-spacing: 0.03em;
        }
        .cardTag {
          margin-left: auto;
          font-size: 18px;
        }
        .cardTitle {
          font-size: 16px;
          font-weight: 800;
          color: #2a2419;
          letter-spacing: -0.025em;
          line-height: 1.35;
          margin-bottom: 10px;
        }
        .cardSub {
          font-size: 13px;
          color: #564a3a;
          line-height: 1.6;
          font-weight: 500;
          margin-bottom: 16px;
          flex: 1;
        }
        .cardFoot {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding-top: 14px;
          border-top: 1px dashed rgba(90, 74, 58, 0.1);
          font-size: 11.5px;
          color: #8a7d6a;
          font-weight: 600;
        }
        .cardRead { color: #c65f3b; font-weight: 700; }

        .adWrap { margin: 40px 0; }

        @media (max-width: 1024px) {
          .grid { grid-template-columns: repeat(2, 1fr); }
        }
        @media (max-width: 640px) {
          .grid { grid-template-columns: 1fr; }
          .hero { padding: 32px 20px; }
          .heroTitle { font-size: 26px; }
        }
      `}</style>

      <div className="page">
        <section className="hero">
          <div className="heroTag">🛡️ 전문가 노하우 시리즈</div>
          <h1 className="heroTitle">
            영상 제작이 <span className="accent">왜 어려운지</span>,<br />
            그리고 AlgoMaker가 어떻게 해결하는지
          </h1>
          <p className="heroSub">
            2026년 영상 플랫폼 알고리즘은 10년 전과 완전히 다릅니다.
            첫 30초, 썸네일, 제목, 태그 — 모든 게 복잡한 최적화 대상입니다.
            각 노하우가 얼마나 복잡한지, 그리고 AlgoMaker는 어떻게 자동화하는지 알아보세요.
          </p>
        </section>

        <div className="grid">
          {POSTS.map((post) => (
            <Link key={post.id} href={`/knowhow/${post.id}`} className="card" style={{textDecoration: 'none'}}>
              <div className="cardHead">
                <span className="cardNum">No.{post.num}</span>
                <span className="cardPhase" style={{ color: phaseColors[post.phase] }}>
                  {post.phase}
                </span>
                <span className="cardTag">{post.tag}</span>
              </div>
              <h3 className="cardTitle">{post.title}</h3>
              <p className="cardSub">{post.sub}</p>
              <div className="cardFoot">
                <span>📖 읽어보기</span>
                <span className="cardRead">⏱ {post.read}</span>
              </div>
            </Link>
          ))}
        </div>

        <div className="adWrap">
          <AdSlot slot="blog-list" variant="horizontal" />
        </div>
      </div>
    </DashboardShell>
  );
}
