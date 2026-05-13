'use client';

import Link from 'next/link';
import { V18Shell } from '../_shared/V18Shell';

export default function TermsPage() {
  return (
    <V18Shell>
      <style jsx>{`
        .terms-container {
          max-width: 760px; margin: 0 auto; padding: 32px 20px 60px;
          font-family: 'Pretendard', -apple-system, system-ui, sans-serif;
          color: #0a0a0a; line-height: 1.75; letter-spacing: -0.01em;
        }
        @media (max-width: 600px) { .terms-container { padding: 24px 16px 50px; } }
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
      `}</style>

      <div className="terms-container">
        <h1>이용약관</h1>
        <p className="updated">최종 업데이트: 2026년 5월 9일</p>

        <h2>제1조 (목적)</h2>
        <p>
          본 약관은 알고파트너스(이하 &apos;운영자&apos;)가 NuTube(nutube.kr, 이하 &apos;본 사이트&apos;)에서
          제공하는 서비스의 이용 조건 및 절차에 관한 사항을 규정함을 목적으로 합니다.
        </p>

        <h2>제2조 (서비스의 내용)</h2>
        <p>본 사이트는 다음과 같은 서비스를 무료로 제공합니다:</p>
        <ul>
          <li>유튜브 채널 운영에 관한 정보 콘텐츠</li>
          <li>영상 메타데이터 생성 도구</li>
          <li>알고리즘 분석 자료</li>
          <li>기타 운영자가 정하는 콘텐츠</li>
        </ul>

        <h2>제3조 (저작권)</h2>
        <p>
          본 사이트에 게시된 모든 콘텐츠(텍스트, 이미지, 디자인 등)의 저작권은 운영자
          또는 정당한 권리자에게 있습니다.
        </p>
        <p>
          이용자는 운영자의 허락 없이 콘텐츠를 복제, 배포, 전송, 출판, 방송할 수 없습니다.
          개인적인 학습 목적의 이용은 허용됩니다.
        </p>

        <h2>제4조 (이용자의 의무)</h2>
        <p>이용자는 다음 행위를 해서는 안 됩니다:</p>
        <ul>
          <li>본 사이트의 정상적인 운영을 방해하는 행위</li>
          <li>다른 이용자의 권익을 침해하는 행위</li>
          <li>관계 법령에 위배되는 행위</li>
          <li>본 사이트의 콘텐츠를 무단으로 복제, 배포하는 행위</li>
          <li>해킹, 크롤링 등 기술적 침입 시도</li>
        </ul>

        <h2>제5조 (서비스의 변경 및 중단)</h2>
        <p>
          운영자는 서비스 개선, 시스템 점검, 운영상 필요 등의 사유로 서비스 내용을
          변경하거나 일시 중단할 수 있습니다. 이 경우 사전 공지를 원칙으로 하되,
          긴급한 경우 사후 공지할 수 있습니다.
        </p>

        <h2>제6조 (책임의 제한)</h2>
        <p>
          본 사이트는 정보 제공을 목적으로 운영되며, 콘텐츠의 정확성에 대해 최선을
          다하지만 다음 사항에 대해서는 책임지지 않습니다:
        </p>
        <ul>
          <li>이용자가 콘텐츠를 활용한 결과로 발생한 손해</li>
          <li>제3자 광고 클릭으로 발생한 결과</li>
          <li>외부 링크의 콘텐츠</li>
          <li>이용자 간의 분쟁</li>
        </ul>

        <h2>제7조 (광고)</h2>
        <p>
          본 사이트는 운영을 위해 Google AdSense 등 광고를 게재할 수 있습니다.
          광고 클릭 등으로 인한 결과는 이용자의 책임이며, 운영자는 광고 콘텐츠에
          대해 책임지지 않습니다.
        </p>

        <h2>제8조 (개인정보 보호)</h2>
        <p>
          본 사이트의 개인정보 처리에 관한 사항은 별도의{' '}
          <Link href="/privacy" style={{ color: '#c2410c' }}>개인정보 처리방침</Link>에서 정합니다.
        </p>

        <h2>제9조 (분쟁 해결)</h2>
        <p>
          본 약관에 관한 분쟁은 대한민국 법령에 따라 해결합니다.
        </p>

        <h2>제10조 (약관의 변경)</h2>
        <p>
          본 약관은 운영자의 사정에 따라 변경될 수 있으며, 변경 사항은 본 사이트에
          게시함으로써 효력이 발생합니다. 이용자는 정기적으로 약관을 확인할 의무가
          있습니다.
        </p>

        <h2>문의</h2>
        <p>
          이용약관에 관한 문의는{' '}
          <Link href="/contact" style={{ color: '#c2410c' }}>문의하기</Link> 페이지를
          이용해주세요.
        </p>

        <div style={{ marginTop: 40, paddingTop: 20, borderTop: '1px solid #e5e5e5', fontSize: 13, color: '#737373' }}>
          <p>
            본 약관은 2026년 5월 9일부터 시행됩니다.
          </p>
        </div>
      </div>
    </V18Shell>
  );
}
