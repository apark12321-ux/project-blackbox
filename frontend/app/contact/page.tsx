'use client';
/**
 * /contact - AdSense 심사 필수 페이지
 *
 * 필수 요소:
 * - 실제 이메일 주소 (운영자 연락 가능)
 * - 답변 가능한 문의 양식
 * - 응답 시간 안내
 * - 사업자 정보 (있으면)
 *
 * 주의: 연락처 이메일은 실제로 받을 수 있는 주소여야 함
 * AdSense 심사관이 실제로 메일 보낼 수 있음
 */

import { useState } from 'react';
import Link from 'next/link';
import { DashboardShell } from '../_shared/V11Shell';

// ⚠️ 예준님 실제 받을 수 있는 이메일로 바꿔주세요
const CONTACT_EMAIL = 'contact@algomaker.kr';
const BUSINESS_NAME = '한줄컴퍼니';

export default function ContactPage() {
  const [form, setForm] = useState({
    name: '',
    email: '',
    category: 'general',
    subject: '',
    message: '',
  });
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // 실제 백엔드 엔드포인트가 없으므로 mailto로 fallback
    const body = encodeURIComponent(
      `이름: ${form.name}\n이메일: ${form.email}\n분류: ${form.category}\n\n${form.message}`
    );
    const subject = encodeURIComponent(`[AlgoMaker 문의] ${form.subject}`);
    window.location.href = `mailto:${CONTACT_EMAIL}?subject=${subject}&body=${body}`;
    setSubmitted(true);
  };

  return (
    <DashboardShell>
      <style jsx>{`
        .page {
          padding: 32px 32px 60px;
          max-width: 820px;
          margin: 0 auto;
        }
        .pageHeader {
          margin-bottom: 28px;
          padding-bottom: 22px;
          border-bottom: 1px solid #e8e8e8;
        }
        .pageBadge {
          display: inline-block;
          padding: 4px 12px;
          background: #dbeafe;
          color: #1e40af;
          border-radius: 999px;
          font-size: 10px;
          font-weight: 800;
          letter-spacing: 0.1em;
          margin-bottom: 12px;
        }
        .pageTitle {
          font-size: 30px;
          font-weight: 800;
          letter-spacing: -0.03em;
          line-height: 1.2;
          margin-bottom: 8px;
          color: #0f0f0f;
        }
        .pageSub {
          font-size: 14px;
          color: #606060;
          line-height: 1.6;
        }

        .grid {
          display: grid;
          grid-template-columns: 1.3fr 1fr;
          gap: 24px;
          margin-bottom: 32px;
        }

        .formSection {
          background: #fff;
          border: 1px solid #e8e8e8;
          border-radius: 14px;
          padding: 24px;
        }
        .formTitle {
          font-size: 16px;
          font-weight: 800;
          margin-bottom: 16px;
          color: #0f0f0f;
        }

        .field {
          margin-bottom: 14px;
        }
        .label {
          display: block;
          font-size: 12px;
          font-weight: 700;
          color: #555;
          margin-bottom: 6px;
        }
        .required { color: #cc0000; }
        .input, .textarea, .select {
          width: 100%;
          padding: 11px 13px;
          border: 1px solid #e0e0e0;
          border-radius: 8px;
          font-size: 13.5px;
          font-family: inherit;
          color: #0f0f0f;
          background: #fafafa;
          transition: all 0.15s;
        }
        .input:focus, .textarea:focus, .select:focus {
          outline: none;
          border-color: #0f0f0f;
          background: #fff;
          box-shadow: 0 0 0 3px rgba(0,0,0,0.04);
        }
        .textarea {
          resize: vertical;
          min-height: 140px;
        }
        .submitBtn {
          width: 100%;
          padding: 13px;
          background: #0f0f0f;
          color: #fff;
          border: none;
          border-radius: 10px;
          font-size: 13.5px;
          font-weight: 700;
          cursor: pointer;
          font-family: inherit;
          margin-top: 6px;
          transition: all 0.15s;
        }
        .submitBtn:hover {
          background: #333;
          transform: translateY(-1px);
        }
        .submittedMsg {
          padding: 20px;
          background: #d1fae5;
          border: 1px solid #6ee7b7;
          border-radius: 10px;
          color: #065f46;
          font-size: 13px;
          line-height: 1.6;
          text-align: center;
        }

        .infoPanel {
          display: flex;
          flex-direction: column;
          gap: 14px;
        }
        .infoCard {
          background: #fafafa;
          border: 1px solid #e8e8e8;
          border-radius: 14px;
          padding: 20px;
        }
        .infoCardTitle {
          font-size: 13px;
          font-weight: 800;
          color: #0f0f0f;
          margin-bottom: 8px;
          display: flex;
          align-items: center;
          gap: 8px;
        }
        .infoCardIcon { font-size: 16px; }
        .infoCardBody {
          font-size: 12.5px;
          color: #555;
          line-height: 1.6;
        }
        .emailLink {
          display: inline-block;
          margin-top: 4px;
          color: #cc0000;
          font-weight: 700;
          font-size: 14px;
          text-decoration: none;
          letter-spacing: -0.01em;
        }
        .emailLink:hover { text-decoration: underline; }

        .responseTimeTag {
          display: inline-block;
          margin-top: 10px;
          padding: 5px 10px;
          background: #dcfce7;
          color: #166534;
          border-radius: 6px;
          font-size: 11px;
          font-weight: 700;
        }

        .faq {
          background: #fff;
          border: 1px solid #e8e8e8;
          border-radius: 14px;
          padding: 24px;
          margin-bottom: 28px;
        }
        .faqTitle {
          font-size: 17px;
          font-weight: 800;
          margin-bottom: 16px;
          color: #0f0f0f;
        }
        .faqItem {
          padding: 14px 0;
          border-bottom: 1px solid #f0f0f0;
        }
        .faqItem:last-child { border-bottom: none; }
        .faqQ {
          font-size: 13.5px;
          font-weight: 700;
          color: #0f0f0f;
          margin-bottom: 6px;
          display: flex;
          gap: 6px;
        }
        .faqA {
          font-size: 12.5px;
          color: #555;
          line-height: 1.65;
          padding-left: 18px;
        }

        @media (max-width: 768px) {
          .page { padding: 22px 16px 40px; }
          .grid { grid-template-columns: 1fr; gap: 16px; }
          .pageTitle { font-size: 24px; }
        }
      `}</style>

      <div className="page">
        <header className="pageHeader">
          <span className="pageBadge">CONTACT</span>
          <h1 className="pageTitle">문의하기</h1>
          <p className="pageSub">
            AlgoMaker에 대한 궁금한 점, 기능 제안, 제휴/광고 문의 등 무엇이든 환영합니다.
            최대한 빠르게 답변드리겠습니다.
          </p>
        </header>

        <div className="grid">
          {/* 문의 양식 */}
          <div className="formSection">
            <div className="formTitle">📝 문의 양식</div>

            {submitted ? (
              <div className="submittedMsg">
                <div style={{ fontSize: 24, marginBottom: 8 }}>✉️</div>
                <div style={{ fontWeight: 800, marginBottom: 4 }}>메일 앱이 열렸습니다</div>
                <div>
                  메일이 자동으로 열리지 않으면 아래 이메일로 직접 보내주세요.<br />
                  <a href={`mailto:${CONTACT_EMAIL}`} style={{ color: '#047857', fontWeight: 700 }}>
                    {CONTACT_EMAIL}
                  </a>
                </div>
              </div>
            ) : (
              <form onSubmit={handleSubmit}>
                <div className="field">
                  <label className="label">이름 <span className="required">*</span></label>
                  <input
                    className="input"
                    type="text"
                    required
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                    placeholder="홍길동"
                    maxLength={30}
                  />
                </div>

                <div className="field">
                  <label className="label">이메일 <span className="required">*</span></label>
                  <input
                    className="input"
                    type="email"
                    required
                    value={form.email}
                    onChange={(e) => setForm({ ...form, email: e.target.value })}
                    placeholder="your@email.com"
                  />
                </div>

                <div className="field">
                  <label className="label">문의 분류</label>
                  <select
                    className="select"
                    value={form.category}
                    onChange={(e) => setForm({ ...form, category: e.target.value })}
                  >
                    <option value="general">일반 문의</option>
                    <option value="bug">버그 신고</option>
                    <option value="feature">기능 제안</option>
                    <option value="partnership">제휴/광고 문의</option>
                    <option value="content">콘텐츠 저작권 문의</option>
                    <option value="account">계정/결제 문의</option>
                    <option value="other">기타</option>
                  </select>
                </div>

                <div className="field">
                  <label className="label">제목 <span className="required">*</span></label>
                  <input
                    className="input"
                    type="text"
                    required
                    value={form.subject}
                    onChange={(e) => setForm({ ...form, subject: e.target.value })}
                    placeholder="문의 제목을 입력해주세요"
                    maxLength={100}
                  />
                </div>

                <div className="field">
                  <label className="label">내용 <span className="required">*</span></label>
                  <textarea
                    className="textarea"
                    required
                    value={form.message}
                    onChange={(e) => setForm({ ...form, message: e.target.value })}
                    placeholder="문의 내용을 상세히 작성해주세요. 버그의 경우 재현 방법을 함께 적어주시면 빠른 해결에 도움이 됩니다."
                    maxLength={2000}
                  />
                </div>

                <button type="submit" className="submitBtn">
                  ✉️ 이메일로 문의 보내기
                </button>
              </form>
            )}
          </div>

          {/* 연락 정보 패널 */}
          <div className="infoPanel">
            <div className="infoCard">
              <div className="infoCardTitle">
                <span className="infoCardIcon">📧</span>
                이메일
              </div>
              <div className="infoCardBody">
                가장 빠른 답변 방법입니다.<br />
                <a href={`mailto:${CONTACT_EMAIL}`} className="emailLink">
                  {CONTACT_EMAIL}
                </a>
                <div className="responseTimeTag">평일 24시간 이내 답변</div>
              </div>
            </div>

            <div className="infoCard">
              <div className="infoCardTitle">
                <span className="infoCardIcon">🏢</span>
                운영 주체
              </div>
              <div className="infoCardBody">
                <strong>{BUSINESS_NAME}</strong><br />
                대표: 박예준<br />
                서비스: AlgoMaker (알고메이커)
              </div>
            </div>

            <div className="infoCard">
              <div className="infoCardTitle">
                <span className="infoCardIcon">⏰</span>
                운영 시간
              </div>
              <div className="infoCardBody">
                월–금 10:00–18:00 (KST)<br />
                주말·공휴일은 이메일 문의만 받고 있으며,<br />
                다음 영업일에 답변드립니다.
              </div>
            </div>

            <div className="infoCard">
              <div className="infoCardTitle">
                <span className="infoCardIcon">🚨</span>
                긴급 신고
              </div>
              <div className="infoCardBody">
                저작권 침해, 부적절한 콘텐츠 생성 등<br />
                긴급 사안은 제목에 <strong>[긴급]</strong>을 붙여<br />
                이메일로 보내주시면 최우선으로 처리합니다.
              </div>
            </div>
          </div>
        </div>

        {/* FAQ */}
        <div className="faq">
          <div className="faqTitle">💡 자주 묻는 질문</div>

          <div className="faqItem">
            <div className="faqQ">
              <span>Q.</span>
              <span>서비스 이용료가 정말 무료인가요?</span>
            </div>
            <div className="faqA">
              네, AlgoMaker의 모든 기능은 무료로 제공됩니다.
              가입이나 결제 없이 12가지 시나리오 스타일을 무제한으로 사용할 수 있습니다.
              서비스 운영은 페이지에 표시되는 광고 수익으로 유지됩니다.
            </div>
          </div>

          <div className="faqItem">
            <div className="faqQ">
              <span>Q.</span>
              <span>생성한 영상의 저작권은 누구에게 있나요?</span>
            </div>
            <div className="faqA">
              생성된 영상에 대한 사용 권한은 사용자에게 있습니다.
              유튜브 업로드, 상업적 이용 모두 가능합니다.
              단, 영상에 포함된 이미지는 Pexels 등 무료 라이선스 소스에서 제공되며
              각 라이선스 조건을 따릅니다. 자세한 내용은 이용약관을 참고해주세요.
            </div>
          </div>

          <div className="faqItem">
            <div className="faqQ">
              <span>Q.</span>
              <span>영상 생성 중 오류가 발생했어요</span>
            </div>
            <div className="faqA">
              간헐적인 API 응답 지연으로 생성이 중단될 수 있습니다.
              몇 분 후 다시 시도해보시고, 계속 문제가 발생하면 위 양식으로
              <strong>버그 신고</strong>를 선택해 에러 발생 시점과 입력한 키워드를 알려주세요.
            </div>
          </div>

          <div className="faqItem">
            <div className="faqQ">
              <span>Q.</span>
              <span>광고 문의나 제휴 제안은 어떻게 하나요?</span>
            </div>
            <div className="faqA">
              위 양식에서 <strong>제휴/광고 문의</strong>를 선택해 보내주시거나,
              제목에 [제휴]를 붙여 직접 이메일 주시면 담당자가 확인 후 답변드립니다.
            </div>
          </div>

          <div className="faqItem">
            <div className="faqQ">
              <span>Q.</span>
              <span>개인정보는 어떻게 보호되나요?</span>
            </div>
            <div className="faqA">
              AlgoMaker는 사용자 가입을 받지 않으므로 개인 식별 정보를 수집하지 않습니다.
              익명 브라우저 식별자로 영상 제작 이력만 로컬에 저장됩니다.
              자세한 내용은 <Link href="/privacy" style={{ color: '#cc0000' }}>개인정보 처리방침</Link>을 참고해주세요.
            </div>
          </div>
        </div>
      </div>
    </DashboardShell>
  );
}
