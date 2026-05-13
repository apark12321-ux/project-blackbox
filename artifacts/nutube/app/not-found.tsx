'use client';
import Link from 'next/link';
import { V11Shell } from './_shared/V11Shell';

/**
 * 404 페이지 - AdSense 승인 요건
 * 깨진 링크 클릭 시 사용자가 길을 잃지 않게 안내
 */
export default function NotFound() {
  return (
    <V11Shell>
      <style jsx>{`
        .container {
          max-width: 720px;
          margin: 0 auto;
          padding: 80px 24px 60px;
          text-align: center;
          min-height: 60vh;
        }
        @media (max-width: 600px) {
          .container { padding: 56px 18px 40px; }
        }
        .errorCode {
          font-size: 96px;
          font-weight: 800;
          color: #c65f3b;
          letter-spacing: -0.04em;
          line-height: 1;
          margin-bottom: 8px;
        }
        @media (max-width: 600px) {
          .errorCode { font-size: 72px; }
        }
        .title {
          font-size: 28px;
          font-weight: 800;
          color: #1a1a1a;
          margin: 0 0 12px;
          letter-spacing: -0.025em;
        }
        @media (max-width: 600px) {
          .title { font-size: 22px; }
        }
        .desc {
          font-size: 15px;
          color: #666;
          line-height: 1.7;
          margin: 0 0 32px;
        }
        @media (max-width: 600px) {
          .desc { font-size: 14px; }
        }
        .actions {
          display: flex;
          gap: 10px;
          justify-content: center;
          flex-wrap: wrap;
        }
        .actionBtn {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          padding: 12px 24px;
          border-radius: 100px;
          font-size: 14px;
          font-weight: 700;
          text-decoration: none;
          transition: all 0.15s;
          min-height: 44px;
        }
        .actionPrimary {
          background: #c65f3b;
          color: #fff;
        }
        .actionPrimary:hover {
          background: #d97155;
          transform: translateY(-1px);
        }
        .actionSecondary {
          background: #fff;
          color: #1a1a1a;
          border: 1px solid #e5e5e5;
        }
        .actionSecondary:hover {
          border-color: #c65f3b;
          color: #c65f3b;
        }
        .helpfulLinks {
          margin-top: 48px;
          padding: 24px;
          background: #fafafa;
          border-radius: 12px;
          text-align: left;
        }
        .helpfulTitle {
          font-size: 14px;
          font-weight: 800;
          color: #1a1a1a;
          margin: 0 0 14px;
          letter-spacing: -0.02em;
        }
        .linkGrid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
          gap: 8px;
        }
        .quickLink {
          display: flex;
          align-items: center;
          gap: 8px;
          padding: 10px 14px;
          background: #fff;
          border: 1px solid #e5e5e5;
          border-radius: 8px;
          text-decoration: none;
          color: #1a1a1a;
          font-size: 13px;
          font-weight: 600;
          transition: all 0.15s;
        }
        .quickLink:hover {
          border-color: #c65f3b;
          color: #c65f3b;
          transform: translateY(-1px);
        }
      `}</style>

      <div className="container">
        <div className="errorCode">404</div>
        <h1 className="title">찾으시는 페이지가 없어요</h1>
        <p className="desc">
          입력하신 주소가 잘못됐거나, 페이지가 이동/삭제되었을 수 있습니다.
          <br />
          아래 버튼으로 홈으로 돌아가시거나, 다른 페이지를 둘러보세요.
        </p>

        <div className="actions">
          <Link href="/" className="actionBtn actionPrimary">
            🏠 홈으로 돌아가기
          </Link>
          <Link href="/create" className="actionBtn actionSecondary">
            ✨ 영상 만들기
          </Link>
        </div>

        <div className="helpfulLinks">
          <div className="helpfulTitle">📚 인기 페이지</div>
          <div className="linkGrid">
            <Link href="/blog" className="quickLink">
              📖 노하우 모음
            </Link>
            <Link href="/workflow" className="quickLink">
              🎬 일관된 영상 가이드
            </Link>
            <Link href="/imagegen" className="quickLink">
              🎨 AI 이미지 생성
            </Link>
            <Link href="/about" className="quickLink">
              ℹ️ 서비스 소개
            </Link>
          </div>
        </div>
      </div>
    </V11Shell>
  );
}
