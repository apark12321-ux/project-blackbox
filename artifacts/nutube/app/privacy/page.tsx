'use client';

import Link from 'next/link';
import { V18Shell } from '../_shared/V18Shell';

export default function PrivacyPage() {
  return (
    <V18Shell>
      <style jsx>{`
        .privacy-container {
          max-width: 760px; margin: 0 auto; padding: 32px 20px 60px;
          font-family: 'Pretendard', -apple-system, system-ui, sans-serif;
          color: #0a0a0a; line-height: 1.75; letter-spacing: -0.01em;
        }
        @media (max-width: 600px) { .privacy-container { padding: 24px 16px 50px; } }
        h1 {
          font-size: 28px; font-weight: 800; letter-spacing: -0.025em;
          margin: 0 0 8px; color: #0a0a0a;
        }
        @media (max-width: 600px) { h1 { font-size: 24px; } }
        .updated {
          font-size: 13px; color: #737373; margin-bottom: 32px;
        }
        h2 {
          font-size: 20px; font-weight: 700; letter-spacing: -0.02em;
          margin: 36px 0 12px; color: #0a0a0a;
        }
        @media (max-width: 600px) { h2 { font-size: 18px; } }
        h3 {
          font-size: 16px; font-weight: 700; margin: 20px 0 8px;
          color: #1a1a1a;
        }
        p {
          font-size: 15px; margin: 0 0 12px; line-height: 1.75;
          word-break: keep-all;
        }
        ul {
          margin: 0 0 16px; padding-left: 24px;
        }
        li {
          font-size: 15px; margin-bottom: 6px; line-height: 1.7;
          word-break: keep-all;
        }
        .contact-box {
          background: #f8f8f8; padding: 16px 20px; border-radius: 8px;
          margin-top: 24px; font-size: 14px;
        }
      `}</style>

      <div className="privacy-container">
        <h1>개인정보 처리방침</h1>
        <p className="updated">최종 업데이트: 2026년 5월 9일</p>

        <p>
          알고파트너스(이하 &apos;운영자&apos;)는 NuTube(nutube.kr) 사이트(이하 &apos;본 사이트&apos;)를
          운영함에 있어 이용자의 개인정보를 중요시하며, 개인정보 보호법 등 관련 법령을
          준수하기 위해 다음과 같은 처리방침을 두고 있습니다.
        </p>

        <h2>1. 수집하는 개인정보 항목</h2>
        <p>본 사이트는 이용자의 개인 식별 정보를 직접 수집하지 않습니다. 다만 다음 정보가 자동으로 수집될 수 있습니다:</p>
        <ul>
          <li>접속 IP 주소</li>
          <li>쿠키(Cookie)</li>
          <li>접속 로그 및 방문 일시</li>
          <li>이용 브라우저 종류 및 운영체제</li>
          <li>이용 페이지 정보</li>
        </ul>

        <h2>2. 개인정보의 수집 및 이용 목적</h2>
        <ul>
          <li>사이트 운영 및 서비스 제공</li>
          <li>통계 분석 및 서비스 개선</li>
          <li>광고 게재 및 맞춤형 콘텐츠 제공</li>
          <li>법령상 의무 이행</li>
        </ul>

        <h2>3. 쿠키(Cookie)의 운용</h2>
        <p>
          본 사이트는 이용자에게 맞춤형 서비스를 제공하기 위해 쿠키를 사용합니다.
          쿠키는 웹사이트가 이용자의 컴퓨터 브라우저에 보내는 소량의 정보입니다.
        </p>

        <h3>쿠키 사용 목적</h3>
        <ul>
          <li>이용자의 선호 설정 저장</li>
          <li>방문 및 이용 형태 분석</li>
          <li>맞춤형 광고 제공</li>
          <li>사이트 보안 강화</li>
        </ul>

        <h3>쿠키 거부 방법</h3>
        <p>
          이용자는 웹 브라우저 설정을 통해 쿠키를 거부하거나 삭제할 수 있습니다.
          단, 쿠키를 거부할 경우 일부 서비스 이용에 제한이 있을 수 있습니다.
        </p>

        <h2>4. 제3자 광고 및 분석 도구</h2>

        <h3>Google AdSense</h3>
        <p>
          본 사이트는 Google AdSense 광고를 게재합니다. Google AdSense는 쿠키를
          사용하여 이용자의 본 사이트 및 다른 사이트 방문 정보를 기반으로 맞춤형
          광고를 제공합니다.
        </p>
        <p>
          이용자는 광고 설정 페이지에서 맞춤형 광고를 비활성화할 수 있습니다:
        </p>
        <ul>
          <li>Google 광고 설정: https://www.google.com/settings/ads</li>
          <li>광고 선택 해제: https://optout.aboutads.info</li>
        </ul>

        <h3>Google Analytics (사용 시)</h3>
        <p>
          본 사이트는 Google Analytics를 사용하여 방문 통계를 분석할 수 있습니다.
          Google Analytics는 익명화된 데이터를 수집하며, 이용자는 Google Analytics
          비활성화 부가 기능을 통해 데이터 수집을 거부할 수 있습니다.
        </p>

        <h2>5. 개인정보의 보유 및 이용 기간</h2>
        <p>
          본 사이트는 이용자의 개인정보를 수집 및 이용 목적이 달성된 후에는 해당 정보를
          지체 없이 파기합니다. 다만 관련 법령에 따라 보존이 필요한 경우 법령에서
          정한 기간 동안 보관됩니다.
        </p>

        <h2>6. 개인정보의 안전성 확보 조치</h2>
        <p>
          본 사이트는 개인정보의 안전성 확보를 위해 다음과 같은 조치를 취하고 있습니다:
        </p>
        <ul>
          <li>HTTPS 통신 암호화</li>
          <li>접근 권한 관리</li>
          <li>해킹 등에 대비한 기술적 대책</li>
          <li>개인정보 처리 시스템 접근 통제</li>
        </ul>

        <h2>7. 이용자의 권리</h2>
        <p>
          이용자는 언제든지 다음 권리를 행사할 수 있습니다:
        </p>
        <ul>
          <li>개인정보 열람 요구</li>
          <li>오류 정정 요구</li>
          <li>삭제 요구</li>
          <li>처리 정지 요구</li>
        </ul>

        <h2>8. 개인정보 보호책임자</h2>
        <p>
          본 사이트의 개인정보 처리에 관한 문의사항은 아래로 연락 주시기 바랍니다:
        </p>
        <div className="contact-box">
          <p style={{ margin: 0 }}>
            <strong>운영자:</strong> 알고파트너스<br />
            <strong>이메일:</strong> apark12321@gmail.com<br />
            <strong>처리방침 문의:</strong> <Link href="/contact" style={{ color: '#c2410c' }}>문의하기</Link>
          </p>
        </div>

        <h2>9. 변경 사항 고지</h2>
        <p>
          본 개인정보 처리방침이 변경되는 경우, 변경 사항을 본 사이트에 게시하여
          이용자가 확인할 수 있도록 합니다. 본 처리방침은 게시된 날부터 효력이 발생합니다.
        </p>

        <h2>10. 어린이 보호</h2>
        <p>
          본 사이트는 만 14세 미만 어린이의 개인정보를 수집하지 않습니다.
          어린이가 본 사이트를 이용하는 경우, 보호자의 지도와 감독이 필요합니다.
        </p>

        <div style={{ marginTop: 40, paddingTop: 20, borderTop: '1px solid #e5e5e5', fontSize: 13, color: '#737373' }}>
          <p>
            본 처리방침은 2026년 5월 9일부터 시행됩니다.
          </p>
        </div>
      </div>
    </V18Shell>
  );
}
