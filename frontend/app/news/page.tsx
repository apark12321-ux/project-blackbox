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
          <span>트렌드 뉴스</span>
        </nav>

        <header className="header">
          <div className="pageBadge">News</div>
          <h1 className="title">트렌드 뉴스</h1>
          <p className="sub">영상 콘텐츠 제작에 필요한 최신 트렌드</p>
        </header>

        <div className="content">
          <h2>📰 영상 트렌드 (준비 중)</h2>
          <p>
            매주 업데이트되는 영상 콘텐츠 트렌드를 한눈에 확인하세요.
          </p>

          <h2>🔥 인기 키워드 TOP 10 (이번 주)</h2>
          <ul>
            <li>1. 2026 부동산 전망</li>
            <li>2. 퇴직금 굴리는 법</li>
            <li>3. 50대 N잡 추천</li>
            <li>4. 시니어 헬스 루틴</li>
            <li>5. 에어프라이어 요리</li>
            <li>6. ChatGPT 활용법</li>
            <li>7. 가성비 여행지</li>
            <li>8. 50대 영어 공부</li>
            <li>9. 50대 운동 루틴</li>
            <li>10. 청약 가점 계산</li>
          </ul>

          <h2>📊 알고리즘 변화</h2>
          <ul>
            <li>YouTube Shorts 추천 알고리즘 업데이트 (2026년 4월)</li>
            <li>TikTok 한국 사용자 알고리즘 변경</li>
            <li>인스타 릴스 우선순위 알고리즘</li>
          </ul>

          <Link href="/create" className="ctaBtn">🚀 트렌드 키워드로 영상 만들기</Link>
        </div>

        <div className="adArea">
          <AdSlot slot="page-bottom" variant="horizontal" />
        </div>
      </div>
    </V11Shell>
  );
}
