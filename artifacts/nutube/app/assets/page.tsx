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
          <span>내 영상</span>
        </nav>

        <header className="header">
          <div className="pageBadge">My Assets</div>
          <h1 className="title">내 영상</h1>
          <p className="sub">내가 만든 콘텐츠를 한눈에 확인</p>
        </header>

        <div className="content">
          <h2>🎬 만든 콘텐츠 목록</h2>
          <p>
            AlgoMaker에서 생성한 영상 자료를 한눈에 확인할 수 있습니다.<br />
            (현재 베타 - 곧 출시 예정)
          </p>

          <h2>📝 사용 안내</h2>
          <p>
            지금은 <strong>브라우저 localStorage</strong>에 마지막으로 만든 자료가 임시 저장됩니다.
          </p>
          <ul>
            <li>가장 최근에 입력한 카테고리, 키워드, 시나리오 정보</li>
            <li>같은 브라우저로 다시 방문 시 이어서 작업 가능</li>
            <li>다른 기기·브라우저에서는 별도로 저장됨</li>
          </ul>

          <h2>🔮 향후 출시 예정 기능</h2>
          <ul>
            <li>📋 만든 콘텐츠 히스토리 저장</li>
            <li>⭐ 즐겨찾기 키워드 관리</li>
            <li>📊 본인이 자주 쓰는 시나리오 분석</li>
            <li>📤 콘텐츠 자료 일괄 다운로드</li>
            <li>🔄 이전에 만든 자료 재사용</li>
          </ul>

          <h2>💡 지금 사용하시려면</h2>
          <p>
            현재 만든 자료는 <Link href="/publish" style={{color: '#c65f3b', fontWeight: 700}}>결과 페이지</Link>에서
            바로 복사해서 사용하시면 됩니다.<br />
            추후 정식 출시 시 모든 사용자에게 무료로 제공됩니다.
          </p>

          <Link href="/create" className="ctaBtn">🚀 새 영상 자료 만들기</Link>
        </div>

        <div className="adArea">
          <AdSlot slot="page-bottom" variant="horizontal" />
        </div>
      </div>
    </V11Shell>
  );
}
