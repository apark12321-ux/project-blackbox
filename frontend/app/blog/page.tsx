'use client';
import Link from 'next/link';
import { V11Shell } from '../_shared/V11Shell';
import AdSlot from '../_shared/AdSlot';

export default function Page() {
  return (
    <V11Shell>
      <style jsx>{`
        .page { max-width: 920px; margin: 0 auto; padding: 56px 24px 60px; }
        .breadcrumb {
          display: flex; gap: 8px; font-size: 13px;
          color: #888; margin-bottom: 24px;
        }
        .breadcrumb a:hover { color: #c65f3b; }
        .breadcrumb .sep { color: #ccc; }
        .pageBadge {
          display: inline-block; padding: 6px 14px;
          background: #fdf1e7; color: #c65f3b;
          border-radius: 100px; font-size: 12px; font-weight: 700;
          margin-bottom: 16px;
        }
        .header { text-align: center; margin-bottom: 40px; }
        .title {
          font-size: 32px; font-weight: 800;
          color: #1a1a1a; letter-spacing: -0.025em;
          margin: 0 0 12px;
        }
        .sub { font-size: 15px; color: #666; line-height: 1.7; }
        @media (max-width: 600px) { .title { font-size: 24px; } }
        .content {
          background: #fff; border: 1px solid #e5e5e5;
          border-radius: 14px; padding: 32px;
          line-height: 1.8; color: #333;
        }
        .content h2 {
          font-size: 19px; font-weight: 800;
          color: #1a1a1a; margin: 28px 0 12px;
        }
        .content h2:first-child { margin-top: 0; }
        .content h3 {
          font-size: 15px; font-weight: 700;
          color: #1a1a1a; margin: 20px 0 8px;
        }
        .content p { margin: 0 0 14px; font-size: 14.5px; }
        .content ul { padding-left: 24px; margin: 12px 0; }
        .content li {
          margin-bottom: 8px; font-size: 14px; color: #555;
          line-height: 1.7;
        }
        .content strong { color: #c65f3b; font-weight: 700; }
        .ctaBtn {
          display: inline-block; padding: 14px 28px;
          background: #c65f3b; color: #fff;
          border-radius: 100px; font-size: 14px; font-weight: 700;
          text-decoration: none; transition: all 0.2s;
          margin-top: 20px;
        }
        .ctaBtn:hover { background: #a64a2a; }
        .adArea { margin: 32px 0; }
      `}</style>

      <div className="page">
        <nav className="breadcrumb">
          <Link href="/">홈</Link>
          <span className="sep">/</span>
          <span>노하우 블로그</span>
        </nav>

        <header className="header">
          <div className="pageBadge">Blog</div>
          <h1 className="title">노하우 블로그</h1>
          <p className="sub">영상 콘텐츠 제작 노하우와 알고리즘 분석</p>
        </header>

        <div className="content">
          <h2>📝 영상 콘텐츠 노하우</h2>
          <p>
            AlgoMaker 노하우 블로그에서는 영상 콘텐츠 제작과 SNS 알고리즘에 대한
            실용적인 가이드를 제공합니다.
          </p>

          <h2>🔥 인기 글</h2>
          <ul>
            <li>
              <Link href="/knowhow/first-30-seconds-hook" style={{color: '#c65f3b', fontWeight: 700}}>
                첫 30초가 영상의 운명을 결정한다 - 시청자 후크 만들기
              </Link>
            </li>
          </ul>

          <h2>📚 카테고리별 가이드 (준비 중)</h2>
          <ul>
            <li>유튜브 알고리즘 작동 원리</li>
            <li>40대가 시작하기 좋은 영상 콘텐츠 분야</li>
            <li>퇴직 후 1년 안에 구독자 1만 명 만들기</li>
            <li>썸네일 클릭률 높이는 5가지 법칙</li>
            <li>키워드 검색량 분석하는 법</li>
            <li>유튜브 vs 틱톡 - 어디부터 시작할까?</li>
          </ul>

          <h2>💡 기타 팁</h2>
          <ul>
            <li>월 100만원 만드는 N잡 콘텐츠 분야</li>
            <li>50대 시작 채널 - 어떤 콘텐츠가 좋을까?</li>
            <li>구독자 1,000명 빠르게 모으는 법</li>
            <li>SEO 최적화로 유입 늘리기</li>
          </ul>

          <Link href="/create" className="ctaBtn">🚀 영상 자료 만들러 가기</Link>
        </div>

        <div className="adArea">
          <AdSlot slot="page-bottom" variant="horizontal" />
        </div>
      </div>
    </V11Shell>
  );
}
