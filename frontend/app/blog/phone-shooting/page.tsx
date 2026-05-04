'use client';

import Link from 'next/link';
import { V17Shell } from '../../_shared/V17Shell';

const articleSchema = {
  '@context': 'https://schema.org',
  '@type': 'Article',
  headline: '핸드폰만으로 영상 찍는 5가지 꿀팁 — 비싼 장비 필요 없습니다',
  description: '핸드폰 1대만으로 유튜브 영상 촬영하는 실전 5가지 팁. 화질, 음질, 흔들림, 조명, 구도까지.',
  datePublished: '2026-05-02',
  dateModified: '2026-05-02',
  author: { '@type': 'Organization', name: 'AlgoMaker' },
  publisher: {
    '@type': 'Organization',
    name: 'AlgoMaker',
    url: 'https://nutube.kr',
  },
  inLanguage: 'ko',
};

export default function PhoneShootingGuide() {
  return (
    <V17Shell>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema) }}
      />

      <style jsx>{`
        .guide {
          max-width: 760px; margin: 0 auto; padding: 24px 20px 60px;
          font-family: 'Pretendard', -apple-system, system-ui, sans-serif;
          color: #0a0a0a; line-height: 1.75; letter-spacing: -0.01em;
        }
        @media (max-width: 600px) { .guide { padding: 18px 16px 50px; } }
        .guide-kicker { font-size: 11px; font-weight: 700; letter-spacing: 0.18em; color: #c2410c; margin-bottom: 8px; text-transform: uppercase; }
        .guide-h1 { font-size: 32px; font-weight: 800; letter-spacing: -0.025em; line-height: 1.3; margin: 0 0 12px; word-break: keep-all; }
        @media (max-width: 600px) { .guide-h1 { font-size: 26px; } }
        .guide-subtitle { font-size: 17px; color: #525252; margin: 0 0 24px; line-height: 1.6; word-break: keep-all; }
        .guide-meta { display: flex; gap: 12px; font-size: 14px; color: #737373; padding-bottom: 18px; border-bottom: 1px solid #e5e5e5; margin-bottom: 28px; flex-wrap: wrap; }
        .guide h2 { font-size: 24px; font-weight: 800; letter-spacing: -0.02em; line-height: 1.4; margin: 36px 0 14px; padding-top: 8px; word-break: keep-all; }
        @media (max-width: 600px) { .guide h2 { font-size: 21px; margin: 28px 0 12px; } }
        .guide h3 { font-size: 19px; font-weight: 700; letter-spacing: -0.015em; margin: 24px 0 10px; word-break: keep-all; }
        @media (max-width: 600px) { .guide h3 { font-size: 17.5px; } }
        .guide p { font-size: 18px; margin: 0 0 14px; word-break: keep-all; }
        @media (max-width: 600px) { .guide p { font-size: 17px; } }
        .guide ul, .guide ol { padding-left: 22px; margin: 8px 0 18px; }
        .guide li { font-size: 18px; margin-bottom: 8px; line-height: 1.6; word-break: keep-all; }
        @media (max-width: 600px) { .guide li { font-size: 17px; } }
        .guide-callout { padding: 14px 16px; background: #fffbeb; border-left: 3px solid #fbbf24; margin: 16px 0; font-size: 17px; line-height: 1.6; color: #78350f; word-break: keep-all; }
        .guide-formula { padding: 16px 18px; background: #0a0a0a; color: #ffffff; margin: 18px 0; font-family: 'SF Mono', 'Consolas', monospace; font-size: 15px; line-height: 1.7; word-break: keep-all; }
        .guide-formula strong { color: #fbbf24; font-weight: 700; }
        .guide-cta { margin-top: 36px; padding: 20px; background: #fafafa; border: 1px solid #e5e5e5; text-align: center; }
        .guide-cta-title { font-size: 18px; font-weight: 700; margin: 0 0 8px; }
        .guide-cta-desc { font-size: 15.5px; color: #525252; margin: 0 0 14px; line-height: 1.55; }
        .guide-cta-btn { display: inline-block; padding: 12px 24px; background: #0a0a0a; color: #ffffff; text-decoration: none; font-size: 15px; font-weight: 700; }
        .guide-cta-btn:hover { background: #c2410c; }
      `}</style>

      <article className="guide">
        <div className="guide-kicker">▍ 영상 제작 · 촬영</div>
        <h1 className="guide-h1">핸드폰만으로 영상 찍는 5가지 꿀팁</h1>
        <p className="guide-subtitle">
          비싼 카메라 사실 필요 없습니다. 핸드폰 1대만으로도 유튜브 영상 충분히 찍을 수 있습니다.
          시니어/초보를 위한 핸드폰 촬영 5가지 실전 팁.
        </p>
        <div className="guide-meta">
          <span>📅 2026.05.02</span>
          <span>·</span>
          <span>⏱ 7분</span>
          <span>·</span>
          <span>📱 영상 제작</span>
        </div>

        <p>
          유튜브 시작하실 때 가장 큰 고민이 "카메라 사야 하나?" 입니다.
          결론부터 말씀드리면 핸드폰 1대로 충분합니다. 100만 구독자
          채널들 중에도 핸드폰만 쓰는 분들이 많습니다.
        </p>

        <p>
          핸드폰 촬영 5가지 핵심 팁을 알려드립니다.
        </p>

        <h2>1. 가로 모드로 촬영하세요</h2>

        <p>
          핸드폰을 세로로 들고 찍는 분들이 많습니다. 인스타그램·틱톡은
          세로가 좋지만 유튜브 일반 영상은 가로 (16:9) 가 필수입니다.
        </p>

        <h3>가로 vs 세로</h3>

        <ul>
          <li><strong>유튜브 일반 영상:</strong> 가로 (16:9). 핸드폰을 옆으로 눕히고 찍기</li>
          <li><strong>유튜브 쇼츠:</strong> 세로 (9:16). 핸드폰 세워서 찍기</li>
        </ul>

        <div className="guide-callout">
          💡 가로로 찍어두면 나중에 쇼츠용으로 잘라쓸 수 있지만,
          세로로 찍으면 일반 영상으로 쓰기 어렵습니다. 처음에는 가로 추천.
        </div>

        <h2>2. 음질이 화질보다 중요합니다</h2>

        <p>
          많은 분들이 "화질 좋은 핸드폰" 을 사야 한다고 생각하시는데
          사실 음질이 훨씬 중요합니다. 화질이 떨어져도 음질만 좋으면
          시청자가 끝까지 봅니다. 음질이 나쁘면 1분도 못 봅니다.
        </p>

        <h3>음질 좋게 찍는 3가지 방법</h3>

        <ul>
          <li><strong>마이크 1만~3만원짜리:</strong> 핸드폰에 꽂는 마이크. 가성비 최고. 쿠팡에서 "스마트폰 마이크" 검색.</li>
          <li><strong>조용한 공간:</strong> TV·에어컨·세탁기 끄고. 새벽이나 깊은 밤이 좋음.</li>
          <li><strong>입에서 30cm 거리:</strong> 너무 가까우면 입 소리 큼. 너무 멀면 작음.</li>
        </ul>

        <h2>3. 흔들림 방지는 삼각대 1개로</h2>

        <p>
          손으로 들고 찍으면 영상이 흔들립니다. 흔들리는 영상은
          시청자가 어지러워서 1분도 못 봅니다.
        </p>

        <h3>저렴한 해결책</h3>

        <ul>
          <li><strong>핸드폰 삼각대:</strong> 1~2만원. 쿠팡에서 "스마트폰 삼각대" 검색.</li>
          <li><strong>책상에 고정:</strong> 책 쌓아서 핸드폰 받치기 (응급용)</li>
          <li><strong>핸드폰 손잡이:</strong> "스마트폰 짐벌" 검색. 5만원대.</li>
        </ul>

        <div className="guide-callout">
          💡 처음에는 1만원짜리 삼각대로 충분합니다. 영상 100편 찍은 후
          업그레이드하셔도 늦지 않습니다.
        </div>

        <h2>4. 자연광이 가장 비싼 조명입니다</h2>

        <p>
          영상 촬영에서 조명이 화질의 70%를 결정합니다. 그런데
          비싼 조명 살 필요 없습니다. 자연광 (창문 빛) 이 가장 좋습니다.
        </p>

        <h3>자연광 활용법</h3>

        <ul>
          <li><strong>창문 마주보기:</strong> 본인이 창문을 마주보고 앉기. 창문 빛이 얼굴을 비춤.</li>
          <li><strong>창문 등지지 마세요:</strong> 창문 등지면 역광. 얼굴이 검게 나옴.</li>
          <li><strong>오전 9~11시 / 오후 3~5시:</strong> 빛이 가장 부드러움.</li>
          <li><strong>흐린 날이 더 좋음:</strong> 직사광선보다 흐린 날 빛이 부드러움.</li>
        </ul>

        <h3>밤에 찍어야 한다면</h3>

        <p>
          어쩔 수 없이 밤에 찍어야 한다면 "링 라이트" 추천. 1~3만원이면
          품질 좋은 거 살 수 있습니다. 쿠팡에서 "링 라이트" 검색.
        </p>

        <h2>5. 구도 — 3분할 법칙</h2>

        <p>
          핸드폰 카메라 화면을 9개 칸으로 상상하세요. 핸드폰 설정에서
          "격자선 보기" 켜시면 실제로 표시됩니다.
        </p>

        <h3>3분할 법칙</h3>

        <div className="guide-formula">
          ┌───┬───┬───┐<br />
          │   │ ★ │   │ ← 인물 눈을 위쪽 가로선에<br />
          ├───┼───┼───┤<br />
          │   │   │   │<br />
          ├───┼───┼───┤<br />
          │   │   │   │<br />
          └───┴───┴───┘
        </div>

        <ul>
          <li><strong>인물 영상:</strong> 눈을 위쪽 가로선에 맞추기. 화면 중앙 X.</li>
          <li><strong>풍경 영상:</strong> 지평선을 위쪽 또는 아래쪽 가로선에. 한가운데 X.</li>
          <li><strong>제품 영상:</strong> 제품을 좌우 세로선 교차점에 배치.</li>
        </ul>

        <h3>정면 응시 vs 사선 응시</h3>

        <ul>
          <li><strong>정보 전달:</strong> 정면 응시 (시청자와 눈 맞춤)</li>
          <li><strong>대화·설명:</strong> 약간 사선 (자연스러움)</li>
        </ul>

        <h2>핸드폰 촬영 체크리스트</h2>

        <div className="guide-formula">
          □ 1. 가로 모드로 촬영<br />
          □ 2. 마이크 또는 조용한 공간 확보<br />
          □ 3. 핸드폰 삼각대 사용<br />
          □ 4. 창문 마주보고 앉기<br />
          □ 5. 격자선 켜고 3분할 법칙
        </div>

        <h2>처음 시작하시는 분들께 추천 장비</h2>

        <p>
          이 5가지만 갖추시면 충분합니다. 총 5만 원 안쪽으로 가능합니다.
        </p>

        <ol>
          <li><strong>핸드폰 (이미 갖고 계심):</strong> 0원</li>
          <li><strong>스마트폰 삼각대:</strong> 1~2만원</li>
          <li><strong>스마트폰 마이크:</strong> 1~3만원</li>
          <li><strong>링 라이트 (선택):</strong> 1~3만원</li>
          <li><strong>편집 앱 (무료):</strong> CapCut, VLLO 등</li>
        </ol>

        <div className="guide-callout">
          💡 영상 100편 찍은 후 본인에게 부족한 것이 무엇인지 알게 되면
          그때 업그레이드하세요. 처음부터 비싼 장비 사면 후회합니다.
        </div>


        <h2>핸드폰 촬영 시 자주 묻는 질문</h2>
        <p>
          많은 분이 묻는 것이 "비싼 카메라가 정말 필요 없나요?" 입니다. 답은 "네"입니다.
          유튜브에 올라오는 영상의 70% 이상이 핸드폰으로 촬영됩니다. 핸드폰만으로도
          충분히 좋은 화질이 나오고, 시청자는 화질보다 내용과 진정성을 봅니다.
        </p>
        <p>
          또 다른 질문은 "어두운 곳에서 어떻게 찍나요?" 입니다. 가장 좋은 방법은
          밝은 곳을 찾는 것입니다. 창가, 햇빛, 책상 스탠드 옆 등을 활용하시면 됩니다.
          어두운 곳에서 찍으면 화질이 거칠어집니다.
        </p>

        <p>
          핸드폰 촬영의 장점은 <strong>즉시 시작할 수 있다</strong>는 점입니다.
          비싼 장비 사느라 시간을 보내지 마시고, 지금 갖고 계신 핸드폰으로 바로 첫 영상을
          찍어보세요. 한 달 동안 핸드폰으로 영상을 찍어보면 본인에게 어떤 장비가
          필요한지 자연스럽게 알게 됩니다.
        </p>

        <div className="guide-section" style={{ marginTop: 32, padding: '16px 20px', background: '#fff7ed', borderLeft: '3px solid #c2410c' }}>
          <h3 style={{ marginTop: 0 }}>✨ 함께 보면 좋은 가이드</h3>
          <ul style={{ marginBottom: 0 }}>
            <li><Link href="/blog/camera-anxiety" style={{ color: "#c2410c" }}>카메라 울렁증 극복</Link></li>
            <li><Link href="/blog/free-editing-apps" style={{ color: "#c2410c" }}>무료 영상 편집 앱</Link></li>
            <li><Link href="/blog/youtube-start" style={{ color: "#c2410c" }}>유튜브 시작 가이드</Link></li>
          </ul>
        </div>
      </article>
    </V17Shell>
  );
}
