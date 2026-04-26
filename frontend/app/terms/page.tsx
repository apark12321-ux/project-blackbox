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
          <span>이용약관</span>
        </nav>

        <header className="header">
          
          <h1 className="title">이용약관</h1>
          <p className="sub">AlgoMaker 서비스 이용약관입니다</p>
        </header>

        <div className="content">
          <h2>제1조 (목적)</h2>
          <p>
            본 약관은 알고파트너스(이하 '회사')가 제공하는 AlgoMaker 서비스(이하 '서비스')의 이용 조건 및 절차를 규정함을 목적으로 합니다.
          </p>

          <h2>제2조 (서비스의 내용)</h2>
          <p>회사가 제공하는 서비스는 다음과 같습니다.</p>
          <ul>
            <li>AI 기반 영상 콘텐츠 제목·태그·대본 추천</li>
            <li>4개 SNS 플랫폼 (YouTube, Shorts, TikTok, Reels) 메타데이터 생성</li>
            <li>트렌드 키워드 분석 및 추천</li>
          </ul>

          <h2>제3조 (이용료)</h2>
          <p>
            본 서비스는 <strong>완전 무료</strong>로 제공됩니다.
            회원가입, 신용카드 등록, 결제가 필요 없습니다.
            서비스 운영은 광고 수익으로 충당됩니다.
          </p>

          <h2>제4조 (이용자의 의무)</h2>
          <ul>
            <li>본인의 명의로 서비스를 이용할 것</li>
            <li>타인의 권리를 침해하지 않을 것</li>
            <li>서비스의 안정적 운영을 방해하지 않을 것</li>
            <li>관련 법령 및 본 약관을 준수할 것</li>
          </ul>

          <h2>제5조 (저작권)</h2>
          <p>
            본 서비스에서 AI가 생성한 추천 결과(제목, 태그, 대본 등)는
            사용자가 자유롭게 활용할 수 있습니다.
            다만 결과물의 사용으로 인한 책임은 사용자에게 있습니다.
          </p>

          <h2>제6조 (서비스 제공의 중지)</h2>
          <p>
            회사는 천재지변, 시스템 점검, 운영상의 필요 등에 따라
            서비스 제공을 일시적으로 중지할 수 있습니다.
          </p>

          <h2>제7조 (면책 조항)</h2>
          <ul>
            <li>회사는 AI 추천 결과의 정확성을 보장하지 않습니다.</li>
            <li>실제 영상의 조회수, 구독자 증가 등의 성과는 보장되지 않습니다.</li>
            <li>서비스 이용으로 발생한 손해에 대해 회사는 책임지지 않습니다.</li>
          </ul>

          <h2>제8조 (분쟁 해결)</h2>
          <p>
            본 약관에 관한 분쟁은 대한민국 법령에 따르며,
            회사 본사 소재지 관할 법원에서 해결합니다.
          </p>

          <h2>부칙</h2>
          <p>본 약관은 2026년 4월 25일부터 시행됩니다.</p>
        </div>

        <div className="adArea">
          <AdSlot slot="page-bottom" variant="horizontal" />
        </div>
      </div>
    </V11Shell>
  );
}
