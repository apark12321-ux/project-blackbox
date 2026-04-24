'use client';
/**
 * /privacy - 개인정보 처리방침
 * SEO: WebPage JSON-LD + Breadcrumb
 */

import Link from 'next/link';
import { DashboardShell } from '../_shared/V11Shell';
import { JsonLd, generateBreadcrumbJsonLd } from '../_shared/SEO';

const privacyJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'WebPage',
  name: '개인정보 처리방침',
  description: 'AlgoMaker의 개인정보 수집·이용·보관·파기 방침',
  url: 'https://nutube.kr/privacy',
  inLanguage: 'ko-KR',
};

const breadcrumbJsonLd = generateBreadcrumbJsonLd([
  { name: '홈', url: 'https://nutube.kr' },
  { name: '개인정보 처리방침', url: 'https://nutube.kr/privacy' },
]);

const LAST_UPDATED = '2026년 4월 23일';
const CONTACT_EMAIL = 'contact@algomaker.kr';

export default function PrivacyPage() {
  return (
    <DashboardShell>
      {/* SEO JSON-LD */}
      <JsonLd data={privacyJsonLd} />
      <JsonLd data={breadcrumbJsonLd} />

      <style jsx>{`
        .page {
          padding: 32px 32px 60px;
          max-width: 820px;
          margin: 0 auto;
        }
        .pageHeader {
          margin-bottom: 22px;
          padding-bottom: 18px;
          border-bottom: 1px solid #e8e8e8;
        }
        .pageBadge {
          display: inline-block;
          padding: 4px 12px;
          background: #e0e7ff;
          color: #3730a3;
          border-radius: 999px;
          font-size: 10px;
          font-weight: 800;
          letter-spacing: 0.1em;
          margin-bottom: 12px;
        }
        .pageTitle {
          font-size: 28px;
          font-weight: 800;
          letter-spacing: -0.03em;
          line-height: 1.2;
          margin-bottom: 6px;
          color: #0f0f0f;
        }
        .lastUpdated {
          font-size: 12px;
          color: #888;
          font-weight: 500;
        }

        .intro {
          padding: 16px 20px;
          background: #fafafa;
          border-radius: 12px;
          font-size: 13.5px;
          color: #333;
          line-height: 1.7;
          margin-bottom: 28px;
          border-left: 3px solid #0f0f0f;
        }

        .section {
          margin-bottom: 30px;
        }
        .sectionTitle {
          font-size: 17px;
          font-weight: 800;
          letter-spacing: -0.02em;
          margin-bottom: 10px;
          color: #0f0f0f;
          display: flex;
          gap: 10px;
          align-items: baseline;
        }
        .sectionNum {
          font-size: 14px;
          color: #cc0000;
          font-weight: 800;
          letter-spacing: 0;
        }
        .sectionBody {
          font-size: 13.5px;
          line-height: 1.75;
          color: #333;
        }
        .sectionBody p {
          margin-bottom: 12px;
        }
        .sectionBody ul {
          margin-bottom: 14px;
          padding-left: 22px;
        }
        .sectionBody li {
          margin-bottom: 6px;
          line-height: 1.7;
        }
        .sectionBody strong {
          color: #0f0f0f;
          font-weight: 700;
        }
        .sectionBody a {
          color: #cc0000;
          text-decoration: underline;
        }

        .noticeBox {
          padding: 14px 18px;
          background: #fef3c7;
          border: 1px solid #fcd34d;
          border-radius: 10px;
          font-size: 12.5px;
          color: #78350f;
          line-height: 1.65;
          margin: 14px 0;
        }

        @media (max-width: 640px) {
          .page { padding: 22px 16px 40px; }
          .pageTitle { font-size: 22px; }
        }
      `}</style>

      <div className="page">
        <header className="pageHeader">
          <span className="pageBadge">PRIVACY POLICY</span>
          <h1 className="pageTitle">개인정보 처리방침</h1>
          <div className="lastUpdated">최종 수정일: {LAST_UPDATED}</div>
        </header>

        <div className="intro">
          한줄컴퍼니가 운영하는 AlgoMaker("본 서비스")는 사용자의 개인정보를 중요하게 생각하며,
          대한민국 개인정보보호법 및 관련 법령을 준수합니다.
          본 방침은 본 서비스가 어떤 정보를 수집하고, 어떻게 사용·보관·보호하는지 설명합니다.
        </div>

        {/* 1. 수집 정보 */}
        <section className="section">
          <div className="sectionTitle">
            <span className="sectionNum">1.</span>
            수집하는 정보
          </div>
          <div className="sectionBody">
            <p>
              본 서비스는 사용자 가입을 요구하지 않으며, 개인을 식별할 수 있는 정보
              (이름, 주민등록번호, 휴대폰 번호 등)를 수집하지 않습니다. 다만 서비스 제공을 위해
              아래 정보가 제한적으로 수집될 수 있습니다:
            </p>
            <ul>
              <li>
                <strong>익명 브라우저 식별자 (Anonymous ID)</strong>:
                사용자가 제작한 영상 이력을 관리하기 위해 브라우저에 저장되는 임의의 식별자입니다.
                개인 식별이 불가능하며, 브라우저 데이터 삭제 시 사라집니다.
              </li>
              <li>
                <strong>사용자가 입력한 키워드</strong>:
                영상 생성에 사용되는 키워드는 임시 로그에 기록될 수 있으나, 개인 식별 정보와 연결되지 않습니다.
              </li>
              <li>
                <strong>접속 로그 및 쿠키</strong>:
                IP 주소, 브라우저 종류, 접속 시간 등 서비스 운영에 필요한 기술적 정보를 수집합니다.
              </li>
              <li>
                <strong>문의 양식 정보</strong>:
                사용자가 직접 문의 양식에 입력한 이름, 이메일, 문의 내용은 답변 목적으로만 사용됩니다.
              </li>
            </ul>
          </div>
        </section>

        {/* 2. 쿠키 */}
        <section className="section">
          <div className="sectionTitle">
            <span className="sectionNum">2.</span>
            쿠키 및 추적 기술
          </div>
          <div className="sectionBody">
            <p>
              본 서비스는 사용자 경험 개선과 서비스 운영을 위해 쿠키(Cookie)를 사용합니다.
              쿠키는 서버가 사용자의 브라우저에 저장하는 작은 파일이며, 개인을 식별할 수 없는 형태로 사용됩니다.
            </p>
            <p><strong>본 서비스에서 사용하는 주요 쿠키:</strong></p>
            <ul>
              <li><strong>기능 쿠키</strong>: 사용자 설정(언어, 영상 이력 등)을 기억하는 쿠키</li>
              <li><strong>분석 쿠키</strong>: 방문자 통계 및 서비스 개선을 위한 익명 분석 쿠키 (Google Analytics 등)</li>
              <li><strong>광고 쿠키</strong>: Google AdSense를 통해 사용자에게 관련성 있는 광고를 제공하기 위한 쿠키</li>
            </ul>
            <p>
              사용자는 브라우저 설정을 통해 쿠키 저장을 거부하거나 삭제할 수 있습니다.
              다만 쿠키를 거부하면 일부 서비스 기능이 제한될 수 있습니다.
            </p>
          </div>
        </section>

        {/* 3. Google AdSense - 가장 중요! */}
        <section className="section">
          <div className="sectionTitle">
            <span className="sectionNum">3.</span>
            Google AdSense 광고에 관한 고지
          </div>
          <div className="sectionBody">
            <p>
              본 서비스는 Google AdSense를 통해 광고를 표시합니다.
              Google은 제3자 광고 제공업체로서, 방문자의 관심사에 맞는 광고를 제공하기 위해
              쿠키를 사용합니다.
            </p>
            <ul>
              <li>
                Google은 <strong>DoubleClick DART 쿠키</strong>를 사용하여 사용자가 본 서비스 및
                인터넷 상 다른 사이트를 방문한 기록을 기반으로 광고를 게재합니다.
              </li>
              <li>
                Google의 광고 쿠키 사용은 <strong>사용자가 본 서비스 및 기타 사이트를 방문할 때</strong>
                Google 및 제3자 광고 파트너가 광고를 게재할 수 있게 합니다.
              </li>
              <li>
                사용자는 <a href="https://www.google.com/settings/ads" target="_blank" rel="noopener noreferrer">
                Google 광고 설정 페이지</a>에서 맞춤 광고를 거부(opt-out)할 수 있습니다.
              </li>
              <li>
                또한 <a href="https://www.aboutads.info/choices/" target="_blank" rel="noopener noreferrer">
                www.aboutads.info</a>에서 제3자 광고 제공업체의 맞춤 광고를 거부할 수 있습니다.
              </li>
            </ul>

            <div className="noticeBox">
              <strong>⚠️ 제3자 광고 서버 관련 안내</strong><br />
              본 서비스의 광고는 Google AdSense 및 기타 광고 네트워크에 의해 관리됩니다.
              이 광고 파트너들은 자체적인 개인정보 처리방침을 가지고 있으며,
              본 서비스는 제3자 광고 서버의 정책에 대해 직접적인 통제력을 갖지 않습니다.
              각 광고 파트너의 개인정보 처리방침은 해당 업체의 웹사이트를 참조하세요.
            </div>

            <p>
              Google의 개인정보 정책 및 광고 관련 자세한 내용은{' '}
              <a href="https://policies.google.com/technologies/ads" target="_blank" rel="noopener noreferrer">
                Google 광고 및 정보 정책
              </a>을 참고하시기 바랍니다.
            </p>
          </div>
        </section>

        {/* 4. 정보 이용 */}
        <section className="section">
          <div className="sectionTitle">
            <span className="sectionNum">4.</span>
            수집한 정보의 이용 목적
          </div>
          <div className="sectionBody">
            <p>본 서비스는 수집한 정보를 다음 목적으로만 사용합니다:</p>
            <ul>
              <li>서비스 제공 및 운영 (영상 생성, 이력 관리 등)</li>
              <li>서비스 품질 개선 및 신규 기능 개발</li>
              <li>익명화된 통계 분석</li>
              <li>사용자 문의에 대한 답변</li>
              <li>서비스 이용약관 위반 행위 방지</li>
              <li>관련성 있는 광고 제공 (Google AdSense 등)</li>
            </ul>
          </div>
        </section>

        {/* 5. 제3자 제공 */}
        <section className="section">
          <div className="sectionTitle">
            <span className="sectionNum">5.</span>
            제3자 정보 제공
          </div>
          <div className="sectionBody">
            <p>
              본 서비스는 사용자의 개인정보를 제3자에게 판매·임대·공유하지 않습니다.
              다만 다음의 경우에는 예외적으로 제공될 수 있습니다:
            </p>
            <ul>
              <li>법령에 의거하여 수사 기관의 요청이 있는 경우</li>
              <li>사용자가 명시적으로 동의한 경우</li>
              <li>
                서비스 제공을 위해 필수적으로 이용하는 외부 API 호출
                (Google Gemini, Pexels, Edge TTS, YouTube API 등).
                이 경우 각 업체의 개인정보 처리방침이 적용됩니다.
              </li>
            </ul>
          </div>
        </section>

        {/* 6. 보관 기간 */}
        <section className="section">
          <div className="sectionTitle">
            <span className="sectionNum">6.</span>
            정보 보관 기간
          </div>
          <div className="sectionBody">
            <p>
              수집된 정보는 해당 정보의 목적이 달성되면 지체 없이 파기됩니다.
              구체적인 보관 기간은 다음과 같습니다:
            </p>
            <ul>
              <li><strong>익명 식별자 및 영상 이력</strong>: 사용자가 브라우저 데이터를 삭제할 때까지</li>
              <li><strong>문의 이메일</strong>: 답변 완료 후 3개월</li>
              <li><strong>서버 로그</strong>: 최대 90일</li>
              <li><strong>관련 법령에 따라 보관 의무가 있는 경우</strong>: 해당 법령이 정하는 기간</li>
            </ul>
          </div>
        </section>

        {/* 7. 사용자 권리 */}
        <section className="section">
          <div className="sectionTitle">
            <span className="sectionNum">7.</span>
            사용자의 권리
          </div>
          <div className="sectionBody">
            <p>사용자는 언제든 다음 권리를 행사할 수 있습니다:</p>
            <ul>
              <li>본인의 정보 열람 요청</li>
              <li>정보 수정 및 삭제 요청</li>
              <li>서비스 이용 기록 삭제 (브라우저 데이터 초기화를 통해 직접 가능)</li>
              <li>쿠키 수집 거부 (브라우저 설정)</li>
              <li>맞춤 광고 거부 (위 3번 섹션의 Google 광고 설정)</li>
            </ul>
            <p>
              권리 행사를 원하시는 경우{' '}
              <Link href="/contact">문의 페이지</Link> 또는{' '}
              <a href={`mailto:${CONTACT_EMAIL}`}>{CONTACT_EMAIL}</a>로 연락주시면 신속히 처리해드립니다.
            </p>
          </div>
        </section>

        {/* 8. 아동 정보 */}
        <section className="section">
          <div className="sectionTitle">
            <span className="sectionNum">8.</span>
            아동의 개인정보 보호
          </div>
          <div className="sectionBody">
            <p>
              본 서비스는 만 14세 미만 아동을 대상으로 하지 않습니다.
              아동의 개인정보를 고의로 수집하지 않으며, 만일 아동의 정보가 수집된 사실이 확인되면
              즉시 삭제 조치합니다.
            </p>
          </div>
        </section>

        {/* 9. 보안 */}
        <section className="section">
          <div className="sectionTitle">
            <span className="sectionNum">9.</span>
            정보 보호를 위한 기술적·관리적 조치
          </div>
          <div className="sectionBody">
            <p>본 서비스는 수집한 정보의 안전을 위해 다음 조치를 취하고 있습니다:</p>
            <ul>
              <li>HTTPS 암호화 통신</li>
              <li>접근 권한 제한 및 로그 관리</li>
              <li>정기적인 보안 점검</li>
              <li>개인정보 처리 시스템의 접근 통제</li>
            </ul>
          </div>
        </section>

        {/* 10. 정책 변경 */}
        <section className="section">
          <div className="sectionTitle">
            <span className="sectionNum">10.</span>
            개인정보 처리방침 변경
          </div>
          <div className="sectionBody">
            <p>
              본 방침은 관련 법령 또는 서비스 정책 변경에 따라 수정될 수 있습니다.
              변경되는 경우 본 페이지를 통해 공지하며, 중대한 변경 시에는 별도 고지합니다.
              최종 수정일은 본 문서 상단에 명시되어 있습니다.
            </p>
          </div>
        </section>

        {/* 11. 문의처 */}
        <section className="section">
          <div className="sectionTitle">
            <span className="sectionNum">11.</span>
            개인정보 보호 책임자 및 문의처
          </div>
          <div className="sectionBody">
            <p>
              본 방침 및 개인정보 처리에 관한 문의는 아래로 연락주시기 바랍니다.
            </p>
            <ul>
              <li><strong>서비스명</strong>: AlgoMaker</li>
              <li><strong>운영사</strong>: 한줄컴퍼니</li>
              <li><strong>대표 / 개인정보 보호 책임자</strong>: 박예준</li>
              <li><strong>이메일</strong>: <a href={`mailto:${CONTACT_EMAIL}`}>{CONTACT_EMAIL}</a></li>
              <li><strong>문의 양식</strong>: <Link href="/contact">/contact</Link></li>
            </ul>
          </div>
        </section>
      </div>
    </DashboardShell>
  );
}
