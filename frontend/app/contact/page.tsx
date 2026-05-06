'use client';

import { V18Shell } from '../_shared/V18Shell';

export default function ContactPage() {
  return (
    <V18Shell>
      <div className="container">
        <article className="page">
          <h1 className="page-h1">문의하기</h1>
          <p className="page-lede">
            궁금하신 점이나 제안 사항이 있으시면 아래 이메일로 연락 주세요.
            영업일 기준 1~3일 내에 답변 드립니다.
          </p>

          <h2>연락처 정보</h2>
          <div className="info-box">
            <div className="info-row">
              <div className="info-label">이메일</div>
              <div className="info-value">
                <a href="mailto:apark12321@gmail.com" className="email-link">apark12321@gmail.com</a>
              </div>
            </div>
            <div className="info-row">
              <div className="info-label">운영자</div>
              <div className="info-value">알고파트너스</div>
            </div>
            <div className="info-row">
              <div className="info-label">웹사이트</div>
              <div className="info-value">https://nutube.kr</div>
            </div>
          </div>

          <h2>문의 가능한 내용</h2>
          <ul>
            <li>가이드 내용에 대한 질문</li>
            <li>다뤘으면 하는 주제 제안</li>
            <li>메타데이터 생성기 사용 시 발생하는 오류 신고</li>
            <li>오타 또는 잘못된 정보 제보</li>
            <li>광고 또는 협업 제안</li>
            <li>기타 사이트 관련 문의</li>
          </ul>

          <h2>답변 시간</h2>
          <p>
            모든 문의는 영업일 기준 <strong>1~3일 이내</strong>에 답변 드립니다.
            주말과 공휴일에는 답변이 늦어질 수 있는 점 양해 부탁드립니다.
          </p>

          <h2>자주 묻는 질문</h2>

          <h3>모든 콘텐츠가 정말 무료인가요?</h3>
          <p>
            네, AlgoMaker의 모든 가이드와 메타데이터 생성기는 완전 무료입니다.
            회원가입도 필요하지 않으며, 결제 정보를 요구하지 않습니다.
            사이트는 광고 수익(Google AdSense)으로 운영됩니다.
          </p>

          <h3>가이드 내용을 다른 곳에 인용해도 되나요?</h3>
          <p>
            출처(AlgoMaker / nutube.kr)를 명확히 표기하시는 조건으로 인용 가능합니다.
            전체 복사 또는 무단 재배포는 금지됩니다.
          </p>

          <h3>새로운 가이드는 얼마나 자주 올라오나요?</h3>
          <p>
            매주 1~2편의 새로운 가이드가 추가됩니다. 알고리즘, 시니어 사연 쇼츠,
            AI 도구, 수익화 등 4개 카테고리에서 균형 있게 작성합니다.
          </p>

          <h3>메타데이터 생성기를 사용하면 정말 5초 안에 만들어지나요?</h3>
          <p>
            네, 키워드 입력 후 평균 5초 이내에 영상 제목, 시나리오, 해시태그, SEO 태그가
            자동으로 생성됩니다. 박 실장 알고리즘 11공식과 시니어 알고리즘이 자동 적용되어 있어
            바로 본인 영상에 사용하실 수 있는 수준의 결과물을 받아보실 수 있습니다.
          </p>
        </article>
      </div>

      <style jsx>{`
        .page { padding: 48px 0 60px; }
        @media (max-width: 600px) { .page { padding: 32px 0 50px; } }

        .page-h1 {
          font-size: 36px;
          font-weight: 800;
          color: #1a1a1a;
          letter-spacing: -0.025em;
          margin: 0 0 16px;
        }
        @media (max-width: 600px) { .page-h1 { font-size: 26px; } }

        .page-lede {
          font-size: 18px;
          color: #525252;
          line-height: 1.7;
          margin: 0 0 32px;
          padding-bottom: 24px;
          border-bottom: 1px solid #e5e5e5;
          word-break: keep-all;
        }
        @media (max-width: 600px) { .page-lede { font-size: 16px; } }

        .page h2 {
          font-size: 24px;
          font-weight: 800;
          color: #1a1a1a;
          margin: 36px 0 14px;
        }
        @media (max-width: 600px) { .page h2 { font-size: 20px; margin: 28px 0 12px; } }

        .page h3 {
          font-size: 18px;
          font-weight: 700;
          color: #1a1a1a;
          margin: 24px 0 10px;
        }

        .page p {
          font-size: 16.5px;
          line-height: 1.8;
          color: #1a1a1a;
          margin: 0 0 16px;
          word-break: keep-all;
        }
        @media (max-width: 600px) { .page p { font-size: 15.5px; } }

        .page ul {
          padding-left: 24px;
          margin: 12px 0 20px;
        }
        .page li {
          font-size: 16.5px;
          line-height: 1.8;
          margin-bottom: 6px;
        }

        .page strong { font-weight: 700; }

        .info-box {
          padding: 20px 24px;
          background: #f8f8f8;
          margin: 20px 0;
        }

        .info-row {
          display: flex;
          gap: 16px;
          padding: 10px 0;
          border-bottom: 1px solid #e5e5e5;
        }
        .info-row:last-child { border-bottom: none; }

        .info-label {
          flex-shrink: 0;
          width: 80px;
          font-size: 14.5px;
          font-weight: 700;
          color: #1a1a1a;
        }

        .info-value {
          flex: 1;
          font-size: 15.5px;
          color: #404040;
        }

        .email-link {
          color: #c2410c;
          font-weight: 600;
          text-decoration: underline;
        }
        .email-link:hover { color: #1a1a1a; }
      `}</style>
    </V18Shell>
  );
}
