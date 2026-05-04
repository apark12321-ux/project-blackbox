'use client';

import Link from 'next/link';
import { V17Shell } from '../../_shared/V17Shell';

const articleSchema = {
  '@context': 'https://schema.org',
  '@type': 'Article',
  headline: '영상 컨셉 정하기 — 나만의 채널 정체성 찾는 5단계',
  description: '유튜브 시작 전 가장 중요한 단계. 본인만의 채널 컨셉을 찾는 5단계 워크시트와 흔한 실수.',
  datePublished: '2026-05-02',
  dateModified: '2026-05-02',
  author: { '@type': 'Organization', name: 'AlgoMaker' },
  publisher: { '@type': 'Organization', name: 'AlgoMaker', url: 'https://nutube.kr' },
  inLanguage: 'ko',
};

export default function ChannelConceptGuide() {
  return (
    <V17Shell>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema) }} />
      <style jsx>{`
        .guide { max-width: 760px; margin: 0 auto; padding: 24px 20px 60px; font-family: 'Pretendard', -apple-system, system-ui, sans-serif; color: #0a0a0a; line-height: 1.75; letter-spacing: -0.01em; }
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
        <div className="guide-kicker">▍ 채널 운영 · 컨셉</div>
        <h1 className="guide-h1">영상 컨셉 정하기 — 5단계 워크시트</h1>
        <p className="guide-subtitle">
          유튜브 시작 전 가장 중요한 단계. "무엇을 다룰지" 가 아니라
          "왜 내가 다뤄야 하는지" 를 찾는 5단계 워크시트.
        </p>
        <div className="guide-meta">
          <span>📅 2026.05.02</span><span>·</span><span>⏱ 8분</span><span>·</span><span>🎯 채널 운영</span>
        </div>

        <p>
          유튜브 시작하실 때 가장 많이 하시는 실수가 "유행하는 분야 따라하기"
          입니다. 부동산이 잘 된다고 부동산 채널 시작하고, 재테크가 뜨면
          재테크 채널 시작합니다. 그러면 6개월 안에 포기합니다.
        </p>

        <p>
          답은 본인 안에 있습니다. 5단계 워크시트로 본인만의 컨셉을 찾으세요.
        </p>

        <h2>1단계: 본인의 3가지 자산 발견</h2>

        <p>
          본인이 갖고 있는 3가지 자산을 적어보세요.
        </p>

        <div className="guide-formula">
          <strong>자산 1. 경험:</strong><br />
          (지금까지 어떤 일을 해왔나? 어떤 어려움을 극복했나?)<br /><br />
          <strong>자산 2. 지식:</strong><br />
          (다른 사람보다 많이 알고 있는 분야는?)<br /><br />
          <strong>자산 3. 관심:</strong><br />
          (시간 가는 줄 모르고 빠져드는 것은?)
        </div>

        <h3>예시 — 50대 전직 은행원</h3>

        <ul>
          <li><strong>경험:</strong> 30년 은행 근무, 부동산·재테크 상담 수천 건</li>
          <li><strong>지식:</strong> 금융 상품, 세제 혜택, 자산 관리 전문가</li>
          <li><strong>관심:</strong> 50대 또래의 노후 준비 도와주기</li>
        </ul>

        <p>
          이 분이 게임 채널 만들면 절대 안 됩니다. 50대 재테크 멘토링
          채널이 답입니다.
        </p>

        <h2>2단계: 타겟 시청자 한 명 그리기</h2>

        <p>
          "30~50대 모두" 같은 넓은 타겟은 실패합니다. 구체적인 한 명을
          머릿속에 그려야 합니다.
        </p>

        <div className="guide-formula">
          <strong>이름:</strong> 김부장 (가상의 인물)<br />
          <strong>나이·성별:</strong> 52세 남성<br />
          <strong>직업:</strong> 중소기업 부장, 5년 후 정년<br />
          <strong>가족:</strong> 자녀 2명 (대학생, 고등학생)<br />
          <strong>관심사:</strong> 노후 자금, 자녀 교육비, 건강<br />
          <strong>고민:</strong> 정년 후 30년 어떻게 살지?<br />
          <strong>채널에서 얻고 싶은 것:</strong> 실전 재테크 노하우
        </div>

        <h3>왜 한 명을 정해야 하나</h3>

        <p>
          한 명을 정하면 영상 만들 때 "김 부장한테 설명한다" 는 마음으로 만듭니다.
          그러면 자연스럽게 그 타겟에 정확히 맞는 영상이 나옵니다. "모두를
          위한 영상" 은 결국 아무에게도 닿지 않습니다.
        </p>

        <h2>3단계: 차별점 찾기 (다른 채널과 무엇이 다른가)</h2>

        <p>
          이미 있는 채널과 똑같으면 안 됩니다. 본인만의 차별점이 있어야 합니다.
        </p>

        <h3>차별점 만드는 5가지 각도</h3>

        <ul>
          <li><strong>경험:</strong> "30년 은행원 출신" (다른 채널에 없는 경력)</li>
          <li><strong>실패담:</strong> "내가 망한 투자 5가지" (다른 채널은 성공담만)</li>
          <li><strong>실명·실금액:</strong> "내 통장 공개" (다른 채널은 추상적)</li>
          <li><strong>연령대:</strong> "50대 시각" (20~30대 채널이 많음)</li>
          <li><strong>지역:</strong> "지방 거주자 시각" (서울 채널이 많음)</li>
        </ul>

        <h3>차별점 1줄 정리</h3>

        <div className="guide-formula">
          나는 [    ]이고, [    ]을 [    ]에게 [    ]답게 알려준다.<br /><br />
          예시: 나는 [50대 전직 은행원]이고, [재테크 실패담]을<br />
          [퇴직 앞둔 50대]에게 [솔직 담백]하게 알려준다.
        </div>

        <h2>4단계: 채널 약속 만들기</h2>

        <p>
          시청자에게 약속하는 1줄 문장입니다. 이게 채널 정체성의 핵심입니다.
        </p>

        <h3>약속 공식</h3>

        <div className="guide-formula">
          이 채널을 보시면 [    ] 분이 [    ]를 통해 [    ]를 얻으실 수 있습니다.<br /><br />
          예시: 이 채널을 보시면 [정년 앞둔 50대]가<br />
          [30년 은행원의 솔직한 재테크 노하우]를 통해<br />
          [노후 30년 든든한 준비]를 얻으실 수 있습니다.
        </div>

        <h3>약속을 모든 영상 첫 30초에</h3>

        <p>
          이 약속을 매 영상 첫 30초에 다른 표현으로 반복하세요. 시청자가
          "아, 이 채널은 이런 채널이구나" 정확히 이해합니다.
        </p>

        <h2>5단계: 첫 50편 주제 미리 적기</h2>

        <p>
          채널 컨셉 정하기의 마지막 단계입니다. 본인이 정한 컨셉으로
          첫 50편 주제를 미리 적어보세요. 50편 안 나오면 컨셉 다시 잡아야 합니다.
        </p>

        <h3>주제 50개 분류</h3>

        <ul>
          <li><strong>입문 주제 (10편):</strong> 시청자가 가장 기본부터 알아야 할 내용</li>
          <li><strong>실전 노하우 (15편):</strong> 본인 경험 기반 실전 가이드</li>
          <li><strong>흔한 실수·함정 (10편):</strong> "~하면 안 되는 5가지"</li>
          <li><strong>비교·리뷰 (10편):</strong> "A vs B" 형식</li>
          <li><strong>QnA·시청자 질문 답변 (5편):</strong> 댓글 답변</li>
        </ul>

        <div className="guide-callout">
          💡 50편 주제가 술술 나오면 컨셉이 잘 잡힌 겁니다.
          20편에서 막히면 컨셉이 너무 좁거나 본인 경험이 부족합니다.
        </div>

        <h2>흔한 실수 5가지</h2>

        <ol>
          <li>
            <strong>유행 따라하기</strong><br />
            "○○가 잘 된대" 라는 이유로 본인 분야 X 인기 분야 → 6개월 안에 포기.
          </li>
          <li>
            <strong>여러 분야 다 다루기</strong><br />
            요리도 하고 재테크도 하고 일상 브이로그도. 알고리즘이 분류 못함.
          </li>
          <li>
            <strong>너무 좁은 분야</strong><br />
            "1990년대 부동산만" 같이 너무 좁으면 시청자 부족.
          </li>
          <li>
            <strong>전문 자격 없이 전문 콘텐츠</strong><br />
            의사 자격 없이 "암 치료법" X. 법적 문제 가능성.
          </li>
          <li>
            <strong>"내가 좋아하는 거" 만 찍기</strong><br />
            본인 좋아하는 것 X 시청자 원하는 것. 둘이 만나는 지점 찾기.
          </li>
        </ol>

        <h2>완성 — 채널 컨셉 한 페이지 요약</h2>

        <div className="guide-formula">
          <strong>채널명:</strong>     ___________________<br />
          <strong>3줄 소개:</strong>   ___________________<br />
          <strong>타겟 1명:</strong>   ___________________<br />
          <strong>차별점:</strong>     ___________________<br />
          <strong>약속:</strong>       ___________________<br />
          <strong>50편 주제:</strong>  (별도 시트)
        </div>

        <p>
          이 한 페이지가 본인 채널의 헌법입니다. 영상 만들 때마다 다시 보세요.
          "이 영상이 컨셉에 맞나?" 확인하는 기준이 됩니다.
        </p>


        <h2>처음 한 달간 컨셉 점검</h2>
        <p>
          처음 정한 컨셉이 잘 맞는지 한 달 후에 다시 점검하세요. 영상 5~10편 올려보고
          어떤 영상이 반응이 좋았는지 분석합니다. 반응이 좋은 방향으로 컨셉을 살짝
          조정하시면 채널이 빠르게 성장합니다.
        </p>
        <div className="guide-section" style={{ marginTop: 32, padding: '16px 20px', background: '#fff7ed', borderLeft: '3px solid #c2410c' }}>
          <h3 style={{ marginTop: 0 }}>✨ 함께 보면 좋은 가이드</h3>
          <ul style={{ marginBottom: 0 }}>
            <li><Link href="/blog/algorithm-branding" style={{ color: "#c2410c" }}>클릭을 부르는 브랜딩</Link></li>
            <li><Link href="/blog/youtube-start" style={{ color: "#c2410c" }}>유튜브 시작 가이드</Link></li>
            <li><Link href="/blog/first-100-subs" style={{ color: "#c2410c" }}>첫 100명 구독자</Link></li>
          </ul>
        </div>
      </article>
    </V17Shell>
  );
}
