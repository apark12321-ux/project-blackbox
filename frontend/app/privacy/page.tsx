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
          <span>개인정보 처리방침</span>
        </nav>

        <header className="header">
          
          <h1 className="title">개인정보 처리방침</h1>
          <p className="sub">AlgoMaker는 사용자의 개인정보를 소중히 다룹니다</p>
        </header>

        <div className="content">
          <h2>제1조 (개인정보의 처리 목적)</h2>
          <p>
            AlgoMaker(이하 '서비스')는 다음의 목적을 위하여 개인정보를 처리합니다. 처리한 개인정보는 다음의 목적 이외의 용도로는 이용되지 않습니다.
          </p>
          <ul>
            <li>서비스 제공 및 운영</li>
            <li>서비스 개선 및 통계 분석</li>
            <li>고객 문의 응대</li>
          </ul>

          <h2>제2조 (수집하는 개인정보 항목)</h2>
          <p>본 서비스는 회원가입 없이 이용 가능합니다. 다만 다음과 같은 정보가 자동으로 수집될 수 있습니다.</p>
          <ul>
            <li>접속 IP 정보, 쿠키, 접속 기록, 브라우저 정보</li>
            <li>localStorage 기반의 사용자 선택 정보 (카테고리, 키워드 등)</li>
          </ul>

          <h2>제3조 (개인정보의 보유 및 이용기간)</h2>
          <p>
            서비스 이용 통계 분석을 위한 데이터는 익명화되어 1년간 보관됩니다.
            사용자가 입력한 키워드 등의 정보는 사용자 브라우저에만 저장되며, 서버에 저장되지 않습니다.
          </p>

          <h2>제4조 (광고 및 분석 도구)</h2>
          <p>
            본 서비스는 다음과 같은 제3자 광고 및 분석 도구를 사용할 수 있습니다.
          </p>
          <ul>
            <li>Google AdSense - 광고 게재</li>
            <li>Google Analytics - 사용자 통계 분석</li>
          </ul>
          <p>
            이러한 도구들은 쿠키를 사용하여 사용자 활동을 분석합니다.
            사용자는 브라우저 설정에서 쿠키를 비활성화할 수 있습니다.
          </p>

          <h2>제5조 (정보주체의 권리)</h2>
          <p>이용자는 언제든지 다음의 권리를 행사할 수 있습니다.</p>
          <ul>
            <li>개인정보 열람 요구</li>
            <li>개인정보 정정·삭제 요구</li>
            <li>개인정보 처리정지 요구</li>
          </ul>

          <h2>제6조 (개인정보 보호 책임자)</h2>
          <p>
            <strong>책임자:</strong> 박예준 (알고파트너스 대표)<br />
            <strong>이메일:</strong> contact@algomaker.kr
          </p>

          <h2>제7조 (개정)</h2>
          <p>
            본 개인정보 처리방침은 2026년 4월 25일부터 시행됩니다.
            법령 및 방침의 변경에 따라 개정될 수 있으며, 변경 시 7일 전에 공지합니다.
          </p>
        </div>

        <div className="adArea">
          <AdSlot slot="page-bottom" variant="horizontal" />
        </div>
      </div>
    </V11Shell>
  );
}
