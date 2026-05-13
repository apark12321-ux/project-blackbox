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
          <span>분석</span>
        </nav>

        <header className="header">
          <div className="pageBadge">Analytics</div>
          <h1 className="title">분석</h1>
          <p className="sub">내 콘텐츠와 트렌드 분석 (베타)</p>
        </header>

        <div className="content">
          <h2>📊 트렌드 분석</h2>
          <p>
            현재 인기있는 영상 분야와 키워드를 분석합니다.<br />
            (현재 베타 - 곧 정식 출시 예정)
          </p>

          <h2>🔥 분야별 핫 키워드 (2026년 4월 기준)</h2>
          <ul>
            <li>📊 <strong>경제·재테크</strong> - 2026 금리 전망, 퇴직금 굴리는 법</li>
            <li>🏠 <strong>부동산</strong> - 청약 가점 계산법, 재개발 유망 지역</li>
            <li>💼 <strong>N잡·창업</strong> - 40대 N잡 추천, 재택 부업 BEST</li>
            <li>💻 <strong>IT·테크</strong> - 50대도 쉬운 AI, ChatGPT 활용법</li>
          </ul>

          <h2>📈 분야별 평균 조회수 (영상당)</h2>
          <ul>
            <li>IT·테크: 25,000회</li>
            <li>N잡·창업: 20,000회</li>
            <li>건강·의료: 18,000회</li>
            <li>요리·음식: 16,000회</li>
            <li>부동산: 15,000회</li>
            <li>교육·자기계발: 15,000회</li>
            <li>여행·맛집: 14,000회</li>
            <li>사회·이슈: 13,000회</li>
            <li>경제·재테크: 12,000회</li>
            <li>리뷰·언박싱: 11,000회</li>
            <li>취미·여가: 9,000회</li>
            <li>시니어 라이프: 8,000회</li>
          </ul>

          <h2>💡 활용 팁</h2>
          <p>
            조회수가 높은 분야가 무조건 좋은 것은 아닙니다.<br />
            본인의 관심사와 전문성에 맞는 분야를 선택하셔야
            지속적으로 콘텐츠를 만들 수 있습니다.
          </p>

          <h2>🔮 향후 출시 예정</h2>
          <ul>
            <li>실시간 트렌드 키워드 분석</li>
            <li>경쟁 채널 자동 분석</li>
            <li>최적 업로드 시간 추천</li>
            <li>본인 채널 진단</li>
          </ul>

          <Link href="/create" className="ctaBtn">🚀 트렌드 키워드로 시작하기</Link>
        </div>

        <div className="adArea">
          <AdSlot slot="page-bottom" variant="horizontal" />
        </div>
      </div>
    </V11Shell>
  );
}
