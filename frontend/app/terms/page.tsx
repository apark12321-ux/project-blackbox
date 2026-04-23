'use client';
/**
 * /terms - 이용약관
 *
 * AdSense 승인에 필수.
 * 핵심 내용: 서비스 제공 범위, 사용자 의무, 제한 사항, 면책 조항
 */

import Link from 'next/link';
import { DashboardShell } from '../_shared/V11Shell';

const LAST_UPDATED = '2026년 4월 23일';
const CONTACT_EMAIL = 'contact@algomaker.kr';

export default function TermsPage() {
  return (
    <DashboardShell>
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
          background: #f3e8ff;
          color: #6b21a8;
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
          border-left: 3px solid #6b21a8;
        }

        .section {
          margin-bottom: 28px;
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
          color: #6b21a8;
          font-weight: 800;
        }
        .sectionBody {
          font-size: 13.5px;
          line-height: 1.75;
          color: #333;
        }
        .sectionBody p { margin-bottom: 12px; }
        .sectionBody ul { margin-bottom: 14px; padding-left: 22px; }
        .sectionBody li { margin-bottom: 6px; line-height: 1.7; }
        .sectionBody strong { color: #0f0f0f; font-weight: 700; }
        .sectionBody a { color: #cc0000; text-decoration: underline; }

        @media (max-width: 640px) {
          .page { padding: 22px 16px 40px; }
          .pageTitle { font-size: 22px; }
        }
      `}</style>

      <div className="page">
        <header className="pageHeader">
          <span className="pageBadge">TERMS OF SERVICE</span>
          <h1 className="pageTitle">이용약관</h1>
          <div className="lastUpdated">최종 수정일: {LAST_UPDATED}</div>
        </header>

        <div className="intro">
          본 이용약관("약관")은 한줄컴퍼니가 제공하는 AlgoMaker("본 서비스")의
          이용에 관한 조건을 규정합니다.
          사용자는 본 서비스를 이용함으로써 본 약관에 동의한 것으로 간주됩니다.
        </div>

        <section className="section">
          <div className="sectionTitle">
            <span className="sectionNum">제 1 조</span>
            목적
          </div>
          <div className="sectionBody">
            <p>
              본 약관은 사용자가 본 서비스를 이용함에 있어 회사와 사용자 간의 권리·의무 및
              책임사항, 이용조건 및 절차, 기타 필요한 사항을 규정함을 목적으로 합니다.
            </p>
          </div>
        </section>

        <section className="section">
          <div className="sectionTitle">
            <span className="sectionNum">제 2 조</span>
            용어의 정의
          </div>
          <div className="sectionBody">
            <ul>
              <li><strong>"본 서비스"</strong>란 AlgoMaker 플랫폼 및 관련 모든 기능을 의미합니다.</li>
              <li><strong>"사용자"</strong>란 본 서비스에 접속하여 이를 이용하는 모든 자를 의미합니다.</li>
              <li><strong>"콘텐츠"</strong>란 사용자가 본 서비스를 통해 생성한 영상, 대본, 이미지 등을 의미합니다.</li>
              <li><strong>"회사"</strong>란 한줄컴퍼니를 의미합니다.</li>
            </ul>
          </div>
        </section>

        <section className="section">
          <div className="sectionTitle">
            <span className="sectionNum">제 3 조</span>
            서비스의 제공
          </div>
          <div className="sectionBody">
            <p>회사는 사용자에게 다음 서비스를 제공합니다:</p>
            <ul>
              <li>AI 기반 유튜브 영상 대본 자동 생성</li>
              <li>AI 기반 영상 합성 (음성·이미지·편집)</li>
              <li>경쟁 채널 분석 정보 제공</li>
              <li>크리에이터를 위한 블로그 콘텐츠 및 가이드</li>
              <li>기타 회사가 정하는 부가 서비스</li>
            </ul>
            <p>
              본 서비스는 현재 <strong>무료로 제공</strong>되며, 서비스 운영 비용은
              페이지에 표시되는 광고를 통해 충당됩니다.
              향후 유료 기능이 추가될 수 있으며, 그 경우 별도 고지 후 시행됩니다.
            </p>
          </div>
        </section>

        <section className="section">
          <div className="sectionTitle">
            <span className="sectionNum">제 4 조</span>
            사용자의 의무
          </div>
          <div className="sectionBody">
            <p>사용자는 본 서비스 이용 시 다음 행위를 해서는 안 됩니다:</p>
            <ul>
              <li>허위 정보, 선정적, 폭력적, 혐오적 콘텐츠 생성</li>
              <li>타인의 저작권, 초상권, 명예권 등을 침해하는 콘텐츠 생성</li>
              <li>특정 개인, 집단을 비방·차별하는 콘텐츠 생성</li>
              <li>도박, 성인물, 마약, 불법 금융 상품 등 현행 법령을 위반하는 콘텐츠 생성</li>
              <li>서비스를 역공학(reverse engineering)하거나 비정상적 방식으로 이용하는 행위</li>
              <li>자동화 도구(봇, 스크래퍼 등)를 이용한 과도한 요청</li>
              <li>타인의 계정 정보나 권한을 무단으로 이용하는 행위</li>
              <li>서비스의 안정적 운영을 방해하는 모든 행위</li>
            </ul>
            <p>
              사용자가 위 의무를 위반할 경우 회사는 사전 통지 없이 서비스 이용을 제한할 수 있으며,
              발생하는 모든 책임은 사용자에게 있습니다.
            </p>
          </div>
        </section>

        <section className="section">
          <div className="sectionTitle">
            <span className="sectionNum">제 5 조</span>
            콘텐츠의 권리와 책임
          </div>
          <div className="sectionBody">
            <p>
              사용자가 본 서비스를 통해 생성한 콘텐츠의 사용 권한은 사용자에게 있습니다.
              사용자는 이를 자유롭게 수정, 배포, 상업적 이용할 수 있습니다.
            </p>
            <p>
              단, 생성된 콘텐츠에 포함되는 이미지는 Pexels 등 외부 무료 라이선스 소스에서 제공되며,
              각 소스의 라이선스 조건이 우선 적용됩니다.
              사용자는 콘텐츠 사용 시 해당 라이선스를 준수해야 합니다.
            </p>
            <p>
              <strong>사용자가 생성한 콘텐츠의 내용에 대한 최종 책임은 사용자에게 있습니다.</strong>
              회사는 AI가 생성한 결과물의 정확성, 적법성, 상업적 사용 적합성을 보장하지 않으며,
              사용자가 콘텐츠를 공개·유통함으로써 발생하는 모든 결과(저작권 분쟁, 명예훼손, 허위 정보 유포 등)에
              대한 책임은 사용자가 부담합니다.
            </p>
          </div>
        </section>

        <section className="section">
          <div className="sectionTitle">
            <span className="sectionNum">제 6 조</span>
            지식재산권
          </div>
          <div className="sectionBody">
            <p>
              본 서비스의 소스코드, 디자인, 로고, 브랜드명, UI 구성 등 모든 지식재산권은 회사에 귀속됩니다.
              사용자는 회사의 사전 서면 동의 없이 이를 복제, 배포, 2차 저작물 작성에 사용할 수 없습니다.
            </p>
          </div>
        </section>

        <section className="section">
          <div className="sectionTitle">
            <span className="sectionNum">제 7 조</span>
            광고의 게재
          </div>
          <div className="sectionBody">
            <p>
              회사는 서비스 운영을 위해 본 서비스에 광고(Google AdSense 등)를 게재할 수 있습니다.
              사용자는 이에 동의하는 것을 조건으로 본 서비스를 이용합니다.
            </p>
            <p>
              광고 클릭 시 외부 사이트로 이동할 수 있으며, 외부 사이트의 내용·거래·서비스에 대해서는
              회사가 책임을 지지 않습니다.
              자세한 내용은 <Link href="/privacy">개인정보 처리방침</Link>을 참고해주세요.
            </p>
          </div>
        </section>

        <section className="section">
          <div className="sectionTitle">
            <span className="sectionNum">제 8 조</span>
            서비스 이용 제한
          </div>
          <div className="sectionBody">
            <p>
              회사는 사용자가 다음 각 호에 해당하는 행위를 하였을 경우 사전 통지 없이
              서비스 이용을 제한 또는 중단할 수 있습니다:
            </p>
            <ul>
              <li>본 약관을 위반한 경우</li>
              <li>공공의 안녕질서 또는 미풍양속을 해치는 경우</li>
              <li>범죄와 결부된다고 객관적으로 판단되는 행위를 한 경우</li>
              <li>과도한 리소스를 사용하여 다른 사용자의 이용을 방해하는 경우</li>
            </ul>
          </div>
        </section>

        <section className="section">
          <div className="sectionTitle">
            <span className="sectionNum">제 9 조</span>
            서비스 변경 및 중단
          </div>
          <div className="sectionBody">
            <p>
              회사는 상당한 이유가 있는 경우 본 서비스의 내용을 변경·개선하거나
              일시적·영구적으로 중단할 수 있습니다.
              중단 시 회사는 가능한 한 사전에 공지합니다.
            </p>
            <p>
              서비스 변경 또는 중단으로 인해 사용자에게 발생한 손해에 대해,
              회사는 고의 또는 중과실이 없는 한 책임을 지지 않습니다.
            </p>
          </div>
        </section>

        <section className="section">
          <div className="sectionTitle">
            <span className="sectionNum">제 10 조</span>
            면책 조항
          </div>
          <div className="sectionBody">
            <p>
              회사는 다음 각 호의 경우 책임을 지지 않습니다:
            </p>
            <ul>
              <li>천재지변, 전쟁, 정전, 국가 비상사태 등 불가항력으로 인한 서비스 제공 불가</li>
              <li>외부 API(Gemini, Pexels, YouTube 등)의 장애로 인한 서비스 중단</li>
              <li>사용자의 귀책사유로 인한 서비스 이용 장애</li>
              <li>사용자가 생성한 콘텐츠로 인한 제3자와의 분쟁</li>
              <li>사용자 간 또는 사용자와 제3자 간 본 서비스를 매개로 한 거래·분쟁</li>
              <li>AI가 생성한 결과물에 포함된 오류, 부정확한 정보, 사실과 다른 내용</li>
            </ul>
            <p>
              본 서비스는 <strong>"있는 그대로(as-is)"</strong> 제공되며,
              특정 목적 적합성, 상품성, 비침해성에 대한 어떠한 명시적·묵시적 보증도 하지 않습니다.
            </p>
          </div>
        </section>

        <section className="section">
          <div className="sectionTitle">
            <span className="sectionNum">제 11 조</span>
            약관의 변경
          </div>
          <div className="sectionBody">
            <p>
              회사는 필요 시 본 약관을 변경할 수 있으며, 변경된 약관은 본 페이지 공지 후 효력이 발생합니다.
              중대한 변경의 경우 7일 이상의 유예기간을 두고 공지합니다.
              사용자가 변경된 약관에 동의하지 않는 경우 서비스 이용을 중단할 수 있습니다.
            </p>
          </div>
        </section>

        <section className="section">
          <div className="sectionTitle">
            <span className="sectionNum">제 12 조</span>
            준거법 및 관할
          </div>
          <div className="sectionBody">
            <p>
              본 약관의 해석 및 회사와 사용자 간의 분쟁에 관하여는 대한민국 법을 적용합니다.
              본 서비스 이용과 관련하여 발생한 분쟁에 대한 소송은 민사소송법상의 관할법원에 제기합니다.
            </p>
          </div>
        </section>

        <section className="section">
          <div className="sectionTitle">
            <span className="sectionNum">제 13 조</span>
            문의
          </div>
          <div className="sectionBody">
            <p>본 약관에 관한 문의는 아래로 연락주시기 바랍니다:</p>
            <ul>
              <li><strong>서비스명</strong>: AlgoMaker</li>
              <li><strong>운영사</strong>: 한줄컴퍼니</li>
              <li><strong>대표</strong>: 박예준</li>
              <li><strong>이메일</strong>: <a href={`mailto:${CONTACT_EMAIL}`}>{CONTACT_EMAIL}</a></li>
              <li><strong>문의 양식</strong>: <Link href="/contact">/contact</Link></li>
            </ul>
          </div>
        </section>
      </div>
    </DashboardShell>
  );
}
