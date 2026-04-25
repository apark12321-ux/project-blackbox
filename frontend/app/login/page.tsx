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
          <span>로그인</span>
        </nav>

        <header className="header">
          <div className="pageBadge">Login</div>
          <h1 className="title">로그인</h1>
          <p className="sub">AlgoMaker는 회원가입이 필요 없습니다</p>
        </header>

        <div className="content">
          <h2>🎉 회원가입 없이 이용 가능</h2>
          <p>
            <strong>AlgoMaker는 회원가입이 필요하지 않습니다!</strong><br />
            이메일, 비밀번호, 신용카드 등록 모두 필요 없습니다.
          </p>

          <h2>✓ 그냥 바로 쓰세요</h2>
          <ul>
            <li>회원가입 X</li>
            <li>로그인 X</li>
            <li>이메일 입력 X</li>
            <li>신용카드 등록 X</li>
            <li>그냥 바로 사용 ✅</li>
          </ul>

          <h2>📝 그래도 임시 저장은 됩니다</h2>
          <p>
            브라우저 localStorage에 마지막으로 만든 자료가 임시 저장됩니다.<br />
            같은 브라우저로 다시 오시면 이어서 작업 가능합니다.
          </p>

          <h2>🔮 향후 회원 기능 (출시 예정)</h2>
          <p>
            추후 다음과 같은 회원 전용 기능을 검토 중입니다 (선택사항, 무료 유지).
          </p>
          <ul>
            <li>여러 기기에서 자료 동기화</li>
            <li>만든 콘텐츠 히스토리 영구 저장</li>
            <li>즐겨찾는 키워드 관리</li>
            <li>맞춤 추천 알고리즘</li>
          </ul>

          <Link href="/create" className="ctaBtn">🚀 바로 시작하기</Link>
        </div>

        <div className="adArea">
          <AdSlot slot="page-bottom" variant="horizontal" />
        </div>
      </div>
    </V11Shell>
  );
}
