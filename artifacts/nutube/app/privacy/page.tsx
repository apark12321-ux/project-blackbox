import type { Metadata } from 'next';
import { SITE } from '@/lib/site';

export const metadata: Metadata = {
  title: '개인정보처리방침',
  description: 'NuTube 개인정보처리방침입니다.',
};

export default function PrivacyPage() {
  return (
    <div className="nt-page">
      <h1>개인정보처리방침</h1>
      <p className="nt-lead">
        NuTube({SITE.url})는 이용자의 개인정보를 중요시하며 「개인정보 보호법」 등 관련 법령을 준수합니다.
      </p>

      <h2>제1조 (수집하는 개인정보 항목)</h2>
      <p>NuTube는 별도의 회원가입 절차 없이 콘텐츠를 열람할 수 있습니다. 다만 다음과 같은 경우에 개인정보를 수집할 수 있습니다.</p>
      <ul>
        <li>이메일 문의 시: 이메일 주소, 문의 내용</li>
        <li>자동 수집: 접속 로그(IP), 쿠키, 접속 기기 정보, 방문 일시</li>
      </ul>

      <h2>제2조 (개인정보 수집 및 이용 목적)</h2>
      <ul>
        <li>문의 및 정정 요청에 대한 답변</li>
        <li>서비스 이용 통계 분석 및 콘텐츠 개선</li>
        <li>광고 노출 최적화 (Google AdSense)</li>
      </ul>

      <h2>제3조 (광고 및 분석 도구)</h2>
      <p>NuTube는 다음과 같은 제3자 서비스를 이용하며, 해당 서비스의 정책에 따라 일부 정보가 수집됩니다.</p>
      <ul>
        <li><strong>Google AdSense</strong> - 광고 게재. <a href="https://policies.google.com/technologies/ads?hl=ko" target="_blank" rel="noopener noreferrer">광고 정책</a>에 따라 쿠키 사용</li>
        <li><strong>Google Analytics</strong> - 트래픽 분석. 개인 식별 정보는 익명 처리</li>
        <li><strong>Google Search Console</strong> - 검색 노출 통계</li>
      </ul>
      <p>이용자는 브라우저 설정에서 쿠키 사용을 거부할 수 있습니다.</p>

      <h2>제4조 (개인정보 보유 및 이용 기간)</h2>
      <ul>
        <li>이메일 문의: 답변 완료 후 1년 이내 파기</li>
        <li>접속 로그: 「통신비밀보호법」에 따라 3개월</li>
      </ul>

      <h2>제5조 (개인정보 보호책임자)</h2>
      <div className="nt-info-box">
        <dl>
          <dt>운영 주체</dt>
          <dd>{SITE.operator.company}</dd>
          <dt>책임자</dt>
          <dd>{SITE.operator.representative} (대표)</dd>
          <dt>이메일</dt>
          <dd><a href={`mailto:${SITE.operator.email}`}>{SITE.operator.email}</a></dd>
        </dl>
      </div>

      <h2>제6조 (이용자의 권리)</h2>
      <p>이용자는 언제든지 본인의 개인정보에 대한 열람, 정정, 삭제, 처리 정지를 요구할 수 있습니다. 위 이메일로 요청 시 지체 없이 처리합니다.</p>

      <h2>제7조 (방침의 변경)</h2>
      <p>본 방침이 변경되는 경우, 변경된 내용은 본 페이지에 게시되며 이전 방침은 별도 보관합니다.</p>

      <p style={{ fontSize: 13, color: '#9ca3af', marginTop: 32 }}>시행일: 2026년 5월 18일</p>
    </div>
  );
}
