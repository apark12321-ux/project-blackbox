'use client';
import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="page">
      <div className="content">
        <div className="errorCode">404</div>
        <div className="title">페이지를 찾을 수 없어요</div>
        <div className="subtitle">
          잘못된 주소이거나 삭제된 페이지일 수 있어요.<br />
          홈으로 돌아가서 다시 시작해보세요.
        </div>
        <Link href="/" className="homeBtn">
          🏠 홈으로 돌아가기
        </Link>
      </div>

      <style jsx>{`
        .page {
          min-height: 100vh; background: #fafafa;
          display: flex; align-items: center; justify-content: center;
          padding: 40px 20px;
          font-family: 'Pretendard Variable', Pretendard, system-ui, sans-serif;
        }
        .content { text-align: center; max-width: 480px; }
        .errorCode {
          font-size: 80px; font-weight: 900; color: #c65f3b;
          letter-spacing: -0.05em; line-height: 1; margin-bottom: 20px;
        }
        .title {
          font-size: 24px; font-weight: 800; color: #1a1a1a;
          margin-bottom: 12px; letter-spacing: -0.02em;
        }
        .subtitle {
          font-size: 14px; color: #666; line-height: 1.7; margin-bottom: 32px;
        }
        .homeBtn {
          display: inline-block; padding: 14px 32px;
          background: #c65f3b; color: #fff;
          border-radius: 100px; font-size: 14px; font-weight: 700;
          text-decoration: none; transition: all 0.2s;
        }
        .homeBtn:hover { background: #a64a2a; }
        @media (max-width: 600px) {
          .errorCode { font-size: 60px; }
          .title { font-size: 20px; }
        }
      `}</style>
    </div>
  );
}
