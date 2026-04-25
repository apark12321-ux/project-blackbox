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
          <span>서비스 소개</span>
        </nav>

        <header className="header">
          <div className="pageBadge">About</div>
          <h1 className="title">서비스 소개</h1>
          <p className="sub">AI 콘텐츠 추천 도구 AlgoMaker가 어떻게 작동하는지</p>
        </header>

        <div className="content">
          <h2>AlgoMaker란?</h2>
          <p>
            AlgoMaker는 <strong>키워드만 입력하면 AI가 영상 제목·태그·대본까지 추천</strong>해드리는 SaaS 도구입니다.
            특히 40대 이상 시니어 분들과 퇴직 예정자분들이 쉽게 영상 콘텐츠를 시작할 수 있도록 설계되었습니다.
          </p>

          <h2>이런 분께 추천드립니다</h2>
          <ul>
            <li>🎯 회사 그만두고 유튜브를 시작하려는 40대 ~ 60대</li>
            <li>📊 N잡으로 영상 콘텐츠를 만들고 싶은 직장인</li>
            <li>🌱 시니어 라이프, 건강, 재테크 등 전문 분야 콘텐츠 제작자</li>
            <li>💼 SNS에 콘텐츠를 빠르고 효과적으로 올리고 싶은 분</li>
          </ul>

          <h2>제공하는 기능</h2>
          <ul>
            <li><strong>12개 분야</strong> 카테고리별 트렌드 키워드 추천</li>
            <li><strong>AI 영상 제목</strong> - 클릭률 높은 제목 3가지 자동 생성</li>
            <li><strong>알고리즘 최적화 태그</strong> 자동 추천</li>
            <li><strong>4개 SNS 플랫폼</strong> (YouTube, Shorts, TikTok, Reels) 메타데이터</li>
            <li><strong>영상 대본 구조</strong> 6가지 시나리오</li>
            <li><strong>썸네일 콘셉트</strong> 추천</li>
          </ul>

          <h2>완전 무료입니다</h2>
          <p>
            AlgoMaker는 회원가입도, 신용카드 등록도, 결제도 필요 없습니다.<br />
            사이트 운영은 광고 수익으로 충당하고 있어, 누구나 자유롭게 사용하실 수 있습니다.
          </p>

          <Link href="/create" className="ctaBtn">🚀 지금 시작하기</Link>
        </div>

        <div className="adArea">
          <AdSlot slot="page-bottom" variant="horizontal" />
        </div>
      </div>
    </V11Shell>
  );
}
