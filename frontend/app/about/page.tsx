'use client';
import Link from 'next/link';
import { V11Shell } from '../_shared/V11Shell';
import AdSlot from '../_shared/AdSlot';

export default function Page() {
  return (
    <V11Shell>
      <style jsx>{`
        .page { max-width: 920px; margin: 0 auto; padding: 56px 24px 60px; }
        @media (max-width: 600px) { .page { padding: 32px 18px 40px; } }

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
        @media (max-width: 600px) { .title { font-size: 24px; } }
        .sub { font-size: 15px; color: #666; line-height: 1.7; }

        .content {
          background: #fff; border: 1px solid #e5e5e5;
          border-radius: 14px; padding: 36px;
          line-height: 1.8; color: #333;
        }
        @media (max-width: 600px) { .content { padding: 24px 20px; } }

        .content h2 {
          font-size: 20px; font-weight: 800;
          color: #1a1a1a; margin: 36px 0 14px;
          letter-spacing: -0.025em;
        }
        .content h2:first-child { margin-top: 0; }
        .content p { margin: 0 0 14px; font-size: 15px; line-height: 1.75; }
        .content ul { padding-left: 22px; margin: 12px 0 18px; }
        .content li {
          margin-bottom: 10px; font-size: 14.5px; color: #444;
          line-height: 1.7;
        }
        .content strong { color: #c65f3b; font-weight: 700; }

        /* 운영자 카드 */
        .founderCard {
          background: linear-gradient(135deg, #fdf1e7 0%, #fff8f3 100%);
          border: 1px solid #fde0c5;
          border-radius: 14px;
          padding: 24px;
          margin: 24px 0;
        }
        .founderTitle {
          font-size: 14px;
          font-weight: 800;
          color: #c65f3b;
          letter-spacing: 0.04em;
          text-transform: uppercase;
          margin-bottom: 12px;
        }
        .founderName {
          font-size: 22px;
          font-weight: 800;
          color: #1a1a1a;
          margin-bottom: 6px;
          letter-spacing: -0.02em;
        }
        .founderRole {
          font-size: 13px;
          color: #777;
          margin-bottom: 14px;
        }
        .founderQuote {
          padding: 16px 20px;
          background: #fff;
          border-left: 3px solid #c65f3b;
          border-radius: 4px;
          font-size: 14px;
          color: #444;
          line-height: 1.8;
          font-style: italic;
        }

        /* 미션 박스 */
        .missionBox {
          background: #fafafa;
          border-radius: 12px;
          padding: 20px 24px;
          margin: 20px 0;
        }
        .missionLabel {
          font-size: 11px;
          font-weight: 800;
          color: #c65f3b;
          letter-spacing: 0.08em;
          margin-bottom: 6px;
        }
        .missionText {
          font-size: 16px;
          font-weight: 700;
          color: #1a1a1a;
          line-height: 1.6;
        }

        /* 통계 박스 */
        .stats {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(140px, 1fr));
          gap: 12px;
          margin: 20px 0;
        }
        .statItem {
          padding: 18px 20px;
          background: #fafafa;
          border-radius: 10px;
          text-align: center;
        }
        .statNumber {
          font-size: 24px;
          font-weight: 800;
          color: #c65f3b;
          letter-spacing: -0.02em;
          margin-bottom: 4px;
        }
        .statLabel {
          font-size: 12px;
          color: #666;
          font-weight: 600;
        }

        /* 사업자 정보 */
        .businessInfo {
          background: #fafafa;
          border-radius: 10px;
          padding: 18px 20px;
          margin: 20px 0;
          font-size: 13.5px;
          color: #555;
          line-height: 1.85;
        }
        .businessInfo strong {
          color: #1a1a1a;
          display: inline-block;
          min-width: 90px;
        }

        .ctaBtn {
          display: inline-block;
          padding: 14px 28px;
          background: #c65f3b;
          color: #fff;
          border-radius: 100px;
          font-size: 14px;
          font-weight: 700;
          text-decoration: none;
          transition: all 0.2s;
          margin-top: 20px;
        }
        .ctaBtn:hover {
          background: #a64a2a;
          transform: translateY(-1px);
        }

        .adArea { margin: 32px 0; }
      `}</style>

      <div className="page">
        <nav className="breadcrumb">
          <Link href="/">홈</Link>
          <span className="sep">/</span>
          <span>서비스 소개</span>
        </nav>

        <header className="header">
          <div className="pageBadge">ABOUT</div>
          <h1 className="title">우리는 영상 입문이 어려운 분들을 위해 만들었습니다</h1>
          <p className="sub">AI 콘텐츠 추천 도구 AlgoMaker가 어떻게, 왜 시작되었는지</p>
        </header>

        <div className="content">
          <div className="missionBox">
            <div className="missionLabel">OUR MISSION</div>
            <div className="missionText">
              "키워드 하나만 입력하면 영상 자료가 끝.<br />
              나이가 많아도, 디지털이 어려워도 누구나 콘텐츠 제작자가 될 수 있게."
            </div>
          </div>

          <h2>AlgoMaker는 어떤 서비스인가요?</h2>
          <p>
            AlgoMaker는 <strong>키워드 하나로 영상 자료 전체를 만들어주는 무료 AI 도구</strong>입니다.
            영상 제목, 검색량 분석된 태그, 영상 설명, 영상 대본 시퀀스 7단계, 한글·영문 영상 프롬프트,
            그리고 4개 SNS 플랫폼(유튜브, 쇼츠, 틱톡, 릴스)에 그대로 붙여넣을 수 있는 메타데이터까지
            한 번에 생성합니다.
          </p>
          <p>
            특히 <strong>시니어층(40대~70대) 분들</strong>, <strong>퇴직 예정자분들</strong>,
            그리고 영상 콘텐츠를 처음 시작하는 분들이 쉽게 사용할 수 있도록 설계되었습니다.
            복잡한 회원가입도, 결제도, 신용카드 등록도 필요 없습니다.
          </p>

          <h2>왜 이 서비스를 만들게 되었나요?</h2>
          <div className="founderCard">
            <div className="founderTitle">OUR STORY</div>
            <div className="founderName">키워드 하나면 충분합니다</div>
            <div className="founderRole">영상 입문이 어려운 분들을 위한 도구</div>
            <div className="founderQuote">
              "영상 시작하고 싶지만 막막한 분들이 정말 많습니다.
              제목은 어떻게 짓고, 태그는 뭘 넣고, 대본은 어떻게 쓰는지
              막막해서 한 발도 못 떼시는 분들이 대부분이었어요.
              키워드 하나만으로 영상 자료를 완성해드리면 어떨까?
              그게 AlgoMaker의 시작이었습니다."
            </div>
          </div>

          <h2>이런 분들께 도움이 됩니다</h2>
          <ul>
            <li>🎯 회사 그만두고 영상 콘텐츠를 시작하려는 시니어층(40대~70대)</li>
            <li>📊 N잡으로 영상 콘텐츠를 만들고 싶은 직장인</li>
            <li>🌱 시니어 라이프, 건강, 재테크 등 전문 분야 콘텐츠 제작자</li>
            <li>💼 SNS 채널 자료 만드는데 시간이 너무 오래 걸리는 분</li>
            <li>🎬 영상은 만들고 싶지만 어디서 시작할지 모르는 입문자</li>
          </ul>

          <h2>AlgoMaker는 무엇이 다른가요?</h2>
          <ul>
            <li>
              <strong>완전 무료, 회원가입 없음</strong> - 광고 시청만으로 무제한 사용
            </li>
            <li>
              <strong>매번 다른 결과</strong> - 같은 키워드도 다시 누를 때마다 새로운 시나리오
            </li>
            <li>
              <strong>한국어 자연스러움</strong> - AI 티 안 나는 진짜 사람이 말하는 듯한 화법
            </li>
            <li>
              <strong>구체적인 디테일</strong> - 추상적 빈칸이 아닌 실제 사용 가능한 콘텐츠
            </li>
            <li>
              <strong>4개 SNS 한 번에</strong> - 한 번 입력으로 유튜브·쇼츠·틱톡·릴스 모두 대응
            </li>
            <li>
              <strong>NotebookLM 연동 가이드</strong> - 일관된 60장 이미지로 떡상 영상 만들기
            </li>
          </ul>

          <h2>운영 정보 (Transparency)</h2>
          <div className="businessInfo">
            <div><strong>운영 회사</strong> 알고파트너스</div>
            <div><strong>서비스명</strong> AlgoMaker</div>
            <div><strong>도메인</strong> nutube.kr</div>
            <div><strong>문의 이메일</strong> apark12321@gmail.com</div>
            <div><strong>서비스 시작</strong> 2026년 4월</div>
          </div>

          <h2>수익 모델 (어떻게 운영되나요?)</h2>
          <p>
            AlgoMaker는 사용자에게 어떤 비용도 청구하지 않습니다.
            서비스 운영비는 <strong>Google AdSense 광고 수익</strong>으로 충당하고 있습니다.
            사용자 데이터를 판매하거나, 유료 구독 모델로 전환하지 않습니다.
            우리의 목표는 영상 콘텐츠 입문 장벽을 낮추는 것이고,
            그 가치는 무료여야 한다고 믿습니다.
          </p>

          <h2>개인정보는 어떻게 다루나요?</h2>
          <p>
            AlgoMaker는 <strong>회원가입을 받지 않으므로 개인정보 수집이 거의 없습니다</strong>.
            서비스 이용을 위해 사용자가 입력한 키워드는 결과 생성에만 사용되며 저장되지 않습니다.
            Google AdSense 광고 표시를 위한 쿠키 사용은 사용자 동의를 받아 진행하며,
            언제든 거부하실 수 있습니다. 자세한 내용은{' '}
            <Link href="/privacy" style={{ color: '#c65f3b', fontWeight: 700 }}>개인정보처리방침</Link>에서 확인하실 수 있습니다.
          </p>

          <h2>도움이 필요하시면</h2>
          <p>
            서비스 이용 중 궁금한 점이나 개선 제안이 있으시면 언제든{' '}
            <strong>contact@nutube.kr</strong>로 메일 주세요.
            한 분 한 분의 의견을 직접 읽고 있습니다.
            특히 사용 중 불편함, 한국어가 어색한 부분, 더 필요한 기능이 있다면
            적극 반영하고 있습니다.
          </p>

          <Link href="/create" className="ctaBtn">🚀 지금 영상 만들기 시작</Link>
        </div>

        <div className="adArea">
          <AdSlot slot="about-bottom" variant="horizontal" />
        </div>
      </div>
    </V11Shell>
  );
}
