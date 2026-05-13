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
          <span>요금제</span>
        </nav>

        <header className="header">
          <div className="pageBadge">Plan</div>
          <h1 className="title">요금제</h1>
          <p className="sub">AlgoMaker는 완전 무료입니다</p>
        </header>

        <div className="content">
          <h2>💎 무료 요금제</h2>
          <p>
            <strong>AlgoMaker는 완전 무료로 제공됩니다.</strong><br />
            모든 기능을 제한 없이 사용하실 수 있습니다.
          </p>

          <h2>✓ 무료로 제공되는 기능</h2>
          <ul>
            <li>✅ 12개 분야 트렌드 키워드 추천 (무제한)</li>
            <li>✅ AI 영상 제목 자동 생성</li>
            <li>✅ 알고리즘 최적화 태그 추천</li>
            <li>✅ 4개 SNS 플랫폼 메타데이터 생성</li>
            <li>✅ 6가지 영상 시나리오 구조</li>
            <li>✅ 썸네일 콘셉트 추천</li>
            <li>✅ 영상 대본 구조 안내</li>
          </ul>

          <h2>🤔 왜 무료인가요?</h2>
          <p>
            AlgoMaker는 사이트에 게재되는 광고 수익으로 운영됩니다.<br />
            덕분에 누구나 부담 없이 사용하실 수 있습니다.
          </p>
          <p>
            특히 <strong>40대~60대 시니어 분들</strong>과 <strong>퇴직 예정자분들</strong>이
            영상 콘텐츠를 시작하실 때 도움이 되고자 하는 마음으로 만들었습니다.
          </p>

          <h2>📩 향후 계획</h2>
          <p>
            추후 다음과 같은 추가 기능을 검토 중입니다 (모두 무료 유지 예정).
          </p>
          <ul>
            <li>실제 AI 영상 생성 기능</li>
            <li>본인 영상 분석 도구</li>
            <li>경쟁 채널 분석</li>
            <li>커뮤니티 기능</li>
          </ul>

          <Link href="/create" className="ctaBtn">🚀 무료로 시작하기</Link>
        </div>

        <div className="adArea">
          <AdSlot slot="page-bottom" variant="horizontal" />
        </div>
      </div>
    </V11Shell>
  );
}
