'use client';
/**
 * 404 Not Found 페이지
 *
 * 박예준 요청:
 * ✅ 404 떠도 깨지지 않게
 * ✅ 알고리즘 컨셉 유지
 * ✅ 홈으로 돌아가기 명확
 */

import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="notFoundPage">
      <div className="stars">
        {Array.from({ length: 30 }).map((_, i) => (
          <div key={i} className="star" style={{
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
            animationDelay: `${Math.random() * 4}s`,
          }} />
        ))}
      </div>

      <div className="content">
        <div className="ornament">❦</div>
        <div className="errorCode">404</div>
        <div className="title">베일 너머의 페이지</div>
        <div className="subtitle">
          알고리즘이 이 영역을 감지하지 못했습니다.<br />
          잘못된 주소이거나 아직 만들어지지 않은 페이지입니다.
        </div>
        <div className="actions">
          <Link href="/" className="primaryBtn">✦ 홈으로 돌아가기</Link>
        </div>
        <div className="ornament">❦</div>
      </div>

      <style jsx>{`
        .notFoundPage {
          position: fixed;
          inset: 0;
          background: radial-gradient(ellipse at center, #2a1f4d 0%, #1a1230 50%, #0a0518 100%);
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 40px 20px;
          color: #f5f1ea;
          font-family: Pretendard, system-ui, sans-serif;
          overflow: hidden;
          z-index: 9999;
        }
        .stars { position: absolute; inset: 0; pointer-events: none; }
        .star {
          position: absolute;
          width: 2px; height: 2px;
          background: #ffd700; border-radius: 50%;
          box-shadow: 0 0 4px #ffd700;
          animation: twinkle 3s ease-in-out infinite;
        }
        @keyframes twinkle {
          0%, 100% { opacity: 0.2; }
          50% { opacity: 1; }
        }
        .content { position: relative; text-align: center; z-index: 1; max-width: 500px; }
        .ornament {
          font-size: 32px;
          color: #ffd700;
          opacity: 0.5;
          margin: 24px 0;
          text-shadow: 0 0 12px rgba(255, 215, 0, 0.5);
        }
        .errorCode {
          font-family: 'Georgia', serif;
          font-size: 100px;
          font-weight: 900;
          color: #ffd700;
          text-shadow: 0 0 30px rgba(255, 215, 0, 0.6);
          line-height: 1;
          margin-bottom: 24px;
        }
        .title {
          font-family: 'Georgia', serif;
          font-size: 28px;
          font-weight: 700;
          font-style: italic;
          margin-bottom: 16px;
        }
        .subtitle {
          font-size: 14px;
          line-height: 1.7;
          color: rgba(245, 241, 234, 0.7);
          margin-bottom: 36px;
        }
        .primaryBtn {
          display: inline-block;
          padding: 14px 32px;
          background: linear-gradient(135deg, #c65f3b 0%, #a64a2a 100%);
          color: #fff;
          border-radius: 100px;
          font-size: 14px;
          font-weight: 800;
          text-decoration: none;
          box-shadow: 0 4px 16px rgba(198, 95, 59, 0.4);
        }
        .primaryBtn:hover {
          transform: translateY(-2px);
          box-shadow: 0 6px 20px rgba(198, 95, 59, 0.5);
        }
        @media (max-width: 720px) {
          .errorCode { font-size: 72px; }
          .title { font-size: 22px; }
        }
      `}</style>
    </div>
  );
}
